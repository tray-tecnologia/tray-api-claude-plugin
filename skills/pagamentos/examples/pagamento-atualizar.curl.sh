#!/usr/bin/env bash
# Exemplo: Atualizar pagamento via API Tray
# Doc: https://developers.tray.com.br/#apis-de-informacoes-de-pagamento
# Quando usar: atualizar status/dados de um pagamento existente.
# Sem schema local: campos conferidos contra skills/pagamentos/SKILL.md
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PAYMENT_ID exportados.
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PAYMENT_ID:?defina TRAY_PAYMENT_ID=<id de um pagamento>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/payments/${TRAY_PAYMENT_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @pagamento-atualizar.fixture.json \
  | jq .
