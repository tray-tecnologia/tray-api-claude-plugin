#!/usr/bin/env bash
# Exemplo: Consultar etiquetas do HUB via API Tray
# Doc: https://developers.tray.com.br/#api-de-etiquetas-do-hub
# Quando usar: buscar etiquetas geradas de um pedido. Não usar para ML nem emissores externos.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID exportados.
# Sem schema local: campos conferidos contra skills/etiquetas-hub/SKILL.md
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ORDER_ID:?defina TRAY_ORDER_ID=<id do pedido>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/labels?access_token=${TRAY_ACCESS_TOKEN}&order_id=${TRAY_ORDER_ID}" \
  | jq .
