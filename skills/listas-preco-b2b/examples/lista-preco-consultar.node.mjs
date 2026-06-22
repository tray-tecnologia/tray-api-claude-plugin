#!/usr/bin/env node
/**
 * Exemplo: Consultar lista de preço B2B por ID via API Tray
 * Run: TRAY_PRICE_LIST_ID=5 node skills/listas-preco-b2b/examples/lista-preco-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-lista-de-preco-b2b
 * Quando usar: obter dados de uma lista de preço específica.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRICE_LIST_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRICE_LIST_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PRICE_LIST_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRICE_LIST_ID');
}

const url = new URL(`${TRAY_API_BASE}/price-lists/${TRAY_PRICE_LIST_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
