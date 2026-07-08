#!/usr/bin/env bash
# Exemplo: Criar script externo via API Tray
# Doc: https://developers.tray.com.br/#apis-de-scripts-externos
# Quando usar: injetar script JavaScript (ex: GTM, pixel) na vitrine. URL deve ser HTTPS.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Sem schema local: campos conferidos contra skills/scripts-externos/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/scripts?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @script-criar.fixture.json \
  | jq .
