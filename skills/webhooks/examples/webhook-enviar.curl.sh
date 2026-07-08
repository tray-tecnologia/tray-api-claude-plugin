#!/usr/bin/env bash
# Exemplo: Disparar um evento de webhook de teste contra seu receptor
# Doc: https://developers.tray.com.br/#sistema-de-notificacao
# Quando usar: testar localmente o webhook-receiver simulando o POST que a Tray envia.
#   A Tray usa application/x-www-form-urlencoded — este exemplo replica o formato.
# Pré-requisito: WEBHOOK_URL (default http://localhost:3000). Suba o receiver antes:
#   node skills/webhooks/examples/webhook-receiver.node.mjs
# Validar a fixture (campos do payload) antes:
#   node skills/webhooks/scripts/validate.mjs --schema=webhook.payload \
#     "$(cat skills/webhooks/examples/webhook.fixture.json)"
set -euo pipefail

WEBHOOK_URL="${WEBHOOK_URL:-http://localhost:3000}"

curl --fail-with-body -sS \
  -X POST \
  "${WEBHOOK_URL}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "seller_id=391250" \
  --data-urlencode "scope_id=4375797" \
  --data-urlencode "scope_name=order" \
  --data-urlencode "act=update"
