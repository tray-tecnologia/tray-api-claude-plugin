#!/usr/bin/env bash
# Exemplo: Cadastrar endereço para um cliente via API Tray
# Doc: https://developers.tray.com.br/#api-de-clientes
# Quando usar: criar novo endereço. A API não tem PUT — para alterar, exclua e recrie.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CUSTOMER_ID exportados.
# Sem schema local: campos conferidos contra skills/enderecos-cliente/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CUSTOMER_ID:?defina TRAY_CUSTOMER_ID=<id do cliente>}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}/addresses?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @endereco-criar.fixture.json \
  | jq .
