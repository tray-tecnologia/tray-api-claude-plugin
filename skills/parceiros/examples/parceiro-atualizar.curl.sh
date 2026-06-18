#!/usr/bin/env bash
# Exemplo: Atualizar parceiro via API Tray
# Doc: https://developers.tray.com.br/#apis-de-parceiros
# Quando usar: alterar dados de um parceiro existente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PARTNER_ID exportados.
# Sem schema local: campos conferidos contra skills/parceiros/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PARTNER_ID:?defina TRAY_PARTNER_ID=<id do parceiro>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/partners/${TRAY_PARTNER_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @parceiro-atualizar.fixture.json \
  | jq .
