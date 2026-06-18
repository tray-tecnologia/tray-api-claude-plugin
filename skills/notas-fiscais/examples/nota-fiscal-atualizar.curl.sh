#!/usr/bin/env bash
# Exemplo: Atualizar nota fiscal via API Tray
# Doc: https://developers.tray.com.br/#api-de-nota-fiscal
# Quando usar: atualizar dados de uma NF-e existente (ex: link do DANFE, valor).
# Sem schema local: campos conferidos contra skills/notas-fiscais/SKILL.md
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_INVOICE_ID exportados.
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_INVOICE_ID:?defina TRAY_INVOICE_ID=<id de uma nota fiscal>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/invoices/${TRAY_INVOICE_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @nota-fiscal-atualizar.fixture.json \
  | jq .
