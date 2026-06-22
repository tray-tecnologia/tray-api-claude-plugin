#!/usr/bin/env bash
# Exemplo: Criar característica global (reutilizável) via API Tray
# Doc: https://developers.tray.com.br/#apis-de-caracteristicas
# Quando usar: padronizar uma característica para reuso em vários produtos.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Sem schema local: campos conferidos contra skills/caracteristicas/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/properties?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @caracteristica-criar-global.fixture.json \
  | jq .
