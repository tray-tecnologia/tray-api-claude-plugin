#!/usr/bin/env bash
# Exemplo: Listar usuários administrativos via API Tray
# Doc: https://developers.tray.com.br/#apis-de-usuario
# Quando usar: consultar usuários com acesso administrativo à loja. Somente leitura.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/users?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
