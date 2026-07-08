#!/usr/bin/env bash
# Exemplo: Consultar kit por ID via API Tray
# Doc: https://developers.tray.com.br/#api-de-kit
# Quando usar: obter dados de um kit específico.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_KIT_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_KIT_ID:?defina TRAY_KIT_ID=<id de um kit>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/products/kits/${TRAY_KIT_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
