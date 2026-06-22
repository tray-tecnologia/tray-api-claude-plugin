#!/usr/bin/env bash
# Exemplo: Listar formas de envio da loja via API Tray
# Doc: https://developers.tray.com.br/#api-de-integracao-de-frete
# Quando usar: listar os métodos de envio disponíveis na loja. Recurso só-leitura.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/shippings/?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
