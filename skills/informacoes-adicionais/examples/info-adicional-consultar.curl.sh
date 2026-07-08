#!/usr/bin/env bash
# Exemplo: Consultar informação adicional por ID via API Tray
# Doc: https://developers.tray.com.br/#api-de-informacao-adicional-additional_info
# Quando usar: obter os dados de uma informação adicional específica.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ADDITIONAL_INFO_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ADDITIONAL_INFO_ID:?defina TRAY_ADDITIONAL_INFO_ID=<id da informação adicional>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/additional-info/${TRAY_ADDITIONAL_INFO_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
