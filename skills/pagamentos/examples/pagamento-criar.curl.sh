#!/usr/bin/env bash
# Exemplo: Cadastrar pagamento via API Tray
# Doc: https://developers.tray.com.br/#apis-de-informacoes-de-pagamento
# Quando usar: registrar um pagamento associado a um pedido.
# Sem schema local: campos conferidos contra skills/pagamentos/SKILL.md
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/payments?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @pagamento-criar.fixture.json \
  | jq .
