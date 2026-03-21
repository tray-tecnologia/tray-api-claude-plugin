---
name: tray-webhooks
description: >
  Sistema de Notificação (Webhook) da Tray. Utilize quando o desenvolvedor
  precisar implementar notificações em tempo real para alterações em produtos,
  pedidos, clientes, variações e configurações da loja. Inclui todos os escopos
  suportados, formato de payload, lógica de retry e boas práticas de implementação.
---

# Sistema de Notificação (Webhook) — API Tray

Documentação oficial: https://developers.tray.com.br/#apis-de-sistema-de-notificacao-webhook

## Ativação

Os webhooks devem ser ativados via **ticket de suporte da Tray**, informando a URL do endpoint receptor do seu aplicativo.

## Escopos Suportados

| Escopo | Ações | Descrição |
|:--|:--|:--|
| `product` | insert, update, delete | Criação, atualização ou exclusão de produto |
| `product_price` | update | Alteração de preço de produto |
| `product_stock` | update | Alteração de estoque de produto |
| `variant` | insert, update, delete | Criação, atualização ou exclusão de variação |
| `variant_price` | update | Alteração de preço de variação |
| `variant_stock` | update | Alteração de estoque de variação |
| `order` | insert, update | Criação ou atualização de pedido |
| `customer` | insert, update, delete | Criação, atualização ou exclusão de cliente |
| `store_config` | update | Alteração de configuração da loja |

## Formato do Payload

O webhook envia um POST com `Content-Type: application/x-www-form-urlencoded`:

| Campo | Tipo | Descrição |
|:--|:--|:--|
| `seller_id` | integer | ID da loja que disparou o evento |
| `scope_id` | integer | ID do recurso afetado (ex: ID do produto) |
| `scope_name` | string | Nome do escopo (ex: `product`, `order`) |
| `act` | string | Ação realizada: `insert`, `update` ou `delete` |

**Exemplo de payload:**

```
seller_id=123456&scope_id=789&scope_name=product&act=update
```

## Lógica de Retry

- Se o endpoint retornar **qualquer código diferente de 200**, a Tray reenvia a notificação
- O reenvio segue **backoff progressivo** (intervalos crescentes entre tentativas)
- A Tray mantém as notificações por até **20 dias** após a desinstalação do app

## Webhook com MultiCD

Quando o MultiCD está ativo na loja, os webhooks de `product_stock` e `variant_stock` são disparados para alterações de estoque em qualquer centro de distribuição.

## Boas Práticas

1. **Responda rápido** — retorne HTTP 200 imediatamente, antes de processar o evento
2. **Processamento assíncrono** — coloque o evento em uma fila e processe em background
3. **Idempotência** — trate notificações duplicadas (o mesmo evento pode chegar mais de uma vez)
4. **Validação** — valide o `seller_id` para confirmar que o evento pertence à loja esperada
5. **Consulta complementar** — após receber o webhook, consulte a API para obter dados atualizados do recurso
6. **Logs** — registre todos os webhooks recebidos para debug e auditoria

## Exemplo de Endpoint Receptor

Ao receber um webhook, seu endpoint deve:

1. Responder HTTP 200 imediatamente
2. Extrair `scope_name`, `scope_id` e `act` do payload
3. Se necessário, consultar a API Tray para obter dados completos
4. Processar a alteração na sua aplicação
