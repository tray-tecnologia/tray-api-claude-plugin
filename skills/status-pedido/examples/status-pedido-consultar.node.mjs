#!/usr/bin/env node
/**
 * Exemplo: Consultar status de pedido por ID via API Tray
 * Run: TRAY_ORDER_STATUS_ID=15 node skills/status-pedido/examples/status-pedido-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-status-do-pedido
 * Quando usar: obter dados de um status específico.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_STATUS_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ORDER_STATUS_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_ORDER_STATUS_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_STATUS_ID');
}

const url = new URL(`${TRAY_API_BASE}/orders/statuses/${TRAY_ORDER_STATUS_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
