---
name: tray-referencia-api
description: Referência rápida de todos os endpoints da API da Tray, aceita nome do recurso como filtro
disable-model-invocation: true
---

# Referência Rápida — API Tray

Filtre por recurso usando o argumento: `/tray-api:referencia-api $ARGUMENTS`

Exemplo: `/tray-api:referencia-api produtos`

Documentação oficial: https://developers.tray.com.br

## Autenticação
- `POST /auth` — Gerar chaves de acesso
- `GET /auth?refresh_token=xxx` — Renovar token (expira em 3h)

## Produtos
- `GET /products` — Listar | `GET /products/:id` — Consultar
- `POST /products` — Criar | `PUT /products/:id` — Atualizar | `DELETE /products/:id` — Excluir

## Variações
- `GET /variants` — Listar | `GET /variants/:id` — Consultar
- `POST /variants` — Criar | `PUT /variants/:id` — Atualizar | `DELETE /variants/:id` — Excluir

## Imagens
- `POST /products/:id/images` — Imagem do produto
- `POST /variants/:id/images` — Imagem da variação
- `POST /images/remove` — Remover

## Categorias
- `GET /categories` — Árvore | `GET /categories/all` — Todas | `GET /categories/:id` — Por ID
- `POST /categories` — Criar | `PUT /categories/:id` — Atualizar | `DELETE /categories/:id` — Excluir

## Marcas
- `GET /products/brands` — Listar | `GET /products/brands/:id` — Consultar
- `POST /products/brands` — Criar | `PUT /products/brands/:id` — Atualizar | `DELETE /products/brands/:id` — Excluir
- ⚠️ `/brands` (sem prefixo) também retorna 200 mas é um alias não documentado oficialmente — use `/products/brands`

## Kits
- `GET /kits` — Listar | `GET /kits/:id` — Consultar
- `POST /kits` — Criar | `PUT /kits/:id` — Atualizar

## Características
- `GET /products/properties` — Listar características
- `POST /products/:id/properties` — Cadastrar/Atualizar no produto
- `POST /properties` — Criar característica global | `DELETE /properties/:id` — Excluir

## Pedidos
- `GET /orders` — Listar | `GET /orders/:id` — Consultar | `GET /orders/:id/full` — Completo
- `POST /orders` — Criar | `PUT /orders/:id` — Atualizar | `PUT /orders/:id/cancel` — Cancelar

## Status de Pedido
- `GET /orders/statuses` — Listar | `GET /orders/statuses/:id` — Consultar
- `POST /orders/statuses` — Criar | `PUT /orders/statuses/:id` — Atualizar | `DELETE /orders/statuses/:id` — Excluir

## Clientes
- `GET /customers` — Listar | `GET /customers/:id` — Consultar
- `POST /customers` — Criar | `PUT /customers/:id` — Atualizar | `DELETE /customers/:id` — Excluir

## Endereços de Cliente
- `GET /customers/:id/addresses` — Listar | `POST /customers/:id/addresses` — Criar
- `DELETE /customers/:id/addresses/:address_id` — Excluir

## Perfis de Cliente
- `GET /customers/profiles` — Listar | `POST /customers/profiles` — Criar
- `PUT /customers/profiles/:id` — Atualizar | `DELETE /customers/profiles/:id` — Excluir
- `POST /customers/profiles/relation` — Relacionar perfil a cliente | `POST /customers/profiles/relation_delete` — Remover relacionamento

## Frete
- `GET /shippings/cotation/` — Calcular frete (params obrigatórios: `zipcode`, `products[n][product_id]`, `products[n][price]`, `products[n][quantity]`)
- `GET /shippings/` — Listar formas de envio disponíveis

## Configuração de Frete
- `POST /shippings/method/gateway` — Criar forma de envio com integração externa | `PUT /shippings/method/gateway/:id` — Atualizar | `DELETE /shippings/method/gateway/:id` — Excluir
- `POST /shippings/method/zipcode_table` — Criar tabela de CEP | `PUT /shippings/method/zipcode_table/:id` — Atualizar | `DELETE /shippings/method/zipcode_table/:id` — Excluir

## MultiCD
- `GET /multicd/distribution-centers` — Listar CDs | `GET /multicd/distribution-centers/:id` — Consultar CD
- `POST /multicd/distribution-centers` — Criar | `PUT /multicd/distribution-centers/:id` — Atualizar | `DELETE /multicd/distribution-centers/:id` — Excluir
- `PUT /multicd/distribution-centers/:id/stock` — Atualizar estoque
- `GET /multicd/stock/detailed/product/:id` — Estoque de produto por CD | `GET /multicd/stock/detailed/variant/:id` — Estoque de variação por CD

