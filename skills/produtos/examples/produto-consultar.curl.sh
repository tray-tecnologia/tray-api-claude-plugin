#!/usr/bin/env bash
# Exemplo: Consultar um produto por ID via API Tray
# Doc: https://developers.tray.com.br/#api-de-produtos
# Quando usar: obter dados detalhados de um produto (inclui Variant, ProductImage, Properties).
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id de um produto de teste>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
