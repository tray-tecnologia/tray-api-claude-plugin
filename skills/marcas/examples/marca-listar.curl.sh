#!/usr/bin/env bash
# Exemplo: Listar marcas via API Tray
# Doc: https://developers.tray.com.br/#api-de-marcas
# Quando usar: paginar as marcas. Máximo 50 itens por página (use page p/ paginar).
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/brands?access_token=${TRAY_ACCESS_TOKEN}&limit=30&page=1" \
  | jq .
