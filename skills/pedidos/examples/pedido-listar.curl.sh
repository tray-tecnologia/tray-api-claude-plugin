#!/usr/bin/env bash
# Exemplo: Listar pedidos via API Tray
# Doc: https://developers.tray.com.br/#apis-de-pedidos
# Quando usar: paginar pedidos com filtros (status, data). Máximo 50 por página.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/orders?access_token=${TRAY_ACCESS_TOKEN}&limit=30&page=1" \
  | jq .
