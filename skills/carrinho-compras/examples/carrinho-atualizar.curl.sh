#!/usr/bin/env bash
# Exemplo: Atualizar carrinho via API Tray
# Doc: https://developers.tray.com.br/#apis-de-carrinho-de-compra
# Quando usar: alterar a quantidade de um item do carrinho existente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CART_SESSION_ID exportados.
# Sem schema local: campos conferidos contra skills/carrinho-compras/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CART_SESSION_ID:?defina TRAY_CART_SESSION_ID=<session_id do carrinho>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/carts/${TRAY_CART_SESSION_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @carrinho-atualizar.fixture.json \
  | jq .
