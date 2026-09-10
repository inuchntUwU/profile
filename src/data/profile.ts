/**
 * 手書きのプロフィール情報。GitHub API から取れない内容はすべてここに置く。
 * ビルド前スクリプト（scripts/fetch-github.mts）もこのファイルを読むので、
 * 依存を増やさない（パスエイリアスや外部パッケージを import しない）。
 */

export type ProfileLink = {
  label: string;
  href: string;
  /** lucide-react のアイコン名。表示側で解決する。 */
  icon: string;
};

export type Profile = {
  /** サイト上での表示ハンドル */
  handle: string;
  /** GitHub のアカウント名。取得スクリプトもこの値を使う。 */
  githubLogin: string;
  /** 公開先の URL。metadata と OGP の絶対 URL 解決に使う。 */
  siteUrl: string;
  /** Hero に置く一行の紹介 */
  tagline: string;
  /** About の本文 */
  intro: string;
  /**
   * Projects の先頭に固定表示するリポジトリ名。
   * この配列の順序がそのまま表示順になる。ここに無いリポジトリは
   * star 数の降順（同数なら更新の新しい順）で後ろに続く。
   */
  featured: string[];
  links: ProfileLink[];
};

export const profile: Profile = {
  handle: "inuchnt",
  githubLogin: "inuchntUwU",
  siteUrl: "https://example.com",

  tagline: "",
  intro: "",

  featured: [],

  links: [{ label: "GitHub", href: "https://github.com/inuchntUwU", icon: "github" }],
};
