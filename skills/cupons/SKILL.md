---
name: tray-cupons
description: >
  API completa de cupons de desconto da Tray.
  Permite criar, editar, excluir e consultar cupons, além de
  gerenciar relacionamentos com clientes, produtos, categorias,
  marcas, fretes e cupons-presente. Contém 21 endpoints.
---

# Cupons de Desconto

API para gerenciamento completo de cupons de desconto na plataforma Tray.

Referência oficial: [https://developers.tray.com.br/#api-de-cupom](https://developers.tray.com.br/#api-de-cupom)

## Autenticacao

Todas as requisicoes utilizam query string para autenticacao:

```
?access_token={token}
```

## Paginacao

Endpoints de listagem suportam paginacao via query string:

- `limit` — maximo 50, padrao 30
- `page` — numero da pagina

## Endpoints

### CRUD de Cupons

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/coupons?access_token={token}` | Listar cupons |
| GET | `/coupons/{id}?access_token={token}` | Detalhes de um cupom |
| POST | `/coupons?access_token={token}` | Criar cupom |
| PUT | `/coupons/{id}?access_token={token}` | Atualizar cupom |
| DELETE | `/coupons?access_token={token}` | Excluir cupom (generico) |
| DELETE | `/coupons/{id}/products?access_token={token}` | Excluir cupom com produtos especificos |

### Consultas de Relacionamento

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/coupons/{id}/customers?access_token={token}` | Listar clientes do cupom |
| GET | `/coupons/{id}/products?access_token={token}` | Listar produtos do cupom |
| GET | `/coupons/{id}/categories?access_token={token}` | Listar categorias do cupom |
| GET | `/coupons/{id}/brands?access_token={token}` | Listar marcas do cupom |
| GET | `/coupons/{id}/shipping?access_token={token}` | Listar fretes do cupom |
| GET | `/coupons/{id}/gift_coupon?access_token={token}` | Consultar cupom-presente |

### Criacao de Relacionamentos

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/coupons/{id}/customers?access_token={token}` | Vincular cliente ao cupom |
| POST | `/coupons/{id}/products?access_token={token}` | Vincular produtos ao cupom |
| POST | `/coupons/{id}/categories?access_token={token}` | Vincular categorias ao cupom |
| POST | `/coupons/{id}/brands?access_token={token}` | Vincular marcas ao cupom |
| POST | `/coupons/{id}/free_shipping?access_token={token}` | Vincular frete gratis ao cupom |
| POST | `/coupons/{id}/shipping_discount?access_token={token}` | Vincular desconto de frete ao cupom |
| POST | `/coupons/{id}/exchange_coupon?access_token={token}` | Criar cupom de troca |
| POST | `/coupons/{id}/gift_coupon?access_token={token}` | Criar cupom-presente |
| DELETE | `/coupons/{id}/gift_coupon?access_token={token}` | Excluir cupom-presente |

## Campos Principais

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `code` | string | Codigo do cupom (unico) |
| `discount_type` | string | Tipo de desconto: `percent` (porcentagem) ou `fixed` (valor fixo) |
| `discount_value` | decimal | Valor do desconto |
| `start_date` | date | Data de inicio de validade |
| `end_date` | date | Data de fim de validade |
| `usage_limit` | integer | Limite de utilizacoes do cupom |
| `minimum_purchase` | decimal | Valor minimo de compra para aplicar o cupom |
| `active` | boolean | Indica se o cupom esta ativo |
| `cumulative` | boolean | Indica se o cupom e cumulativo com outros descontos |

## Exemplos

### Listar cupons

```http
GET /coupons?access_token={token}&limit=30&page=1
```

Resposta:

```json
{
  "paging": {
    "total": 85,
    "page": 1,
    "offset": 0,
    "limit": 30,
    "maxLimit": 50
  },
  "Coupons": [
    {
      "Coupon": {
        "id": "123",
        "code": "VERAO2026",
        "discount_type": "percent",
        "discount_value": "15.00",
        "start_date": "2026-01-01",
        "end_date": "2026-03-31",
        "usage_limit": "500",
        "minimum_purchase": "100.00",
        "active": "1",
        "cumulative": "0"
      }
    }
  ]
}
```

### Criar cupom

```http
POST /coupons?access_token={token}
Content-Type: application/json

{
  "code": "PROMO10",
  "discount_type": "percent",
  "discount_value": 10,
  "start_date": "2026-04-01",
  "end_date": "2026-04-30",
  "usage_limit": 200,
  "minimum_purchase": 50.00,
  "active": 1,
  "cumulative": 0
}
```

### Atualizar cupom

```http
PUT /coupons/123?access_token={token}
Content-Type: application/json

{
  "discount_value": 20,
  "end_date": "2026-06-30"
}
```

### Vincular produtos ao cupom

```http
POST /coupons/123/products?access_token={token}
Content-Type: application/json

{
  "product_id": [456, 789, 1011]
}
```

### Vincular categorias ao cupom

```http
POST /coupons/123/categories?access_token={token}
Content-Type: application/json

{
  "category_id": [10, 20]
}
```

### Criar cupom-presente

```http
POST /coupons/123/gift_coupon?access_token={token}
Content-Type: application/json

{
  "gift_value": 50.00,
  "recipient_email": "cliente@email.com"
}
```

### Excluir cupom-presente

```http
DELETE /coupons/123/gift_coupon?access_token={token}
```

## Boas Praticas

- Sempre valide as datas de inicio e fim antes de criar um cupom. A `start_date` deve ser anterior a `end_date`.
- Utilize `discount_type` corretamente: `percent` para descontos percentuais e `fixed` para valores absolutos.
- Defina `usage_limit` para evitar uso excessivo de cupons promocionais.
- Ao vincular produtos, categorias ou marcas, envie os IDs em lote para reduzir o numero de requisicoes.
- Cupons cumulativos (`cumulative: true`) devem ser usados com cautela para nao comprometer a margem de lucro.
- Utilize os endpoints de consulta de relacionamento (GET customers, GET products, etc.) para auditar quais entidades estao vinculadas ao cupom.
- Ao excluir um cupom, verifique se nao existem pedidos pendentes que utilizam o codigo.
- Respeite o limite de paginacao (maximo 50 registros por pagina) ao listar cupons.
- Para cupons-presente, sempre valide o e-mail do destinatario antes do envio.
