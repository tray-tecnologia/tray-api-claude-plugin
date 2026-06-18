#!/usr/bin/env node
/**
 * Exemplo: Criar script externo via API Tray
 * Run: node skills/scripts-externos/examples/script-criar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-scripts-externos
 * Quando usar: injetar script JavaScript (ex: GTM, pixel) na vitrine. URL deve ser HTTPS.
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 * Sem schema local: campos conferidos contra skills/scripts-externos/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const payload = JSON.parse(
  await readFile(new URL('./script-criar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/scripts`);
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
