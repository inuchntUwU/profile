#!/bin/bash
# Cloudflare Tunnel を常駐させる。setup-pi.sh と、トンネルの作成（README の手順 4）が終わってから実行する。
#
# 実行（手元の PC から。Pi のパスワードを聞かれる）:
#   ssh -t pi 'sudo bash ~/profile-deploy/setup-tunnel.sh'

set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "sudo を付けて実行してください: sudo bash $0" >&2
  exit 1
fi

cd "$(dirname "$0")"

# トンネルを作ったユーザー（sudo を実行した人）のホームにある認証情報を使う。
user_home="$(getent passwd "${SUDO_USER:-root}" | cut -d: -f6)"

if [ ! -f config.yml ]; then
  echo "config.yml がありません。先にトンネルを作成してください（README の手順 4）。" >&2
  exit 1
fi

# config.yml に書かれたトンネル ID から、認証情報ファイルの場所を決める。
tunnel_id="$(awk '/^tunnel:/ {print $2}' config.yml)"
creds="$user_home/.cloudflared/$tunnel_id.json"
if [ ! -f "$creds" ]; then
  echo "認証情報 $creds が見つかりません。" >&2
  exit 1
fi

echo "==> 設定と認証情報を /etc/cloudflared へ置く"
install -d -m 0755 /etc/cloudflared
install -m 0644 config.yml /etc/cloudflared/config.yml
# 認証情報はトンネルを乗っ取れる鍵なので、root だけが読めるようにする。
install -m 0600 "$creds" "/etc/cloudflared/$tunnel_id.json"
cloudflared --config /etc/cloudflared/config.yml tunnel ingress validate

echo "==> サービスとして登録して起動する"
if [ ! -f /etc/systemd/system/cloudflared.service ]; then
  cloudflared service install
fi
systemctl daemon-reload
systemctl enable cloudflared
systemctl restart cloudflared

sleep 3
systemctl is-active cloudflared
printf '\n\033[1;32m完了。Claude に「終わった」と伝えてください。\033[0m\n'
