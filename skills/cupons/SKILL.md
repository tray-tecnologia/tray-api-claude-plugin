---
name: tray-cupons
description: >
  API completa de cupons de desconto da Tray (recurso `discount_coupons`).
  Cobre criar, editar, listar, consultar e excluir cupons (CRUD) e gerenciar
  os relacionamentos do cupom com clientes, produtos, categorias, marcas,
  fretes e cupom-presente, além da geração de cupom de troca a partir de um
  pedido. Total de 21 endpoints. DISAMBIGUATION: o endpoint base é
  `/discount_coupons` (NÃO `/coupons`) e o wrapper de payload/resposta é
  `DiscountCoupon` (NÃO `Coupon`). Cupom é desconto por CÓDIGO aplicado no
  checkout — não confundir com preço permanente por grupo de cliente
  (lista de preço B2B).
when_to_use: >
  Use quando o desenvolvedor mencionar: cupom, cupom de desconto, código
  promocional, código de desconto, coupon, discount_coupons, GET/POST/PUT/DELETE
  /discount_coupons, cupom por cliente, cupom por produto, cupom por categoria,
  cupom por marca, cupom de frete grátis, desconto no frete, cupom-presente,
  cupom de troca, percentual de desconto (%) ou valor fixo de desconto ($),
  limite de uso de cupom, faixa de pedido para desconto, ou os endpoints de
  relacionamento (customer_relationship, product_relationship,
  category_relationship, brand_relationship, shipping_relationship,
  gift_relationship, create_relationship).
when_not_to_use: >
  Não use para preços B2B permanentes por grupo de cliente — isso é
  precificação fixa, não desconto por código (use tray-listas-preco-b2b).
  Não use para configurar formas/tabelas de frete da loja (use
  tray-configuracao-frete) nem para cotação de frete (use tray-frete);
  cupons apenas aplicam desconto/frete grátis sobre métodos já existentes.
  Para preço promocional direto no produto (promotional_price), use
  tray-produtos, não cupom.
---

## MANDATORY: Tool Calls Required Before Answering

> **Estas chamadas são OBRIGATÓRIAS, não opcionais.** Execute-as antes de gerar
> qualquer código ou payload. Se você está respondendo sem ter chamado a
> ferramenta abaixo, **pare e chame agora**.

### 1. Buscar documentação atualizada (sempre)

```bash
node skills/tray-dev/scripts/search_docs.mjs --topic=cupons "<termo da pergunta>"
```

- `<TOPIC_SLUG>`: ver tabela em `skills/tray-dev/SKILL.md`.
- Use os trechos retornados como fonte primária; este SKILL.md é resumo denso.

### 2. Revisar campos (este recurso ainda NÃO tem `validate.mjs`)

> **Nota:** o recurso `cupons` ainda não possui `scripts/validate.mjs` local.
> A chamada **OBRIGATÓRIA** a `search_docs.mjs` acima continua valendo. Como não
> há validador automático, **você é responsável** por revisar manualmente cada
> campo obrigatório (`code`, `value`, `type`) contra a doc retornada por
> `search_docs.mjs` e contra os schemas de referência em
> `skills/cupons/schemas/` antes de retornar qualquer código. Confira em
> especial: chave de recurso `DiscountCoupon` presente no body, `code` sem
> espaços nem acentos, `type` em `$`/`%`, e coerência entre
> `usage_counter_limit` e `usage_counter_limit_customer`.

## Antes de responder

> Execute estas verificações antes de gerar qualquer payload ou código:

1. Confirme o método HTTP e o endpoint correto para a operação solicitada
   (CRUD em `/discount_coupons`, consulta de relacionamento em
   `/discount_coupons/<tipo>_relationship/:id`, ou criação de vínculo em
   `/discount_coupons/create_relationship/:id`).
2. Identifique os campos obrigatórios listados neste documento — `code`,
   `value` e `type` nunca podem faltar na criação; não omita nenhum.
3. Verifique que `access_token` não aparece como literal string no código
   gerado — use sempre `TRAY_ACCESS_TOKEN` e `TRAY_API_ADDRESS` por variável
   de ambiente.
4. Confirme que esta é a skill correta para o recurso: cupom é desconto por
   código no checkout; se for preço permanente por grupo, leia `when_not_to_use`
   e redirecione para `tray-listas-preco-b2b`.

# Cupons de Desconto — API Tray

Documentação oficial: https://developers.tray.com.br/#api-de-cupom

> **Atenção (disambiguation):** o endpoint base é `/discount_coupons` (não
> `/coupons`) e o wrapper de payload/resposta é `DiscountCoupon` (não `Coupon`).
> Trocar o wrapper ou o caminho é a causa #1 de `HTTP 400`/`404` neste recurso.

## Visão geral

Um cupom de desconto (`discount_coupon`) é um código textual que o cliente
digita no checkout para obter uma vantagem: desconto percentual (`type=%`),
desconto em valor fixo em reais (`type=$`), frete grátis/desconto de frete
(`freight_application`), ou ainda um produto como brinde (`coupon_type=presente`).
A API expõe 21 endpoints: cinco de CRUD (`GET /discount_coupons`,
`GET /discount_coupons/:id`, `POST /discount_coupons`, `PUT /discount_coupons/:id`,
`DELETE /discount_coupons/:id`), seis de consulta de relacionamento por tipo
(`customer_relationship`, `product_relationship`, `category_relationship`,
`brand_relationship`, `shipping_relationship`, `gift_relationship`) e o endpoint
único de criação de vínculos `POST /discount_coupons/create_relationship/:id`,
cujo tipo de relacionamento é definido pela chave-wrapper do corpo. O cupom é o
mecanismo de desconto promocional **transacional** da Tray — distinto de preço
promocional direto no produto (campo `promotional_price`, ver `tray-produtos`) e
de preço permanente por grupo de cliente (ver `tray-listas-preco-b2b`).

O recurso se conecta a vários outros pontos do fluxo Tray. Os campos
`coupon_type` (`loja`/`cliente`/`troca`/`presente`) e `local_application`
(`loja`/`produtos`/`categorias`/`marcas`) determinam **qual** endpoint de
relacionamento se aplica e quais IDs externos precisam existir antes: vincular
clientes exige `customer_id` válidos (ver `tray-clientes`); vincular produtos,
`product_id` (ver `tray-produtos`); categorias, `category_id` (ver
`tray-categorias`); marcas, `brand_id` (ver `tray-marcas`); e relacionamento de
frete exige `shipping_id` de um método de envio já existente na loja (ver
`tray-frete`/`tray-configuracao-frete`). O cupom de troca (`coupon_type=troca`) é
gerado a partir de um `order_id` existente (ver `tray-pedidos`). O uso do cupom
materializa-se em um pedido — o desconto aplicado aparece nos campos
`coupon_code`/`discount` do pedido (ver `tray-pedidos`); não há escopo de webhook
próprio para cupom, então alterações de pedido com cupom chegam via escopo
`order` (ver `tray-webhooks`).

Invariantes da plataforma que valem para **toda** chamada deste recurso:
(1) o `access_token` é passado **sempre como query parameter**
(`?access_token={token}`), nunca em header `Authorization` — token em header
retorna `HTTP 401`; (2) a URL base é `https://{api_address}/`, e o
`api_address` **varia por loja** (retornado no callback OAuth) — usar o
endereço errado retorna `HTTP 404`; (3) todo body de `POST`/`PUT` deve estar
envolto na chave de recurso `DiscountCoupon`; (4) listagens paginam com `limit`
(padrão 30, **máximo 50**) e `page`, lendo `paging.total` para iterar;
(5) datas usam `YYYY-MM-DD` (validade `starts_at`/`ends_at`, horário de
Brasília) e timestamps `YYYY-MM-DD HH:MM:SS`; (6) o rate limit é 180 req/min e
10.000 req/dia — `HTTP 429` exige backoff exponencial (1s, 2s, 4s, 8s) e, em
vínculos em massa via `create_relationship`, lotes de **no máximo 100 registros**
por chamada com pausa entre eles. Como o recurso ainda não tem `validate.mjs`,
valide manualmente `code` (alfanumérico, sem espaços/acentos, único na loja),
`type` (`$` ou `%`), `value` (decimal) e a coerência
`usage_counter_limit >= usage_counter_limit_customer` antes de enviar.


## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/discount_coupons` | Listar cupons de desconto da loja com paginação e filtros |
| GET | `/discount_coupons/:id` | Consultar os detalhes de um cupom específico |
| POST | `/discount_coupons` | Criar um novo cupom de desconto |
| PUT | `/discount_coupons/:id` | Atualizar os dados de um cupom existente |
| DELETE | `/discount_coupons/:id` | Excluir um cupom de desconto |

**Autenticação:** `?access_token={token}` em todas as chamadas — sempre como query parameter, **nunca** em header `Authorization`. URL base `https://{api_address}/` varia por loja (retornada no callback OAuth). Payloads de `POST`/`PUT` envolvidos na chave de recurso `"DiscountCoupon"`.

### GET /discount_coupons

- **Quando usar:** para listar cupons existentes, descobrir o `coupon_type` e o `local_application` de cada cupom (que indicam qual endpoint de relacionamento consultar) e auditar campanhas ativas.
- **Pré-requisitos:**
  - `access_token` válido como query param.
  - `TRAY_API_ADDRESS` da loja (varia por loja, retornado no callback OAuth).
- **Schema do request:** sem body — apenas query params de paginação/filtro (ver tabela abaixo).
- **Schema da response:** resposta JSON padrão da API Tray (ver exemplo abaixo).
- **Paginação:** `limit` (padrão 30, máximo 50), `page`.
- **Campos da resposta:**

  | Campo | Tipo | Descrição |
  |:--|:--|:--|
  | `paging.total` | integer | Total de cupons disponíveis |
  | `paging.page` | integer | Página atual |
  | `paging.limit` | integer | Itens por página solicitados |
  | `paging.maxLimit` | integer | Teto de itens por página (50) |
  | `DiscountCoupons[].DiscountCoupon.id` | string | ID do cupom |
  | `DiscountCoupons[].DiscountCoupon.code` | string | Código digitado no checkout |
  | `DiscountCoupons[].DiscountCoupon.value` | decimal | Valor do desconto |
  | `DiscountCoupons[].DiscountCoupon.type` | string | `$` (reais) ou `%` (percentual) |
  | `DiscountCoupons[].DiscountCoupon.starts_at` | date | Início da validade |
  | `DiscountCoupons[].DiscountCoupon.ends_at` | date | Fim da validade |
  | `DiscountCoupons[].DiscountCoupon.coupon_type` | string | `loja` / `cliente` / `troca` / `presente` |
  | `DiscountCoupons[].DiscountCoupon.local_application` | string | `loja` / `produtos` / `marcas` / `categorias` |
  | `DiscountCoupons[].DiscountCoupon.freight_application` | string | `nao_aplicavel` / `desconto` / `frete_gratis` |
  | `DiscountCoupons[].DiscountCoupon.usage_counter_limit` | integer | Limite total de usos |
  | `DiscountCoupons[].DiscountCoupon.usage_counter_limit_customer` | integer | Limite de usos por cliente |

- **Exemplo (curl):**

  ```bash
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X GET \
    "https://${TRAY_API_ADDRESS}/discount_coupons?access_token=${TRAY_ACCESS_TOKEN}&limit=30&page=1"
  ```

