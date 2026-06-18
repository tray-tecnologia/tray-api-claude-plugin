#!/usr/bin/env node
/**
 * Exemplo: Consultar informação adicional por ID via API Tray
 * Run: TRAY_ADDITIONAL_INFO_ID=45 node skills/informacoes-adicionais/examples/info-adicional-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-informacao-adicional-additional_info
 * Quando usar: obter os dados de uma informação adicional específica.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ADDITIONAL_INFO_ID no env.
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ADDITIONAL_INFO_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_ADDITIONAL_INFO_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ADDITIONAL_INFO_ID');
}

const url = new URL(`${TRAY_API_BASE}/additional-info/${TRAY_ADDITIONAL_INFO_ID}`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
