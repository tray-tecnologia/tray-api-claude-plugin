#!/usr/bin/env bash
# Exemplo: Criar produto via API Tray
# Doc: https://developers.tray.com.br/#api-de-produtos
# Quando usar: cadastrar produto novo. Não usar para variações (ver tray-variacoes).
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Validar a fixture antes:
#   node skills/produtos/scripts/validate.mjs --schema=produto.create \
#     "$(cat skills/produtos/examples/produto-criar.fixture.json)"
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/products?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @produto-criar.fixture.json \
  | jq .
