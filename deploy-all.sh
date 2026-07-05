#!/usr/bin/env bash
# Surge と Vercel の両方に同じ内容を公開する
# 独自ドメイン移行後も Surge は残す運用を想定しています。
#
# 【デプロイ】
#   ./deploy-all.sh
#
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== Deploying to Surge ==="
"$ROOT/deploy.sh"

echo ""
echo "=== Deploying to Vercel ==="
"$ROOT/deploy-vercel.sh"

echo ""
echo "Done. Surge and Vercel are both updated."
