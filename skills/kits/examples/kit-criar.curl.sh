#!/usr/bin/env bash
# Exemplo: Criar kit via API Tray
# Doc: https://developers.tray.com.br/#api-de-kit
# Quando usar: associar um produto componente a um produto-kit (combo/bundle).
# Sem schema local: campos conferidos contra skills/kits/SKILL.md
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/products/kits?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @kit-criar.fixture.json \
  | jq .
