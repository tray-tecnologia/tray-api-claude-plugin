#!/usr/bin/env bash
# Exemplo: Gerar tokens de acesso (etapa 3 do OAuth Tray)
# Doc: https://developers.tray.com.br/#autorizacao
# Quando usar: trocar o `code` do callback por access_token + refresh_token.
#   NÃO usar para renovar token expirado — use auth-renovar-token.
# Pré-requisitos: TRAY_API_BASE, TRAY_CONSUMER_KEY, TRAY_CONSUMER_SECRET e TRAY_AUTH_CODE.
# Segredos vêm sempre do ambiente — nunca hardcode no arquivo.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_CONSUMER_KEY:?defina TRAY_CONSUMER_KEY}"
: "${TRAY_CONSUMER_SECRET:?defina TRAY_CONSUMER_SECRET}"
: "${TRAY_AUTH_CODE:?defina TRAY_AUTH_CODE=<code recebido no callback>}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/auth" \
  -H "Content-Type: application/json" \
  -d "{\"consumer_key\":\"${TRAY_CONSUMER_KEY}\",\"consumer_secret\":\"${TRAY_CONSUMER_SECRET}\",\"code\":\"${TRAY_AUTH_CODE}\"}" \
  | jq .
