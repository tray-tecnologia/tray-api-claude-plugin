---
name: tray-produtos-vendidos
description: >
  API de Produtos Vendidos da Tray. Utilize quando o desenvolvedor
  precisar consultar o histórico de vendas e analytics de produtos vendidos
  na loja. API somente leitura com filtros de data.
---

# API de Produtos Vendidos — Tray

Documentação oficial: https://developers.tray.com.br/#apis-de-produtos-vendidos

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/products-sold` | Listagem de produtos vendidos |

**Autenticação:** `?access_token={token}`

**Somente leitura** — esta API não permite criação, atualização ou exclusão.

## Filtros

| Parâmetro | Descrição |
|:--|:--|
| `created` | Filtrar por data de venda |
| `product_id` | Filtrar por produto |

## Paginação

`limit` (máximo 50, padrão 30), `page`.

## Uso

Ideal para relatórios de vendas, analytics e dashboards. Consulte periodicamente para manter dados atualizados.
