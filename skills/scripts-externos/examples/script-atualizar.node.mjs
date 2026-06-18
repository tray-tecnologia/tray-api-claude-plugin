#!/usr/bin/env node
/**
 * Exemplo: Atualizar script externo via API Tray
 * Run: TRAY_SCRIPT_ID=5 node skills/scripts-externos/examples/script-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-scripts-externos
 * Quando usar: ativar/desativar ou alterar um script existente (ex: active=0 para desativar).
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_SCRIPT_ID no env.
 * Sem schema local: campos conferidos contra skills/scripts-externos/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_SCRIPT_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_SCRIPT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_SCRIPT_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./script-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/scripts/${TRAY_SCRIPT_ID}`);
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
