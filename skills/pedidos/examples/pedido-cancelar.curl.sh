#!/usr/bin/env bash
# Exemplo: Cancelar pedido via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#apis-de-pedidos
# Quando usar: cancelar pedido de teste. Prefira cancelamento a exclusão. NÃO rodar em produção.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ORDER_ID e CONFIRM_CANCEL=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ORDER_ID:?defina TRAY_ORDER_ID=<id de um pedido de teste>}"

if [ "${CONFIRM_CANCEL:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_CANCEL=yes para cancelar o pedido ${TRAY_ORDER_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/orders/${TRAY_ORDER_ID}/cancel?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
