#!/usr/bin/env node
/**
 * Exemplo: Desassociar cliente de um perfil via API Tray (DESTRUTIVO)
 * Run: TRAY_CUSTOMER_ID=50 TRAY_PROFILE_ID=3 CONFIRM_DELETE=yes node skills/perfis-cliente/examples/perfil-desassociar-cliente.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-clientes
 * Quando usar: remover o vínculo entre um cliente e um perfil. Não requer corpo.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID, TRAY_PROFILE_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID, TRAY_PROFILE_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_CUSTOMER_ID || !TRAY_PROFILE_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_CUSTOMER_ID e TRAY_PROFILE_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para desassociar o cliente ${TRAY_CUSTOMER_ID} do perfil ${TRAY_PROFILE_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/customers/${TRAY_CUSTOMER_ID}/profiles/${TRAY_PROFILE_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
