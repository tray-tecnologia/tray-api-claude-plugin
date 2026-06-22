#!/usr/bin/env node
/**
 * Exemplo: Cadastrar/atualizar característica de um produto via API Tray
 * Run: TRAY_PRODUCT_ID=123 node skills/caracteristicas/examples/caracteristica-criar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-caracteristicas
 * Quando usar: vincular uma característica (ex: Cor=Azul) a um produto específico.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID no env.
 * Sem schema local: campos conferidos contra skills/caracteristicas/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRODUCT_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PRODUCT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PRODUCT_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./caracteristica-criar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/products/${TRAY_PRODUCT_ID}/properties`);
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
