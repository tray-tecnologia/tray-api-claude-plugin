#!/usr/bin/env bash
# Exemplo: Vincular informação adicional a um produto via API Tray
# Doc: https://developers.tray.com.br/#api-de-informacao-adicional-additional_info
# Quando usar: associar uma informação adicional existente a um produto.
#   O corpo usa additional_info_id (sem wrapper de recurso, conforme o SKILL.md).
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID exportados.
# Sem schema local: campos conferidos contra skills/informacoes-adicionais/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id do produto>}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/additional-info?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @info-adicional-vincular-produto.fixture.json \
  | jq .
