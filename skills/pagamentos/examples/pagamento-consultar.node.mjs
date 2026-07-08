#!/usr/bin/env node
/**
 * Exemplo: Consultar pagamento por ID via API Tray
 * Run: TRAY_PAYMENT_ID=800 node skills/pagamentos/examples/pagamento-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-informacoes-de-pagamento
 * Quando usar: obter dados de um pagamento específico.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PAYMENT_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PAYMENT_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PAYMENT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PAYMENT_ID');
}

const url = new URL(`${TRAY_API_BASE}/payments/${TRAY_PAYMENT_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
