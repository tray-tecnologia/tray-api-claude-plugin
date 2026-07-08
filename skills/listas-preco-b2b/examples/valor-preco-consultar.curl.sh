#!/usr/bin/env bash
# Exemplo: Consultar um valor de lista de preço B2B via API Tray
# Doc: https://developers.tray.com.br/#api-de-lista-de-preco-b2b
# Quando usar: obter um valor específico (preço de um produto) dentro de uma lista.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRICE_LIST_ID
#   e TRAY_PRICE_LIST_VALUE_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRICE_LIST_ID:?defina TRAY_PRICE_LIST_ID=<id de uma lista de preço>}"
: "${TRAY_PRICE_LIST_VALUE_ID:?defina TRAY_PRICE_LIST_VALUE_ID=<id de um valor da lista>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/price-lists/${TRAY_PRICE_LIST_ID}/values/${TRAY_PRICE_LIST_VALUE_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
