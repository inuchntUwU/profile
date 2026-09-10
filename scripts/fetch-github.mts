/**
 * GitHub からプロフィールとリポジトリ一覧を取得し、src/data/github.generated.json へ書き出す。
 * アバター画像も public/ に落とし、実行時に githubusercontent へ依存しないようにする。
 *ま
 * Server Component の中で fetch せずビルド前に JSON 化しているのは、
 * 生成 JSON をコミットしておけば API 障害やレート制限でもビルドが壊れず、
 * 直近のスナップショットで公開を継続できるため。オフラインでも dev が動く。
 *
 * 実行: npm run data （Node のネイティブ TypeScript 実行を使うので tsx は不要）
 * 認証: GITHUB_TOKEN があれば使う。無ければ未認証（60 req/h）で動く。
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { profile } from "../src/data/profile.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_JSON = path.join(ROOT, "src", "data", "github.generated.json");
const PUBLIC_DIR = path.join(ROOT, "public");

const API = "https://api.github.com";
const LOGIN = profile.githubLogin;

const headers: Record<string, string> = {
  accept: "application/vnd.github+json",
  "x-github-api-version": "2022-11-28",
  "user-agent": `${LOGIN}-portfolio-build`,
};
if (process.env.GITHUB_TOKEN) {
  headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

/** GitHub REST API のうち、実際に使うフィールドだけを拾った型 */
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
  topics: string[] | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

async function api<T>(pathname: string): Promise<T> {
  const res = await fetch(`${API}${pathname}`, { headers });
  if (!res.ok) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    const hint =
      remaining === "0"
        ? "（レート制限に達しています。GITHUB_TOKEN を設定すると緩和されます）"
        : "";
    throw new Error(`GET ${pathname} → ${res.status} ${res.statusText}${hint}`);
  }
  return (await res.json()) as T;
}

/** 100 件ずつ、返ってくる件数が 100 未満になるまで辿る */
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
 * アバターを public/ に保存し、サイトから参照するパスを返す。
 * 拡張子は Content-Type から決める（GitHub は PNG とも JPEG とも返しうる）。
 */
async function downloadAvatar(url: string): Promise<string> {
  const sized = `${url}${url.includes("?") ? "&" : "?"}s=400`;
  const res = await fetch(sized, { headers: { "user-agent": headers["user-agent"] } });
  if (!res.ok) {
    throw new Error(`アバターの取得に失敗: ${res.status} ${res.statusText}`);
  }
  const type = res.headers.get("content-type") ?? "image/png";
  const ext = type.includes("jpeg") ? "jpg" : type.includes("webp") ? "webp" : "png";
  const filename = `avatar.${ext}`;
  await mkdir(PUBLIC_DIR, { recursive: true });
  await writeFile(
    path.join(PUBLIC_DIR, filename),
    Buffer.from(await res.arrayBuffer()),
  );
  return `/${filename}`;
}

async function main(): Promise<void> {
  const [user, repos] = await Promise.all([
    api<ApiUser>(`/users/${LOGIN}`),
    fetchAllRepos(),
  ]);

  const avatarUrl = await downloadAvatar(user.avatar_url);

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
      .filter((repo) => !repo.fork && !repo.archived)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.html_url,
        homepage: repo.homepage || null,
        language: repo.language,
        stars: repo.stargazers_count,
        topics: repo.topics ?? [],
        pushedAt: repo.pushed_at,
      })),
  };

  await writeFile(OUT_JSON, `${JSON.stringify(data, null, 2)}\n`);
  console.log(
    `✓ ${data.repos.length} 件のリポジトリと ${avatarUrl} を src/data/github.generated.json に書き出しました`,
  );
}

main().catch(async (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`⚠ GitHub の取得に失敗しました: ${message}`);

  const hasFallback = await readFile(OUT_JSON)
    .then(() => true)
    .catch(() => false);

  if (hasFallback) {
    console.warn("  既存の github.generated.json を使ってビルドを続行します。");
    process.exit(0);
  }

  console.error("  フォールバックとなる生成済み JSON も無いため中止します。");
  process.exit(1);
});
