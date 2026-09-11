/**
 * 手書きのプロフィール情報。
 *
 * GitHub API から自動で取れない内容（自己紹介文、SNS リンクなど）は全部ここに書く。
 * 日常的に編集するのは基本このファイルだけ。
 *
 * 注意: このファイルは 2 か所から読まれる。
 *   1. サイト本体（src/app/page.tsx など）
 *   2. ビルド前に走る取得スクリプト（scripts/fetch-github.mts）
 * 2 は Next.js を通さず素の Node.js で実行されるので、
 * ここで「@/」から始まるパスや外部パッケージを import すると動かなくなる。
 * このファイルは型と定数だけの、依存ゼロの状態を保つこと。
 */

/** Links セクションに並べる外部リンク 1 件分 */
export type ProfileLink = {
  /** 画面に出す名前。例: "GitHub" */
  label: string;
  /** リンク先 URL */
  href: string;
  /**
   * lucide-react のアイコン名。表示側でこの文字列から実際のアイコンを引く。
   * 使えるアイコン名は https://lucide.dev/icons/ で探せる。
   */
  icon: string;
};

/** profile オブジェクトの形。ここに書いた項目しか使えないので、増やすときは型も足す。 */
export type Profile = {
  /** サイト上での表示ハンドル。ページタイトルにも使われる。 */
  handle: string;
  /**
   * GitHub のアカウント名。
   * 取得スクリプトが https://api.github.com/users/<この値> を叩くので、
   * 表示用ハンドルとは別に正確な値が必要。
   */
  githubLogin: string;
  /**
   * 公開先の URL。
   * OGP（SNS でシェアしたときに出るカード）の画像 URL を絶対パスに直すのに使う。
   * 公開前に実際のドメインへ必ず変えること。
   */
  siteUrl: string;
  /** Hero に置く一行の紹介文 */
  tagline: string;
  /** About セクションの本文 */
  intro: string;
  /**
   * Projects の先頭に固定表示したいリポジトリ名（GitHub 上の名前をそのまま書く）。
   * この配列に書いた順がそのまま表示順になる。
   * ここに書かなかったリポジトリは、star の多い順で自動的に後ろに並ぶ。
   * 空配列のままなら全部 star 順。
   */
  featured: string[];
  /** Links セクションに並べる外部リンク */
  links: ProfileLink[];
};

export const profile: Profile = {
  handle: "inuchnt",
  githubLogin: "inuchntUwU",

  // TODO: 公開するドメインが決まったら差し替える
  siteUrl: "https://profile.inuch.net",

  // TODO: 自己紹介を書く
  tagline: "エアプエンジニア",
  intro:
    "エアプエンジニアとしてAIをつかってプロダクトを作成しています。もうデザイナーのほうが近いです",

  // TODO: 見せたいリポジトリ名を並べる。例: ["my-app", "some-tool"]
  featured: ["OMUCT_foodsys", "DisArcade"],

  links: [
    { label: "GitHub", href: "https://github.com/inuchntUwU", icon: "github" },
    { label: "X", href: "https://x.com/inuchnt", icon: "X" },

    // 例: { label: "X", href: "https://x.com/...", icon: "twitter" },
  ],
};
