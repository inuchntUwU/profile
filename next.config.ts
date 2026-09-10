import type { NextConfig } from "next";

/**
 * Next.js の設定ファイル。
 *
 * このサイトは「サーバーを動かさず、出来上がった HTML ファイルを置くだけ」の形で公開する。
 * ラズパイ側は Caddy がファイルを返すだけになり、Node.js を入れる必要がない。
 * そのための設定が下の 3 つ。
 */
const nextConfig: NextConfig = {
  // ビルド時にページを HTML ファイルとして out/ に書き出す。
  // これを付けないと Next.js のサーバーを常駐させる前提の出力になってしまう。
  output: "export",

  // Next.js の <Image> は本来サーバー側で画像を変換して配信するが、
  // サーバーが無いのでその機能を切る。画像はそのままのサイズで配信される。
  images: { unoptimized: true },

  // 各ページを「/about.html」ではなく「/about/index.html」の形で出力する。
  // ディレクトリを開いたら index.html を返すのはどのファイルサーバーでも共通の動きなので、
  // Caddy 側に特別なリライト設定を書かなくてもリンクが壊れない。
  trailingSlash: true,
};

export default nextConfig;
