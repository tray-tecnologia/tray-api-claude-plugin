#!/usr/bin/env bash
# Exemplo: Consultar perfil de cliente por ID via API Tray
# Doc: https://developers.tray.com.br/#api-de-clientes
# Quando usar: obter dados de um perfil específico.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PROFILE_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PROFILE_ID:?defina TRAY_PROFILE_ID=<id do perfil>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/customers/profiles/${TRAY_PROFILE_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
