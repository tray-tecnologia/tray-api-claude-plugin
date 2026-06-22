#!/usr/bin/env bash
# Exemplo: Excluir forma de envio (gateway) via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#api-de-configuracao-de-forma-de-frete
# Quando usar: remover um método de envio de teste. NÃO rodar contra produção.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_SHIPPING_METHOD_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_SHIPPING_METHOD_ID:?defina TRAY_SHIPPING_METHOD_ID=<id de um método de teste>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o método de envio ${TRAY_SHIPPING_METHOD_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/shippings/method/gateway/${TRAY_SHIPPING_METHOD_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
