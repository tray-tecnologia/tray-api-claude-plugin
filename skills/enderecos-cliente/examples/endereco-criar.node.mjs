#!/usr/bin/env node
/**
 * Exemplo: Cadastrar endereço para um cliente via API Tray
 * Run: TRAY_CUSTOMER_ID=50 node skills/enderecos-cliente/examples/endereco-criar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-clientes
 * Quando usar: criar novo endereço. A API não tem PUT — para alterar, exclua e recrie.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CUSTOMER_ID no env.
 * Sem schema local: campos conferidos contra skills/enderecos-cliente/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_CUSTOMER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CUSTOMER_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./endereco-criar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}/addresses`);
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
