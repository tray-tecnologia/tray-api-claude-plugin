#!/usr/bin/env node
/**
 * Exemplo: Enviar imagem de produto via API Tray
 * Run: TRAY_PRODUCT_ID=123 node skills/imagens-produtos/examples/imagem-produto-criar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-imagens-de-produtos-e-variacoes
 * Quando usar: cadastrar/atualizar imagem de um produto (via URL na fixture).
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID no env.
 * Sem schema local: campos conferidos contra skills/imagens-produtos/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PRODUCT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./imagem-produto-criar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/images`);
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
