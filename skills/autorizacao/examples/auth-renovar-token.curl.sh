#!/usr/bin/env bash
# Exemplo: Renovar access_token via refresh_token
# Doc: https://developers.tray.com.br/#autorizacao
# Quando usar: access_token expirou (3h) e o refresh_token (30 dias) ainda é válido.
#   Se o refresh_token também expirou, refaça o fluxo OAuth completo.
# Pré-requisitos: TRAY_API_BASE e TRAY_REFRESH_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_REFRESH_TOKEN:?defina TRAY_REFRESH_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/auth?refresh_token=${TRAY_REFRESH_TOKEN}" \
  | jq .
