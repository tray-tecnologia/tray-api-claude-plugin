#!/usr/bin/env node
/**
 * Exemplo: Consultar estoque detalhado de variação em todos os CDs via API Tray (MultiCD)
 * Run: TRAY_VARIANT_ID=200 node skills/multicd/examples/cd-estoque-variacao.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-multicd
 * Quando usar: obter o estoque de uma variação distribuída por todos os CDs.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_VARIANT_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_VARIANT_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_VARIANT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_VARIANT_ID');
}

const url = new URL(`${TRAY_API_BASE}/multicd/stock/detailed/variant/${TRAY_VARIANT_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
