#!/usr/bin/env bash
# Exemplo: Consultar palavra-chave por ID via API Tray
# Doc: https://developers.tray.com.br/#apis-de-palavras-chave
# Quando usar: obter dados de uma palavra-chave específica.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_KEYWORD_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_KEYWORD_ID:?defina TRAY_KEYWORD_ID=<id de uma palavra-chave>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/keywords/${TRAY_KEYWORD_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
