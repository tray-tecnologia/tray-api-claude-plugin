#!/usr/bin/env bash
# Exemplo: Associar cliente a um perfil via API Tray
# Doc: https://developers.tray.com.br/#api-de-clientes
# Quando usar: vincular um cliente a um perfil. Não requer corpo na requisição.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID e TRAY_PROFILE_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CUSTOMER_ID:?defina TRAY_CUSTOMER_ID=<id do cliente>}"
: "${TRAY_PROFILE_ID:?defina TRAY_PROFILE_ID=<id do perfil>}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}/profiles/${TRAY_PROFILE_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
