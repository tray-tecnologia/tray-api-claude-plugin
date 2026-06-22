#!/usr/bin/env bash
# Exemplo: Atualizar informação adicional via API Tray
# Doc: https://developers.tray.com.br/#api-de-informacao-adicional-additional_info
# Quando usar: alterar nome/valor de uma informação adicional existente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ADDITIONAL_INFO_ID exportados.
# Sem schema local: campos conferidos contra skills/informacoes-adicionais/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ADDITIONAL_INFO_ID:?defina TRAY_ADDITIONAL_INFO_ID=<id da informação adicional>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/additional-info/${TRAY_ADDITIONAL_INFO_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @info-adicional-atualizar.fixture.json \
  | jq .
