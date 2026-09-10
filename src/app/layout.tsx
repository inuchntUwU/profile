import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/data/profile";
// 全ページ共通の CSS。ここで 1 回読み込めば全体に効く。
import "./globals.css";

/**
 * 全ページを包む一番外側の枠。<html> と <body> はここにしか書かない。
 * ページ本体（page.tsx）は下の {children} の位置に差し込まれる。
 */

// next/font はビルド時にフォントを取得して同梱してくれる。
// 表示のたびに Google のサーバーへ取りに行かないので速く、外部への通信も発生しない。
// variable で CSS 変数として定義し、globals.css 側から参照できるようにしている。
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ブラウザのタブに出る文字や、SNS でシェアされたときのカードの内容。
// profile.ts から引いているので、こちらを直接書き換える必要はない。
export const metadata: Metadata = {
  // 画像などの相対パスを絶対 URL に直すときの基準。
  // OGP は絶対 URL でないと SNS 側が読めないため必要。
  // profile.siteUrl が example.com のままだと間違った URL が埋まるので、公開前に直すこと。
  metadataBase: new URL(profile.siteUrl),
  title: profile.handle,
  description: profile.tagline,
  // openGraph は SNS でシェアされたときに表示されるカードの設定。
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
      // 日本語ページであることの宣言。読み上げソフトや翻訳の判定に使われる。
      lang="ja"
      // 上で作ったフォントの CSS 変数を全体に適用する。
      // antialiased は文字の輪郭を滑らかにする Tailwind のクラス。
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
