#!/usr/bin/env bash
# Exemplo: Criar relacionamento de cupom via API Tray
# Doc: https://developers.tray.com.br/#api-de-cupom
# Quando usar: vincular clientes/produtos/categorias/marcas/fretes a um cupom.
#   O tipo de vínculo é definido pela chave do corpo (ver fixture: DiscountCouponProduct).
#   Máximo 100 registros por POST.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_COUPON_ID exportados.
# Sem schema local: campos conferidos contra skills/cupons/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_COUPON_ID:?defina TRAY_COUPON_ID=<id do cupom>}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/discount_coupons/create_relationship/${TRAY_COUPON_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @cupom-criar-relacionamento.fixture.json \
  | jq .
