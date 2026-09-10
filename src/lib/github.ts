/**
 * scripts/fetch-github.mts が生成した JSON を型付きで読み出し、表示順を整えて返す。
 * 表示側はこのモジュールだけを見ればよく、生成 JSON の形を直接触らない。
 */
import generated from "@/data/github.generated.json";
import { profile } from "@/data/profile";

export type GitHubUser = {
  login: string;
  name: string | null;
  bio: string | null;
  /** public/ 以下に保存済みのアバターへのパス */
  avatarUrl: string;
  htmlUrl: string;
  followers: number;
  publicRepos: number;
};

export type GitHubRepo = {
  name: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  topics: string[];
  /** ISO 8601 */
  pushedAt: string;
};

export type GitHubData = {
  /** ISO 8601。取得時刻をフッターなどに出したい場合に使う。 */
  fetchedAt: string;
  user: GitHubUser;
  repos: GitHubRepo[];
};

const data = generated as GitHubData;

export const githubUser = data.user;
export const fetchedAt = data.fetchedAt;

/**
 * profile.featured を指定順で先頭に並べ、残りを star 数の降順
 * （同数なら更新の新しい順）で続ける。存在しないリポジトリ名は黙って無視する。
 */
export function getProjects(): GitHubRepo[] {
  const byName = new Map(data.repos.map((repo) => [repo.name, repo]));

  const featured = profile.featured
    .map((name) => byName.get(name))
    .filter((repo): repo is GitHubRepo => repo !== undefined);

  const featuredNames = new Set(featured.map((repo) => repo.name));

  const rest = data.repos
    .filter((repo) => !featuredNames.has(repo.name))
    .sort(
      (a, b) => b.stars - a.stars || Date.parse(b.pushedAt) - Date.parse(a.pushedAt),
    );

  return [...featured, ...rest];
}
