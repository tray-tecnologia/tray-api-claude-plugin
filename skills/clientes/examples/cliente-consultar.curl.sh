#!/usr/bin/env bash
# Exemplo: Consultar cliente por ID via API Tray
# Doc: https://developers.tray.com.br/#api-de-clientes
# Quando usar: obter dados de um cliente específico.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CUSTOMER_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CUSTOMER_ID:?defina TRAY_CUSTOMER_ID=<id de um cliente de teste>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
