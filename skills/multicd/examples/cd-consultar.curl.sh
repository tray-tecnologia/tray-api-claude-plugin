#!/usr/bin/env bash
# Exemplo: Consultar centro de distribuição por ID via API Tray (MultiCD)
# Doc: https://developers.tray.com.br/#api-de-multicd
# Quando usar: obter dados de um CD específico.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_DISTRIBUTION_CENTER_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_DISTRIBUTION_CENTER_ID:?defina TRAY_DISTRIBUTION_CENTER_ID=<id de um CD>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/multicd/distribution-centers/${TRAY_DISTRIBUTION_CENTER_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
