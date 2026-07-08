#!/usr/bin/env bash
# Exemplo: Criar cliente via API Tray
# Doc: https://developers.tray.com.br/#api-de-clientes
# Quando usar: cadastrar cliente novo. name e email obrigatórios; email é único.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Validar a fixture antes:
#   node skills/clientes/scripts/validate.mjs --schema=cliente.create \
#     "$(cat skills/clientes/examples/cliente-criar.fixture.json)"
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/customers?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @cliente-criar.fixture.json \
  | jq .
