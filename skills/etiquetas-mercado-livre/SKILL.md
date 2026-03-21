---
name: tray-etiquetas-mercado-livre
description: >
  API de Etiquetas do Mercado Livre da Tray. Utilize quando o desenvolvedor
  precisar consultar etiquetas de envio geradas pelo Mercado Livre para pedidos
  originados neste marketplace.
---

# API de Etiquetas do Mercado Livre — Tray

Documentação oficial: https://developers.tray.com.br/#api-de-etiqueta-do-mercado-livre

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/mercado-livre/labels` | Consultar etiquetas do Mercado Livre |

**Autenticação:** `?access_token={token}`

## Uso

Este endpoint permite consultar as etiquetas de envio geradas automaticamente pelo Mercado Livre para pedidos originados neste marketplace e integrados à loja Tray.

## Exemplo

```http
GET /mercado-livre/labels?access_token={token}
```

## Observação

Somente leitura. As etiquetas são geradas pelo Mercado Livre e não podem ser criadas via API Tray.
