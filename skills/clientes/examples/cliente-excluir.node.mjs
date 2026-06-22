#!/usr/bin/env node
/**
 * Exemplo: Excluir cliente via API Tray (DESTRUTIVO)
 * Run: TRAY_CUSTOMER_ID=1 CONFIRM_DELETE=yes node skills/clientes/examples/cliente-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-clientes
 * Quando usar: remover cliente de teste. NÃO rodar contra produção (atenção à LGPD).
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_CUSTOMER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_CUSTOMER_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o cliente ${TRAY_CUSTOMER_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
