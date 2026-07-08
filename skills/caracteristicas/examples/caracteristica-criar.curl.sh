#!/usr/bin/env bash
# Exemplo: Cadastrar/atualizar característica de um produto via API Tray
# Doc: https://developers.tray.com.br/#apis-de-caracteristicas
# Quando usar: vincular uma característica (ex: Cor=Azul) a um produto específico.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID exportados.
# Sem schema local: campos conferidos contra skills/caracteristicas/SKILL.md
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_PRODUCT_ID:?defina TRAY_PRODUCT_ID=<id do produto>}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/properties?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @caracteristica-criar.fixture.json \
  | jq .
