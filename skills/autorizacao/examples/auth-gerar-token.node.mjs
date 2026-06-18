#!/usr/bin/env node
/**
 * Exemplo: Gerar tokens de acesso (etapa 3 do OAuth Tray)
 * Run: node skills/autorizacao/examples/auth-gerar-token.node.mjs
 * Doc: https://developers.tray.com.br/#autorizacao
 * Quando usar: trocar o `code` do callback por access_token + refresh_token.
 *   NÃO usar para renovar token expirado — use auth-renovar-token.
 * Pré-requisitos: TRAY_API_BASE, TRAY_CONSUMER_KEY, TRAY_CONSUMER_SECRET, TRAY_AUTH_CODE.
 * Segredos vêm sempre do ambiente — nunca hardcode no arquivo.
 */
const { TRAY_API_BASE, TRAY_CONSUMER_KEY, TRAY_CONSUMER_SECRET, TRAY_AUTH_CODE } = process.env;
if (!TRAY_API_BASE || !TRAY_CONSUMER_KEY || !TRAY_CONSUMER_SECRET || !TRAY_AUTH_CODE) {
  throw new Error('Defina TRAY_API_BASE, TRAY_CONSUMER_KEY, TRAY_CONSUMER_SECRET e TRAY_AUTH_CODE');
}

const res = await fetch(`${TRAY_API_BASE}/auth`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    consumer_key: TRAY_CONSUMER_KEY,
    consumer_secret: TRAY_CONSUMER_SECRET,
    code: TRAY_AUTH_CODE,
  }),
});

if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
