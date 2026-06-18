#!/usr/bin/env node
/**
 * Exemplo: Consultar uma variação de produto via API Tray
 * Run: TRAY_PRODUCT_ID=123 TRAY_VARIANT_ID=456 node skills/variacoes/examples/variacao-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-variacoes-de-produtos
 * Quando usar: obter dados de uma variação específica de um produto.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID e TRAY_VARIANT_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID, TRAY_VARIANT_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PRODUCT_ID || !TRAY_VARIANT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID e TRAY_VARIANT_ID');
}

const url = new URL(`${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/variants/${TRAY_VARIANT_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
