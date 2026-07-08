#!/usr/bin/env node
/**
 * Exemplo: Consultar endereço específico de um cliente via API Tray
 * Run: TRAY_CUSTOMER_ID=50 TRAY_ADDRESS_ID=200 node skills/enderecos-cliente/examples/endereco-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-clientes
 * Quando usar: obter um endereço por ID. Não usar para listar (ver endereco-listar).
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID e TRAY_ADDRESS_ID no env.
 * Sem schema local: campos conferidos contra skills/enderecos-cliente/SKILL.md
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID, TRAY_ADDRESS_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_CUSTOMER_ID || !TRAY_ADDRESS_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID e TRAY_ADDRESS_ID');
}

const url = new URL(`${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}/addresses/${TRAY_ADDRESS_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
