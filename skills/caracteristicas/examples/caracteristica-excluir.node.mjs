#!/usr/bin/env node
/**
 * Exemplo: Excluir característica de um produto via API Tray (DESTRUTIVO)
 * Run: TRAY_PRODUCT_ID=123 TRAY_PROPERTY_ID=1 CONFIRM_DELETE=yes node skills/caracteristicas/examples/caracteristica-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-caracteristicas
 * Quando usar: remover característica de teste de um produto. NÃO rodar contra produção.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID, TRAY_PROPERTY_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID, TRAY_PROPERTY_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PRODUCT_ID || !TRAY_PROPERTY_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID e TRAY_PROPERTY_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir a característica ${TRAY_PROPERTY_ID} do produto ${TRAY_PRODUCT_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/properties/${TRAY_PROPERTY_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
