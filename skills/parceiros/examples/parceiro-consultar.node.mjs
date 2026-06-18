#!/usr/bin/env node
/**
 * Exemplo: Consultar parceiro por ID via API Tray
 * Run: TRAY_PARTNER_ID=10 node skills/parceiros/examples/parceiro-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-parceiros
 * Quando usar: obter dados de um parceiro específico.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PARTNER_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PARTNER_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PARTNER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PARTNER_ID');
}

const url = new URL(`${TRAY_API_BASE}/partners/${TRAY_PARTNER_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
