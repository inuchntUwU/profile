/**
 * GitHub からプロフィールとリポジトリ一覧を取ってきて、
 * src/data/github.generated.json とアバター画像 public/avatar.* を作るスクリプト。
 *
 * 実行:
 *   npm run data
 * npm run dev と npm run build は、中で自動的にこれを先に呼ぶ。
 *
 * ── なぜページの中で fetch せず、事前に JSON を作るのか ──
 * このサイトは静的な HTML として書き出すので、通信できるのはビルドのときだけ。
 * さらに、出来上がった JSON を Git にコミットしておけば、
 * GitHub が落ちていてもレート制限に当たってもビルドが失敗せず、
 * 「少し古いけど正しい内容」で公開を続けられる。ネットが無くても npm run dev が動く。
 *
 * ── 認証について ──
 * 環境変数 GITHUB_TOKEN があれば使う。無くても動く（未認証は 1 時間あたり 60 回まで）。
 * GitHub Actions では自動で用意されるトークンを渡している。
 *
 * ── TypeScript なのに直接 node で動く理由 ──
 * 拡張子が .mts のファイルは、最近の Node.js が型注釈を無視して実行してくれる。
 * そのため ts-node や tsx といった変換ツールを入れていない。
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
// 素の Node.js で動くので、"@/" のようなパスの省略記法は使えず相対パスで書く。
import { profile } from "../src/data/profile.ts";

// import.meta.url はこのファイル自身の場所。そこから 1 つ上がプロジェクトのルート。
// 「どのディレクトリで npm run data を叩いても同じ場所に書き出す」ためにこうしている。
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_JSON = path.join(ROOT, "src", "data", "github.generated.json");
const PUBLIC_DIR = path.join(ROOT, "public");

const API = "https://api.github.com";
const LOGIN = profile.githubLogin;

// すべてのリクエストに付けるヘッダー。
const headers: Record<string, string> = {
  // 返してほしいデータ形式の指定（GitHub が推奨している値）。
  accept: "application/vnd.github+json",
  // API のバージョン固定。将来 GitHub 側が仕様を変えても壊れにくくなる。
  "x-github-api-version": "2022-11-28",
  // GitHub は User-Agent の無いリクエストを拒否するので必須。
  "user-agent": `${LOGIN}-portfolio-build`,
};
if (process.env.GITHUB_TOKEN) {
  headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

/**
 * GitHub が返す JSON のうち、このサイトで実際に使う項目だけを書いた型。
 * 実際のレスポンスにはもっと多くの項目が入っているが、書かなければ無視される。
 */
type ApiUser = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  public_repos: number;
};

type ApiRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  /** トピックが 1 つも無いと null が返ることがある */
  topics: string[] | null;
  pushed_at: string;
  /** 他人のリポジトリをフォークしたもの */
  fork: boolean;
  /** アーカイブ（凍結）済み */
  archived: boolean;
};

/** GitHub API を叩いて JSON を返す。失敗したら例外を投げる。 */
async function api<T>(pathname: string): Promise<T> {
  const res = await fetch(`${API}${pathname}`, { headers });

  // fetch は 404 や 403 でも例外を投げないので、自分で成否を確認する必要がある。
  if (!res.ok) {
    // 残り回数が 0 ならレート制限。原因が分かるようメッセージに足しておく。
    const remaining = res.headers.get("x-ratelimit-remaining");
    const hint =
      remaining === "0"
        ? "（レート制限に達しています。GITHUB_TOKEN を設定すると緩和されます）"
        : "";
    throw new Error(`GET ${pathname} → ${res.status} ${res.statusText}${hint}`);
  }

  return (await res.json()) as T;
}

/**
 * リポジトリを全件取得する。
 * GitHub は 1 回で最大 100 件しか返さないので、100 件ちょうど返ってきたら
 * 「まだ続きがある」とみなして次のページを取りに行く。
 * 無限ループを避けるため 10 ページ（＝1000 件）で打ち切る。
 */
async function fetchAllRepos(): Promise<ApiRepo[]> {
  const all: ApiRepo[] = [];

  for (let page = 1; page <= 10; page++) {
    const batch = await api<ApiRepo[]>(
      `/users/${LOGIN}/repos?per_page=100&sort=pushed&page=${page}`,
    );
    all.push(...batch);
    if (batch.length < 100) break;
  }

  return all;
}

