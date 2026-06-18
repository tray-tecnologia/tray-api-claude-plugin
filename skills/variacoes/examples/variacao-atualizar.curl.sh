#!/usr/bin/env bash
# Exemplo: Atualizar variação de produto via API Tray
# Doc: https://developers.tray.com.br/#api-de-variacoes-de-produtos
# Quando usar: alterar preço, estoque ou demais dados de uma variação existente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID e TRAY_VARIANT_ID exportados.
# Validar a fixture antes:
#   node skills/variacoes/scripts/validate.mjs --schema=variacao.update \
#     "$(cat skills/variacoes/examples/variacao-atualizar.fixture.json)"
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id do produto pai>}"
: "${TRAY_VARIANT_ID:?defina TRAY_VARIANT_ID=<id da variação>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/variants/${TRAY_VARIANT_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @variacao-atualizar.fixture.json \
  | jq .
