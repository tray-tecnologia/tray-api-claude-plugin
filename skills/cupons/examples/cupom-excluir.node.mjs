#!/usr/bin/env node
/**
 * Exemplo: Excluir cupom de desconto via API Tray (DESTRUTIVO)
 * Run: TRAY_COUPON_ID=7 CONFIRM_DELETE=yes node skills/cupons/examples/cupom-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-cupom
 * Quando usar: remover um cupom de teste. NÃO rodar contra produção.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_COUPON_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_COUPON_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_COUPON_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_COUPON_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o cupom ${TRAY_COUPON_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/discount_coupons/${TRAY_COUPON_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
