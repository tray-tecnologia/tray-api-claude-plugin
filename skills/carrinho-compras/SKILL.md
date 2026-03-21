---
name: tray-carrinho-compras
description: >
  API de carrinho de compras da Tray.
  Permite criar, consultar, atualizar e excluir carrinhos,
  incluindo suporte a kits de produtos. Contém 6 endpoints.
---

# Carrinho de Compras

API para gerenciamento de carrinhos de compras na plataforma Tray.

Referência oficial: [https://developers.tray.com.br/#apis-de-carrinho-de-compra](https://developers.tray.com.br/#apis-de-carrinho-de-compra)

## Autenticacao

Todas as requisicoes utilizam query string para autenticacao:

```
?access_token={token}
```

## Endpoints

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/carts/{session_id}?access_token={token}` | Obter dados do carrinho |
| GET | `/carts/{session_id}/complete?access_token={token}` | Obter dados completos do carrinho |
| POST | `/carts?access_token={token}` | Criar carrinho |
| POST | `/carts/kit?access_token={token}` | Criar carrinho com kit de produtos |
| PUT | `/carts/{session_id}?access_token={token}` | Atualizar carrinho |
| DELETE | `/carts/{session_id}?access_token={token}` | Excluir carrinho |

## Campos Principais

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `customer_id` | integer | ID do cliente associado ao carrinho |
| `product_id` | integer | ID do produto |
| `variant_id` | integer | ID da variacao do produto |
| `quantity` | integer | Quantidade do item |
| `session_id` | string | Identificador da sessao do carrinho |
| `total` | decimal | Valor total do carrinho |
| `subtotal` | decimal | Subtotal do carrinho (sem frete e descontos) |
| `shipping_cost` | decimal | Custo do frete |
| `coupon_code` | string | Codigo do cupom de desconto aplicado |

## Exemplos

### Obter dados do carrinho

```http
GET /carts/abc123session?access_token={token}
```

Resposta:

```json
{
  "Cart": {
    "session_id": "abc123session",
    "customer_id": "456",
    "subtotal": "250.00",
    "shipping_cost": "15.00",
    "total": "265.00",
    "coupon_code": "",
    "Products": [
      {
        "product_id": "789",
        "variant_id": "101",
        "quantity": "2",
        "price": "125.00"
      }
    ]
  }
}
```

### Criar carrinho

```http
POST /carts?access_token={token}
Content-Type: application/json

{
  "Cart": {
    "customer_id": 456,
    "product_id": 789,
    "variant_id": 101,
    "quantity": 2
  }
}
```

### Criar carrinho com kit

```http
POST /carts/kit?access_token={token}
Content-Type: application/json

{
  "Cart": {
    "customer_id": 456,
    "kit_id": 10,
    "products": [
      {"product_id": 789, "variant_id": 101, "quantity": 1},
      {"product_id": 790, "variant_id": 102, "quantity": 1}
    ]
  }
}
```

### Atualizar carrinho

```http
PUT /carts/abc123session?access_token={token}
Content-Type: application/json

{
  "Cart": {
    "product_id": 789,
    "variant_id": 101,
    "quantity": 5
  }
}
```

### Excluir carrinho

```http
DELETE /carts/abc123session?access_token={token}
```

## Boas Praticas

- Utilize o endpoint `/carts/{session_id}/complete` quando precisar de todas as informacoes do carrinho, incluindo detalhes de produtos e frete.
- O `session_id` e o identificador unico do carrinho — armazene-o de forma segura na sessao do usuario.
- Ao criar carrinhos com kit, certifique-se de que todos os produtos do kit estao disponiveis em estoque.
- Antes de aplicar um cupom via `coupon_code`, valide se o cupom existe e esta ativo utilizando a API de cupons.
- Ao atualizar quantidades, verifique o estoque disponivel para evitar erros.
- Exclua carrinhos abandonados periodicamente para manter a base limpa.
