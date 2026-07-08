#!/usr/bin/env node
/**
 * Exemplo: Associar cliente a um perfil via API Tray
 * Run: TRAY_CUSTOMER_ID=50 TRAY_PROFILE_ID=3 node skills/perfis-cliente/examples/perfil-associar-cliente.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-clientes
 * Quando usar: vincular um cliente a um perfil. Não requer corpo na requisição.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID e TRAY_PROFILE_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID, TRAY_PROFILE_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_CUSTOMER_ID || !TRAY_PROFILE_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID e TRAY_PROFILE_ID');
}

const url = new URL(`${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}/profiles/${TRAY_PROFILE_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'POST' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
