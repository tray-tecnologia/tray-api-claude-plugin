#!/usr/bin/env node
/**
 * Exemplo: Excluir pagamento via API Tray (DESTRUTIVO)
 * Run: TRAY_PAYMENT_ID=800 CONFIRM_DELETE=yes node skills/pagamentos/examples/pagamento-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-informacoes-de-pagamento
 * Quando usar: remover registro de pagamento de teste. NÃO rodar contra produção.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PAYMENT_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_PAYMENT_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_PAYMENT_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_PAYMENT_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o pagamento ${TRAY_PAYMENT_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/payments/${TRAY_PAYMENT_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
