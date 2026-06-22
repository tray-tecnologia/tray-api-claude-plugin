#!/usr/bin/env bash
# Exemplo: Desassociar cliente de um perfil via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#api-de-clientes
# Quando usar: remover o vínculo entre um cliente e um perfil. Não requer corpo.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID, TRAY_PROFILE_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CUSTOMER_ID:?defina TRAY_CUSTOMER_ID=<id do cliente>}"
: "${TRAY_PROFILE_ID:?defina TRAY_PROFILE_ID=<id do perfil>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para desassociar o cliente ${TRAY_CUSTOMER_ID} do perfil ${TRAY_PROFILE_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}/profiles/${TRAY_PROFILE_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
