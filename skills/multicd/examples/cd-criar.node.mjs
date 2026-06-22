#!/usr/bin/env node
/**
 * Exemplo: Criar centro de distribuição via API Tray (MultiCD)
 * Run: node skills/multicd/examples/cd-criar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-multicd
 * Quando usar: cadastrar um novo CD. Requer MultiCD ativo na loja.
 * Sem schema local: campos conferidos contra skills/multicd/SKILL.md
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const payload = JSON.parse(
  await readFile(new URL('./cd-criar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/multicd/distribution-centers`);
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
