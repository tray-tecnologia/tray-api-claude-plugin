#!/usr/bin/env bash
# Exemplo: Excluir característica de um produto via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#apis-de-caracteristicas
# Quando usar: remover característica de teste de um produto. NÃO rodar contra produção.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID, TRAY_PROPERTY_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id do produto>}"
: "${TRAY_PROPERTY_ID:?defina TRAY_PROPERTY_ID=<id da característica de teste>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir a característica ${TRAY_PROPERTY_ID} do produto ${TRAY_PRODUCT_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/properties/${TRAY_PROPERTY_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
