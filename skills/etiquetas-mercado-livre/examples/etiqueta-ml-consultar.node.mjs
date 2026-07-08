#!/usr/bin/env node
/**
 * Exemplo: Consultar etiquetas do Mercado Livre via API Tray
 * Run: node skills/etiquetas-mercado-livre/examples/etiqueta-ml-consultar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-etiqueta-do-mercado-livre
 * Quando usar: buscar etiquetas geradas pelo ML. Somente leitura — não criáveis via API Tray.
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 * Sem schema local: campos conferidos contra skills/etiquetas-mercado-livre/SKILL.md
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const url = new URL(`${TRAY_API_BASE}/mercado-livre/labels`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url);
if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
