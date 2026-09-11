/**
 * profile.ts の links に書いた icon 名（"github" など）を、実際のアイコンに変換して描画する部品。
 *
 * アイコンの出どころが 2 つあるのは、種類によって配布元が違うため。
 *   - ブランドロゴ（GitHub / X / Discord …） … simple-icons
 *     lucide は v1 でブランド系アイコンを全部削除したので、こちらを使う必要がある。
 *   - 汎用アイコン（メール / リンク …）      … lucide-react
 *
 * どちらも currentColor で塗るので、親要素の文字色をそのまま引き継ぐ。
 * Tailwind の text-* クラスで色を変えられる。
 */
import { ExternalLink, Globe, type LucideIcon, Mail, Rss } from "lucide-react";
import {
  type SimpleIcon,
  siBluesky,
  siDiscord,
  siGithub,
  siInstagram,
  siMisskey,
  siNiconico,
  siNote,
  siNotion,
  siPixiv,
  siQiita,
  siSoundcloud,
  siSpeakerdeck,
  siSteam,
  siTwitch,
  siX,
  siYoutube,
  siZenn,
} from "simple-icons";

/**
 * ブランドロゴ。使いたいサービスが増えたら、上の import に足してここに 1 行足す。
 * simple-icons で使える名前は https://simpleicons.org/ で探せる
 * （サイト上の "GitHub" が、コード上では siGithub になる）。
 */
const brandIcons: Record<string, SimpleIcon> = {
  github: siGithub,
  x: siX,
  // X は旧 Twitter。どちらの名前で書いても同じロゴが出るようにしておく。
  twitter: siX,
  discord: siDiscord,
  zenn: siZenn,
  qiita: siQiita,
  note: siNote,
  notion: siNotion,
  youtube: siYoutube,
  twitch: siTwitch,
  bluesky: siBluesky,
  misskey: siMisskey,
  instagram: siInstagram,
  pixiv: siPixiv,
  niconico: siNiconico,
  soundcloud: siSoundcloud,
  speakerdeck: siSpeakerdeck,
  steam: siSteam,
};

/** ブランドロゴではない汎用アイコン。 */
const genericIcons: Record<string, LucideIcon> = {
  mail: Mail,
  email: Mail,
  globe: Globe,
  website: Globe,
  link: ExternalLink,
  rss: Rss,
};

type IconProps = {
  /** profile.ts の links に書いた icon の値。大文字small文字は区別しない。 */
  name: string;
  /** 一辺のピクセル数 */
  size?: number;
  className?: string;
};

export function Icon({ name, size = 20, className }: IconProps) {
  // "X" と "x" のどちらで書かれても引けるように、小文字に揃えてから探す。
  const key = name.toLowerCase();

  const brand = brandIcons[key];
  if (brand) {
    return (
      <svg
        // viewBox="0 0 24 24" は simple-icons 共通の座標系。
        viewBox="0 0 24 24"
        width={size}
        height={size}
        // 親の文字色で塗る。
        fill="currentColor"
        className={className}
        // 隣にサービス名のテキストが出ているので、読み上げでは二重に読ませない。
        aria-hidden="true"
      >
        <path d={brand.path} />
      </svg>
    );
  }

  // 知らない名前だったときは汎用のリンクアイコンにする。
  // 綴りを間違えても何も表示されない状態にはならず、間違いに気づける。
  const Generic = genericIcons[key] ?? ExternalLink;
  return <Generic size={size} className={className} aria-hidden="true" />;
}
