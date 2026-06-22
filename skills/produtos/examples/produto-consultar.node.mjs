#!/usr/bin/env node
/**
 * Exemplo: Consultar um produto por ID via API Tray
 * Run: TRAY_PRODUCT_ID=123 node skills/produtos/examples/produto-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-produtos
 * Quando usar: obter dados detalhados (inclui Variant, ProductImage, Properties).
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PRODUCT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID');
}

const url = new URL(`${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
