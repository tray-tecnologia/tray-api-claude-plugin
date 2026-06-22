#!/usr/bin/env bash
# Exemplo: Consultar etiquetas do Mercado Livre via API Tray
# Doc: https://developers.tray.com.br/#api-de-etiqueta-do-mercado-livre
# Quando usar: buscar etiquetas geradas pelo ML. Somente leitura — não criáveis via API Tray.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
# Sem schema local: campos conferidos contra skills/etiquetas-mercado-livre/SKILL.md
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/mercado-livre/labels?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
