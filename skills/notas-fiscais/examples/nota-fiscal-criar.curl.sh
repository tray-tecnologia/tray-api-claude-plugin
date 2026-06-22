#!/usr/bin/env bash
# Exemplo: Cadastrar nota fiscal para um pedido via API Tray
# Doc: https://developers.tray.com.br/#api-de-nota-fiscal
# Quando usar: vincular uma NF-e emitida ao pedido. order_id vai na URL.
# Sem schema local: campos conferidos contra skills/notas-fiscais/SKILL.md
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID exportados.
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ORDER_ID:?defina TRAY_ORDER_ID=<id de um pedido>}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/orders/${TRAY_ORDER_ID}/invoices?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @nota-fiscal-criar.fixture.json \
  | jq .
