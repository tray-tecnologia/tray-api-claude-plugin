#!/usr/bin/env node
/**
 * Exemplo: Consultar notas fiscais de um pedido via API Tray
 * Run: TRAY_ORDER_ID=1001 node skills/notas-fiscais/examples/nota-fiscal-listar-por-pedido.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-nota-fiscal
 * Quando usar: listar as NF-e associadas a um pedido específico.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ORDER_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_ORDER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID');
}

const url = new URL(`${TRAY_API_BASE}/orders/${TRAY_ORDER_ID}/invoices`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
