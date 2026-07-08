#!/usr/bin/env node
/**
 * Exemplo: Excluir variação de produto via API Tray (DESTRUTIVO)
 * Run: TRAY_PRODUCT_ID=123 TRAY_VARIANT_ID=456 CONFIRM_DELETE=yes node skills/variacoes/examples/variacao-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-variacoes-de-produtos
 * Quando usar: remover variação de teste. NÃO rodar contra produção.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID, TRAY_VARIANT_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID, TRAY_VARIANT_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PRODUCT_ID || !TRAY_VARIANT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID e TRAY_VARIANT_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir a variação ${TRAY_VARIANT_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/variants/${TRAY_VARIANT_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
