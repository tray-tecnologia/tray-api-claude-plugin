#!/usr/bin/env node
/**
 * Exemplo: Vincular URL de etiqueta a um pedido via API Tray
 * Run: TRAY_ORDER_ID=12345 node skills/emissores-etiqueta/examples/emissor-etiqueta-vincular.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-emissores-de-etiqueta
 * Quando usar: associar a etiqueta gerada a um pedido específico. Não usar para HUB nem ML.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID no env.
 * Sem schema local: campos conferidos contra skills/emissores-etiqueta/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ORDER_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_ORDER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./emissor-etiqueta-vincular.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/label-emitters/${TRAY_ORDER_ID}`);
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
