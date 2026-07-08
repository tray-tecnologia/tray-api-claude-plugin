#!/usr/bin/env bash
# Exemplo: Criar pedido via API Tray
# Doc: https://developers.tray.com.br/#apis-de-pedidos
# Quando usar: registrar pedido novo. customer_id e products são obrigatórios.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Validar a fixture antes:
#   node skills/pedidos/scripts/validate.mjs --schema=pedido.create \
#     "$(cat skills/pedidos/examples/pedido-criar.fixture.json)"
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/orders?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @pedido-criar.fixture.json \
  | jq .
