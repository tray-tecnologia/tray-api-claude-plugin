#!/usr/bin/env node
/**
 * Exemplo: Consultar marca por ID via API Tray
 * Run: TRAY_BRAND_ID=123 node skills/marcas/examples/marca-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-marcas
 * Quando usar: obter os dados de uma marca específica.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_BRAND_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_BRAND_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_BRAND_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_BRAND_ID');
}

const url = new URL(`${TRAY_API_BASE}/brands/${TRAY_BRAND_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
