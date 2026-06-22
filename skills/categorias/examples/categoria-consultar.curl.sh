#!/usr/bin/env bash
# Exemplo: Consultar categoria por ID via API Tray
# Doc: https://developers.tray.com.br/#api-de-categorias
# Quando usar: obter dados de uma categoria específica.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CATEGORY_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CATEGORY_ID:?defina TRAY_CATEGORY_ID=<id de uma categoria>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/categories/${TRAY_CATEGORY_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
