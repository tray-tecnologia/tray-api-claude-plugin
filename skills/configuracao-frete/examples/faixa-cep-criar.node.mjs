#!/usr/bin/env node
/**
 * Exemplo: Criar tabela/faixa de CEP via API Tray
 * Run: node skills/configuracao-frete/examples/faixa-cep-criar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-configuracao-de-forma-de-frete
 * Quando usar: cadastrar uma faixa de CEP+peso com preço e prazo para um método de envio.
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 * Sem schema local: campos conferidos contra skills/configuracao-frete/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const payload = JSON.parse(
  await readFile(new URL('./faixa-cep-criar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/shippings/method/zipcode_table`);
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
