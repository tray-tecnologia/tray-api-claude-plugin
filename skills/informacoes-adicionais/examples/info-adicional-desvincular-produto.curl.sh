#!/usr/bin/env bash
# Exemplo: Desvincular informação adicional de um produto via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#api-de-informacao-adicional-additional_info
# Quando usar: remover a relação entre uma informação adicional e um produto.
#   NÃO rodar contra produção.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID, TRAY_ADDITIONAL_INFO_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id do produto>}"
: "${TRAY_ADDITIONAL_INFO_ID:?defina TRAY_ADDITIONAL_INFO_ID=<id da informação adicional>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para desvincular a informação ${TRAY_ADDITIONAL_INFO_ID} do produto ${TRAY_PRODUCT_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/additional-info/${TRAY_ADDITIONAL_INFO_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
