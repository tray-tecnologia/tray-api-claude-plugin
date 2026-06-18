#!/usr/bin/env node
/**
 * Exemplo: Excluir categoria via API Tray (DESTRUTIVO)
 * Run: TRAY_CATEGORY_ID=1 CONFIRM_DELETE=yes node skills/categorias/examples/categoria-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-categorias
 * Quando usar: remover categoria de teste. NÃO rodar contra produção.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CATEGORY_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CATEGORY_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_CATEGORY_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CATEGORY_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir a categoria ${TRAY_CATEGORY_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/categories/${TRAY_CATEGORY_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
