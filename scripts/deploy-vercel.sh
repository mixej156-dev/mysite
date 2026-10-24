#!/usr/bin/env bash
# Deploy to Vercel production (project lonar-eco, https://lonar-eco.vercel.app): refresh the clean copy, then deploy
# it. The token is read from ~/.config/vercel-token/token (outside the repository).
#
#   scripts/deploy-vercel.sh
set -euo pipefail

SRC="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
DEST="$SRC/../my-site-clean"
TOKEN_FILE="$HOME/.config/vercel-token/token"

[ -s "$TOKEN_FILE" ] || { echo "No Vercel token in $TOKEN_FILE" >&2; exit 1; }

"$SRC/scripts/export-clean.sh" "$DEST"
cd "$DEST"
# `vercel link` writes an OIDC token here; the deployment doesn't need it
rm -f .env.local
npx --yes vercel@65 deploy --prod --yes --token "$(cat "$TOKEN_FILE")"
