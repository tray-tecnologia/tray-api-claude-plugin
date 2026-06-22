#!/usr/bin/env bash
# Exemplo: Excluir endereço de um cliente via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#api-de-clientes
# Quando usar: remover endereço de teste. NÃO rodar contra produção sem certeza.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID, TRAY_ADDRESS_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
# Sem schema local: campos conferidos contra skills/enderecos-cliente/SKILL.md
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CUSTOMER_ID:?defina TRAY_CUSTOMER_ID=<id do cliente>}"
: "${TRAY_ADDRESS_ID:?defina TRAY_ADDRESS_ID=<id do endereço de teste>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o endereço ${TRAY_ADDRESS_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}/addresses/${TRAY_ADDRESS_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
