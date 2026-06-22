#!/usr/bin/env bash
# Exemplo: Atualizar marca via API Tray
# Doc: https://developers.tray.com.br/#api-de-marcas
# Quando usar: atualizar dados de uma marca existente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_BRAND_ID exportados.
# Validar a fixture antes:
#   node skills/marcas/scripts/validate.mjs --schema=marca.update \
#     "$(cat skills/marcas/examples/marca-atualizar.fixture.json)"
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_BRAND_ID:?defina TRAY_BRAND_ID=<id de uma marca>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/brands/${TRAY_BRAND_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @marca-atualizar.fixture.json \
  | jq .