- **Exemplo (Node):**

  ```js
  // NÃO-VERIFICADO contra sandbox — validar antes do merge.
  const res = await fetch(
    `https://${process.env.TRAY_API_ADDRESS}/discount_coupons` +
      `?access_token=${process.env.TRAY_ACCESS_TOKEN}&limit=30&page=1`,
  );
  if (res.status === 429) { /* backoff exponencial: 1s, 2s, 4s, 8s */ }
  const data = await res.json();
  // data.paging.total para paginar; data.DiscountCoupons[].DiscountCoupon
  ```

- **Erros comuns:**

  | Código | Causa | Como resolver |
  |:--|:--|:--|
  | 401 | `access_token` expirado (3h) ou enviado como header `Authorization` em vez de query param | Renovar via `GET /auth?refresh_token={token}`; sempre passar `?access_token={token}` na query string |
  | 404 | `api_address` incorreto (varia por loja) | Usar o `api_address` retornado no callback OAuth da loja |
  | 429 | Rate limit (180 req/min ou 10k/dia) | Backoff exponencial (1s, 2s, 4s, 8s) |

### GET /discount_coupons/:id

- **Quando usar:** para obter a configuração completa de um único cupom (validade, valor, tipo, limites) antes de editar ou diagnosticar por que não foi aplicado.
- **Pré-requisitos:**
  - `access_token` válido.
  - `id` do cupom (obtido via `GET /discount_coupons`).
- **Schema do request:** sem body — apenas parâmetro de path `:id`.
- **Schema da response:** resposta JSON padrão da API Tray (ver exemplo abaixo).
- **Campos da resposta:**

  | Campo | Tipo | Descrição |
  |:--|:--|:--|
  | `DiscountCoupon.id` | string | ID do cupom |
  | `DiscountCoupon.code` | string | Código do cupom |
  | `DiscountCoupon.value` | decimal | Valor do desconto |
  | `DiscountCoupon.type` | string | `$` (reais) ou `%` (percentual) |
  | `DiscountCoupon.starts_at` | date | Início da validade (`YYYY-MM-DD`) |
  | `DiscountCoupon.ends_at` | date | Fim da validade (`YYYY-MM-DD`) |
  | `DiscountCoupon.coupon_type` | string | `loja` / `cliente` / `troca` / `presente` |
  | `DiscountCoupon.local_application` | string | `loja` / `produtos` / `marcas` / `categorias` |
  | `DiscountCoupon.freight_application` | string | `nao_aplicavel` / `desconto` / `frete_gratis` |

- **Exemplo (curl):**

  ```bash
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X GET \
    "https://${TRAY_API_ADDRESS}/discount_coupons/7?access_token=${TRAY_ACCESS_TOKEN}"
  ```

- **Exemplo (Node):**

  ```js
  // NÃO-VERIFICADO contra sandbox — validar antes do merge.
  const couponId = 7;
  const res = await fetch(
    `https://${process.env.TRAY_API_ADDRESS}/discount_coupons/${couponId}` +
      `?access_token=${process.env.TRAY_ACCESS_TOKEN}`,
  );
  if (res.status === 404) { /* id inexistente ou api_address errado */ }
  const data = await res.json();
  // data.DiscountCoupon
  ```

- **Erros comuns:**

  | Código | Causa | Como resolver |
  |:--|:--|:--|
  | 401 | Token expirado ou enviado em header | Renovar token; usar query param |
  | 404 | ID de cupom inexistente ou `api_address` errado | Confirmar o `id` via listagem e o `api_address` da loja |
  | 429 | Rate limit (180 req/min ou 10k/dia) | Backoff exponencial (1s, 2s, 4s, 8s) |

### POST /discount_coupons

- **Quando usar:** ao cadastrar uma nova campanha de desconto (percentual ou valor fixo), definindo janela de validade, valor, faixa de pedido e limites de uso.
- **Pré-requisitos:**
  - `access_token` válido.
  - `code` único, sem espaços nem acentos.
  - definir `value` e `type` (`$` ou `%`).
- **Schema do request:** [`schemas/discount_coupons.create.json`](schemas/discount_coupons.create.json)
- **Schema da response:** resposta JSON padrão da API Tray (ver exemplo abaixo).
- **Content-Type:** `application/x-www-form-urlencoded` com wrapper `["DiscountCoupon"]["campo"]` (a estrutura JSON equivalente usa a chave de recurso `"DiscountCoupon"`).
- **Campos:**

  | Campo | Tipo | Obrigatório | Descrição |
  |:--|:--|:--:|:--|
  | `code` | string | Sim | Código digitado no checkout — alfanumérico, sem espaços nem acentos, único por loja |
  | `value` | decimal | Sim | Valor do desconto (ex.: `10.00`), interpretado conforme `type` |
  | `type` | string | Sim | `$` = valor fixo em reais / `%` = percentual |
  | `description` | string | Não | Descrição interna/administrativa (nome da campanha) |
  | `coupon_type` | string | Não | `loja` / `cliente` / `troca` / `presente` |
  | `starts_at` | date | Não | Início da validade (`YYYY-MM-DD`) |
  | `ends_at` | date | Não | Fim da validade (`YYYY-MM-DD`) |
  | `value_start` | decimal | Não | Valor mínimo do produto/pedido elegível; vazio = sem restrição |
  | `value_end` | decimal | Não | Valor máximo do produto/pedido elegível; vazio = sem restrição |
  | `usage_counter_limit` | integer | Não | Limite total de usos (todos os clientes); deve ser `>= usage_counter_limit_customer` |
  | `usage_counter_limit_customer` | integer | Não | Limite de usos por cliente; deve ser `<= usage_counter_limit` |
  | `cumulative_discount` | number | Não | `1` = acumula com desconto progressivo / `0` = exclusivo |
  | `local_application` | string | Não | `loja` / `produtos` / `marcas` / `categorias` |
  | `freight_application` | string | Não | `nao_aplicavel` / `desconto` / `frete_gratis` |

- **Exemplo (curl):**

  ```bash
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X POST \
    "https://${TRAY_API_ADDRESS}/discount_coupons?access_token=${TRAY_ACCESS_TOKEN}" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode '["DiscountCoupon"]["code"]=PROMO10' \
    --data-urlencode '["DiscountCoupon"]["description"]=Promo Abril' \
    --data-urlencode '["DiscountCoupon"]["starts_at"]=2026-04-01' \
    --data-urlencode '["DiscountCoupon"]["ends_at"]=2026-04-30' \
    --data-urlencode '["DiscountCoupon"]["value"]=10.00' \
    --data-urlencode '["DiscountCoupon"]["type"]=%' \
    --data-urlencode '["DiscountCoupon"]["usage_counter_limit_customer"]=5'
  ```

  Estrutura JSON equivalente do body (chave de recurso `DiscountCoupon`):

  ```json
  {
    "DiscountCoupon": {
      "code": "PROMO10",
      "description": "Promo Abril",
      "starts_at": "2026-04-01",
      "ends_at": "2026-04-30",
      "value": "10.00",
      "type": "%",
      "usage_counter_limit_customer": "5",
      "cumulative_discount": "0"
    }
  }
  ```

- **Exemplo (Node):**

  ```js
  // NÃO-VERIFICADO contra sandbox — validar antes do merge.
  const body = new URLSearchParams({
    '["DiscountCoupon"]["code"]': 'PROMO10',
    '["DiscountCoupon"]["description"]': 'Promo Abril',
    '["DiscountCoupon"]["starts_at"]': '2026-04-01',
    '["DiscountCoupon"]["ends_at"]': '2026-04-30',
    '["DiscountCoupon"]["value"]': '10.00',
    '["DiscountCoupon"]["type"]': '%',
    '["DiscountCoupon"]["usage_counter_limit_customer"]': '5',
  });
  const res = await fetch(
    `https://${process.env.TRAY_API_ADDRESS}/discount_coupons` +
      `?access_token=${process.env.TRAY_ACCESS_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    },
  );
  if (res.status === 429) { /* backoff exponencial */ }
  const data = await res.json();
  // { "message": "Created", "id": "1", "code": 201 }
  ```

  Resposta de sucesso:

  ```json
  { "message": "Created", "id": "1", "code": 201 }
  ```

- **Erros comuns:**

  | Código | Causa | Como resolver |
  |:--|:--|:--|
  | 400 | Faltou a chave de recurso `DiscountCoupon`, `code` com espaço/acento, ou campo obrigatório (`code`/`value`/`type`) ausente | Envolver os dados na chave `DiscountCoupon`; normalizar o `code` (alfanumérico); conferir `value` e `type` |
  | 401 | Token expirado ou enviado em header | Renovar token; usar query param |
  | 429 | Rate limit (180 req/min ou 10k/dia) | Backoff exponencial (1s, 2s, 4s, 8s) |

### PUT /discount_coupons/:id

- **Quando usar:** para prorrogar a validade (`ends_at`), ajustar valor/limites de uso ou alterar a faixa de pedido de um cupom já criado. Para apenas "desativar" temporariamente, prefira ajustar `ends_at` aqui em vez de excluir via `DELETE`.
- **Pré-requisitos:**
  - `access_token` válido.
  - `id` do cupom.
  - payload com a chave `DiscountCoupon`.
- **Schema do request:** [`schemas/discount_coupons.update.json`](schemas/discount_coupons.update.json)
- **Schema da response:** resposta JSON padrão da API Tray (ver exemplo abaixo).
- **Content-Type:** `application/x-www-form-urlencoded` com wrapper `DiscountCoupon`.
- **Campos:**

  | Campo | Tipo | Obrigatório | Descrição |
  |:--|:--|:--:|:--|
  | `value` | decimal | Não | Valor do desconto |
  | `type` | string | Não | `$` (reais) / `%` (percentual) |
  | `starts_at` | date | Não | Início da validade (`YYYY-MM-DD`) |
  | `ends_at` | date | Não | Fim da validade (`YYYY-MM-DD`) |
  | `value_start` | decimal | Não | Valor mínimo do produto/pedido elegível |
  | `value_end` | decimal | Não | Valor máximo do produto/pedido elegível |
  | `usage_counter_limit` | integer | Não | Limite total de usos; deve ser `>= usage_counter_limit_customer` |
  | `usage_counter_limit_customer` | integer | Não | Limite de usos por cliente; deve ser `<= usage_counter_limit` |
  | `cumulative_discount` | number | Não | `1` = acumula / `0` = exclusivo |

- **Exemplo (curl):**

  ```bash
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X PUT \
    "https://${TRAY_API_ADDRESS}/discount_coupons/7?access_token=${TRAY_ACCESS_TOKEN}" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode '["DiscountCoupon"]["ends_at"]=2026-05-31'
  ```

- **Exemplo (Node):**

  ```js
  // NÃO-VERIFICADO contra sandbox — validar antes do merge.
  const couponId = 7;
  const body = new URLSearchParams({
    '["DiscountCoupon"]["ends_at"]': '2026-05-31',
  });
  const res = await fetch(
    `https://${process.env.TRAY_API_ADDRESS}/discount_coupons/${couponId}` +
      `?access_token=${process.env.TRAY_ACCESS_TOKEN}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    },
  );
  if (res.status === 429) { /* backoff exponencial */ }
  const data = await res.json();
  // { "message": "Saved", "id": "7", "code": 200 }
  ```

  Resposta de sucesso:

  ```json
  { "message": "Saved", "id": "7", "code": 200 }
  ```

- **Erros comuns:**

  | Código | Causa | Como resolver |
  |:--|:--|:--|
  | 400 | Falta da chave `DiscountCoupon` ou limites inconsistentes (`usage_counter_limit` menor que `usage_counter_limit_customer`) | Envolver na chave `DiscountCoupon`; garantir limite geral `>=` limite por cliente |
  | 401 | Token expirado ou enviado em header | Renovar token; usar query param |
  | 404 | ID inexistente | Confirmar `id` via listagem |
  | 429 | Rate limit (180 req/min ou 10k/dia) | Backoff exponencial (1s, 2s, 4s, 8s) |

### DELETE /discount_coupons/:id

- **Quando usar:** ao encerrar definitivamente uma campanha. Para apenas desativar temporariamente, prefira ajustar `ends_at` via `PUT` (preserva o histórico).
- **Pré-requisitos:**
  - `access_token` válido.
  - `id` do cupom.
- **Schema do request:** sem body — apenas parâmetro de path `:id`.
- **Schema da response:** resposta JSON padrão da API Tray (ver exemplo abaixo).
- **Campos:**

  | Campo | Tipo | Obrigatório | Descrição |
  |:--|:--|:--:|:--|
  | `id` | string | Sim | ID do cupom a excluir (passado na URL) |

- **Exemplo (curl):**

  ```bash
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X DELETE \
    "https://${TRAY_API_ADDRESS}/discount_coupons/7?access_token=${TRAY_ACCESS_TOKEN}"
  ```

- **Exemplo (Node):**

  ```js
  // NÃO-VERIFICADO contra sandbox — validar antes do merge.
  const couponId = 7;
  const res = await fetch(
    `https://${process.env.TRAY_API_ADDRESS}/discount_coupons/${couponId}` +
      `?access_token=${process.env.TRAY_ACCESS_TOKEN}`,
    { method: 'DELETE' },
  );
  if (res.status === 404) { /* id inexistente ou já excluído */ }
  const data = await res.json();
  // { "message": "Deleted", "id": "7", "code": 200 }
  ```

  Resposta de sucesso:

  ```json
  { "message": "Deleted", "id": "7", "code": 200 }
  ```

- **Erros comuns:**

  | Código | Causa | Como resolver |
  |:--|:--|:--|
  | 401 | Token expirado ou enviado em header | Renovar token; usar query param |
  | 404 | ID inexistente ou já excluído | Confirmar `id` via listagem |
  | 429 | Rate limit (180 req/min ou 10k/dia) | Backoff exponencial (1s, 2s, 4s, 8s) |


## Relacionamentos do cupom

Um cupom de desconto pode ser **genérico** (vale para toda a loja) ou **restrito** a um conjunto de clientes, produtos, categorias, marcas ou métodos de frete. Essas restrições — e o brinde de um cupom-presente — não vivem no corpo do cupom: são **relacionamentos** mantidos em endpoints próprios. Esta seção cobre os 6 endpoints `GET` de consulta de relacionamento e o endpoint `POST` único de criação.

### Como descobrir qual relacionamento consultar

Dois campos do cupom (retornados em `GET /discount_coupons` e `GET /discount_coupons/:id`) determinam qual relacionamento é relevante — **consulte-os antes de chamar qualquer endpoint de relacionamento**, para não fazer requisições inúteis:

- **`coupon_type`** — abrangência/comportamento do cupom:
  - `loja` → cupom genérico; combinado com `local_application` define o escopo (ver abaixo).
  - `cliente` → restrito a clientes vinculados → consultar **`customer_relationship`**.
  - `troca` → gerado a partir de um pedido (`order_id`); o vínculo é criado via `DiscountCouponCustomer` com `order_id`.
  - `presente` → entrega um produto como brinde → consultar **`gift_relationship`**.
- **`local_application`** — escopo do desconto dentro da loja:
  - `loja` → aplica a toda a loja; sem relacionamento de produto/categoria/marca.
  - `produtos` → consultar **`product_relationship`**.
  - `categorias` → consultar **`category_relationship`**.
  - `marcas` → consultar **`brand_relationship`**.
- **`freight_application`** — comportamento quanto ao frete:
  - `nao_aplicavel` → sem relacionamento de frete.
  - `desconto` ou `frete_gratis` → consultar **`shipping_relationship`**.

> **Regra de ouro:** um cupom `coupon_type=loja` **sem nenhum relacionamento** é genérico e vale para toda a loja e todos os clientes. Já um cupom `coupon_type=cliente` **sem relacionamento criado não se aplica a ninguém** — o vínculo via `create_relationship` é obrigatório para que ele funcione.

### Tabela-resumo dos endpoints de relacionamento

| Método | Endpoint | Wrapper de resposta | Quando usar (campo gatilho) |
|:--|:--|:--|:--|
| GET | `/discount_coupons/customer_relationship/:id` | `DiscountCouponCustomers[].DiscountCouponCustomer.customer_id` | `coupon_type=cliente` |
| GET | `/discount_coupons/product_relationship/:id` | `DiscountCouponProducts[].DiscountCouponProduct.product_id` | `local_application=produtos` |
| GET | `/discount_coupons/category_relationship/:id` | `DiscountCouponCategories[].DiscountCouponCategory.category_id` | `local_application=categorias` |
| GET | `/discount_coupons/brand_relationship/:id` | `DiscountCouponBrands[].DiscountCouponBrand.brand_id` | `local_application=marcas` |
| GET | `/discount_coupons/shipping_relationship/:id` | `DiscountCouponShippings[].DiscountCouponShipping.shipping_id` / `.value` | `freight_application=desconto` ou `frete_gratis` |
| GET | `/discount_coupons/gift_relationship/:id` | `DiscountCouponGift` (product_id do brinde) | `coupon_type=presente` |
| POST | `/discount_coupons/create_relationship/:id` | corpo define o tipo (ver abaixo) | criar qualquer vínculo; máx. **100** registros/chamada |

> `:id` é sempre o **ID do cupom** (não o ID do cliente/produto/etc.). Todos os endpoints usam `?access_token={token}` na query string — **nunca** em header `Authorization`.

---

### GET `/discount_coupons/customer_relationship/:id` — clientes vinculados

**Quando usar:** com `coupon_type=cliente`, para auditar quais `customer_id` podem usar o cupom. Útil ao depurar "cupom não aplica para o cliente X".

**Pré-requisitos:** `access_token` válido; `id` do cupom (via `GET /discount_coupons`); relacionamento de cliente já criado.

**Campos da resposta:** `DiscountCouponCustomers[].DiscountCouponCustomer.customer_id`.

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s "https://${TRAY_API_ADDRESS}/discount_coupons/customer_relationship/7?access_token=${TRAY_ACCESS_TOKEN}"
```

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;
const couponId = 7;

