#!/usr/bin/env bash
# Exemplo: Consultar cupom-presente vinculado via API Tray
# Doc: https://developers.tray.com.br/#api-de-cupom
# Quando usar: consultar o produto-presente associado a um cupom do tipo presente.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_COUPON_ID exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_COUPON_ID:?defina TRAY_COUPON_ID=<id do cupom>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/discount_coupons/gift_relationship/${TRAY_COUPON_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
