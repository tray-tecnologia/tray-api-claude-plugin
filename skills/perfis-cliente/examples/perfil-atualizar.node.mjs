#!/usr/bin/env node
/**
 * Exemplo: Atualizar perfil de cliente via API Tray
 * Run: TRAY_PROFILE_ID=3 node skills/perfis-cliente/examples/perfil-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-clientes
 * Quando usar: alterar dados de um perfil existente.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PROFILE_ID no env.
 * Sem schema local: campos conferidos contra skills/perfis-cliente/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PROFILE_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PROFILE_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PROFILE_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./perfil-atualizar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/customers/profiles/${TRAY_PROFILE_ID}`);
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
