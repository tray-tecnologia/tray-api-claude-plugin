#!/usr/bin/env bash
# Exemplo: Consultar nota fiscal por ID via API Tray
# Doc: https://developers.tray.com.br/#api-de-nota-fiscal
# Quando usar: obter dados de uma NF-e específica.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_INVOICE_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_INVOICE_ID:?defina TRAY_INVOICE_ID=<id de uma nota fiscal>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/invoices/${TRAY_INVOICE_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
