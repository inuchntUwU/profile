import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_JP } from "next/font/google";
import { profile } from "@/data/profile";
// 全ページ共通の CSS。ここで 1 回読み込めば全体に効く。
import "./globals.css";

/**
 * 全ページを包む一番外側の枠。<html> と <body> はここにしか書かない。
 * ページ本体（page.tsx）は下の {children} の位置に差し込まれる。
 */

// 本文のフォント。next/font はビルド時にフォントを取得してサイトに同梱するので、
// 表示のたびに Google へ取りに行かない（ラズパイ配信でも速い）。
// variable の名前は globals.css の font-sans が参照する --font-sans に合わせている。
const notoSansJp = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// 等幅フォント。言語名や日付などの細かい情報に使う（font-mono クラス）。
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ブラウザのタブに出る文字や、SNS でシェアされたときのカードの内容。
// profile.ts から引いているので、こちらを直接書き換える必要はない。
export const metadata: Metadata = {
  // 画像などの相対パスを絶対 URL に直すときの基準。OGP は絶対 URL でないと SNS 側が読めない。
  metadataBase: new URL(profile.siteUrl),
  title: profile.handle,
  description: profile.tagline,
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    title: profile.handle,
    description: profile.tagline,
  },
};

// LayoutProps は Next.js がビルド時に自動生成する型なので、import は要らない。
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      // dark … shadcn/ui の色をダーク用に切り替える。このサイトはダーク固定。
      // antialiased … 文字の輪郭を滑らかにする。
      className={`dark ${notoSansJp.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
