#!/usr/bin/env node
/**
 * Exemplo: Listar variações de um produto via API Tray
 * Run: TRAY_PRODUCT_ID=123 node skills/variacoes/examples/variacao-listar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-variacoes-de-produtos
 * Quando usar: listar variações de um produto. Máximo 50 itens por página.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PRODUCT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID');
}

const url = new URL(`${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/variants`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);
url.searchParams.set('limit', '30');
url.searchParams.set('page', '1');

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
