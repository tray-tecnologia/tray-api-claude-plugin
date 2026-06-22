#!/usr/bin/env bash
# Exemplo: Listar valores de uma lista de preço B2B via API Tray
# Doc: https://developers.tray.com.br/#api-de-lista-de-preco-b2b
# Quando usar: paginar os valores (preços por produto) de uma lista. Máximo 50 itens por página.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRICE_LIST_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRICE_LIST_ID:?defina TRAY_PRICE_LIST_ID=<id de uma lista de preço>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/price-lists/${TRAY_PRICE_LIST_ID}/values?access_token=${TRAY_ACCESS_TOKEN}&limit=30&page=1" \
  | jq .
