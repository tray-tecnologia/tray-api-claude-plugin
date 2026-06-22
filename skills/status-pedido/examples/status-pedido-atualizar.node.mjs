#!/usr/bin/env node
/**
 * Exemplo: Atualizar status de pedido via API Tray
 * Run: TRAY_ORDER_STATUS_ID=15 node skills/status-pedido/examples/status-pedido-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-status-do-pedido
 * Quando usar: alterar nome, cores, descrição ou tipo de um status existente.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_STATUS_ID no env.
 * Sem schema local: campos conferidos contra skills/status-pedido/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ORDER_STATUS_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_ORDER_STATUS_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_STATUS_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./status-pedido-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/orders/statuses/${TRAY_ORDER_STATUS_ID}`);
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
