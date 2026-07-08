#!/usr/bin/env bash
# Exemplo: Listar características de um produto via API Tray
# Doc: https://developers.tray.com.br/#apis-de-caracteristicas
# Quando usar: consultar as características já vinculadas a um produto.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id do produto>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/properties?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
