#!/bin/bash
#
# krystal — one-liner ship
#
# Usage:
#   ./ship.sh                    # commits as "update", pushes, auto-deploys
#   ./ship.sh "what changed"     # commits with your message, pushes, auto-deploys
#
# Vercel's GitHub connection picks up the push and deploys within ~2 minutes.
# Watch progress at https://vercel.com/gigis-projects-65dc14fd/crystal/deployments

set -e

MESSAGE="${1:-update}"

cd "$(dirname "$0")"

git add .

if git diff --staged --quiet; then
  echo "Nothing new to commit."
  exit 0
fi

git commit -m "$MESSAGE"
git push

echo ""
echo "✓ Pushed. Vercel is deploying."
echo "  Watch: https://vercel.com/gigis-projects-65dc14fd/crystal/deployments"
echo "  Live in ~2 min: https://krystal-one.vercel.app"
