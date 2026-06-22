#!/usr/bin/env bash
# Exemplo: Atualizar lista de preço B2B via API Tray
# Doc: https://developers.tray.com.br/#api-de-lista-de-preco-b2b
# Quando usar: alterar nome, descrição ou status de uma lista de preço.
# Sem schema local: campos conferidos contra skills/listas-preco-b2b/SKILL.md
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRICE_LIST_ID exportados.
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRICE_LIST_ID:?defina TRAY_PRICE_LIST_ID=<id de uma lista de preço>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/price-lists/${TRAY_PRICE_LIST_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @lista-preco-atualizar.fixture.json \
  | jq .
