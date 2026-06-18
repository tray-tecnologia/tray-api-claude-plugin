#!/usr/bin/env node
/**
 * Exemplo: Atualizar parceiro via API Tray
 * Run: TRAY_PARTNER_ID=10 node skills/parceiros/examples/parceiro-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-parceiros
 * Quando usar: alterar dados de um parceiro existente.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PARTNER_ID no env.
 * Sem schema local: campos conferidos contra skills/parceiros/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PARTNER_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PARTNER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PARTNER_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./parceiro-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/partners/${TRAY_PARTNER_ID}`);
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
