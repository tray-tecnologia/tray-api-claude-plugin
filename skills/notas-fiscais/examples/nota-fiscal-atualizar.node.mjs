#!/usr/bin/env node
/**
 * Exemplo: Atualizar nota fiscal via API Tray
 * Run: TRAY_INVOICE_ID=500 node skills/notas-fiscais/examples/nota-fiscal-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-nota-fiscal
 * Quando usar: atualizar dados de uma NF-e existente (ex: link do DANFE, valor).
 * Sem schema local: campos conferidos contra skills/notas-fiscais/SKILL.md
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_INVOICE_ID no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_INVOICE_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_INVOICE_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_INVOICE_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./nota-fiscal-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/invoices/${TRAY_INVOICE_ID}`);
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
