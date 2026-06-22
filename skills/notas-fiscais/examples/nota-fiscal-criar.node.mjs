#!/usr/bin/env node
/**
 * Exemplo: Cadastrar nota fiscal para um pedido via API Tray
 * Run: TRAY_ORDER_ID=1001 node skills/notas-fiscais/examples/nota-fiscal-criar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-nota-fiscal
 * Quando usar: vincular uma NF-e emitida ao pedido. order_id vai na URL.
 * Sem schema local: campos conferidos contra skills/notas-fiscais/SKILL.md
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ORDER_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_ORDER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./nota-fiscal-criar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/orders/${TRAY_ORDER_ID}/invoices`);
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
