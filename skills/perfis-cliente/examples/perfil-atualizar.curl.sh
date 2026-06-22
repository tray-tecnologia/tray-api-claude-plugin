#!/usr/bin/env bash
# Exemplo: Atualizar perfil de cliente via API Tray
# Doc: https://developers.tray.com.br/#api-de-clientes
# Quando usar: alterar dados de um perfil existente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PROFILE_ID exportados.
# Sem schema local: campos conferidos contra skills/perfis-cliente/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PROFILE_ID:?defina TRAY_PROFILE_ID=<id do perfil>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/customers/profiles/${TRAY_PROFILE_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @perfil-atualizar.fixture.json \
  | jq .
