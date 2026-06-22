#!/usr/bin/env bash
# Exemplo: Consultar dados completos do carrinho via API Tray
# Doc: https://developers.tray.com.br/#apis-de-carrinho-de-compra
# Quando usar: obter todos os dados do carrinho (produtos, frete, cupom) em uma chamada.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CART_SESSION_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CART_SESSION_ID:?defina TRAY_CART_SESSION_ID=<session_id do carrinho>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/carts/${TRAY_CART_SESSION_ID}/complete?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
