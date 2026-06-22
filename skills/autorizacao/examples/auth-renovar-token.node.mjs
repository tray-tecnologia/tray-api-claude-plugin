#!/usr/bin/env node
/**
 * Exemplo: Renovar access_token via refresh_token
 * Run: node skills/autorizacao/examples/auth-renovar-token.node.mjs
 * Doc: https://developers.tray.com.br/#autorizacao
 * Quando usar: access_token expirou (3h) e o refresh_token (30 dias) ainda é válido.
 *   Se o refresh_token também expirou, refaça o fluxo OAuth completo.
 * Pré-requisitos: TRAY_API_BASE e TRAY_REFRESH_TOKEN no env.
 */
const { TRAY_API_BASE, TRAY_REFRESH_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_REFRESH_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_REFRESH_TOKEN');
}

const url = new URL(`${TRAY_API_BASE}/auth`);
url.searchParams.set('refresh_token', TRAY_REFRESH_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
