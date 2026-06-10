#!/bin/bash
#
# krystal — one-liner ship
#
# Usage:
#   ./ship.sh                    # commits as "update", pushes, auto-deploys
#   ./ship.sh "what changed"     # commits with your message, pushes, auto-deploys
#
# GitHub Actions picks up the push and deploys to Vercel within ~2 minutes.
# Watch progress at https://github.com/ggshoo/krystal/actions

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
echo "✓ Pushed. GitHub Actions is deploying."
echo "  Watch: https://github.com/ggshoo/krystal/actions"
echo "  Live in ~2 min: https://krystal-one.vercel.app"
