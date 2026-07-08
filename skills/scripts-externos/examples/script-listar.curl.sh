#!/usr/bin/env bash
# Exemplo: Listar scripts externos via API Tray
# Doc: https://developers.tray.com.br/#apis-de-scripts-externos
# Quando usar: listar scripts JavaScript injetados na vitrine da loja.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/scripts?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
