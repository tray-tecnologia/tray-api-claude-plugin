---
name: tray-listagem-carrinho
description: >
  Nova API de Listagem de Carrinho da Tray. Utilize quando o desenvolvedor
  precisar listar todos os carrinhos de compra da loja com paginação. Endpoint
  separado da API principal de carrinho.
---

# Nova API de Listagem de Carrinho — Tray

Documentação oficial: https://developers.tray.com.br/#novo-api-de-listagem-de-carrinho

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/carts` | Listagem de todos os carrinhos com paginação |

**Autenticação:** `?access_token={token}`

## Paginação

| Parâmetro | Descrição |
|:--|:--|
| `limit` | Itens por página (máximo **50**, padrão **30**) |
| `page` | Número da página |

## Exemplo

```http
GET /carts?access_token={token}&limit=30&page=1
```

## Observação

Este endpoint é **separado** da API principal de Carrinho de Compras. Use-o para listar todos os carrinhos da loja. Para operações individuais (consultar, criar, atualizar, excluir), consulte o skill `tray-carrinho-compras`.
