#!/usr/bin/env bash
# Exemplo: Excluir status de pedido via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#api-de-status-do-pedido
# Quando usar: remover status personalizado de teste. NÃO rodar contra produção.
#   Status padrão da plataforma não podem ser excluídos.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ORDER_STATUS_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ORDER_STATUS_ID:?defina TRAY_ORDER_STATUS_ID=<id de um status de teste>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o status ${TRAY_ORDER_STATUS_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/orders/statuses/${TRAY_ORDER_STATUS_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
