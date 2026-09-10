# profile

`inuchnt` のポートフォリオサイト。Next.js の静的エクスポートをラズパイに置き、
Cloudflare Tunnel 経由で公開する。

## スタック

| | |
|---|---|
| フレームワーク | Next.js 16（App Router / `output: "export"` で完全な静的出力） |
| 言語・UI | TypeScript / React 19 / Tailwind CSS v4 |
| コンポーネント | shadcn/ui + lucide-react |
| アニメーション | motion |
| Lint / Format | Biome |

## コマンド

```bash
npm run dev        # データ取得 + 開発サーバー
npm run data       # GitHub から取得して src/data/github.generated.json を更新
npm run build      # データ取得 + 静的ビルド（out/ に出力）
npm run check      # Biome で lint と format を適用
npm run typecheck  # 型チェック
```

## ファイルの役割

| ファイル | 何をしているか |
|---|---|
| `src/data/profile.ts` | 手書きのプロフィール情報。自己紹介・リンク・`featured` |
| `src/data/github.generated.json` | 自動生成。GitHub から取ってきた内容のスナップショット |
| `scripts/fetch-github.mts` | 上の JSON とアバターを作るスクリプト |
| `src/lib/github.ts` | 生成 JSON を読み、表示したい順に並べ替えて画面へ渡す |
| `src/app/layout.tsx` | 全ページ共通の枠。フォントとタブのタイトル・OGP |
| `src/app/page.tsx` | トップページ本体。見た目はここに書く |
| `src/components/Reveal.tsx` | スクロールでフェードインさせる部品 |
| `src/components/ui/` | shadcn/ui のパーツ。自分で編集しない |
| `next.config.ts` | 静的な HTML として書き出すための設定 |
| `biome.jsonc` | lint と整形の設定 |
| `.github/workflows/deploy.yml` | 自動ビルドと deploy ブランチへの反映 |
| `deploy/` | ラズパイに置く設定ファイルと手順 |

各ファイルの先頭に、何をしているかのコメントを書いてある。

## 編集する場所

日常的に触るのは次の 2 つ。

- `src/data/profile.ts` — 自己紹介、外部リンク、`featured`（Projects の先頭に固定するリポジトリ）
- `src/app/page.tsx` と `src/components/` — 見た目

リポジトリ一覧は自動で埋まるので手で書く必要はない。

## GitHub のデータについて

`scripts/fetch-github.mts` がビルド前に GitHub API を叩き、
`src/data/github.generated.json` と `public/avatar.*` を生成する。

Server Component の中で fetch せずビルド前に JSON 化しているのは、
**生成物をコミットしておけば API 障害やレート制限が起きてもビルドが壊れず、
直近のスナップショットで公開を継続できる**ため。オフラインでも `npm run dev` が動く。
そのため生成物は `.gitignore` に入れず、あえてコミットしている。

取得に失敗したときは警告を出して既存の JSON を使い、ビルドは続行する。

`GITHUB_TOKEN` があればレート制限が緩和される。無ければ未認証（60 req/h）で動く。

## デプロイ

```
push / 毎日 06:00 JST / 手動実行
        ↓
GitHub Actions がビルドし out/ を deploy ブランチへ force push
        ↓
ラズパイの systemd timer が 10 分ごとに取り込む
        ↓
Caddy が配信し、Cloudflare Tunnel で HTTPS 公開
```

`deploy` ブランチはビルド成果物専用の使い捨てブランチ。ラズパイ側では
ビルドを行わないので Node.js は不要。セットアップ手順は [`deploy/README.md`](deploy/README.md) を参照。

## 公開前にやること

- `src/data/profile.ts` の `siteUrl` を実際の公開先に変える（OGP の絶対 URL 解決に使う）
- `deploy/cloudflared-config.yml` の `<TUNNEL_ID>` と `<公開ホスト名>` を埋める
