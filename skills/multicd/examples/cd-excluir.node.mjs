#!/usr/bin/env node
/**
 * Exemplo: Excluir centro de distribuição via API Tray (MultiCD) (DESTRUTIVO)
 * Run: TRAY_DISTRIBUTION_CENTER_ID=5 CONFIRM_DELETE=yes node skills/multicd/examples/cd-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-multicd
 * Quando usar: remover um CD de teste. NÃO rodar contra produção.
 *   Desative o CD (active=0) antes de excluir para evitar impacto em pedidos.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_DISTRIBUTION_CENTER_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_DISTRIBUTION_CENTER_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_DISTRIBUTION_CENTER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_DISTRIBUTION_CENTER_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir o CD ${TRAY_DISTRIBUTION_CENTER_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/multicd/distribution-centers/${TRAY_DISTRIBUTION_CENTER_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
