#!/usr/bin/env bash
# Exemplo: Atualizar cliente via API Tray
# Doc: https://developers.tray.com.br/#api-de-clientes
# Quando usar: alterar dados de cliente existente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CUSTOMER_ID exportados.
# Validar a fixture antes:
#   node skills/clientes/scripts/validate.mjs --schema=cliente.update \
#     "$(cat skills/clientes/examples/cliente-atualizar.fixture.json)"
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CUSTOMER_ID:?defina TRAY_CUSTOMER_ID=<id de um cliente de teste>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @cliente-atualizar.fixture.json \
  | jq .
