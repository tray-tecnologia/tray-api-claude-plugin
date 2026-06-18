#!/usr/bin/env node
/**
 * Exemplo: Atualizar centro de distribuição via API Tray (MultiCD)
 * Run: TRAY_DISTRIBUTION_CENTER_ID=1 node skills/multicd/examples/cd-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-multicd
 * Quando usar: alterar nome, prioridade ou status de um CD.
 * Sem schema local: campos conferidos contra skills/multicd/SKILL.md
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_DISTRIBUTION_CENTER_ID no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_DISTRIBUTION_CENTER_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_DISTRIBUTION_CENTER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_DISTRIBUTION_CENTER_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./cd-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/multicd/distribution-centers/${TRAY_DISTRIBUTION_CENTER_ID}`);
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
