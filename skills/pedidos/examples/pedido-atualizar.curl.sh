#!/usr/bin/env bash
# Exemplo: Atualizar pedido via API Tray
# Doc: https://developers.tray.com.br/#apis-de-pedidos
# Quando usar: mudar status ou registrar código de rastreio de pedido existente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID exportados.
# Validar a fixture antes:
#   node skills/pedidos/scripts/validate.mjs --schema=pedido.update \
#     "$(cat skills/pedidos/examples/pedido-atualizar.fixture.json)"
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ORDER_ID:?defina TRAY_ORDER_ID=<id de um pedido de teste>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/orders/${TRAY_ORDER_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @pedido-atualizar.fixture.json \
  | jq .
