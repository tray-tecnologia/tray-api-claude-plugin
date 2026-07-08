#!/usr/bin/env node
/**
 * Exemplo: Consultar centro de distribuição por ID via API Tray (MultiCD)
 * Run: TRAY_DISTRIBUTION_CENTER_ID=1 node skills/multicd/examples/cd-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-multicd
 * Quando usar: obter dados de um CD específico.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_DISTRIBUTION_CENTER_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_DISTRIBUTION_CENTER_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_DISTRIBUTION_CENTER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_DISTRIBUTION_CENTER_ID');
}

const url = new URL(`${TRAY_API_BASE}/multicd/distribution-centers/${TRAY_DISTRIBUTION_CENTER_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
