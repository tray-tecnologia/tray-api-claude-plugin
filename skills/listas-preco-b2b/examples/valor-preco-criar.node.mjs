#!/usr/bin/env node
/**
 * Exemplo: Criar valor em uma lista de preço B2B via API Tray
 * Run: TRAY_PRICE_LIST_ID=5 node skills/listas-preco-b2b/examples/valor-preco-criar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-lista-de-preco-b2b
 * Quando usar: adicionar um preço diferenciado por produto/variação a uma lista.
 * Sem schema local: campos conferidos contra skills/listas-preco-b2b/SKILL.md
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRICE_LIST_ID no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRICE_LIST_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PRICE_LIST_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRICE_LIST_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./valor-preco-criar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/price-lists/${TRAY_PRICE_LIST_ID}/values`);
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
