#!/usr/bin/env bash
# Exemplo: Atualizar tabela/faixa de CEP via API Tray
# Doc: https://developers.tray.com.br/#api-de-configuracao-de-forma-de-frete
# Quando usar: alterar preço ou prazo de uma faixa de CEP existente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ZIPCODE_TABLE_ID exportados.
# Sem schema local: campos conferidos contra skills/configuracao-frete/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_ZIPCODE_TABLE_ID:?defina TRAY_ZIPCODE_TABLE_ID=<id da faixa de CEP>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/shippings/method/zipcode_table/${TRAY_ZIPCODE_TABLE_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @faixa-cep-atualizar.fixture.json \
  | jq .
