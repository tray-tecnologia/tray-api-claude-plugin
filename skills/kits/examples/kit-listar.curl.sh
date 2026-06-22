#!/usr/bin/env bash
# Exemplo: Listar kits via API Tray
# Doc: https://developers.tray.com.br/#api-de-kit
# Quando usar: paginar os kits da loja. Máximo 50 itens por página (use page p/ paginar).
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/products/kits?access_token=${TRAY_ACCESS_TOKEN}&limit=30&page=1" \
  | jq .
