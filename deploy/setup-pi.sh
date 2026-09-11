#!/bin/bash
# ラズパイの基本セットアップ。Caddy と cloudflared を入れ、サイトを配信できる状態にする。
#
# 実行（手元の PC から。Pi のパスワードを聞かれる）:
#   ssh -t pi 'sudo bash ~/profile-deploy/setup-pi.sh'
#
# 何度実行しても安全（入っているものは入れ直さず、設定だけ上書きする）。

# 途中でコマンドが失敗したらそこで止める。
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "sudo を付けて実行してください: sudo bash $0" >&2
  exit 1
fi

# このスクリプトと同じ場所にある Caddyfile などを使う。
cd "$(dirname "$0")"

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }

step "1/5 パッケージを入れる（git / caddy / curl）"
apt-get update
apt-get install -y git caddy curl

step "2/5 cloudflared を入れる"
if command -v cloudflared >/dev/null; then
  echo "インストール済み: $(cloudflared --version)"
else
  # Cloudflare 公式の apt リポジトリから入れる。こうしておくと、以後は apt upgrade で更新される。
  install -d -m 0755 /usr/share/keyrings
  curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg -o /usr/share/keyrings/cloudflare-main.gpg
  echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main' \
    > /etc/apt/sources.list.d/cloudflared.list

  if apt-get update && apt-get install -y cloudflared; then
    echo "apt から入れました"
  else
    # apt が署名の確認などで失敗したときは、GitHub で配布されている公式の .deb を入れる。
    echo "apt で入らなかったので、GitHub の公式リリースから入れます"
    rm -f /etc/apt/sources.list.d/cloudflared.list
    apt-get update
    tmp="$(mktemp -d)"
    curl -fsSL -o "$tmp/cloudflared.deb" \
      "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-$(dpkg --print-architecture).deb"
    apt-get install -y "$tmp/cloudflared.deb"
    rm -rf "$tmp"
  fi
  cloudflared --version
fi

step "3/5 サイトのファイルを置く（deploy ブランチを /var/www/profile へ）"
if [ -d /var/www/profile/.git ]; then
  echo "既にあるので最新にする"
  git -C /var/www/profile fetch --depth 1 origin deploy
  git -C /var/www/profile reset --hard FETCH_HEAD
else
  install -d -m 0755 /var/www
  git clone --depth 1 -b deploy https://github.com/inuchntUwU/profile.git /var/www/profile
fi

step "4/5 Caddy の設定を入れる"
# 8090 番を Caddy 以外が使っていたら止める（同じ Pi で動いている他のサービスを壊さないため）。
if ss -ltnp 2>/dev/null | grep -q '127.0.0.1:8090 ' && ! ss -ltnp 2>/dev/null | grep '127.0.0.1:8090 ' | grep -q caddy; then
  echo "ポート 8090 を別のプログラムが使っています。Caddyfile のポートを変えてください:" >&2
  ss -ltnp | grep '127.0.0.1:8090 ' >&2
  exit 1
fi
install -m 0644 Caddyfile /etc/caddy/Caddyfile
# 書き間違いがあればここで止まる（壊れた設定で再起動しない）。
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
systemctl enable caddy
systemctl restart caddy

step "5/5 自動更新（10 分ごとに deploy ブランチを取り込む）を有効にする"
install -m 0644 profile-sync.service profile-sync.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now profile-sync.timer

step "確認"
sleep 1
code="$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: profile.inuch.net' http://127.0.0.1:8090/)"
echo "Caddy の応答: $code"
systemctl list-timers profile-sync.timer --no-pager | head -3
if [ "$code" = "200" ]; then
  printf '\n\033[1;32m完了。Claude に「終わった」と伝えてください。\033[0m\n'
else
  printf '\n\033[1;31mCaddy が 200 を返しませんでした。この画面の内容を Claude に見せてください。\033[0m\n'
  exit 1
fi
