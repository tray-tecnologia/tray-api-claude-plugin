#!/usr/bin/env bash
# Exemplo: Criar etiqueta do HUB via API Tray
# Doc: https://developers.tray.com.br/#api-de-etiquetas-do-hub
# Quando usar: gerar etiqueta de envio via HUB para um pedido. Não usar para ML nem emissores externos.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Sem schema local: campos conferidos contra skills/etiquetas-hub/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/labels?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @etiqueta-hub-criar.fixture.json \
  | jq .
