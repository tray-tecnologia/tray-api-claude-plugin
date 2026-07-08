#!/usr/bin/env node
/**
 * Exemplo: Consultar palavra-chave por ID via API Tray
 * Run: TRAY_KEYWORD_ID=123 node skills/palavras-chave/examples/palavra-chave-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-palavras-chave
 * Quando usar: obter dados de uma palavra-chave específica.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_KEYWORD_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_KEYWORD_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_KEYWORD_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_KEYWORD_ID');
}

const url = new URL(`${TRAY_API_BASE}/keywords/${TRAY_KEYWORD_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
