#!/usr/bin/env bash
# Exemplo: Listar variações de um produto via API Tray
# Doc: https://developers.tray.com.br/#api-de-variacoes-de-produtos
# Quando usar: listar variações de um produto. Máximo 50 itens por página (use page p/ paginar).
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id do produto pai>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/variants?access_token=${TRAY_ACCESS_TOKEN}&limit=30&page=1" \
  | jq .
