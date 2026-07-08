#!/usr/bin/env bash
# Exemplo: Atualizar script externo via API Tray
# Doc: https://developers.tray.com.br/#apis-de-scripts-externos
# Quando usar: ativar/desativar ou alterar um script existente (ex: active=0 para desativar).
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_SCRIPT_ID exportados.
# Sem schema local: campos conferidos contra skills/scripts-externos/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_SCRIPT_ID:?defina TRAY_SCRIPT_ID=<id do script>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/scripts/${TRAY_SCRIPT_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @script-atualizar.fixture.json \
  | jq .
