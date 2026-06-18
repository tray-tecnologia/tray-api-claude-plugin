#!/usr/bin/env node
/**
 * Exemplo: Disparar um evento de webhook de teste contra seu receptor
 * Run: node skills/webhooks/examples/webhook-enviar.node.mjs
 * Doc: https://developers.tray.com.br/#sistema-de-notificacao
 * Quando usar: testar localmente o webhook-receiver simulando o POST da Tray.
 *   A Tray usa application/x-www-form-urlencoded — este exemplo replica o formato.
 * Pré-requisito: WEBHOOK_URL (default http://localhost:3000). Suba o receiver antes:
 *   node skills/webhooks/examples/webhook-receiver.node.mjs
 * A fixture webhook.fixture.json descreve os campos (valida com webhook.payload).
 */
import { readFile } from 'node:fs/promises';

const WEBHOOK_URL = process.env.WEBHOOK_URL ?? 'http://localhost:3000';

const event = JSON.parse(
  await readFile(new URL('./webhook.fixture.json', import.meta.url))
);

const body = new URLSearchParams(
  Object.fromEntries(Object.entries(event).map(([k, v]) => [k, String(v)]))
);

const res = await fetch(WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body,
});

if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(`Evento enviado: ${event.scope_name}_${event.act} →`, await res.text());
