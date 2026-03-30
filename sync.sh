#!/bin/bash
set -e

cd "$(dirname "$0")"

SOURCE="../personal-blog/30_writings/"
TARGET="content/"

if [ ! -d "$SOURCE" ]; then
  echo "Error: source directory not found: $SOURCE"
  exit 1
fi

rsync -a --delete --exclude='index.md' "$SOURCE" "$TARGET"

# Sync attachments (incremental, only transfers changes)
ATTACH_SOURCE="../personal-blog/attachments/"
ATTACH_TARGET="content/attachments/"

if [ -d "$ATTACH_SOURCE" ]; then
  mkdir -p "$ATTACH_TARGET"
  rsync -a --delete "$ATTACH_SOURCE" "$ATTACH_TARGET"
fi

git add -A content/
if git diff --cached --quiet -- content/; then
  echo "No changes to publish."
  exit 0
fi

git commit -m "update posts"
git push

echo "Done."
