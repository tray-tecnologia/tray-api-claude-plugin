#!/usr/bin/env bash
# Exemplo: Excluir categoria via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#api-de-categorias
# Quando usar: remover categoria de teste. NÃO rodar contra produção.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CATEGORY_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CATEGORY_ID:?defina TRAY_CATEGORY_ID=<id de uma categoria de teste>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir a categoria ${TRAY_CATEGORY_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/categories/${TRAY_CATEGORY_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
