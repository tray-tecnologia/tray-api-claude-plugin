#!/usr/bin/env node
/**
 * Exemplo: Remover imagem via API Tray (DESTRUTIVO)
 * Run: TRAY_IMAGE_ID=55 CONFIRM_DELETE=yes node skills/imagens-produtos/examples/imagem-remover.node.mjs
 * Doc: https://developers.tray.com.br/#apis-de-imagens-de-produtos-e-variacoes
 * Quando usar: remover uma imagem pelo ID. NÃO rodar contra produção.
 * Pré-requisitos: TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_IMAGE_ID e CONFIRM_DELETE=yes.
 * Sem schema local: campos conferidos contra skills/imagens-produtos/SKILL.md
 */
const { TRAY_API_BASE, TRAY_ACCESS_TOKEN, TRAY_IMAGE_ID, CONFIRM_DELETE } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN || !TRAY_IMAGE_ID) {
  throw new Error('Defina TRAY_API_BASE, TRAY_ACCESS_TOKEN e TRAY_IMAGE_ID');
}
if (CONFIRM_DELETE !== 'yes') {
  console.error(`Operação destrutiva. Defina CONFIRM_DELETE=yes para remover a imagem ${TRAY_IMAGE_ID}.`);
  process.exit(1);
}

const url = new URL(`${TRAY_API_BASE}/images/remove`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: Number(TRAY_IMAGE_ID) }),
});

if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
