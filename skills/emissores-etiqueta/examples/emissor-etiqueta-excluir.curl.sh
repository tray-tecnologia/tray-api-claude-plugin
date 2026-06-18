#!/usr/bin/env bash
# Exemplo: Excluir URL de etiqueta via API Tray (DESTRUTIVO)
# Doc: https://developers.tray.com.br/#api-de-emissores-de-etiqueta
# Quando usar: remover etiqueta cadastrada. NÃO rodar contra produção sem certeza.
# Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_LABEL_EMITTER_ID
#   e confirmação explícita CONFIRM_DELETE=yes.
# Sem schema local: campos conferidos contra skills/emissores-etiqueta/SKILL.md
set -euo pipefail

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"
: "${TRAY_LABEL_EMITTER_ID:?defina TRAY_LABEL_EMITTER_ID=<id da etiqueta cadastrada>}"

if [ "${CONFIRM_DELETE:-no}" != "yes" ]; then
  echo "Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir a etiqueta ${TRAY_LABEL_EMITTER_ID}." >&2
  exit 1
fi

curl --fail-with-body -sS \
  -X DELETE \
  "${TRAY_API_BASE}/label-emitters/${TRAY_LABEL_EMITTER_ID}?access_token=${TRAY_ACCESS_TOKEN}" \
  | jq .
