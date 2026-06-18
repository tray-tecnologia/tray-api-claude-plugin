#!/usr/bin/env node
/**
 * Exemplo: Desvincular informação adicional de um produto via API Tray (DESTRUTIVO)
 * Run: TRAY_PRODUCT_ID=123 TRAY_ADDITIONAL_INFO_ID=45 CONFIRM_DELETE=yes node skills/informacoes-adicionais/examples/info-adicional-desvincular-produto.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-informacao-adicional-additional_info
 * Quando usar: remover a relação entre uma informação adicional e um produto. NÃO rodar contra produção.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID, TRAY_ADDITIONAL_INFO_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID, TRAY_ADDITIONAL_INFO_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PRODUCT_ID || !TRAY_ADDITIONAL_INFO_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID e TRAY_ADDITIONAL_INFO_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para desvincular a informação ${TRAY_ADDITIONAL_INFO_ID} do produto ${TRAY_PRODUCT_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/additional-info/${TRAY_ADDITIONAL_INFO_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
