# ラズパイ側セットアップ

ラズパイでは **ビルドしない**。GitHub Actions が作った静的ファイルを `deploy` ブランチから
引いてきて Caddy で配るだけなので、Node.js は不要。

前提:

- `main` に push 済みで、Actions が一度成功して `deploy` ブランチが存在すること
- 公開に使うドメインが Cloudflare のネームサーバー管理下にあること

## 1. 成果物を置く

```bash
sudo apt install -y git caddy
sudo git clone --depth 1 -b deploy https://github.com/inuchntUwU/profile.git /var/www/profile
```

## 2. Caddy で配信する

```bash
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl enable --now caddy
curl -I http://localhost:8080     # 200 が返れば OK
```

## 3. 自動更新（10 分ごと）

```bash
sudo cp deploy/profile-sync.service deploy/profile-sync.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now profile-sync.timer

sudo systemctl start profile-sync   # 手動で 1 回動かして確認
systemctl list-timers profile-sync
```

`deploy` ブランチは毎回 force push される使い捨てブランチなので、`git pull` ではなく
`git fetch` + `git reset --hard FETCH_HEAD` で追いかけている。

## 4. Cloudflare Tunnel で公開する

```bash
# cloudflared のインストールは Cloudflare のドキュメントに従う
cloudflared tunnel login
cloudflared tunnel create profile          # 出力される Tunnel ID を控える
cloudflared tunnel route dns profile <公開ホスト名>

sudo mkdir -p /etc/cloudflared
sudo cp deploy/cloudflared-config.yml /etc/cloudflared/config.yml
sudo nano /etc/cloudflared/config.yml      # <TUNNEL_ID> と <公開ホスト名> を埋める

sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

TLS は Cloudflare 側で終端するため、ルーターのポート開放も証明書の管理も不要。
グローバル IP も露出しない。

## 確認

```bash
curl -I https://<公開ホスト名>
systemctl status caddy cloudflared profile-sync.timer
```

## 更新の流れ

1. `main` に push、または毎日 06:00 JST の定期実行で Actions が走る
2. GitHub API を取り直して静的 HTML を生成し、`deploy` ブランチへ force push
3. ラズパイの `profile-sync.timer` が 10 分以内に取り込む

`main` を触らずに GitHub の最新情報だけ反映したいときは、Actions の
"Build and deploy" を `workflow_dispatch` で手動実行する。
