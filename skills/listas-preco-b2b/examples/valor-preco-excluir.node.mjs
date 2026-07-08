#!/usr/bin/env node
/**
 * Exemplo: Excluir valor de uma lista de preço B2B via API Tray (DESTRUTIVO)
 * Run: TRAY_PRICE_LIST_ID=5 TRAY_PRICE_LIST_VALUE_ID=12 CONFIRM_DELETE=yes node skills/listas-preco-b2b/examples/valor-preco-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-lista-de-preco-b2b
 * Quando usar: remover um valor de teste de uma lista. NÃO rodar contra produção.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRICE_LIST_ID, TRAY_PRICE_LIST_VALUE_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRICE_LIST_ID, TRAY_PRICE_LIST_VALUE_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PRICE_LIST_ID || !TRAY_PRICE_LIST_VALUE_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PRICE_LIST_ID e TRAY_PRICE_LIST_VALUE_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o valor ${TRAY_PRICE_LIST_VALUE_ID} da lista ${TRAY_PRICE_LIST_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/price-lists/${TRAY_PRICE_LIST_ID}/values/${TRAY_PRICE_LIST_VALUE_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
