#!/usr/bin/env bash
# Exemplo: Listar centros de distribuição via API Tray (MultiCD)
# Doc: https://developers.tray.com.br/#api-de-multicd
# Quando usar: paginar os CDs da loja. Máximo 50 itens por página (use page p/ paginar).
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/multicd/distribution-centers?access_token=${TRAY_ACCESS_TOKEN}&limit=30&page=1" \
  | jq .
