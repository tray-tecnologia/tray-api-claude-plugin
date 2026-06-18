#!/usr/bin/env bash
# Exemplo: Atualizar forma de envio (gateway) via API Tray
# Doc: https://developers.tray.com.br/#api-de-configuracao-de-forma-de-frete
# Quando usar: alterar nome, prazo ou status de um método de envio existente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_SHIPPING_METHOD_ID exportados.
# Sem schema local: campos conferidos contra skills/configuracao-frete/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_SHIPPING_METHOD_ID:?defina TRAY_SHIPPING_METHOD_ID=<id do método de envio>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/shippings/method/gateway/${TRAY_SHIPPING_METHOD_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @metodo-atualizar.fixture.json \
  | jq .
