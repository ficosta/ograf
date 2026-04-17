#!/usr/bin/env bash
#
# Refreshes specThreads.json with the current state of closed issues on ebu/ograf.
# Drops PRs and issues closed as "invalid" (i.e. noise, not spec-shaping decisions).
#
# Usage:
#   ./apps/dev/scripts/refresh-spec-history.sh
#
# Requirements: gh (authenticated), jq.
#
# After running, open specSummaries.json and add plain-English summaries for
# any new issue numbers. Issues without a summary fall back to the GitHub title.

set -euo pipefail

REPO="ebu/ograf"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$HERE/../src/content/specThreads.json"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "→ Fetching closed issues from $REPO …"
gh api "repos/$REPO/issues?state=closed&per_page=100" --paginate \
  | jq '[.[] | select(.pull_request == null) | select([.labels[].name] | index("invalid") | not)]' \
  > "$TMP_DIR/issues.json"

COUNT=$(jq 'length' "$TMP_DIR/issues.json")
echo "→ Found $COUNT spec-shaping issues. Fetching comments …"

for n in $(jq -r '.[].number' "$TMP_DIR/issues.json"); do
  gh api "repos/$REPO/issues/$n/comments" > "$TMP_DIR/comments-$n.json"
done

echo "→ Merging into specThreads.json …"
jq -r '.[].number' "$TMP_DIR/issues.json" | while read -r n; do
  jq --slurpfile comments "$TMP_DIR/comments-$n.json" \
    --argjson num "$n" \
    '.[] | select(.number == $num) | {
      number,
      title,
      url: .html_url,
      closedAt: (.closed_at | .[0:10]),
      author: .user.login,
      labels: [.labels[].name | if . == "Concluded - waiting for implementation" then "Concluded" else . end],
      body: (.body // ""),
      comments: ($comments[0] | map({author: .user.login, createdAt: .created_at, body: .body}))
    }' "$TMP_DIR/issues.json"
done | jq -s 'sort_by(.closedAt) | reverse' > "$OUT"

echo "✓ Wrote $OUT ($COUNT entries)"
echo ""
echo "Next: open src/content/specSummaries.json and add summaries for any new issue numbers."
