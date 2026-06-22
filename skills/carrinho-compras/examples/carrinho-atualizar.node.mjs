#!/usr/bin/env node
/**
 * Exemplo: Atualizar carrinho via API Tray
 * Run: TRAY_CART_SESSION_ID=abc123 node skills/carrinho-compras/examples/carrinho-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-carrinho-de-compra
 * Quando usar: alterar a quantidade de um item do carrinho existente.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CART_SESSION_ID no env.
 * Sem schema local: campos conferidos contra skills/carrinho-compras/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CART_SESSION_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_CART_SESSION_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CART_SESSION_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./carrinho-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/carts/${TRAY_CART_SESSION_ID}`);
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
