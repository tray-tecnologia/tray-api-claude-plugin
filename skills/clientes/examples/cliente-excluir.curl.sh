#!/usr/bin/env bash
# Exemplo: Excluir cliente via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#api-de-clientes
# Quando usar: remover cliente de teste. NÃO rodar contra produção (atenção à LGPD).
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID e CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CUSTOMER_ID:?defina TRAY_CUSTOMER_ID=<id de um cliente de teste>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o cliente ${TRAY_CUSTOMER_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
