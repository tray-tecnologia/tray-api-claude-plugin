#!/usr/bin/env node
/**
 * Exemplo: Criar pedido via API Tray
 * Run: node skills/pedidos/examples/pedido-criar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-pedidos
 * Quando usar: registrar pedido novo. customer_id e products são obrigatórios.
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const payload = JSON.parse(
  await readFile(new URL('./pedido-criar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/orders`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
