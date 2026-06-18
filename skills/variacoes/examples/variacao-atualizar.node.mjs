#!/usr/bin/env node
/**
 * Exemplo: Atualizar variação de produto via API Tray
 * Run: TRAY_PRODUCT_ID=123 TRAY_VARIANT_ID=456 node skills/variacoes/examples/variacao-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-variacoes-de-produtos
 * Quando usar: alterar preço, estoque ou demais dados de uma variação existente.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID e TRAY_VARIANT_ID no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID, TRAY_VARIANT_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PRODUCT_ID || !TRAY_VARIANT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID e TRAY_VARIANT_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./variacao-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/variants/${TRAY_VARIANT_ID}`);
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
