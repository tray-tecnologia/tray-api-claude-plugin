#!/usr/bin/env node
/**
 * Exemplo: Atualizar categoria via API Tray
 * Run: TRAY_CATEGORY_ID=1 node skills/categorias/examples/categoria-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-categorias
 * Quando usar: alterar dados de uma categoria existente.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CATEGORY_ID no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CATEGORY_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_CATEGORY_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CATEGORY_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./categoria-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/categories/${TRAY_CATEGORY_ID}`);
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
