#!/usr/bin/env node
/**
 * Exemplo: Listar formas de envio da loja via API Tray
 * Run: node skills/frete/examples/frete-listar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-integracao-de-frete
 * Quando usar: listar os métodos de envio disponíveis na loja. Recurso só-leitura.
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const url = new URL(`${TRAY_API_BASE}/shippings/`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
