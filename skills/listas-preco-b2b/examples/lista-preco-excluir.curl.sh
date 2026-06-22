#!/usr/bin/env bash
# Exemplo: Excluir lista de preço B2B via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#api-de-lista-de-preco-b2b
# Quando usar: remover lista de preço de teste. NÃO rodar contra produção.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRICE_LIST_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRICE_LIST_ID:?defina TRAY_PRICE_LIST_ID=<id de uma lista de preço de teste>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir a lista de preço ${TRAY_PRICE_LIST_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/price-lists/${TRAY_PRICE_LIST_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
