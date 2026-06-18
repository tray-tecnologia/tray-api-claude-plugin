#!/usr/bin/env bash
# Exemplo: Atualizar kit via API Tray
# Doc: https://developers.tray.com.br/#api-de-kit
# Quando usar: alterar a quantidade de um componente dentro do kit.
# Sem schema local: campos conferidos contra skills/kits/SKILL.md
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_KIT_ID exportados.
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_KIT_ID:?defina TRAY_KIT_ID=<id de um kit>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/products/kits/${TRAY_KIT_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @kit-atualizar.fixture.json \
  | jq .
