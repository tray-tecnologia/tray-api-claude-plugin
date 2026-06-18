#!/usr/bin/env bash
# Exemplo: Consultar pedido completo via API Tray
# Doc: https://developers.tray.com.br/#apis-de-pedidos
# Quando usar: obter dados completos do pedido (produtos, cliente, pagamento, frete) em 1 chamada.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ORDER_ID:?defina TRAY_ORDER_ID=<id de um pedido de teste>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/orders/${TRAY_ORDER_ID}/full?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
