---
name: tray-listas-preco-b2b
description: >
  API de Lista de Preço B2B da Tray. Utilize quando o desenvolvedor
  precisar gerenciar tabelas de preço diferenciadas para clientes B2B e atacado,
  incluindo criação de listas, gestão de valores por produto/variação.
---

# API de Lista de Preço B2B — Tray

Documentação oficial: https://developers.tray.com.br/#api-de-lista-de-preco-b2b

## Endpoints de Listas de Preço

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/price-lists` | Listar todas as listas de preço |
| GET | `/price-lists/:id` | Retorna uma lista de preço |
| POST | `/price-lists` | Criar lista de preço |
| PUT | `/price-lists/:id` | Atualizar lista de preço |
| DELETE | `/price-lists/:id` | Excluir lista de preço |

## Endpoints de Valores

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/price-lists/:id/values` | Listar valores de uma lista |
| GET | `/price-lists/:id/values/:value_id` | Retorna um valor |
| POST | `/price-lists/:id/values` | Criar valor na lista |
| PUT | `/price-lists/:id/values/:value_id` | Atualizar valor |
| DELETE | `/price-lists/:id/values/:value_id` | Excluir valor |

**Autenticação:** `?access_token={token}`

## Campos da Lista de Preço

| Campo | Tipo | Descrição |
|:--|:--|:--|
| `name` | string | Nome da lista de preço |
| `description` | string | Descrição |
| `active` | boolean | Se a lista está ativa |
| `customer_group_id` | number | ID do grupo de clientes associado |

## Campos do Valor

| Campo | Tipo | Descrição |
|:--|:--|:--|
| `product_id` | number | ID do produto |
| `variant_id` | number | ID da variação (opcional) |
| `price` | decimal | Preço diferenciado |
| `cost_price` | decimal | Preço de custo |
| `active` | boolean | Se o valor está ativo |

## Exemplo de Criação

```json
{
  "PriceList": {
    "name": "Atacado Premium",
    "description": "Preços para clientes atacadistas",
    "active": 1
  }
}
```

## Exemplo de Valor

```json
{
  "PriceListValue": {
    "product_id": 123,
    "price": "79.90",
    "active": 1
  }
}
```

## Paginação

`limit` (máximo 50, padrão 30), `page`.
