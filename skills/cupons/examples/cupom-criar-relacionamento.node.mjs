#!/usr/bin/env node
/**
 * Exemplo: Criar relacionamento de cupom via API Tray
 * Run: TRAY_COUPON_ID=7 node skills/cupons/examples/cupom-criar-relacionamento.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-cupom
 * Quando usar: vincular clientes/produtos/categorias/marcas/fretes a um cupom.
 *   O tipo de vínculo é definido pela chave do corpo (ver fixture: DiscountCouponProduct).
 *   Máximo 100 registros por POST.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_COUPON_ID no env.
 * Sem schema local: campos conferidos contra skills/cupons/SKILL.md
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_COUPON_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_COUPON_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_COUPON_ID');
}

const payload = JSON.parse(
  await readFile(new URL('./cupom-criar-relacionamento.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/discount_coupons/create_relationship/${TRAY_COUPON_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
