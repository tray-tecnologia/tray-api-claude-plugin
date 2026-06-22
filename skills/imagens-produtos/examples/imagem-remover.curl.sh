#!/usr/bin/env bash
# Exemplo: Remover imagem via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#apis-de-imagens-de-produtos-e-variacoes
# Quando usar: remover uma imagem de produto/variação pelo ID. NÃO rodar contra produção.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_IMAGE_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
# Sem schema local: campos conferidos contra skills/imagens-produtos/SKILL.md
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_IMAGE_ID:?defina TRAY_IMAGE_ID=<id da imagem a remover>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para remover a imagem ${TRAY_IMAGE_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/images/remove?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"id\": ${TRAY_IMAGE_ID}}" \
  | jq .
