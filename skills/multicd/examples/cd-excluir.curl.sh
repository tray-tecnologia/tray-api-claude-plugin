#!/usr/bin/env bash
# Exemplo: Excluir centro de distribuição via API Tray (MultiCD) (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#api-de-multicd
# Quando usar: remover um CD de teste. NÃO rodar contra produção.
#   Desative o CD (active=0) antes de excluir para evitar impacto em pedidos.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_DISTRIBUTION_CENTER_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_DISTRIBUTION_CENTER_ID:?defina TRAY_DISTRIBUTION_CENTER_ID=<id de um CD de teste>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o CD ${TRAY_DISTRIBUTION_CENTER_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/multicd/distribution-centers/${TRAY_DISTRIBUTION_CENTER_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
