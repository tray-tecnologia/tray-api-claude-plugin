#!/usr/bin/env bash
# Exemplo: Criar categoria via API Tray
# Doc: https://developers.tray.com.br/#api-de-categorias
# Quando usar: cadastrar categoria nova. Crie a categoria antes dos produtos.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Validar a fixture antes:
#   node skills/categorias/scripts/validate.mjs --schema=categoria.create \
#     "$(cat skills/categorias/examples/categoria-criar.fixture.json)"
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/categories?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @categoria-criar.fixture.json \
  | jq .
