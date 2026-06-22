#!/usr/bin/env bash
# Exemplo: Excluir informação adicional via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#api-de-informacao-adicional-additional_info
# Quando usar: excluir definitivamente uma informação adicional. NÃO rodar contra produção.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ADDITIONAL_INFO_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ADDITIONAL_INFO_ID:?defina TRAY_ADDITIONAL_INFO_ID=<id da informação adicional>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir a informação adicional ${TRAY_ADDITIONAL_INFO_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/additional-info/${TRAY_ADDITIONAL_INFO_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
