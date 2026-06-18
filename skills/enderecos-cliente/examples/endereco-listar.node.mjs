#!/usr/bin/env node
/**
 * Exemplo: Listar endereços de um cliente via API Tray
 * Run: TRAY_CUSTOMER_ID=50 node skills/enderecos-cliente/examples/endereco-listar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-clientes
 * Quando usar: paginar endereços de um cliente. Máximo 50 itens por página.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CUSTOMER_ID no env.
 * Sem schema local: campos conferidos contra skills/enderecos-cliente/SKILL.md
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_CUSTOMER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CUSTOMER_ID');
}

const url = new URL(`${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}/addresses`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);
url.searchParams.set('limit', '30');
url.searchParams.set('page', '1');

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
