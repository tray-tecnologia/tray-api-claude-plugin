#!/usr/bin/env node
/**
 * Exemplo: Consultar etiquetas do HUB via API Tray
 * Run: TRAY_ORDER_ID=12345 node skills/etiquetas-hub/examples/etiqueta-hub-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-etiquetas-do-hub
 * Quando usar: buscar etiquetas geradas de um pedido. Não usar para ML nem emissores externos.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID no env.
 * Sem schema local: campos conferidos contra skills/etiquetas-hub/SKILL.md
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_ORDER_ID } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_ORDER_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_ORDER_ID');
}

const url = new URL(`${TRAY_API_BASE}/labels`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);
url.searchParams.set('order_id', TRAY_ORDER_ID);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
