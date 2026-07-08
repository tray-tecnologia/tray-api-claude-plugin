#!/usr/bin/env bash
# Exemplo: Cotar frete por CEP via API Tray
# Doc: https://developers.tray.com.br/#api-de-integracao-de-frete
# Quando usar: calcular frete de um ou mais produtos para um CEP de destino.
#   Recurso só-leitura; produtos passados via query indexada (products[0][...]).
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  -G \
  "${TRAY_API_BASE}/shippings/cotation/" \
  --data-urlencode "access_token=${TRAY_ACCESS_TOKEN}" \
  --data-urlencode "zipcode=04001001" \
  --data-urlencode "products[0][product_id]=123" \
  --data-urlencode "products[0][price]=58.90" \
  --data-urlencode "products[0][quantity]=2" \
  | jq .
