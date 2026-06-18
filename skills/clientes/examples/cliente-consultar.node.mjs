#!/usr/bin/env node
/**
 * Exemplo: Consultar cliente por ID via API Tray
 * Run: TRAY_CUSTOMER_ID=1 node skills/clientes/examples/cliente-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-clientes
 * Quando usar: obter dados de um cliente específico.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CUSTOMER_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_CUSTOMER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CUSTOMER_ID');
}

const url = new URL(`${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
