#!/usr/bin/env node
/**
 * Exemplo: Consultar categoria por ID via API Tray
 * Run: TRAY_CATEGORY_ID=1 node skills/categorias/examples/categoria-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-categorias
 * Quando usar: obter dados de uma categoria específica.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CATEGORY_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CATEGORY_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_CATEGORY_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CATEGORY_ID');
}

const url = new URL(`${TRAY_API_BASE}/categories/${TRAY_CATEGORY_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