const res = await fetch(
  `https://${base}/discount_coupons/customer_relationship/${couponId}?access_token=${encodeURIComponent(token)}`
);
if (res.status === 401) throw new Error("Token expirado/invalido — renovar via GET /auth?refresh_token=...");
if (res.status === 404) throw new Error("Cupom inexistente — confirmar id via GET /discount_coupons");
const data = await res.json();
const customerIds = (data.DiscountCouponCustomers ?? []).map(c => c.DiscountCouponCustomer.customer_id);
console.log(customerIds);
```

**Erros comuns:** `404` (cupom inexistente — confirmar o `id` via listagem); `401` (token em header em vez de query param — mover para `?access_token=`).

---

### GET `/discount_coupons/product_relationship/:id` — produtos vinculados

**Quando usar:** com `local_application=produtos`, para verificar quais `product_id` recebem o desconto.

**Pré-requisitos:** `access_token` válido; `id` do cupom; relacionamento de produto já criado.

**Campos da resposta:** `DiscountCouponProducts[].DiscountCouponProduct.product_id`.

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s "https://${TRAY_API_ADDRESS}/discount_coupons/product_relationship/7?access_token=${TRAY_ACCESS_TOKEN}"
```

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;

const res = await fetch(
  `https://${base}/discount_coupons/product_relationship/7?access_token=${encodeURIComponent(token)}`
);
const data = await res.json();
const productIds = (data.DiscountCouponProducts ?? []).map(p => p.DiscountCouponProduct.product_id);
console.log(productIds);
```

**Erros comuns:** `404` (cupom inexistente — confirmar o `id`); `401` (token expirado/em header).

---

### GET `/discount_coupons/category_relationship/:id` — categorias vinculadas

**Quando usar:** com `local_application=categorias`, para verificar quais `category_id` recebem o desconto. O cupom aplica-se a **todos os produtos** das categorias vinculadas.

**Pré-requisitos:** `access_token` válido; `id` do cupom; relacionamento de categoria já criado.

**Campos da resposta:** `DiscountCouponCategories[].DiscountCouponCategory.category_id`.

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s "https://${TRAY_API_ADDRESS}/discount_coupons/category_relationship/7?access_token=${TRAY_ACCESS_TOKEN}"
```

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;

