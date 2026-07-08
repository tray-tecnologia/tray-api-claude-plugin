#!/usr/bin/env bash
# Exemplo: Consultar parceiro por ID via API Tray
# Doc: https://developers.tray.com.br/#apis-de-parceiros
# Quando usar: obter dados de um parceiro específico.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PARTNER_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PARTNER_ID:?defina TRAY_PARTNER_ID=<id do parceiro>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/partners/${TRAY_PARTNER_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
