#!/usr/bin/env node
/**
 * Exemplo: Consultar cupom-presente vinculado via API Tray
 * Run: TRAY_COUPON_ID=7 node skills/cupons/examples/cupom-relacionamento-presente.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-cupom
 * Quando usar: consultar o produto-presente associado a um cupom do tipo presente.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_COUPON_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_COUPON_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_COUPON_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_COUPON_ID');
}

const url = new URL(`${TRAY_API_BASE}/discount_coupons/gift_relationship/${TRAY_COUPON_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
