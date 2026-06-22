#!/usr/bin/env bash
# Exemplo: Atualizar estoque no CD via API Tray (MultiCD)
# Doc: https://developers.tray.com.br/#api-de-multicd
# Quando usar: ajustar o estoque de um produto (ou variação) em um CD específico.
#   Fixture usa o wrapper DistributionCenterProduct. Para variação, troque o body
#   pelo wrapper DistributionCenterVariant (ver skills/multicd/SKILL.md).
# Sem schema local: campos conferidos contra skills/multicd/SKILL.md
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_DISTRIBUTION_CENTER_ID exportados.
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_DISTRIBUTION_CENTER_ID:?defina TRAY_DISTRIBUTION_CENTER_ID=<id de um CD>}"

curl --fail-with-body -sS \
  -X PUT \
  "${TRAY_API_BASE}/multicd/distribution-centers/${TRAY_DISTRIBUTION_CENTER_ID}/stock?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @cd-estoque-atualizar.fixture.json \
  | jq .