const res = await fetch(
  `https://${base}/discount_coupons/category_relationship/7?access_token=${encodeURIComponent(token)}`
);
const data = await res.json();
const categoryIds = (data.DiscountCouponCategories ?? []).map(c => c.DiscountCouponCategory.category_id);
console.log(categoryIds);
```

**Erros comuns:** `404` (cupom inexistente — confirmar o `id`); `401` (token expirado/em header).

---

### GET `/discount_coupons/brand_relationship/:id` — marcas vinculadas

**Quando usar:** com `local_application=marcas`, para verificar quais `brand_id` recebem o desconto. Aplica-se a todos os produtos das marcas vinculadas.

**Pré-requisitos:** `access_token` válido; `id` do cupom; relacionamento de marca já criado.

**Campos da resposta:** `DiscountCouponBrands[].DiscountCouponBrand.brand_id`.

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s "https://${TRAY_API_ADDRESS}/discount_coupons/brand_relationship/7?access_token=${TRAY_ACCESS_TOKEN}"
```

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;

const res = await fetch(
  `https://${base}/discount_coupons/brand_relationship/7?access_token=${encodeURIComponent(token)}`
);
const data = await res.json();
const brandIds = (data.DiscountCouponBrands ?? []).map(b => b.DiscountCouponBrand.brand_id);
console.log(brandIds);
```

**Erros comuns:** `404` (cupom inexistente — confirmar o `id`); `401` (token expirado/em header).

---

### GET `/discount_coupons/shipping_relationship/:id` — fretes vinculados

**Quando usar:** com `freight_application=desconto` ou `frete_gratis`, para verificar a quais métodos de envio o cupom aplica desconto/frete grátis. O campo `value` no relacionamento indica o comportamento: `0` = frete grátis; `n` = R$ n de desconto no frete.

**Pré-requisitos:** `access_token` válido; `id` do cupom; relacionamento de frete já criado.

**Campos da resposta:** `DiscountCouponShippings[].DiscountCouponShipping.shipping_id` e `.value`.

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s "https://${TRAY_API_ADDRESS}/discount_coupons/shipping_relationship/7?access_token=${TRAY_ACCESS_TOKEN}"
```

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;

const res = await fetch(
  `https://${base}/discount_coupons/shipping_relationship/7?access_token=${encodeURIComponent(token)}`
);
const data = await res.json();
const shippings = (data.DiscountCouponShippings ?? []).map(s => ({
  shipping_id: s.DiscountCouponShipping.shipping_id,
  value: s.DiscountCouponShipping.value, // "0" = frete gratis
}));
console.log(shippings);
```

**Erros comuns:** `404` (cupom inexistente — confirmar o `id`); `401` (token expirado/em header).

---

### GET `/discount_coupons/gift_relationship/:id` — cupom-presente

**Quando usar:** com `coupon_type=presente`, para identificar o produto associado como brinde. Um cupom-presente **entrega um item** em vez de reduzir o valor — não confunda com cupom de desconto monetário.

**Pré-requisitos:** `access_token` válido; `id` do cupom; relacionamento de presente já criado.

**Campos da resposta:** `DiscountCouponGift` com o `product_id` do brinde.

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s "https://${TRAY_API_ADDRESS}/discount_coupons/gift_relationship/7?access_token=${TRAY_ACCESS_TOKEN}"
```

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;

const res = await fetch(
  `https://${base}/discount_coupons/gift_relationship/7?access_token=${encodeURIComponent(token)}`
);
if (res.status === 404) throw new Error("Cupom inexistente ou sem presente vinculado — confirmar id e coupon_type=presente");
const data = await res.json();
console.log(data.DiscountCouponGift);
```

**Erros comuns:** `404` (cupom inexistente **ou** sem presente vinculado — confirmar `id` e que `coupon_type=presente`); `401` (token expirado/em header).

---

### POST `/discount_coupons/create_relationship/:id` — criar qualquer relacionamento

**Endpoint único** para todos os tipos de vínculo. O **tipo é determinado pela chave-wrapper do corpo**, não pela URL:

| Chave-wrapper do corpo | Tipo de relacionamento | Campo-chave |
|:--|:--|:--|
| `DiscountCouponCustomer` | clientes | `customer_id` (array) ou `order_id` (cupom de troca) |
| `DiscountCouponProduct` | produtos | `product_id` |
| `DiscountCouponCategory` | categorias | `category_id` |
| `DiscountCouponBrand` | marcas | `brand_id` |
| `DiscountCouponShipping` | frete | `shipping_id`, ou `value` (`0`=frete grátis, `n`=desconto de R$ n) |

**Quando usar:** depois de criar o cupom (`POST /discount_coupons`), para restringi-lo a clientes/produtos/categorias/marcas/fretes específicos, configurar frete grátis/desconto de frete, ou gerar cupom de troca a partir de um `order_id`.

**Pré-requisitos:** `access_token` válido; `id` do cupom já criado; IDs dos recursos a vincular; **máximo 100 registros por chamada** — lotes maiores retornam `400`, divida e respeite o rate limit (180 req/min).

**Content-Type:** `application/json` (cada chave-wrapper define o tipo de relacionamento).

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s -X POST \
  "https://${TRAY_API_ADDRESS}/discount_coupons/create_relationship/7?access_token=${TRAY_ACCESS_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{"DiscountCouponProduct":[{"product_id":"456"},{"product_id":"789"}]}'
```

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;
const couponId = 7;

