#!/usr/bin/env bash
# Exemplo: Atualizar informações adicionais relacionadas a um produto via API Tray
# Doc: https://developers.tray.com.br/#api-de-informacao-adicional-additional_info
# Quando usar: atualizar as informações adicionais vinculadas a um produto.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID exportados.
# Sem schema local: campos conferidos contra skills/informacoes-adicionais/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id do produto>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/additional-info?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @info-adicional-atualizar-produto.fixture.json \
  | jq .
