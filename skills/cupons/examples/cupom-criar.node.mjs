#!/usr/bin/env node
/**
 * Exemplo: Criar cupom de desconto via API Tray
 * Run: node skills/cupons/examples/cupom-criar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-cupom
 * Quando usar: cadastrar um novo cupom de desconto.
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 * Sem schema local: campos conferidos contra skills/cupons/SKILL.md
 * Nota: a API espera application/x-www-form-urlencoded com wrapper ["DiscountCoupon"]["campo"].
 *   O fixture é JSON; convertemos para urlencoded antes de enviar.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const { DiscountCoupon } = JSON.parse(
  await readFile(new URL('./cupom-criar.fixture.json', import.meta.url))
);

const body = new URLSearchParams();
for (const [key, value] of Object.entries(DiscountCoupon)) {
  body.set(`["DiscountCoupon"]["${key}"]`, String(value));
}

const url = new URL(`${TRAY_API_BASE}/discount_coupons`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: body.toString(),
});

if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
