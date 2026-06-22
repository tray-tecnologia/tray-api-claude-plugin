#!/usr/bin/env node
/**
 * Exemplo: Excluir tabela/faixa de CEP via API Tray (DESTRUTIVO)
 * Run: TRAY_ZIPCODE_TABLE_ID=10 CONFIRM_DELETE=yes node skills/configuracao-frete/examples/faixa-cep-excluir.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-configuracao-de-forma-de-frete
 * Quando usar: remover uma faixa de CEP de teste. NÃO rodar contra produção.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ZIPCODE_TABLE_ID e CONFIRM_DELETE=yes.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ZIPCODE_TABLE_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_ZIPCODE_TABLE_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ZIPCODE_TABLE_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para excluir a faixa de CEP ${TRAY_ZIPCODE_TABLE_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/shippings/method/zipcode_table/${TRAY_ZIPCODE_TABLE_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, { method: 'DELETE' });
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
