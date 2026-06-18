#!/usr/bin/env node
/**
 * Exemplo: Consultar nota fiscal por ID via API Tray
 * Run: TRAY_INVOICE_ID=500 node skills/notas-fiscais/examples/nota-fiscal-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-nota-fiscal
 * Quando usar: obter dados de uma NF-e específica.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_INVOICE_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_INVOICE_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_INVOICE_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_INVOICE_ID');
}

const url = new URL(`${TRAY_API_BASE}/invoices/${TRAY_INVOICE_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
