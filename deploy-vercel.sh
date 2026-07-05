#!/usr/bin/env bash
# 地域おこし協力隊 判定ツールを Vercel に公開する
# Surge（./deploy.sh）とは独立。Vercel 移行後も Surge は残します。
#
# 【初回】
#   npx vercel login
#   ./deploy-vercel.sh
#
# 【本番デプロイ】
#   ./deploy-vercel.sh
#
# 【プレビューのみ】
#   ./deploy-vercel.sh --preview
#
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if [[ "${1:-}" == "--preview" ]]; then
  echo "Deploying to Vercel (preview)..."
  DEPLOY_URL=$(npx --yes vercel@latest deploy --yes)
else
  echo "Deploying to Vercel (production)..."
  DEPLOY_URL=$(npx --yes vercel@latest deploy --prod --yes)
fi

echo "$DEPLOY_URL"
echo "$(date '+%Y-%m-%d %H:%M:%S') | $DEPLOY_URL" >> "$ROOT/deploy-vercel-history.log"
