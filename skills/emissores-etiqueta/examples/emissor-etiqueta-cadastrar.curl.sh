#!/usr/bin/env bash
# Exemplo: Cadastrar URL de emissor de etiqueta via API Tray
# Doc: https://developers.tray.com.br/#api-de-emissores-de-etiqueta
# Quando usar: registrar a URL base do seu sistema de etiquetas. Não usar para HUB nem ML.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Sem schema local: campos conferidos contra skills/emissores-etiqueta/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/label-emitters?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @emissor-etiqueta-cadastrar.fixture.json \
  | jq .
