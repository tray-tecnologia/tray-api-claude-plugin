#!/usr/bin/env bash
# Exemplo: Confirmar inscrição na newsletter via API Tray
# Doc: https://developers.tray.com.br/#apis-de-newsletter
# Quando usar: confirmar o cadastro (etapa 2 do double opt-in).
# Sem schema local: campos conferidos contra skills/newsletter/SKILL.md
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/newsletters/confirm?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @newsletter-confirmar.fixture.json \
  | jq .
