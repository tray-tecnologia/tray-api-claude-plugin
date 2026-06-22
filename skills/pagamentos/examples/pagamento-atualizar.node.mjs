#!/usr/bin/env node
/**
 * Exemplo: Atualizar pagamento via API Tray
 * Run: TRAY_PAYMENT_ID=800 node skills/pagamentos/examples/pagamento-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-informacoes-de-pagamento
 * Quando usar: atualizar status/dados de um pagamento existente.
 * Sem schema local: campos conferidos contra skills/pagamentos/SKILL.md
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PAYMENT_ID no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PAYMENT_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PAYMENT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PAYMENT_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./pagamento-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/payments/${TRAY_PAYMENT_ID}`);
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
