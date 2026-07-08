#!/usr/bin/env bash
# Exemplo: Criar informação adicional via API Tray
# Doc: https://developers.tray.com.br/#api-de-informacao-adicional-additional_info
# Quando usar: cadastrar uma informação adicional reutilizável (criar antes de vincular).
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Sem schema local: campos conferidos contra skills/informacoes-adicionais/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/additional-info?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @info-adicional-criar.fixture.json \
  | jq .
