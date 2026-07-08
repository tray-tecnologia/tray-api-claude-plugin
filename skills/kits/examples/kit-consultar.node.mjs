#!/usr/bin/env node
/**
 * Exemplo: Consultar kit por ID via API Tray
 * Run: TRAY_KIT_ID=50 node skills/kits/examples/kit-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-kit
 * Quando usar: obter dados de um kit específico.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_KIT_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_KIT_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_KIT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_KIT_ID');
}

const url = new URL(`${TRAY_API_BASE}/products/kits/${TRAY_KIT_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
