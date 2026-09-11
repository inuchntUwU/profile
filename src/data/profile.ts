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

/** Tools セクションに並べるツール 1 件分 */
export type ProfileTool = {
  /** ツール名 */
  name: string;
  /** 一行の説明 */
  description: string;
  /** 公開先の URL。例: "https://xxx.inuch.net" */
  href: string;
  /**
   * 公開状況。省略すると "live"（公開中）。
   * "wip" にすると「開発中」の表示になり、カードはリンクにならない。
   * 作っている途中のツールを先に予告しておきたいときに使う。
   */
  status?: "live" | "wip";
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
  /**
   * About セクションの本文。
   * 改行したいときは " ではなく ` （バッククォート）で囲むと、書いた改行がそのまま画面に出る。
   *   intro: `1 行目
   *   2 行目`,
   */
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
  /**
   * Tools セクションに並べる、このドメインで公開しているツール。
   * 空配列のあいだは「準備中」のカードが 1 枚だけ表示される。
   */
  tools: ProfileTool[];
};

export const profile: Profile = {
  handle: "inuchnt",
  githubLogin: "inuchntUwU",

  // TODO: 公開するドメインが決まったら差し替える
  siteUrl: "https://profile.inuch.net",

  // TODO: 自己紹介を書く
  tagline: "エアプエンジニア",
  intro: "AIをつかってプロダクトを作成しています。ほぼデザイナーです",
  // TODO: 見せたいリポジトリ名を並べる。例: ["my-app", "some-tool"]
  featured: ["OMUCT_foodsys", "DisArcade"],

  links: [
    { label: "GitHub", href: "https://github.com/inuchntUwU", icon: "github" },
    { label: "X", href: "https://x.com/inuchnt", icon: "X" },
    { label: "note", href: "https://note.com/inuchnt", icon: "note" },

    // 例: { label: "X", href: "https://x.com/...", icon: "twitter" },
  ],

  // このドメインで公開するツール。1 つ公開するごとに 1 行足す。
  tools: [
    { name: "ここ", description: "このサイト", href: "https://profile.inuch.net" },
    // 例: { name: "Hoge", description: "〇〇を××するツール", href: "https://hoge.inuch.net" },
    // 例: { name: "Fuga", description: "作っている途中", href: "https://fuga.inuch.net", status: "wip" },
  ],
};
