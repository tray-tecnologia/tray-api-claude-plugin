#!/usr/bin/env bash
# Exemplo: Consultar endereço específico de um cliente via API Tray
# Doc: https://developers.tray.com.br/#api-de-clientes
# Quando usar: obter um endereço por ID. Não usar para listar (ver endereco-listar).
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID e TRAY_ADDRESS_ID exportados.
# Sem schema local: campos conferidos contra skills/enderecos-cliente/SKILL.md
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_CUSTOMER_ID:?defina TRAY_CUSTOMER_ID=<id do cliente>}"
: "${TRAY_ADDRESS_ID:?defina TRAY_ADDRESS_ID=<id do endereço>}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}/addresses/${TRAY_ADDRESS_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
