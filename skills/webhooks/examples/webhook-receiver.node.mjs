#!/usr/bin/env node
/**
 * Exemplo: Endpoint receptor de webhooks da Tray
 * Run: node skills/webhooks/examples/webhook-receiver.node.mjs
 * Doc: https://developers.tray.com.br/#sistema-de-notificacao
 * Quando usar: receber as notificações que a Tray dispara (insert/update/delete).
 *   A Tray envia POST com Content-Type application/x-www-form-urlencoded — sempre.
 * Boas práticas demonstradas: responder HTTP 200 imediatamente e rotear por
 *   `scope_name + "_" + act`. Em produção, processe em fila (assíncrono) e trate
 *   idempotência (o mesmo evento pode chegar mais de uma vez).
 * Pré-requisito: nenhuma credencial (é um listener). Porta via WEBHOOK_PORT (default 3000).
 */
import { createServer } from 'node:http';

const PORT = Number(process.env.WEBHOOK_PORT ?? 3000);

const server = createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405).end('Method Not Allowed');
    return;
  }

  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    // Responde 200 antes de processar — evita retry da Tray por timeout.
    res.writeHead(200, { 'Content-Type': 'text/plain' }).end('OK');

    const params = new URLSearchParams(body);
    const event = {
      seller_id: params.get('seller_id'),
      scope_id: params.get('scope_id'),
      scope_name: params.get('scope_name'),
      act: params.get('act'),
    };

    switch (`${event.scope_name}_${event.act}`) {
      case 'order_insert':
      case 'order_update':
        console.log(`[pedido ${event.scope_id}] ${event.act} da loja ${event.seller_id}`);
        break;
      case 'product_update':
        console.log(`[produto ${event.scope_id}] atualizado`);
        break;
      case 'customer_delete':
        console.log(`[cliente ${event.scope_id}] removido`);
        break;
      default:
        console.log(`[evento não roteado] ${event.scope_name}_${event.act}`, event);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Webhook receiver ouvindo em http://localhost:${PORT} (POST x-www-form-urlencoded)`);
});
