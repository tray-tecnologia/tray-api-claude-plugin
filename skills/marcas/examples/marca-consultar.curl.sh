#!/usr/bin/env bash
# Exemplo: Consultar marca por ID via API Tray
# Doc: https://developers.tray.com.br/#api-de-marcas
# Quando usar: obter os dados de uma marca específica.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_BRAND_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_BRAND_ID:?defina TRAY_BRAND_ID=<id de uma marca>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/brands/${TRAY_BRAND_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
