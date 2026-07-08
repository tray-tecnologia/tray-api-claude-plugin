#!/usr/bin/env node
/**
 * Exemplo: Atualizar forma de envio (gateway) via API Tray
 * Run: TRAY_SHIPPING_METHOD_ID=10 node skills/configuracao-frete/examples/metodo-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-configuracao-de-forma-de-frete
 * Quando usar: alterar nome, prazo ou status de um método de envio existente.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_SHIPPING_METHOD_ID no env.
 * Sem schema local: campos conferidos contra skills/configuracao-frete/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_SHIPPING_METHOD_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_SHIPPING_METHOD_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_SHIPPING_METHOD_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./metodo-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/shippings/method/gateway/${TRAY_SHIPPING_METHOD_ID}`);
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
