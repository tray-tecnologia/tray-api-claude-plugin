#!/usr/bin/env node
/**
 * Exemplo: Consultar perfil de cliente por ID via API Tray
 * Run: TRAY_PROFILE_ID=3 node skills/perfis-cliente/examples/perfil-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-clientes
 * Quando usar: obter dados de um perfil específico.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PROFILE_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PROFILE_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PROFILE_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PROFILE_ID');
}

const url = new URL(`${TRAY_API_BASE}/customers/profiles/${TRAY_PROFILE_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
