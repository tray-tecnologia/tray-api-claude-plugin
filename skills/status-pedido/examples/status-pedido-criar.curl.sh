#!/usr/bin/env bash
# Exemplo: Criar status de pedido via API Tray
# Doc: https://developers.tray.com.br/#api-de-status-do-pedido
# Quando usar: cadastrar status personalizado de pedido. Cores em hexadecimal; type: open/closed/cancelled.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Sem schema local: campos conferidos contra skills/status-pedido/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/orders/statuses?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @status-pedido-criar.fixture.json \
  | jq .
