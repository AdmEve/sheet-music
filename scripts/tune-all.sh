#!/usr/bin/env bash
# Tune the first N levels on all cores and write src/data/levels.json.
set -euo pipefail
N=${1:-300}
J=${2:-$(nproc)}
TMP=$(mktemp -d)
echo '[]' > src/data/levels.json
step=$(( (N + J - 1) / J ))
pids=()
for ((k = 0; k < J; k++)); do
  from=$((k * step)); to=$(( (k + 1) * step < N ? (k + 1) * step : N ))
  npx vite-node scripts/tune-levels.ts "$from" "$to" "$TMP/part$k.json" > "$TMP/log$k.txt" 2>&1 &
  pids+=($!)
done
for p in "${pids[@]}"; do wait "$p"; done
cat "$TMP"/log*.txt | sort -n > "${TUNE_LOG:-/dev/null}"
node -e '
const fs = require("fs");
const parts = process.argv.slice(1).sort((a, b) => Number(a.match(/part(\d+)/)[1]) - Number(b.match(/part(\d+)/)[1]));
const all = parts.flatMap((f) => JSON.parse(fs.readFileSync(f, "utf8")));
fs.writeFileSync("src/data/levels.json", JSON.stringify(all));
console.log("levels:", all.length);
' "$TMP"/part*.json
