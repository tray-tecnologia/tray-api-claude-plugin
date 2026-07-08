#!/usr/bin/env bash
# Exemplo: Listar produtos vendidos via API Tray
# Doc: https://developers.tray.com.br/#apis-de-produtos-vendidos
# Quando usar: relatórios e analytics de vendas. Somente leitura. Máximo 50 itens por página.
#   Filtros opcionais: created (data de venda) e product_id.
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X GET \
  "${TRAY_API_BASE}/products-sold?access_token=${TRAY_ACCESS_TOKEN}&limit=30&page=1" \
  | jq .
