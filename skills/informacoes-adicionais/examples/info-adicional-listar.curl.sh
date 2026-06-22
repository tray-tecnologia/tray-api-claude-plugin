#!/usr/bin/env bash
# Exemplo: Listar informações adicionais via API Tray
# Doc: https://developers.tray.com.br/#api-de-informacao-adicional-additional_info
# Quando usar: paginar as informações adicionais cadastradas. Máximo 50 por página.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/additional-info?access_token=${TRAY_ACCESS_TOKEN}&limit=30&page=1" \
  | jq .
