#!/usr/bin/env bash
# Exemplo: Criar tabela/faixa de CEP via API Tray
# Doc: https://developers.tray.com.br/#api-de-configuracao-de-forma-de-frete
# Quando usar: cadastrar uma faixa de CEP+peso com preço e prazo para um método de envio.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Sem schema local: campos conferidos contra skills/configuracao-frete/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/shippings/method/zipcode_table?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @faixa-cep-criar.fixture.json \
  | jq .
