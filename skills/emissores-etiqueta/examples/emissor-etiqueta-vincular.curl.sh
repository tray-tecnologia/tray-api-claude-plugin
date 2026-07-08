#!/usr/bin/env bash
# Exemplo: Vincular URL de etiqueta a um pedido via API Tray
# Doc: https://developers.tray.com.br/#api-de-emissores-de-etiqueta
# Quando usar: associar a etiqueta gerada a um pedido específico. Não usar para HUB nem ML.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID exportados.
# Sem schema local: campos conferidos contra skills/emissores-etiqueta/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ORDER_ID:?defina TRAY_ORDER_ID=<id do pedido>}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/label-emitters/${TRAY_ORDER_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @emissor-etiqueta-vincular.fixture.json \
  | jq .
