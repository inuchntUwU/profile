# ラズパイ側セットアップ

ラズパイでは **ビルドしない**。GitHub Actions が作った静的ファイルを `deploy` ブランチから
引いてきて Caddy で配るだけなので、Node.js は不要。
公開は Cloudflare Tunnel 経由で、URL は **https://profile.inuch.net**。
`https://inuch.net` に来たアクセスは、Caddy が `https://profile.inuch.net` へ転送する（302）。

```
ブラウザ → Cloudflare（https）→ Tunnel → Pi の cloudflared → Caddy（127.0.0.1:8090）→ /var/www/profile
```

前提:

- `ssh pi` でラズパイに入れること（`~/.ssh/config` に `Host pi` がある）
- `main` を push 済みで、Actions が一度成功して `deploy` ブランチがあること
- `inuch.net` が Cloudflare のネームサーバー管理下にあること

sudo が必要な手順（2 と 5）は、ラズパイのパスワードを入力するため手元のターミナルで実行する。

## 1. ファイルをラズパイへ送る（手元の PC で）

```bash
ssh pi 'mkdir -p ~/profile-deploy'
scp deploy/* pi:~/profile-deploy/
```

## 2. 基本セットアップ（手元の PC で。パスワードを聞かれる）

```bash
ssh -t pi 'sudo bash ~/profile-deploy/setup-pi.sh'
```

git / Caddy / cloudflared を入れ、`/var/www/profile` にサイトを置き、Caddy と自動更新タイマーを動かす。
最後に「完了」と出れば OK。何度実行しても安全。

## 3. Cloudflare にログイン（ラズパイで）

```bash
ssh pi 'cloudflared tunnel login'
```

URL が表示されるので、**手元のブラウザで開き、Cloudflare にログインして `inuch.net` を選ぶ**。
承認されるとラズパイの `~/.cloudflared/cert.pem` ができる。

## 4. トンネルを作って DNS に登録（ラズパイで）

```bash
ssh pi 'cloudflared tunnel create profile'
ssh pi 'cloudflared tunnel route dns profile profile.inuch.net'
ssh pi 'cloudflared tunnel route dns profile inuch.net'          # inuch.net → profile.inuch.net の転送用
```

1 行目で表示されたトンネル ID を `cloudflared-config.yml` の `<TUNNEL_ID>` 2 か所に埋め、
ラズパイの `~/profile-deploy/config.yml` として保存する。

## 5. トンネルを常駐させる（手元の PC で。パスワードを聞かれる）

```bash
ssh -t pi 'sudo bash ~/profile-deploy/setup-tunnel.sh'
```

設定と認証情報を `/etc/cloudflared/` に移し、cloudflared をサービスとして起動する。

## 確認

```bash
curl -I https://profile.inuch.net
ssh pi 'systemctl is-active caddy cloudflared profile-sync.timer'
```

## 更新の流れ

1. `main` に push、または毎日 06:00 JST の定期実行で Actions が走る
2. GitHub API を取り直して静的 HTML を生成し、`deploy` ブランチへ force push
3. ラズパイの `profile-sync.timer` が 10 分以内に取り込む

`deploy` ブランチは毎回 force push される使い捨てブランチなので、ラズパイ側は `git pull` ではなく
`git fetch` + `git reset --hard FETCH_HEAD` で追いかけている（`profile-sync.service`）。

`main` を触らずに GitHub の最新情報だけ反映したいときは、Actions の
"Build and deploy" を `workflow_dispatch` で手動実行する。

## メモ

- `~/.cloudflared/cert.pem` は inuch.net のトンネルや DNS を操作できる鍵なので、他人に渡さない
- Caddy は `127.0.0.1:8090` だけで待ち受けている。LAN の他の端末から直接は見えない
