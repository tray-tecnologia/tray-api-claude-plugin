#!/usr/bin/env bash
# Exemplo: Consultar uma variação de produto via API Tray
# Doc: https://developers.tray.com.br/#api-de-variacoes-de-produtos
# Quando usar: obter dados de uma variação específica de um produto.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID e TRAY_VARIANT_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id do produto pai>}"
: "${TRAY_VARIANT_ID:?defina TRAY_VARIANT_ID=<id da variação>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/variants/${TRAY_VARIANT_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
