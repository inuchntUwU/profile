/**
 * 取得済みの GitHub 情報を、画面から使いやすい形にして渡すファイル。
 *
 * 実際に API を叩くのは scripts/fetch-github.mts（ビルド前に 1 回だけ動く）。
 * ここはその結果ファイル src/data/github.generated.json を読むだけなので、
 * ページ表示のたびに通信が起きることはない。
 *
 * 画面側（page.tsx など）はこのファイルの githubUser と getProjects() だけを見ればよく、
 * JSON の中身の形を直接気にしなくて済む。
 */

// ビルド時に JSON がそのままコードに埋め込まれる（tsconfig の resolveJsonModule のおかげ）。
import generated from "@/data/github.generated.json";
import { profile } from "@/data/profile";

/** GitHub のプロフィール情報 */
export type GitHubUser = {
  login: string;
  name: string | null;
  bio: string | null;
  /**
   * アバター画像のパス。例: "/avatar.png"
   * 取得スクリプトが public/ に保存済みなので、GitHub のサーバーには繋ぎに行かない。
   */
  avatarUrl: string;
  htmlUrl: string;
  followers: number;
  publicRepos: number;
};

/** リポジトリ 1 件分 */
export type GitHubRepo = {
  name: string;
  /** リポジトリの説明。未設定なら null なので、表示前に必ず有無を確認すること。 */
  description: string | null;
  htmlUrl: string;
  /** GitHub の Website 欄。未設定なら null。 */
  homepage: string | null;
  /** 主要言語。判定できないリポジトリは null。 */
  language: string | null;
  stars: number;
  topics: string[];
  /** 最終 push 日時（ISO 8601 の文字列）。表示するときは整形が必要。 */
  pushedAt: string;
};

/** github.generated.json 全体の形 */
export type GitHubData = {
  /** 取得した時刻（ISO 8601）。「最終更新: ...」をフッターに出したいときに使う。 */
  fetchedAt: string;
  user: GitHubUser;
  repos: GitHubRepo[];
};

// JSON から読んだ値には型が付いていないので、ここで一度だけ上の型として扱う。
// 形が合っているかは取得スクリプト側が保証している。
const data = generated as GitHubData;

export const githubUser = data.user;
export const fetchedAt = data.fetchedAt;

/**
 * Projects に出すリポジトリを、表示したい順に並べて返す。
 *
 * 並び順:
 *   1. profile.featured に書いたリポジトリを、書いた順のまま先頭に置く
 *   2. 残りを star の多い順（同数なら最近 push された順）で後ろに続ける
 *
 * profile.featured に存在しないリポジトリ名が混ざっていても、エラーにせず黙って飛ばす。
 * （リポジトリをリネームしたときにサイトが落ちないように）
 */
export function getProjects(): GitHubRepo[] {
  // 名前からリポジトリを引けるようにしておく。
  const byName = new Map(data.repos.map((repo) => [repo.name, repo]));

  // featured に書いた名前を順番に引く。見つからなかったものは undefined になる。
  const featured = profile.featured
    .map((name) => byName.get(name))
    // undefined を取り除く。`repo is GitHubRepo` と書くことで、
    // この後の featured が「undefined を含まない配列」だと TypeScript に伝わる。
    .filter((repo): repo is GitHubRepo => repo !== undefined);

  // 先頭に出したものを、後ろのリストから除くための一覧。
  const featuredNames = new Set(featured.map((repo) => repo.name));

  const rest = data.repos
    .filter((repo) => !featuredNames.has(repo.name))
    .sort(
      // 比較関数が 0 を返す（= star が同数）ときだけ、|| の右側の日付比較が使われる。
      (a, b) => b.stars - a.stars || Date.parse(b.pushedAt) - Date.parse(a.pushedAt),
    );

  return [...featured, ...rest];
}
