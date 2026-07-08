#!/usr/bin/env bash
# Exemplo: Consultar estoque detalhado de variação em todos os CDs via API Tray (MultiCD)
# Doc: https://developers.tray.com.br/#api-de-multicd
# Quando usar: obter o estoque de uma variação distribuída por todos os CDs.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_VARIANT_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_VARIANT_ID:?defina TRAY_VARIANT_ID=<id de uma variação>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/multicd/stock/detailed/variant/${TRAY_VARIANT_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
