#!/usr/bin/env bash
# Exemplo: Criar variação de produto via API Tray
# Doc: https://developers.tray.com.br/#api-de-variacoes-de-produtos
# Quando usar: cadastrar variação nova em um produto existente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID exportados.
# Validar a fixture antes:
#   node skills/variacoes/scripts/validate.mjs --schema=variacao.create \
#     "$(cat skills/variacoes/examples/variacao-criar.fixture.json)"
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id do produto pai>}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/variants?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @variacao-criar.fixture.json \
  | jq .
