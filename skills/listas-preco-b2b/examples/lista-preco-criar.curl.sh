#!/usr/bin/env bash
# Exemplo: Criar lista de preço B2B via API Tray
# Doc: https://developers.tray.com.br/#api-de-lista-de-preco-b2b
# Quando usar: cadastrar uma nova tabela de preço diferenciada (atacado/B2B).
# Sem schema local: campos conferidos contra skills/listas-preco-b2b/SKILL.md
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/price-lists?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @lista-preco-criar.fixture.json \
  | jq .
