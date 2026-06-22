#!/usr/bin/env bash
# Exemplo: Excluir tabela/faixa de CEP via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#api-de-configuracao-de-forma-de-frete
# Quando usar: remover uma faixa de CEP de teste. NÃO rodar contra produção.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ZIPCODE_TABLE_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ZIPCODE_TABLE_ID:?defina TRAY_ZIPCODE_TABLE_ID=<id de uma faixa de teste>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir a faixa de CEP ${TRAY_ZIPCODE_TABLE_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/shippings/method/zipcode_table/${TRAY_ZIPCODE_TABLE_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
