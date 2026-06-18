#!/usr/bin/env bash
# Exemplo: Excluir parceiro via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#apis-de-parceiros
# Quando usar: remover parceiro de teste. NÃO rodar contra produção.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PARTNER_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PARTNER_ID:?defina TRAY_PARTNER_ID=<id de um parceiro de teste>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o parceiro ${TRAY_PARTNER_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/partners/${TRAY_PARTNER_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
