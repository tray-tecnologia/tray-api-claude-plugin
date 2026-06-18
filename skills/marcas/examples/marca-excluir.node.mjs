#!/usr/bin/env node
/**
 * Exemplo: Excluir marca via API Tray (DESTRUTIVO)
 * Run: TRAY_BRAND_ID=123 CONFIRM_DELETE=yes node skills/marcas/examples/marca-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-marcas
 * Quando usar: remover marca de teste. NÃO rodar contra produção.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_BRAND_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_BRAND_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_BRAND_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_BRAND_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir a marca ${TRAY_BRAND_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/brands/${TRAY_BRAND_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
