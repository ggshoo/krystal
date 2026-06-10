#!/bin/bash
#
# krystal — manual one-command deploy
#
# Usage:
#   ./deploy.sh                  # default commit message
#   ./deploy.sh "what changed"   # custom commit message
#
# This is the local fallback. Normally GitHub Actions handles deploys on
# every push to main — use `./ship.sh` instead. This script forces a local
# build + manual Vercel upload (slower, but works if Actions is broken).

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

# Use the official Vercel CLI pattern: pull → build → deploy --prebuilt.
# This pattern automatically links to the correct krystal project rather
# than creating one named after the working directory.

echo "→ Pulling Vercel project config…"
vercel pull --yes --environment=production

echo "→ Building with Vercel (uses vercel.json buildCommand)…"
vercel build --prod

echo "→ Deploying pre-built output…"
vercel deploy --prebuilt --prod

echo ""
echo "✓ Done. Hard-reload krystal-one.vercel.app to see the new build."
