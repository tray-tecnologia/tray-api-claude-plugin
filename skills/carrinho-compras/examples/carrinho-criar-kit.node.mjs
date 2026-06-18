#!/usr/bin/env node
/**
 * Exemplo: Criar carrinho com kit de produtos via API Tray
 * Run: node skills/carrinho-compras/examples/carrinho-criar-kit.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-carrinho-de-compra
 * Quando usar: criar um carrinho a partir de um kit (bundle) com vários componentes.
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 * Sem schema local: campos conferidos contra skills/carrinho-compras/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const payload = JSON.parse(
  await readFile(new URL('./carrinho-criar-kit.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/carts/kit`);
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
