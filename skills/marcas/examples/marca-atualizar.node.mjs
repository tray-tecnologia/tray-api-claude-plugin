#!/usr/bin/env node
/**
 * Exemplo: Atualizar marca via API Tray
 * Run: TRAY_BRAND_ID=123 node skills/marcas/examples/marca-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-marcas
 * Quando usar: atualizar dados de uma marca existente.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_BRAND_ID no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_BRAND_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_BRAND_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_BRAND_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./marca-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/brands/${TRAY_BRAND_ID}`);
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
