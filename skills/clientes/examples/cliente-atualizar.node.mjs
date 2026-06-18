#!/usr/bin/env node
/**
 * Exemplo: Atualizar cliente via API Tray
 * Run: TRAY_CUSTOMER_ID=1 node skills/clientes/examples/cliente-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-clientes
 * Quando usar: alterar dados de cliente existente.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CUSTOMER_ID no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_CUSTOMER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CUSTOMER_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./cliente-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
