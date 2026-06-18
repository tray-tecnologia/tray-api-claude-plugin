#!/usr/bin/env bash
# Exemplo: Listar status de pedido via API Tray
# Doc: https://developers.tray.com.br/#api-de-status-do-pedido
# Quando usar: listar os status (tipos) de pedido configurados na loja.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/orders/statuses?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
