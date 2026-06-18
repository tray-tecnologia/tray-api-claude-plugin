#!/usr/bin/env node
/**
 * Exemplo: Cadastrar URL de emissor de etiqueta via API Tray
 * Run: node skills/emissores-etiqueta/examples/emissor-etiqueta-cadastrar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-emissores-de-etiqueta
 * Quando usar: registrar a URL base do seu sistema de etiquetas. Não usar para HUB nem ML.
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 * Sem schema local: campos conferidos contra skills/emissores-etiqueta/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const payload = JSON.parse(
  await readFile(new URL('./emissor-etiqueta-cadastrar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/label-emitters`);
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