/**
 * アバター画像を public/ に保存し、サイトから参照するパスを返す。
 *
 * 画像をダウンロードして手元に置くのは、表示のたびに GitHub のサーバーへ
 * 取りに行かなくて済むようにするため（相手が落ちても表示が崩れない）。
 */
async function downloadAvatar(url: string): Promise<string> {
  // s=400 は「400px で返して」という GitHub 側の指定。
  // 元の URL に ? が既に付いているかで、繋ぎ文字を ? と & で使い分ける。
  const sized = `${url}${url.includes("?") ? "&" : "?"}s=400`;

  const res = await fetch(sized, {
    headers: { "user-agent": headers["user-agent"] },
  });
  if (!res.ok) {
    throw new Error(`アバターの取得に失敗: ${res.status} ${res.statusText}`);
  }

  // GitHub は PNG を返すとは限らない（アップロード画像だと JPEG のこともある）ので、
  // レスポンスが申告してきた種類に合わせて拡張子を決める。
  const type = res.headers.get("content-type") ?? "image/png";
  const ext = type.includes("jpeg") ? "jpg" : type.includes("webp") ? "webp" : "png";
  const filename = `avatar.${ext}`;

  await mkdir(PUBLIC_DIR, { recursive: true });
  await writeFile(
    path.join(PUBLIC_DIR, filename),
    Buffer.from(await res.arrayBuffer()),
  );

  // public/ の中身はサイトのルートから配信されるので、先頭に / を付けたパスを返す。
  return `/${filename}`;
}

async function main(): Promise<void> {
  // プロフィールとリポジトリ一覧は互いに関係ないので、Promise.all で同時に取る。
  const [user, repos] = await Promise.all([
    api<ApiUser>(`/users/${LOGIN}`),
    fetchAllRepos(),
  ]);

  // アバターの URL は user を取得しないと分からないので、これだけ後回し。
  const avatarUrl = await downloadAvatar(user.avatar_url);

  // GitHub の項目名（snake_case）を、サイト側で使う名前（camelCase）に詰め替える。
  // ここで形を決めておくことで、画面側は GitHub の都合を知らずに済む。
  const data = {
    fetchedAt: new Date().toISOString(),
    user: {
      login: user.login,
      name: user.name,
      bio: user.bio,
      avatarUrl,
      htmlUrl: user.html_url,
      followers: user.followers,
      publicRepos: user.public_repos,
    },
    repos: repos
      // フォークとアーカイブ済みは自分の活動として見せたくないので除く。
      .filter((repo) => !repo.fork && !repo.archived)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.html_url,
        // 空文字が返ることがあるので null に揃える（|| は空文字も拾う）。
        homepage: repo.homepage || null,
        language: repo.language,
        stars: repo.stargazers_count,
        // null が返ることがあるので空配列に揃える。画面側で毎回 null 判定しなくて済む。
        topics: repo.topics ?? [],
        pushedAt: repo.pushed_at,
      })),
  };

  // null, 2 は「見やすく 2 スペースで整形して書く」指定。差分が読みやすくなる。
  await writeFile(OUT_JSON, `${JSON.stringify(data, null, 2)}\n`);

  console.log(
    `✓ ${data.repos.length} 件のリポジトリと ${avatarUrl} を src/data/github.generated.json に書き出しました`,
  );
}

// main の中で例外が起きたらここに来る。
// ここでの方針は「取得に失敗してもビルドは止めない」。
main().catch(async (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`⚠ GitHub の取得に失敗しました: ${message}`);

  // 前回の結果が残っているか確認する。読めれば残っている。
  const hasFallback = await readFile(OUT_JSON)
    .then(() => true)
    .catch(() => false);

  if (hasFallback) {
    // 少し古い内容だが正しい JSON があるので、それを使ってビルドを続ける。
    // exit code 0 は「成功」の意味なので、呼び出し元の npm run build も止まらない。
    console.warn("  既存の github.generated.json を使ってビルドを続行します。");
    process.exit(0);
  }

  // 一度も取得できていない状態。このまま進めても中身が空のサイトができるだけなので、
  // exit code 1（失敗）でビルドごと止める。
  console.error("  フォールバックとなる生成済み JSON も無いため中止します。");
  process.exit(1);
});