// Divide em lotes de até 100 para respeitar o limite do endpoint.
function chunk(arr, size = 100) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function vincularClientes(customerIds) {
  for (const lote of chunk(customerIds, 100)) {
    const body = { DiscountCouponCustomer: lote.map(id => ({ customer_id: String(id) })) };
    const res = await fetch(
      `https://${base}/discount_coupons/create_relationship/${couponId}?access_token=${encodeURIComponent(token)}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    );
    if (res.status === 400) throw new Error("Lote >100 ou chave-wrapper/IDs invalidos — revisar payload");
    if (res.status === 404) throw new Error("Cupom inexistente — confirmar id do cupom na URL");
    if (res.status === 429) { /* backoff exponencial: 1s, 2s, 4s, 8s... */ }
    // pausa entre lotes para respeitar o rate limit (180 req/min)
    await new Promise(r => setTimeout(r, 500));
  }
}
```

**Frete grátis vs. desconto de frete:** envie `value=0` para zerar o frete ou `value=n` para R$ n de desconto:

```json
{ "DiscountCouponShipping": { "value": "0" } }
```

**Cupom de troca a partir de pedido:** use `DiscountCouponCustomer` com `order_id`:

```json
{ "DiscountCouponCustomer": { "order_id": "10" } }
```

**Resposta de sucesso:** `{ "message": "Created", "id": "...", "code": 201 }`.

**Erros comuns:**
- `400` — lote acima de 100 registros, chave-wrapper incorreta, ou IDs inexistentes → dividir em lotes de até 100; usar a chave correta (`DiscountCouponCustomer`/`Product`/`Category`/`Brand`/`Shipping`); validar os IDs.
- `404` — cupom (`id` na URL) inexistente → confirmar o `id` do cupom.
- `429` — rate limit em cargas grandes de vinculação → pausar entre lotes; backoff exponencial.

> **Anti-pattern:** criar um cupom `coupon_type=cliente` e **esquecer** de criar o relacionamento. Sem o `create_relationship` com os `customer_id`, o cupom não se aplica a ninguém. O mesmo vale para `local_application=produtos/categorias/marcas` sem o respectivo vínculo.

## Edge cases

Os cupons da Tray combinam várias dimensões ortogonais — janela de validade, contadores de uso, tipo de aplicação, frete e relacionamentos — e cada combinação tem comportamento próprio. Os casos abaixo cobrem as armadilhas mais frequentes. Em todos, o `access_token` vai como query param (`?access_token={TRAY_ACCESS_TOKEN}`) e a URL base usa `{TRAY_API_ADDRESS}` (varia por loja, retornado no callback OAuth).

- **Janela de validade (`starts_at` / `ends_at`):** o cupom só é aceito no checkout dentro do intervalo `[starts_at, ends_at]`, inclusive. Antes de `starts_at` ou depois de `ends_at` ele é tratado como inexistente — não retorna erro de "cupom inválido por valor", simplesmente não se aplica. As datas usam o formato `YYYY-MM-DD` (horário de Brasília, sem timezone). Para **desativar temporariamente** uma campanha, prefira encurtar `ends_at` via `PUT` a apagar o cupom com `DELETE`, pois o `PUT` preserva o histórico e o `id` para reativação futura.

  ```bash
  # Cupom válido só em abril/2026 — NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X POST "https://${TRAY_API_ADDRESS}/discount_coupons?access_token=${TRAY_ACCESS_TOKEN}" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode '["DiscountCoupon"]["code"]=ABRIL10' \
    --data-urlencode '["DiscountCoupon"]["type"]=%' \
    --data-urlencode '["DiscountCoupon"]["value"]=10.00' \
    --data-urlencode '["DiscountCoupon"]["starts_at"]=2026-04-01' \
    --data-urlencode '["DiscountCoupon"]["ends_at"]=2026-04-30'
  # "Desativar" antecipadamente sem perder histórico:
  curl -X PUT "https://${TRAY_API_ADDRESS}/discount_coupons/7?access_token=${TRAY_ACCESS_TOKEN}" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode '["DiscountCoupon"]["ends_at"]=2026-04-15'
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  ```

- **Limite total (`usage_counter_limit`) vs. limite por cliente (`usage_counter_limit_customer`):** os dois contadores operam em conjunto e precisam ser **consistentes** — o limite total deve ser `>=` ao limite por cliente. Se você define `usage_counter_limit_customer=2` mas deixa `usage_counter_limit=1`, o cupom esgota globalmente no primeiro uso, antes mesmo de um único cliente atingir suas 2 utilizações; a configuração é internamente contraditória e tende a retornar `HTTP 400`. Por convenção, `usage_counter_limit=0` (ou vazio) costuma indicar uso **ilimitado no total**. Ao depurar um "cupom inválido" reportado por um cliente, **cheque os dois contadores**: um cliente que já usou o cupom o número máximo de vezes (`usage_counter_limit_customer`) recebe recusa mesmo que o limite geral ainda tenha saldo.

  ```bash
  # 1000 usos no total, 2 por cliente (geral >= por cliente) — NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X POST "https://${TRAY_API_ADDRESS}/discount_coupons?access_token=${TRAY_ACCESS_TOKEN}" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode '["DiscountCoupon"]["code"]=BLACK20' \
    --data-urlencode '["DiscountCoupon"]["type"]=%' \
    --data-urlencode '["DiscountCoupon"]["value"]=20.00' \
    --data-urlencode '["DiscountCoupon"]["usage_counter_limit"]=1000' \
    --data-urlencode '["DiscountCoupon"]["usage_counter_limit_customer"]=2'
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  ```

- **Cupom cumulativo vs. exclusivo (`cumulative_discount`):** com `cumulative_discount=1` o desconto do cupom **soma-se** a um desconto progressivo ou a outros descontos já aplicados ao pedido; com `cumulative_discount=0` ele é **exclusivo** e não empilha. Essa flag muda diretamente o valor final do pedido e é crítica em campanhas como Black Friday, onde já existe desconto progressivo ativo. Defina-a sempre **explicitamente** — não confie no default — para evitar empilhamento indevido (cliente paga menos do que a margem permite) ou bloqueio inesperado de promoções legítimas.

  ```bash
  # Cupom que NÃO acumula com outras promoções — NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X PUT "https://${TRAY_API_ADDRESS}/discount_coupons/7?access_token=${TRAY_ACCESS_TOKEN}" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode '["DiscountCoupon"]["cumulative_discount"]=0'
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  ```

- **`coupon_type=loja` vs. `coupon_type=cliente`:** um cupom `loja` **sem nenhum relacionamento** é genérico e vale para toda a loja e todos os clientes. Já `coupon_type=cliente` só funciona **após** vincular `customer_id` via `POST /discount_coupons/create_relationship/:id` — um cupom marcado como `cliente` mas sem relacionamento criado **não se aplica a ninguém** (sintoma silencioso: o cupom existe na listagem mas é recusado por todos). O fluxo correto é sempre em duas etapas: criar o cupom e, em seguida, criar o relacionamento.

  ```bash
  # Etapa 1: cria o cupom restrito a clientes — NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X POST "https://${TRAY_API_ADDRESS}/discount_coupons?access_token=${TRAY_ACCESS_TOKEN}" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode '["DiscountCoupon"]["code"]=VIP15' \
    --data-urlencode '["DiscountCoupon"]["type"]=%' \
    --data-urlencode '["DiscountCoupon"]["value"]=15.00' \
    --data-urlencode '["DiscountCoupon"]["coupon_type"]=cliente'
  # Etapa 2: vincula os clientes (sem isto, o cupom não vale para ninguém)
  curl -X POST "https://${TRAY_API_ADDRESS}/discount_coupons/create_relationship/7?access_token=${TRAY_ACCESS_TOKEN}" \
    -H 'Content-Type: application/json' \
    -d '{"DiscountCouponCustomer":[{"customer_id":"101"},{"customer_id":"102"}]}'
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  ```

- **Cupom de frete (`freight_application`):** o comportamento de frete é definido pelo par `freight_application` + relacionamento `DiscountCouponShipping`. Com `freight_application=frete_gratis`, vincula-se um `DiscountCouponShipping` com `value=0` (zera o frete); com `freight_application=desconto`, vincula-se com `value=n` (ex.: `value=10` = R$10 de desconto no frete). O desconto pode ainda ser **restrito a métodos de envio específicos** informando `shipping_id` no relacionamento; sem `shipping_id`, aplica-se aos métodos elegíveis da loja. Combine com `value_start` para o clássico "frete grátis acima de R$X".

  ```bash
  # Frete grátis (value=0) para o método de envio 3 — NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X POST "https://${TRAY_API_ADDRESS}/discount_coupons/create_relationship/7?access_token=${TRAY_ACCESS_TOKEN}" \
    -H 'Content-Type: application/json' \
    -d '{"DiscountCouponShipping":[{"shipping_id":"3","value":"0"}]}'
  # Desconto de R$10 no frete (em vez de zerar):
  # -d '{"DiscountCouponShipping":[{"shipping_id":"3","value":"10"}]}'
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  ```

- **Cupom-presente (`coupon_type=presente`):** difere fundamentalmente do cupom de desconto tradicional — em vez de reduzir o valor monetário do pedido, ele **entrega um produto como brinde**. O produto associado é consultado via `GET /discount_coupons/gift_relationship/:id` e vinculado pelo `create_relationship`. Ao diagnosticar "o desconto não apareceu" para um cupom-presente, lembre-se de que não há redução de preço a verificar: a validação correta é confirmar se o produto-brinde foi adicionado ao carrinho.

  ```bash
  # Consulta o produto-brinde vinculado ao cupom 7 — NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl "https://${TRAY_API_ADDRESS}/discount_coupons/gift_relationship/7?access_token=${TRAY_ACCESS_TOKEN}"
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  ```

- **Percentual vs. valor fixo (`type`):** `type=%` com `value=10.00` aplica **10% de desconto**; `type=$` com o mesmo `value=10.00` aplica **R$10,00 fixos**. A diferença é enorme em pedidos altos — 10% de um pedido de R$500 são R$50, contra R$10 fixos — e confundir os dois é um erro de campanha clássico, com impacto direto na margem. Sempre confirme `type` explicitamente ao criar o cupom; não assuma o default.

  ```bash
  # Atenção ao mesmo value=10.00 com semânticas opostas — NÃO-VERIFICADO contra sandbox — validar antes do merge.
  # Percentual (10%):  ["DiscountCoupon"]["type"]=%   ["DiscountCoupon"]["value"]=10.00
  # Valor fixo (R$10): ["DiscountCoupon"]["type"]=$   ["DiscountCoupon"]["value"]=10.00
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  ```

- **Faixa de pedido (`value_start` / `value_end`):** definem o intervalo de valor de produto/pedido elegível ao desconto. `value_start=150` sem `value_end` aplica o cupom apenas a pedidos **a partir de R$150** (caso de uso típico: "frete grátis acima de R$150"). Ambos vazios significam **sem restrição de valor**. Um cliente que tenta usar o cupom com pedido abaixo de `value_start` recebe recusa — outro candidato a "cupom inválido" que não é bug, e sim regra de faixa.

  ```bash
  # Cupom só vale a partir de R$150 — NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X PUT "https://${TRAY_API_ADDRESS}/discount_coupons/7?access_token=${TRAY_ACCESS_TOKEN}" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode '["DiscountCoupon"]["value_start"]=150.00'
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  ```

- **Lote de relacionamento acima de 100 registros:** o `POST /discount_coupons/create_relationship/:id` aceita no **máximo 100 registros por chamada**. Para vincular 500 clientes a um cupom VIP, divida em **5 lotes de até 100**, com pausa entre eles para respeitar o rate limit (180 req/min, 10k/dia). Lotes maiores retornam `HTTP 400`; rajadas sem pausa podem retornar `HTTP 429`.

  ```bash
  # Vinculação em lotes de até 100 (pseudo-loop) — NÃO-VERIFICADO contra sandbox — validar antes do merge.
  # for lote in lote1.json lote2.json ... lote5.json; do
  #   curl -X POST "https://${TRAY_API_ADDRESS}/discount_coupons/create_relationship/7?access_token=${TRAY_ACCESS_TOKEN}" \
  #     -H 'Content-Type: application/json' --data-binary "@${lote}"
  #   sleep 1   # pausa entre lotes; em 429, backoff exponencial 1s,2s,4s,8s
  # done
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  ```

## Antipadrões

- ❌ **Esquecer a chave de recurso `DiscountCoupon` no body:** parece natural enviar os campos soltos (`code=PROMO10&value=10&type=%`), como em muitas APIs REST. Na Tray isso retorna `HTTP 400` — é a **causa #1** de erro na criação/atualização de cupons. **Por quê quebra:** a API exige que todo payload de `POST`/`PUT` venha envolvido na chave do recurso. **Correção:** envolva sempre os dados em `DiscountCoupon` — no formato urlencoded `["DiscountCoupon"]["campo"]=valor`, ou no JSON equivalente `{"DiscountCoupon": {"code": "PROMO10", "value": "10.00", "type": "%"}}`.

- ❌ **Enviar o `access_token` como header `Authorization: Bearer`:** é o padrão de praticamente toda API OAuth moderna, então parece o caminho certo. **Por quê quebra:** a API Tray **não lê** o token em header — a requisição é tratada como não autenticada e retorna `HTTP 401`. **Correção:** passe o token **sempre** como query param: `?access_token={TRAY_ACCESS_TOKEN}`. Se o token estiver expirado (vida útil de 3h), renove via `GET /auth?refresh_token={token}` antes de repetir a chamada.

- ❌ **Aplicar dois cupons exclusivos ao mesmo pedido:** parece que somar "PROMO10" + "FRETEGRATIS" no checkout multiplicaria o desconto. **Por quê quebra:** cupons com `cumulative_discount=0` são exclusivos e **não empilham** — ao tentar combinar dois, apenas um prevalece e o outro é silenciosamente ignorado, gerando reclamação de cliente ("meu segundo cupom não funcionou"). **Correção:** para que descontos se somem, **todos** os cupons envolvidos precisam de `cumulative_discount=1`; caso contrário, deixe claro ao cliente que cupons são mutuamente exclusivos.

- ❌ **Usar `code` com espaços ou acentos:** nomes de campanha legíveis como `PROMO ABRIL` ou `NATAL2025!` parecem inofensivos. **Por quê quebra:** o campo `code` **não aceita espaços nem acentos**; valores assim quebram a criação e/ou a aplicação no checkout. **Correção:** normalize o código para alfanumérico sem espaços nem acentos (`PROMOABRIL`, `NATAL2025`), garantindo também que seja **único** na loja. Use o campo `description` (texto livre) para o nome amigável da campanha.

- ❌ **Criar `coupon_type=cliente` e não criar o relacionamento:** depois de cadastrar o cupom restrito, é tentador considerar a tarefa concluída. **Por quê quebra:** um cupom `cliente` só passa a valer **após** `POST /discount_coupons/create_relationship/:id` com os `customer_id`; sem o relacionamento, ele **não se aplica a ninguém** e a recusa é silenciosa (o cupom aparece na listagem, mas todos os clientes são bloqueados). **Correção:** trate a criação como um fluxo de duas etapas obrigatórias — criar o cupom e, em seguida, vincular os clientes via `create_relationship`.

- ❌ **Confundir cupom com lista de preço B2B:** para "dar 10% permanente ao grupo de revendedores", parece prático criar um cupom e distribuí-lo. **Por quê quebra:** cupons (`tray-cupons`) são descontos por **código aplicado no checkout**, pontuais e sujeitos a contadores de uso/validade — não servem como precificação permanente por grupo de cliente. **Correção:** para preços permanentes por grupo, use a **lista de preço B2B** (`tray-listas-preco-b2b`), que é o recurso desenhado para precificação contínua e segmentada.

- ❌ **Não checar `usage_counter_limit_customer` ao depurar "cupom inválido":** ao ver que o limite geral (`usage_counter_limit`) ainda tem saldo, é fácil concluir que há um bug na API. **Por quê quebra:** o limite **por cliente** (`usage_counter_limit_customer`) é independente — um cliente que já atingiu sua cota individual recebe recusa mesmo com o contador global longe do teto. **Correção:** ao diagnosticar recusa, **verifique os dois contadores** (`GET /discount_coupons/:id`) e cruze com o histórico de uso daquele cliente antes de assumir que é defeito.

- ❌ **Enviar lote de relacionamento acima de 100 registros num único POST:** parece eficiente mandar os 500 `customer_id` de uma vez para reduzir chamadas. **Por quê quebra:** o `create_relationship` aceita **no máximo 100 registros** por chamada e estoura com `HTTP 400`; mesmo dentro do limite, rajadas sem pausa podem disparar `HTTP 429`. **Correção:** divida em lotes de até 100 registros, com pausa entre eles, e aplique backoff exponencial (1s, 2s, 4s, 8s) em caso de `429`.

## Webhooks relacionados

> **Cupons não possuem escopo de webhook próprio.** Não existe escopo `coupon`/`discount_coupon` no sistema de notificação da Tray. Criar, editar ou excluir um cupom via `/discount_coupons` **não** dispara nenhum webhook.

O efeito de um cupom só é observável **indiretamente**, no momento em que é aplicado a um pedido no checkout:

- Escopo `order` (ações: `insert`, `update`) — quando um pedido é criado ou atualizado com um cupom aplicado, o objeto de pedido reflete o desconto. Consulte os campos `coupon_code` e `discount` do pedido via `GET /orders/:id/full`. Ver [`tray-webhooks`](../webhooks/SKILL.md) e [`tray-pedidos`](../pedidos/SKILL.md).

Implicações práticas:

- **Não há como ser notificado em tempo real** de que um cupom foi criado/alterado por outro sistema — para auditar campanhas, faça polling com `GET /discount_coupons` (paginado, máx. 50/página).
- Para medir o **uso** de um cupom, escute o escopo `order`: ao receber `order_insert`/`order_update`, consulte o pedido e verifique `coupon_code`/`discount`. Lembre-se de que o webhook chega como `application/x-www-form-urlencoded` (campos `seller_id`, `scope_id`, `scope_name=order`, `act`).
- O escopo `order` precisa estar habilitado na loja — por padrão a Tray libera apenas `order`; demais escopos exigem ticket de suporte. Detalhes em [`tray-webhooks`](../webhooks/SKILL.md).

## Glossário

| Termo | Definição |
|:--|:--|
| `cupom (discount_coupon)` | Código de desconto aplicado pelo cliente no checkout. Recurso da API em `/discount_coupons`; wrapper de payload/resposta `DiscountCoupon`. Difere de lista de preço B2B (desconto por código, não precificação permanente). |
| `code` | Código textual do cupom digitado pelo cliente. Não aceita espaços nem acentos; deve ser único na loja. |
| `type` | Tipo de desconto: `$` (valor fixo em reais) ou `%` (percentual). Determina como o campo `value` é interpretado. |
| `value` | Valor do desconto, interpretado conforme `type` (reais se `$`, porcentagem se `%`). |
| `coupon_type` | Abrangência/comportamento do cupom: `loja` (genérico, toda a loja), `cliente` (restrito a clientes vinculados), `troca` (gerado a partir de um `order_id`), `presente` (entrega um produto como brinde). |
| `local_application` | Escopo de aplicação do desconto: `loja`, `produtos`, `marcas` ou `categorias`. Indica qual endpoint de relacionamento (`product`/`category`/`brand`) consultar ou criar. |
| `freight_application` | Comportamento do cupom quanto ao frete: `nao_aplicavel`, `desconto` (reduz o valor do frete) ou `frete_gratis` (zera o frete). |
| `cumulative_discount` | Flag que indica se o cupom acumula com desconto progressivo/outros descontos. `1` = acumulativo; `0` = exclusivo (não empilha). |
| `usage_counter_limit` | Limite total de usos do cupom somando todos os clientes. Deve ser `>= usage_counter_limit_customer`; `0`/vazio tende a indicar ilimitado. |
| `usage_counter_limit_customer` | Limite de usos do cupom por cliente individual. Deve ser `<= usage_counter_limit`. |
| `value_start / value_end` | Faixa de valor de produto/pedido elegível ao desconto. `value_start` = mínimo, `value_end` = máximo. Vazios = sem restrição de valor. |
| `starts_at / ends_at` | Janela de validade do cupom no formato `YYYY-MM-DD`. Fora desse intervalo o cupom não é aplicável. |
| `create_relationship` | Endpoint único (`POST /discount_coupons/create_relationship/:id`) para vincular clientes, produtos, categorias, marcas, fretes ou gerar cupom de troca. O tipo é definido pela chave-wrapper do corpo; máximo 100 registros por chamada. |
| `DiscountCouponShipping (frete grátis vs desconto)` | Relacionamento de frete: `value=0` configura frete grátis; `value=n` configura desconto de R$n no frete. Pode também restringir a `shipping_id` específicos. |
| `cupom de troca (troca)` | Cupom gerado a partir de um pedido existente, criado via `DiscountCouponCustomer` com `order_id` no `create_relationship`. |
| `cupom-presente (presente)` | Cupom que entrega um produto como brinde em vez de desconto monetário; consultado via `gift_relationship`. |

## Referências

- **Documentação oficial:** https://developers.tray.com.br/#api-de-cupom
- **Endpoint base:** `/discount_coupons` (wrapper de payload/resposta `DiscountCoupon`) — **não** `/coupons` nem `Coupon`.
- **Skills relacionadas:**
  - [`tray-pedidos`](../pedidos/SKILL.md) — onde o cupom é efetivamente aplicado (`coupon_code`, `discount`); fonte do `order_id` para cupom de troca.
  - [`tray-clientes`](../clientes/SKILL.md) — origem do `customer_id` para cupons `coupon_type=cliente` e cupons VIP.
  - [`tray-frete`](../frete/SKILL.md) — origem do `shipping_id`/métodos de envio para cupons com `freight_application=desconto`/`frete_gratis`.
  - [`tray-listas-preco-b2b`](../listas-preco-b2b/SKILL.md) — recurso correto para precificação **permanente** por grupo de cliente (não confundir com cupom).
  - [`tray-webhooks`](../webhooks/SKILL.md) — escopo `order` para observar o uso de cupons (cupons não têm escopo próprio).
- **Regras invariantes da plataforma:** [`skills/visao-geral/SKILL.md`](../visao-geral/SKILL.md) — autenticação OAuth, `access_token` como query param, paginação 50, rate limit, formato de datas.
- **Issue de origem:** ai/tasks#100 (P2.1 — aprofundar skills mais finas; aprofundamento da skill `tray-cupons`).

> **Aviso de verificação:** os exemplos `curl`/Node desta skill estão marcados como **NÃO-VERIFICADO contra sandbox** — devem ser validados contra a sandbox Tray antes do merge (critério de aceite da #100).

## Como Usar no Claude Code

### Exemplos de Prompt

- "cria um cupom PROMO10 de 10% de desconto válido de 01/04 a 30/04, máximo 5 usos por cliente"
- "cria um cupom de frete grátis para compras acima de R$ 150"
- "cria um cupom de R$ 50 fixos (type `$`) cumulativo para a Black Friday"
- "vincula o cupom VIP20 exclusivamente aos 300 clientes do perfil Atacado"
- "restringe o cupom ELETRO15 apenas aos produtos da categoria Eletrônicos"
- "lista todos os cupons da loja e mostra quais estão ativos hoje (17/06/2026)"
- "prorroga a validade do cupom 7 até 31/05 sem recriá-lo"
- "por que o cliente recebe 'cupom inválido' se o cupom ainda está no prazo?"

### O que o Claude faz

1. **Confirma o recurso e o wrapper** — usa `/discount_coupons` com a chave `DiscountCoupon` (nunca `/coupons`/`Coupon`); chama `search_docs.mjs --topic=cupons` antes de gerar código.
2. **Monta o payload de criação** — `Content-Type: application/x-www-form-urlencoded` com wrapper `["DiscountCoupon"]["campo"]`, definindo `code` (sem espaços/acentos), `value`, `type` (`$`/`%`), validade (`starts_at`/`ends_at`) e limites de uso.
3. **Diferencia `$` de `%`** — alerta que `value=10` com `type=%` é 10% e com `type=$` é R$ 10,00 fixos, evitando erro de campanha.
4. **Gera relacionamentos quando há restrição** — `POST /discount_coupons/create_relationship/:id` com a chave-wrapper correta (`DiscountCouponCustomer`/`Product`/`Category`/`Brand`/`Shipping`), dividindo em lotes de até 100 registros.
5. **Configura frete grátis/desconto** — vincula `DiscountCouponShipping` com `value=0` (grátis) ou `value=n` (desconto de R$n).
6. **Valida consistência de limites** — garante `usage_counter_limit >= usage_counter_limit_customer` e checa ambos os contadores ao diagnosticar "cupom inválido".
7. **Aplica as regras invariantes** — `access_token` como query param via env (`TRAY_ACCESS_TOKEN`/`TRAY_API_ADDRESS`), datas `YYYY-MM-DD`, paginação máx. 50, backoff em HTTP 429.

### O que você recebe

- Código de criação de cupom com wrapper `DiscountCoupon` e `Content-Type: application/x-www-form-urlencoded` correto.
- Código de relacionamento via `POST /discount_coupons/create_relationship/:id` com a chave-wrapper adequada e lotes de até 100.
- Exemplos de frete grátis (`value=0`) e desconto de frete (`value=n`) prontos.
- Listagem paginada (`GET /discount_coupons`) com leitura de `coupon_type`/`local_application` para saber qual relacionamento consultar.
- Código de atualização (`PUT`) para prorrogar validade/ajustar limites sem recriar o cupom.
- Checklist de diagnóstico de "cupom inválido" (validade, ambos os contadores de uso, `cumulative_discount`, relacionamento ausente).
- Todos os exemplos com tokens via variáveis de ambiente e marcados como **NÃO-VERIFICADO contra sandbox**.

### Pré-requisitos

- `access_token` válido configurado em variável de ambiente (`TRAY_ACCESS_TOKEN`); nunca como literal no código.
- `TRAY_API_ADDRESS` da loja (varia por loja, retornado no callback OAuth da Etapa 2).
- `code` único na loja, sem espaços nem acentos.
- `customer_id` (de `tray-clientes`), `product_id`, `category_id`, `brand_id` ou `shipping_id` (de `tray-frete`) quando o cupom tiver restrições de relacionamento.
- `order_id` (de `tray-pedidos`) quando for gerar um cupom de troca (`coupon_type=troca`).
