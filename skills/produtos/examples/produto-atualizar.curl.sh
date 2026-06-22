#!/usr/bin/env bash
# Exemplo: Atualizar produto via API Tray
# Doc: https://developers.tray.com.br/#api-de-produtos
# Quando usar: alterar campos de produto existente (preço, estoque, disponibilidade).
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID exportados.
# Validar a fixture antes:
#   node skills/produtos/scripts/validate.mjs --schema=produto.update \
#     "$(cat skills/produtos/examples/produto-atualizar.fixture.json)"
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id de um produto de teste>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @produto-atualizar.fixture.json \
  | jq .
