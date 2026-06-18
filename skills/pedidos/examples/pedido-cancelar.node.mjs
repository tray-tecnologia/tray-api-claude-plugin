#!/usr/bin/env node
/**
 * Exemplo: Cancelar pedido via API Tray (DESTRUTIVO)
 * Run: TRAY_ORDER_ID=1001 CONFIRM_CANCEL=yes node skills/pedidos/examples/pedido-cancelar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-pedidos
 * Quando usar: cancelar pedido de teste. Prefira cancelamento a exclusão. NÃO rodar em produção.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ORDER_ID e CONFIRM_CANCEL=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ORDER_ID, CONFIRM_CANCEL } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_ORDER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID');
}
if (CONFIRM_CANCEL !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_CANCEL=yes para cancelar o pedido ${TRAY_ORDER_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/orders/${TRAY_ORDER_ID}/cancel`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'PUT' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
