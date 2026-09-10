import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // out/ に静的 HTML を書き出す。ラズパイ側は素のファイルサーバーで配るだけになる。
  output: "export",
  // 静的出力では画像最適化サーバーが動かないため無効化する。
  images: { unoptimized: true },
  // 各ルートを dir/index.html にして、リライト設定なしのファイルサーバーで確実に引けるようにする。
  trailingSlash: true,
};

export default nextConfig;
