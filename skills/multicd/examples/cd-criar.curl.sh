#!/usr/bin/env bash
# Exemplo: Criar centro de distribuição via API Tray (MultiCD)
# Doc: https://developers.tray.com.br/#api-de-multicd
# Quando usar: cadastrar um novo CD. Requer MultiCD ativo na loja.
# Sem schema local: campos conferidos contra skills/multicd/SKILL.md
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/multicd/distribution-centers?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @cd-criar.fixture.json \
  | jq .
