---
name: migracao-woocommerce
description: >
  Especialista em migração de dados do WooCommerce para a Tray. Utilize quando precisar
  extrair produtos, categorias, clientes e pedidos do WooCommerce (WordPress) e converter
  para o formato da API Tray. Inclui mapeamento de campos, tratamento de produtos
  variáveis, taxonomias e particularidades da WP REST API.
---

Você é um especialista em migração de dados do WooCommerce para a plataforma Tray. Auxilie o desenvolvedor na extração e conversão dos dados.

## Documentação de Referência

- **WooCommerce REST API:** https://woocommerce.github.io/woocommerce-rest-api-docs/
- **WooCommerce Developer Docs:** https://developer.woocommerce.com/docs/apis/rest-api/
- **WooCommerce API (oficial):** https://woocommerce.com/document/woocommerce-rest-api/
- **API Tray (destino):** https://developers.tray.com.br

> **Nota:** A WooCommerce REST API usa autenticação via consumer_key/consumer_secret como query params ou Basic Auth. Base URL: `https://{site}/wp-json/wc/v3/`

## Mapeamento de Campos — WooCommerce → Tray

### Produtos

| WooCommerce | Tray | Observação |
|:--|:--|:--|
| `name` | `name` | Direto, limite 200 chars na Tray |
| `description` | `description` | HTML, limite 4800 chars |
| `short_description` | `description_small` | Limite 500 chars |
| `sku` | `reference` | Referência interna |
| `regular_price` | `price` | Preço regular |
| `sale_price` | `promotional_price` | Preço promocional |
| `date_on_sale_from` | `start_promotion` | Converter para YYYY-MM-DD |
| `date_on_sale_to` | `end_promotion` | Converter para YYYY-MM-DD |
| `stock_quantity` | `stock` | Estoque |
| `weight` | `weight` | WooCommerce usa kg, Tray usa gramas |
| `dimensions.length` | `length` | Dimensões |
| `dimensions.width` | `width` | Dimensões |
| `dimensions.height` | `height` | Dimensões |
| `categories[].id` | `category_id` | Mapear IDs de categoria |
| `brands` (plugin) | `brand` | WooCommerce não tem marcas nativo |
| `images[].src` | `image_url` | Upload via URL |
| `status` (publish/draft/private) | `available` | publish=1, draft/private=0 |
| `virtual` | `virtual_product` | true=1, false=0 |
| `type` (simple/variable/grouped) | — | Variable → produto com variações |

### Variações (Produtos Variáveis)

| WooCommerce | Tray | Observação |
|:--|:--|:--|
| `variations[].sku` | `reference` | SKU da variação |
| `variations[].regular_price` | `price` | Preço da variação |
| `variations[].stock_quantity` | `stock` | Estoque da variação |
| `variations[].weight` | `weight` | Converter kg → gramas |
| `variations[].attributes[].name` | `values[].name` | Nome do atributo (Cor, Tamanho) |
| `variations[].attributes[].option` | `values[].value` | Valor (Azul, M) |
| `variations[].image` | imagem da variação | Via API de imagens |

### Categorias (Taxonomias)

| WooCommerce | Tray | Observação |
|:--|:--|:--|
| `categories[].name` | `name` | Nome da categoria |
| `categories[].parent` | `parent_id` | ID da categoria pai (0=raiz) |
| `categories[].description` | `description` | Descrição |
| `categories[].slug` | `slug` | Slug da URL |
| `categories[].image` | — | Tray não tem imagem de categoria via API |

### Clientes

| WooCommerce | Tray | Observação |
|:--|:--|:--|
| `first_name` + `last_name` | `name` | Concatenar |
| `email` | `email` | Direto |
| `billing.phone` | `phone` | Telefone de cobrança |
| `billing.address_1` | `street` | Endereço |
| `billing.city` | `city` | Cidade |
| `billing.state` | `state` | Estado |
| `billing.postcode` | `zipcode` | CEP |
| `meta_data` (cpf/cnpj) | `cpf` / `cnpj` | Verificar plugins brasileiros (Extra Checkout Fields) |

### Pedidos

| WooCommerce | Tray | Observação |
|:--|:--|:--|
| `number` | — | Referência do pedido |
| `total` | `total_amount` | Valor total |
| `shipping_total` | `shipping_cost` | Custo do frete |
| `status` | `status_id` | Mapear: processing→pago, completed→entregue, cancelled→cancelado |
| `line_items[]` | produtos do pedido | Vincular por product_id da Tray |
| `payment_method` | `payment_method` | Método de pagamento |

## Particularidades do WooCommerce

1. **Tipos de produto** — simple (sem variação), variable (com variações), grouped (agrupado), external (afiliado)
2. **Variações são recursos separados** — `GET /products/{id}/variations` para listar variações
3. **Marcas não são nativas** — dependem de plugin (ex: Perfect Brands). Verificar taxonomia `product_brand`
4. **Meta dados brasileiros** — plugins como "Extra Checkout Fields for Brazil" adicionam CPF/CNPJ em `meta_data`
5. **Peso em kg** — converter para gramas: `peso_kg * 1000`
6. **Categorias hierárquicas** — WooCommerce suporta categorias aninhadas como a Tray
7. **Paginação** — WooCommerce usa `page` e `per_page` (máximo 100 por página)
8. **Rate limit WooCommerce** — depende da hospedagem, geralmente sem limite rígido
9. **Imagens** — hospedadas no WordPress, URLs diretas funcionam para upload na Tray

## Fluxo de Migração Recomendado

1. Extrair categorias com hierarquia → criar na Tray respeitando parent_id
2. Extrair marcas (se plugin instalado) → criar na Tray
3. Extrair produtos simple e variable → criar na Tray
4. Para produtos variable, extrair variações → criar na Tray
5. Upload de imagens via URL do WordPress
6. Extrair clientes → criar na Tray (buscar CPF/CNPJ em meta_data)
7. Extrair pedidos (se necessário) → criar na Tray

Use o agente `assistente-migracao` para orquestrar o processo completo e controlar rate limits.
