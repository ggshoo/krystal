#!/bin/bash
#
# krystal — one-command deploy
#
# Usage:
#   ./deploy.sh                  # uses a default commit message
#   ./deploy.sh "what changed"   # custom commit message
#
# Does all of:
#   1. git add . && git commit (if there are changes)
#   2. git push
#   3. npx expo export --platform web
#   4. vercel deploy --prod from dist/
#
# Exits on first failure so you'll see the actual error.

set -e

MESSAGE="${1:-deploy: latest changes}"

cd "$(dirname "$0")"

echo "→ Staging changes…"
git add .

if git diff --staged --quiet; then
  echo "  (nothing new to commit)"
else
  echo "→ Committing: $MESSAGE"
  git commit -m "$MESSAGE"
fi

echo "→ Pushing to GitHub…"
git push

echo "→ Building production web bundle…"
npx expo export --platform web

echo "→ Deploying to Vercel…"
cd dist
vercel deploy --prod --yes
cd ..

echo ""
echo "✓ Done. Hard-reload krystal-one.vercel.app to see the new build."
