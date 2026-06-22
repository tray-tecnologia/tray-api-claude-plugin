#!/usr/bin/env bash
# Exemplo: Excluir cupom de desconto via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#api-de-cupom
# Quando usar: remover um cupom de teste. NÃO rodar contra produção.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_COUPON_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_COUPON_ID:?defina TRAY_COUPON_ID=<id de um cupom de teste>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o cupom ${TRAY_COUPON_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/discount_coupons/${TRAY_COUPON_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
