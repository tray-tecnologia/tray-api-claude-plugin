#!/usr/bin/env bash
# Exemplo: Consultar notas fiscais de um pedido via API Tray
# Doc: https://developers.tray.com.br/#api-de-nota-fiscal
# Quando usar: listar as NF-e associadas a um pedido específico.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ORDER_ID:?defina TRAY_ORDER_ID=<id de um pedido>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/orders/${TRAY_ORDER_ID}/invoices?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
