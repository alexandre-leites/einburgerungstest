#!/usr/bin/env bash
#
# Rebuild docs/assets/questions.json (and optionally dictionary.json) from
# data/source/. See data/README.md for the full story.
#
# Usage:
#   ./scripts/build-data.sh                  # questions only (fast)
#   ./scripts/build-data.sh --with-dictionary  # + dictionary refresh (slow, network)
#
set -euo pipefail

cd "$(dirname "$0")/.."

echo "[build-data] applying corrections to questions…"
node scripts/update_questions.js

if [[ "${1-}" == "--with-dictionary" ]]; then
  echo "[build-data] refreshing German dictionary descriptions (this will take a while)…"
  python3 scripts/fill_de_descriptions.py --sleep 0.12 --report scripts/fill_report.json
else
  echo "[build-data] skipping dictionary refresh (pass --with-dictionary to include it)"
fi

echo "[build-data] done."
