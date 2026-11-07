#!/bin/bash
# Type-check, commit staged-and-unstaged changes with a message, and push to main.
# Usage: scripts/push.sh "feat: describe your change"
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 \"commit message\"" >&2
  exit 1
fi

echo "=== Type-checking ==="
npm run lint

echo "=== Changes to be committed ==="
git status --short

git add -A
git commit -m "$1"
git push origin main
