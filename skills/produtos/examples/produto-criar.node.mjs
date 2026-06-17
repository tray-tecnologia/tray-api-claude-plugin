#!/usr/bin/env node
/**
 * Exemplo: Criar produto via API Tray
 * Run: node skills/produtos/examples/produto-criar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-produtos
 * Quando usar: cadastrar produto novo. Não usar para variações (ver tray-variacoes).
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const payload = JSON.parse(
  await readFile(new URL('./produto-criar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/products`);
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
