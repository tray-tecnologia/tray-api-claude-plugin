#!/usr/bin/env bash
# Exemplo: Criar forma de envio com integração externa (gateway) via API Tray
# Doc: https://developers.tray.com.br/#api-de-configuracao-de-forma-de-frete
# Quando usar: cadastrar um método de envio personalizado na loja.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Sem schema local: campos conferidos contra skills/configuracao-frete/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/shippings/method/gateway?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @metodo-criar.fixture.json \
  | jq .
