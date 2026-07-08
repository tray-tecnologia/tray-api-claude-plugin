#!/usr/bin/env bash
# Exemplo: Excluir carrinho via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#apis-de-carrinho-de-compra
# Quando usar: remover um carrinho de teste/abandonado. NÃO rodar contra produção.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CART_SESSION_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CART_SESSION_ID:?defina TRAY_CART_SESSION_ID=<session_id de um carrinho de teste>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o carrinho ${TRAY_CART_SESSION_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/carts/${TRAY_CART_SESSION_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
