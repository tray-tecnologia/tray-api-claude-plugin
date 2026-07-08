#!/usr/bin/env node
/**
 * Exemplo: Atualizar kit via API Tray
 * Run: TRAY_KIT_ID=50 node skills/kits/examples/kit-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-kit
 * Quando usar: alterar a quantidade de um componente dentro do kit.
 * Sem schema local: campos conferidos contra skills/kits/SKILL.md
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_KIT_ID no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_KIT_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_KIT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_KIT_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./kit-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/products/kits/${TRAY_KIT_ID}`);
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
