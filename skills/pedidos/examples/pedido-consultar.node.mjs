#!/usr/bin/env node
/**
 * Exemplo: Consultar pedido completo via API Tray
 * Run: TRAY_ORDER_ID=1001 node skills/pedidos/examples/pedido-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-pedidos
 * Quando usar: obter dados completos (produtos, cliente, pagamento, frete) em 1 chamada.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ORDER_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_ORDER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID');
}

const url = new URL(`${TRAY_API_BASE}/orders/${TRAY_ORDER_ID}/full`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
