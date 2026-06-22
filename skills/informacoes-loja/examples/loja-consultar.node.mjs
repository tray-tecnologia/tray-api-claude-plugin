#!/usr/bin/env node
/**
 * Exemplo: Consultar informações da loja via API Tray
 * Run: node skills/informacoes-loja/examples/loja-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-informacoes-da-loja
 * Quando usar: validar o access_token e obter dados de configuração da loja.
 *   Recurso só-leitura (apenas GET).
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const url = new URL(`${TRAY_API_BASE}/store`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
