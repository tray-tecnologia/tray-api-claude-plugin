#!/usr/bin/env bash
# Exemplo: Criar cupom de desconto via API Tray
# Doc: https://developers.tray.com.br/#api-de-cupom
# Quando usar: cadastrar um novo cupom de desconto.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados; jq instalado.
# Sem schema local: campos conferidos contra skills/cupons/SKILL.md
# Nota: a API espera application/x-www-form-urlencoded com wrapper ["DiscountCoupon"]["campo"].
#   O fixture é JSON; convertemos para urlencoded com jq antes de enviar.
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

# Converte {"DiscountCoupon":{"code":"X",...}} em ["DiscountCoupon"]["code"]=X&...
body=$(jq -rn --argjson c "$(jq '.DiscountCoupon' cupom-criar.fixture.json)" '
  $c | to_entries
     | map("[\"DiscountCoupon\"][\"\(.key)\"]=\(.value|@uri)")
     | join("&")')

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/discount_coupons?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-raw "${body}" \
  | jq .
