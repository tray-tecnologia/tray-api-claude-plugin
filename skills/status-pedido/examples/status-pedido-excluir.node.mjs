#!/usr/bin/env node
/**
 * Exemplo: Excluir status de pedido via API Tray (DESTRUTIVO)
 * Run: TRAY_ORDER_STATUS_ID=15 CONFIRM_DELETE=yes node skills/status-pedido/examples/status-pedido-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-status-do-pedido
 * Quando usar: remover status personalizado de teste. NÃO rodar contra produção.
 *   Status padrão da plataforma não podem ser excluídos.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ORDER_STATUS_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ORDER_STATUS_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_ORDER_STATUS_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_STATUS_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o status ${TRAY_ORDER_STATUS_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/orders/statuses/${TRAY_ORDER_STATUS_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
