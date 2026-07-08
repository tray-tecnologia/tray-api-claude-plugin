#!/usr/bin/env bash
# Exemplo: Criar marca via API Tray
# Doc: https://developers.tray.com.br/#api-de-marcas
# Quando usar: cadastrar marca nova.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Validar a fixture antes:
#   node skills/marcas/scripts/validate.mjs --schema=marca.create \
#     "$(cat skills/marcas/examples/marca-criar.fixture.json)"
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/brands?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @marca-criar.fixture.json \
  | jq .