## Notas Fiscais
- `GET /orders/invoices` — Listagem geral | `GET /orders/:id/invoices` — Por pedido
- `GET /orders/:order_id/invoices/:invoice_id` — Consultar NF por ID
- `POST /orders/:id/invoices` — Criar | `PUT /orders/:order_id/invoices/:invoice_id` — Atualizar

## Pagamentos
- `GET /payments` — Listar | `GET /payments/:id` — Consultar | `GET /payments/options` — Opções
- `POST /payments` — Criar | `PUT /payments/:id` — Atualizar | `DELETE /payments/:id` — Excluir

## Cupons
- `GET /discount_coupons` — Listar | `GET /discount_coupons/:id` — Consultar
- `POST /discount_coupons` — Criar | `PUT /discount_coupons/:id` — Atualizar | `DELETE /discount_coupons/:id` — Excluir
- `GET /discount_coupons/customer_relationship/:id` — Clientes do cupom
- `GET /discount_coupons/product_relationship/:id` — Produtos do cupom
- `GET /discount_coupons/category_relationship/:id` — Categorias do cupom
- `GET /discount_coupons/brand_relationship/:id` — Marcas do cupom
- `GET /discount_coupons/shipping_relationship/:id` — Fretes do cupom
- `POST /discount_coupons/create_relationship/:id` — Vincular clientes/produtos/categorias/marcas/fretes (tipo definido pelo body)

## Carrinho de Compras
- `GET /carts/:id` — Consultar | `GET /carts/:id/complete` — Completo | `GET /carts` — Listar
- `POST /carts` — Criar | `PUT /carts/:id` — Atualizar | `DELETE /carts/:id` — Excluir

## Lista de Preço B2B
- `GET /price-lists` — Listar | `POST /price-lists` — Criar
- `GET /price-lists/:id/values` — Valores | `POST /price-lists/:id/values` — Criar valor

## Informações da Loja
- `GET /store` — Consultar informações

## Outros
- `GET /products-sold` — Produtos vendidos
- `GET /newsletters` — Newsletter | `GET /partners` — Parceiros
- `GET /keywords` — Palavras-chave | `GET /users` — Usuários
- `GET /scripts` — Scripts externos

---

## URL Base e Versionamento

A API Tray **não usa versionamento por prefixo** (não existe `/v1/`, `/v2/`, etc.).

O endereço base é específico por loja e retornado no fluxo OAuth como `api_address`:

```
https://{api_address}/{endpoint}?access_token={token}
```

Exemplo real:
```
https://leandroteste.commercesuite.com.br/web_api/products?access_token=xxx
```

> O `api_address` é obtido no callback de autorização OAuth e é único por loja. Armazene-o junto ao `access_token`.

---

## Paginação

Todos os endpoints de listagem seguem o mesmo padrão:

**Query parameters:**

| Parâmetro | Tipo | Padrão | Máximo | Descrição |
|:--|:--|:--|:--|:--|
| `page` | integer | 1 | — | Número da página |
| `limit` | integer | 30 | **50** | Itens por página |

**Campos retornados no objeto `paging`:**

| Campo | Descrição |
|:--|:--|
| `total` | Total de registros na consulta |
| `page` | Página atual |
| `offset` | Índice do primeiro item da página |
| `limit` | Itens retornados nesta página |
| `maxLimit` | Máximo permitido (50) |

**Exemplo de resposta:**
```json
{
  "paging": {
    "total": 243,
    "page": 2,
    "offset": 30,
    "limit": 30,
    "maxLimit": 50
  }
}
```

**Iteração completa:**
```
page=1&limit=50 → page=2&limit=50 → ... até offset >= total
```

---

## Ambiente de Homologação

A API Tray **não possui sandbox separado**. Todos os testes ocorrem em lojas reais.

**Opções para desenvolvimento e testes:**

| Opção | Como obter | Uso recomendado |
|:--|:--|:--|
| Loja de testes própria | Criar conta gratuita em tray.com.br | Desenvolvimento e testes |
| Loja do cliente | Credenciais fornecidas pelo lojista | Produção |
| Loja de demonstração Tray | Solicitar ao suporte | Validações específicas |

**Boas práticas em testes:**
- Use uma loja de testes isolada — operações de criação e exclusão são reais
- Para testes de webhook, exponha o endpoint local via ferramenta como `ngrok`
- Anote os IDs criados durante testes para limpeza posterior
- Respeite os limites de rate limit mesmo em testes (180 req/min)
