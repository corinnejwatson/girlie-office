#!/usr/bin/env bash
# Rebuild the girlie office page (index.html) from office.config.json, build/bots.config.json and data/*.json.
# No AI calls, no network. Usage: ./refresh.sh [--rel]   (--rel also recomputes data/relationships.json from ../shared/bot-findings)
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
if [[ "${1:-}" == "--rel" ]]; then python3 build/relationships.py || echo "relationships step failed; keeping the old data/relationships.json" >&2; fi
python3 build/build.py
