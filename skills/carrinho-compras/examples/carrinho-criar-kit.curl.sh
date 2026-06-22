#!/usr/bin/env bash
# Exemplo: Criar carrinho com kit de produtos via API Tray
# Doc: https://developers.tray.com.br/#apis-de-carrinho-de-compra
# Quando usar: criar um carrinho a partir de um kit (bundle) com vários componentes.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Sem schema local: campos conferidos contra skills/carrinho-compras/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/carts/kit?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @carrinho-criar-kit.fixture.json \
  | jq .
