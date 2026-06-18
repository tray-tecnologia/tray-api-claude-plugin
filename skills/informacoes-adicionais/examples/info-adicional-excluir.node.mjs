#!/usr/bin/env node
/**
 * Exemplo: Excluir informação adicional via API Tray (DESTRUTIVO)
 * Run: TRAY_ADDITIONAL_INFO_ID=45 CONFIRM_DELETE=yes node skills/informacoes-adicionais/examples/info-adicional-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-informacao-adicional-additional_info
 * Quando usar: excluir definitivamente uma informação adicional. NÃO rodar contra produção.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ADDITIONAL_INFO_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ADDITIONAL_INFO_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_ADDITIONAL_INFO_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ADDITIONAL_INFO_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir a informação adicional ${TRAY_ADDITIONAL_INFO_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/additional-info/${TRAY_ADDITIONAL_INFO_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
