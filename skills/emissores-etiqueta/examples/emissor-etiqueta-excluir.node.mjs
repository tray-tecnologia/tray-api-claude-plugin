#!/usr/bin/env node
/**
 * Exemplo: Excluir URL de etiqueta via API Tray (DESTRUTIVO)
 * Run: TRAY_LABEL_EMITTER_ID=200 CONFIRM_DELETE=yes node skills/emissores-etiqueta/examples/emissor-etiqueta-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-emissores-de-etiqueta
 * Quando usar: remover etiqueta cadastrada. NÃO rodar contra produção sem certeza.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_LABEL_EMITTER_ID e CONFIRM_DELETE=yes.
 * Sem schema local: campos conferidos contra skills/emissores-etiqueta/SKILL.md
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_LABEL_EMITTER_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_LABEL_EMITTER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_LABEL_EMITTER_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir a etiqueta ${TRAY_LABEL_EMITTER_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/label-emitters/${TRAY_LABEL_EMITTER_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
