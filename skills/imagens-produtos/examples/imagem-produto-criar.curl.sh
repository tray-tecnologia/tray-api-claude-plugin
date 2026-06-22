#!/usr/bin/env bash
# Exemplo: Enviar imagem de produto via API Tray
# Doc: https://developers.tray.com.br/#apis-de-imagens-de-produtos-e-variacoes
# Quando usar: cadastrar/atualizar imagem de um produto (via URL na fixture).
#   Para imagem de variação, ver imagem-variacao-criar.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID exportados.
# Sem schema local: campos conferidos contra skills/imagens-produtos/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id do produto>}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/images?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @imagem-produto-criar.fixture.json \
  | jq .
