---
description: Referência rápida de todos os endpoints da API da Tray, aceita nome do recurso como filtro
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
- `GET /brands` — Listar | `GET /brands/:id` — Consultar
- `POST /brands` — Criar | `PUT /brands/:id` — Atualizar | `DELETE /brands/:id` — Excluir

## Kits
- `GET /kits` — Listar | `GET /kits/:id` — Consultar
- `POST /kits` — Criar | `PUT /kits/:id` — Atualizar

## Características
- `GET /products/:id/characteristics` — Consultar
- `POST /products/:id/characteristics` — Cadastrar/Atualizar
- `POST /characteristics` — Criar global | `DELETE /characteristics/:id` — Excluir

## Pedidos
- `GET /orders` — Listar | `GET /orders/:id` — Consultar | `GET /orders/:id/full` — Completo
- `POST /orders` — Criar | `PUT /orders/:id` — Atualizar | `PUT /orders/:id/cancel` — Cancelar

## Status de Pedido
- `GET /order-statuses` — Listar | `GET /order-statuses/:id` — Consultar
- `POST /order-statuses` — Criar | `PUT /order-statuses/:id` — Atualizar | `DELETE /order-statuses/:id` — Excluir

## Clientes
- `GET /customers` — Listar | `GET /customers/:id` — Consultar
- `POST /customers` — Criar | `PUT /customers/:id` — Atualizar | `DELETE /customers/:id` — Excluir

## Endereços de Cliente
- `GET /customers/:id/addresses` — Listar | `POST /customers/:id/addresses` — Criar
- `DELETE /customers/:id/addresses/:address_id` — Excluir

## Perfis de Cliente
- `GET /customers/:id/profiles` — Consultar | `POST /customers/:id/profiles` — Criar
- `PUT /customers/:id/profiles/:pid` — Atualizar | `DELETE /customers/:id/profiles/:pid` — Excluir

## Frete
- `GET /shipping/calculate` — Calcular frete
- `GET /shipping/methods` — Formas de envio

## Configuração de Frete
- `POST /shipping/methods` — Criar forma de envio | `PUT /shipping/methods/:id` — Atualizar | `DELETE /shipping/methods/:id` — Excluir
- `POST /shipping/zip-tables` — Criar tabela CEP | `PUT /shipping/zip-tables/:id` — Atualizar | `DELETE /shipping/zip-tables/:id` — Excluir

## MultiCD
- `GET /multicd/distribution-centers` — Listar CDs
- `POST /multicd/distribution-centers` — Criar | `PUT /multicd/distribution-centers/:id` — Atualizar
- `PUT /multicd/distribution-centers/:id/stock` — Atualizar estoque

## Notas Fiscais
- `GET /invoices` — Listar | `GET /invoices/:id` — Por ID | `GET /invoices/order/:oid` — Por pedido
- `POST /invoices` — Criar | `PUT /invoices/:id` — Atualizar

## Pagamentos
- `GET /payments` — Listar | `GET /payments/:id` — Consultar | `GET /payments/options` — Opções
- `POST /payments` — Criar | `PUT /payments/:id` — Atualizar | `DELETE /payments/:id` — Excluir

## Cupons
- `GET /coupons` — Listar | `GET /coupons/:id` — Consultar
- `POST /coupons` — Criar | `PUT /coupons/:id` — Atualizar | `DELETE /coupons/:id` — Excluir

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
