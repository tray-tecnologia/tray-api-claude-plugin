#!/usr/bin/env node
/**
 * Exemplo: Excluir carrinho via API Tray (DESTRUTIVO)
 * Run: TRAY_CART_SESSION_ID=abc123 CONFIRM_DELETE=yes node skills/carrinho-compras/examples/carrinho-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-carrinho-de-compra
 * Quando usar: remover um carrinho de teste/abandonado. NÃO rodar contra produção.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CART_SESSION_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CART_SESSION_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_CART_SESSION_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CART_SESSION_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o carrinho ${TRAY_CART_SESSION_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/carts/${TRAY_CART_SESSION_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
