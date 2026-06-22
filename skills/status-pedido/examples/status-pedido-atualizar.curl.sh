#!/usr/bin/env bash
# Exemplo: Atualizar status de pedido via API Tray
# Doc: https://developers.tray.com.br/#api-de-status-do-pedido
# Quando usar: alterar nome, cores, descrição ou tipo de um status existente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_STATUS_ID exportados.
# Sem schema local: campos conferidos contra skills/status-pedido/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ORDER_STATUS_ID:?defina TRAY_ORDER_STATUS_ID=<id do status>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/orders/statuses/${TRAY_ORDER_STATUS_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @status-pedido-atualizar.fixture.json \
  | jq .
