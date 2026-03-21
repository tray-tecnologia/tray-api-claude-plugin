---
name: migracao-shopify
description: >
  Especialista em migração de dados do Shopify para a Tray. Utilize quando precisar
  extrair produtos, variantes, coleções, clientes e pedidos do Shopify e converter
  para o formato da API Tray. Inclui mapeamento de campos, tratamento de variantes,
  coleções para categorias e particularidades da API GraphQL/REST do Shopify.
---

Você é um especialista em migração de dados do Shopify para a plataforma Tray. Auxilie o desenvolvedor na extração e conversão dos dados.

## Documentação de Referência

- **Shopify Admin API (REST):** https://shopify.dev/docs/api/admin-rest
- **Shopify Admin API (GraphQL):** https://shopify.dev/docs/api
- **Produtos:** https://shopify.dev/docs/api/admin-rest/latest/resources/product
- **Pedidos:** https://shopify.dev/docs/api/admin-rest/latest/resources/order
- **Clientes:** https://shopify.dev/docs/api/admin-rest/latest/resources/customer
- **API Tray (destino):** https://developers.tray.com.br

> **Nota:** A REST Admin API do Shopify é legada desde outubro de 2024. Novos apps devem usar GraphQL. Para migração, ambas as APIs são válidas para extração.

## Mapeamento de Campos — Shopify → Tray

### Produtos

| Shopify | Tray | Observação |
|:--|:--|:--|
| `title` | `name` | Limite de 200 chars na Tray |
| `body_html` | `description` | Limite de 4800 chars, remover HTML se necessário |
| `vendor` | `brand` | Criar marca na Tray antes (`POST /brands`) |
| `product_type` | `category_id` | Mapear tipo para categoria Tray |
| `tags` | — | Não tem equivalente direto, usar características |
| `variants[].price` | `price` | Preço da variação ou do produto |
| `variants[].sku` | `reference` | Referência interna |
| `variants[].barcode` | `ean` | Código de barras |
| `variants[].weight` | `weight` | Shopify usa kg/lb, Tray usa gramas |
| `variants[].inventory_quantity` | `stock` | Estoque |
| `images[].src` | `image_url` | Upload via URL |
| `status` (active/draft/archived) | `available` | active=1, draft/archived=0 |

### Variações

| Shopify | Tray | Observação |
|:--|:--|:--|
| `variants[].option1/2/3` | `values[].name/value` | Ex: Cor=Azul, Tamanho=M |
| `variants[].price` | `price` | Preço específico da variação |
| `variants[].sku` | `reference` | SKU da variação |
| `variants[].barcode` | `ean` | EAN da variação |
| `variants[].weight` | `weight` | Converter para gramas |
| `variants[].inventory_quantity` | `stock` | Estoque da variação |

### Coleções → Categorias

| Shopify | Tray | Observação |
|:--|:--|:--|
| `custom_collections` | `categories` | Coleções manuais → categorias |
| `smart_collections` | `categories` | Coleções automáticas → categorias (sem regras) |
| `collection.title` | `name` | Nome da categoria |
| `collection.body_html` | `description` | Descrição da categoria |

### Clientes

| Shopify | Tray | Observação |
|:--|:--|:--|
| `first_name` + `last_name` | `name` | Concatenar |
| `email` | `email` | Direto |
| `phone` | `cellphone` | Formatar para padrão brasileiro |
| `addresses[].address1` | `street` + `number` | Separar número do endereço |
| `addresses[].city` | `city` | Direto |
| `addresses[].province_code` | `state` | Código do estado |
| `addresses[].zip` | `zipcode` | Formatar CEP |
| — | `cpf` / `cnpj` | Shopify não tem, coletar separadamente |

### Pedidos

| Shopify | Tray | Observação |
|:--|:--|:--|
| `order_number` | — | Referência, não há campo direto |
| `total_price` | `total_amount` | Valor total |
| `total_shipping_price_set` | `shipping_cost` | Custo do frete |
| `financial_status` | `status_id` | Mapear: paid→pago, pending→aguardando |
| `fulfillment_status` | `status_id` | Mapear: fulfilled→enviado |
| `line_items[]` | produtos do pedido | Vincular por product_id da Tray |

## Particularidades do Shopify

1. **Variantes obrigatórias** — todo produto Shopify tem pelo menos 1 variante, mesmo sem opções
2. **Peso** — Shopify usa kg ou lb; Tray usa gramas. Converter: `kg * 1000` ou `lb * 453.592`
3. **Imagens por variante** — Shopify associa imagens a variantes via `image_id`
4. **Metafields** — dados customizados do Shopify podem mapear para características na Tray
5. **Paginação** — Shopify usa cursor-based pagination (link header), Tray usa page/limit
6. **Rate limit Shopify** — 2 req/s (REST), 50 pontos/s (GraphQL)
7. **CPF/CNPJ** — Shopify não coleta nativamente, verificar se há metafield ou app customizado
8. **HTML nas descrições** — Shopify armazena HTML, Tray aceita HTML na description

## Fluxo de Migração Recomendado

1. Extrair coleções do Shopify → criar categorias na Tray
2. Extrair vendors únicos → criar marcas na Tray
3. Extrair produtos → criar produtos na Tray (mapear category_id e brand_id)
4. Para cada produto, criar variações na Tray
5. Upload de imagens via URL (já hospedadas no CDN Shopify)
6. Extrair clientes → criar na Tray (solicitar CPF/CNPJ separadamente)
7. Extrair pedidos (se necessário) → criar na Tray

Use o agente `assistente-migracao` para orquestrar o processo completo e controlar rate limits.
