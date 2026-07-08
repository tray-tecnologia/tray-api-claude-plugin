#!/usr/bin/env node
/**
 * Exemplo: Listar notas fiscais via API Tray
 * Run: node skills/notas-fiscais/examples/nota-fiscal-listar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-nota-fiscal
 * Quando usar: paginar NF-e da loja. Máximo 50 itens por página.
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const url = new URL(`${TRAY_API_BASE}/invoices`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);
url.searchParams.set('limit', '30');
url.searchParams.set('page', '1');

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
