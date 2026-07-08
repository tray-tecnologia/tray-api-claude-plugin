#!/usr/bin/env bash
# Exemplo: Atualizar categoria via API Tray
# Doc: https://developers.tray.com.br/#api-de-categorias
# Quando usar: alterar dados de uma categoria existente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CATEGORY_ID exportados.
# Validar a fixture antes:
#   node skills/categorias/scripts/validate.mjs --schema=categoria.update \
#     "$(cat skills/categorias/examples/categoria-atualizar.fixture.json)"
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CATEGORY_ID:?defina TRAY_CATEGORY_ID=<id de uma categoria>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/categories/${TRAY_CATEGORY_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @categoria-atualizar.fixture.json \
  | jq .
