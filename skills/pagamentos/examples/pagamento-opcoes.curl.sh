#!/usr/bin/env bash
# Exemplo: Listar opções/métodos de pagamento da loja via API Tray
# Doc: https://developers.tray.com.br/#apis-de-informacoes-de-pagamento
# Quando usar: descobrir os métodos de pagamento disponíveis na loja (só-leitura).
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/payments/options?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
