#!/usr/bin/env bash
# Exemplo: Enviar imagem de variação via API Tray
# Doc: https://developers.tray.com.br/#apis-de-imagens-de-produtos-e-variacoes
# Quando usar: cadastrar/atualizar imagem de uma variação (via URL na fixture).
#   Para imagem de produto, ver imagem-produto-criar.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_VARIANT_ID exportados.
# Sem schema local: campos conferidos contra skills/imagens-produtos/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_VARIANT_ID:?defina TRAY_VARIANT_ID=<id da variação>}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/variants/${TRAY_VARIANT_ID}/images?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @imagem-variacao-criar.fixture.json \
  | jq .
