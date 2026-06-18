#!/usr/bin/env node
/**
 * Exemplo: Atualizar cupom de desconto via API Tray
 * Run: TRAY_COUPON_ID=7 node skills/cupons/examples/cupom-atualizar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-cupom
 * Quando usar: alterar valor, validade ou descrição de um cupom existente.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_COUPON_ID no env.
 * Sem schema local: campos conferidos contra skills/cupons/SKILL.md
 * Nota: a API espera application/x-www-form-urlencoded com wrapper ["DiscountCoupon"]["campo"].
 *   O fixture é JSON; convertemos para urlencoded antes de enviar.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_COUPON_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_COUPON_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_COUPON_ID');
}

const { DiscountCoupon } = JSON.parse(
  await readFile(new URL('./cupom-atualizar.fixture.json', import.meta.url))
);

const body = new URLSearchParams();
for (const [key, value] of Object.entries(DiscountCoupon)) {
  body.set(`["DiscountCoupon"]["${key}"]`, String(value));
}

const url = new URL(`${TRAY_API_BASE}/discount_coupons/${TRAY_COUPON_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: body.toString(),
});

if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
