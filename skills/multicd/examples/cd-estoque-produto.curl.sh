#!/usr/bin/env bash
# Exemplo: Consultar estoque detalhado de produto em todos os CDs via API Tray (MultiCD)
# Doc: https://developers.tray.com.br/#api-de-multicd
# Quando usar: obter o estoque de um produto distribuído por todos os CDs.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id de um produto>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/multicd/stock/detailed/product/${TRAY_PRODUCT_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
