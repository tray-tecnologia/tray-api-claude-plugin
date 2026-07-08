#!/usr/bin/env bash
# Exemplo: Consultar informações da loja via API Tray
# Doc: https://developers.tray.com.br/#apis-de-informacoes-da-loja
# Quando usar: validar o access_token e obter dados de configuração da loja.
#   Recurso só-leitura (apenas GET).
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/store?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
