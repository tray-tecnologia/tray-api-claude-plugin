#!/usr/bin/env node
/**
 * Exemplo: Consultar estoque detalhado de produto em todos os CDs via API Tray (MultiCD)
 * Run: TRAY_PRODUCT_ID=100 node skills/multicd/examples/cd-estoque-produto.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-multicd
 * Quando usar: obter o estoque de um produto distribuído por todos os CDs.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PRODUCT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID');
}

const url = new URL(`${TRAY_API_BASE}/multicd/stock/detailed/product/${TRAY_PRODUCT_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
