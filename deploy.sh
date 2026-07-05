#!/usr/bin/env bash
# 地域おこし協力隊 判定ツールを surge.sh に公開する
# Vercel 移行後も Surge は残します（並行運用・予備URL）。
#
# 【デプロイ】
#   ./deploy.sh
#   ./deploy.sh chiiki-okoshi-checker
#
# 両方に反映する場合:
#   ./deploy-all.sh
#
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
SUB="${1:-chiiki-okoshi-checker}"
DOMAIN="${SUB%.surge.sh}.surge.sh"

cd "$ROOT"
npm run build

echo "Deploying to https://${DOMAIN} ..."
npx --yes surge@0.27.3 out "$DOMAIN"

echo "$(date '+%Y-%m-%d %H:%M:%S') | https://${DOMAIN}" >> "$ROOT/deploy-history.log"
