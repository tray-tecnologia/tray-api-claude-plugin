#!/usr/bin/env node
/**
 * Exemplo: Atualizar informação adicional via API Tray
 * Run: TRAY_ADDITIONAL_INFO_ID=45 node skills/informacoes-adicionais/examples/info-adicional-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-informacao-adicional-additional_info
 * Quando usar: alterar nome/valor de uma informação adicional existente.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ADDITIONAL_INFO_ID no env.
 * Sem schema local: campos conferidos contra skills/informacoes-adicionais/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ADDITIONAL_INFO_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_ADDITIONAL_INFO_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ADDITIONAL_INFO_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./info-adicional-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/additional-info/${TRAY_ADDITIONAL_INFO_ID}`);
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
