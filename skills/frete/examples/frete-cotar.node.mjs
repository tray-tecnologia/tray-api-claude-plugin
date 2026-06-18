#!/usr/bin/env node
/**
 * Exemplo: Cotar frete por CEP via API Tray
 * Run: node skills/frete/examples/frete-cotar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-integracao-de-frete
 * Quando usar: calcular frete de um ou mais produtos para um CEP.
 *   Recurso só-leitura; produtos via query indexada (products[0][...]).
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const url = new URL(`${TRAY_API_BASE}/shippings/cotation/`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);
url.searchParams.set('zipcode', '04001001');
url.searchParams.set('products[0][product_id]', '123');
url.searchParams.set('products[0][price]', '58.90');
url.searchParams.set('products[0][quantity]', '2');

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
