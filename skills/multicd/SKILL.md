---
name: tray-multicd
description: >
  API de Multi-CD (Centros de Distribuição) da Tray. Cobre o CRUD de centros
  de distribuição (`/multicd/distribution-centers`: listar, consultar, criar,
  atualizar e excluir CDs) e a gestão de estoque distribuído por CD
  (`/multicd/stock/detailed/product/:id`, `/multicd/stock/detailed/variant/:id`
  e `PUT /multicd/distribution-centers/:id/stock`), além dos webhooks de estoque
  (`product_stock`/`variant_stock`) para sincronização com ERPs. DISAMBIGUATION:
  o wrapper de CD é `DistributionCenter`; o de estoque é `DistributionCenterProduct`
  (produto sem variações) ou `DistributionCenterVariant` (variação) — não use
  `DistributionCenter` para atualizar estoque. Multi-CD é estoque distribuído por
  múltiplos depósitos — não confundir com o estoque único do campo `stock` de
  `tray-produtos`.
when_to_use: >
  Use quando o desenvolvedor mencionar: MultiCD, multi-cd, centro de distribuição,
  CD, estoque por CD, distribution center, distribution-centers, estoque
  distribuído, estoque regionalizado, depósito, /multicd, prioridade de CD,
  seleção de CD, estoque detalhado por CD, DistributionCenterProduct,
  DistributionCenterVariant, sincronizar estoque entre depósitos, ou webhook
  product_stock/variant_stock com múltiplos CDs.
when_not_to_use: >
  Não use para estoque único sem múltiplos CDs — nesse caso o estoque é o campo
  `stock` do produto/variação (use tray-produtos ou tray-variacoes). Use esta
  skill apenas quando o recurso MultiCD está ativo na loja (configurado no painel
  Tray). Para cotação/listagem de frete, use tray-frete; para configurar
  formas/tabelas de frete, use tray-configuracao-frete; para o formato genérico,
  retry e parsing de webhooks, use tray-webhooks.
---

## MANDATORY: Tool Calls Required Before Answering

> **Estas chamadas são OBRIGATÓRIAS, não opcionais.** Execute-as antes de gerar
> qualquer código ou payload. Se você está respondendo sem ter chamado a
> ferramenta abaixo, **pare e chame agora**.

### 1. Buscar documentação atualizada (sempre)

```bash
node skills/tray-dev/scripts/search_docs.mjs --topic=multicd "<termo da pergunta>"
```

- `<TOPIC_SLUG>`: ver tabela em `skills/tray-dev/SKILL.md`.
- Use os trechos retornados como fonte primária; este SKILL.md é resumo denso.

### 2. Revisar campos (este recurso ainda NÃO tem `validate.mjs`)

> **Nota:** o recurso `multicd` ainda não possui `scripts/validate.mjs` local.
> A chamada **OBRIGATÓRIA** a `search_docs.mjs` acima continua valendo. Como não
> há validador automático, **você é responsável** por revisar manualmente cada
> campo obrigatório contra a doc retornada por `search_docs.mjs` e contra os
> schemas de referência em `skills/multicd/schemas/`
> (`distribution_center.create.json`, `distribution_center.update.json`) antes de
> retornar qualquer código. Confira em especial: chave de recurso
> `DistributionCenter` no body de CD; wrapper `DistributionCenterProduct` x
> `DistributionCenterVariant` na atualização de estoque (item com variações usa
> `Variant`); e `zip_code` normalizado para 8 dígitos numéricos sem traço.

## Antes de responder

> Execute estas verificações antes de gerar qualquer payload ou código:

1. Confirme o método HTTP e o endpoint correto para a operação solicitada
   (CRUD em `/multicd/distribution-centers`, consulta de estoque em
   `/multicd/stock/detailed/product/:id` ou `/variant/:id`, e atualização de
   estoque em `/multicd/distribution-centers/:id/stock`).
2. Identifique os campos obrigatórios listados neste documento — `name`,
   `zip_code`, `address`, `city` e `state` nunca podem faltar na criação de CD,
   e `stock` na atualização de estoque; não omita nenhum.
3. Verifique que `access_token` não aparece como literal string no código
   gerado — use sempre `TRAY_ACCESS_TOKEN` e `TRAY_API_ADDRESS` por variável de
   ambiente, e sempre como query parameter (`?access_token={token}`).
4. Confirme que esta é a skill correta para o recurso: Multi-CD pressupõe o
   recurso ativo na loja e estoque distribuído por depósito; se for estoque
   único, leia `when_not_to_use` e redirecione para `tray-produtos`/`tray-variacoes`.

# API de Multi-CD (Centros de Distribuição) — Tray

Documentação oficial: https://developers.tray.com.br/#api-de-multicd

> **Atenção (disambiguation):** o wrapper de payload/resposta de um **centro de
> distribuição** é `DistributionCenter`; o de **estoque por CD** é
> `DistributionCenterProduct` (produto sem variações) ou `DistributionCenterVariant`
> (variação). Trocar o wrapper — em especial usar `DistributionCenterProduct` para
> um item que tem variações — é a causa #1 de estoque inconsistente e de `HTTP 400`
> neste recurso.

## Visão geral

O Multi-CD é o recurso da Tray para uma mesma loja operar **múltiplos Centros de
Distribuição** (depósitos físicos), cada um com endereço, CEP, prioridade e
status (`active`) próprios, e estoque mantido **por item em cada CD**. Em vez de
um único saldo de estoque (campo `stock` do produto/variação em `tray-produtos`),
cada produto ou variação passa a ter um saldo discriminado por CD; o estoque
exibido na vitrine é a **soma** dos saldos de todos os CDs com `active=1`. A API
expõe duas famílias de endpoints: o **CRUD de CDs** em
`/multicd/distribution-centers` (listar, consultar por `id`, criar, atualizar e
excluir) e a **gestão de estoque distribuído** — consulta de estoque detalhado
por produto (`GET /multicd/stock/detailed/product/:id`) e por variação
(`GET /multicd/stock/detailed/variant/:id`), e atualização de saldo de um item
dentro de um CD específico (`PUT /multicd/distribution-centers/:id/stock`). O
recurso precisa estar **ativo no painel da loja**; com Multi-CD desativado, esses
endpoints retornam `HTTP 404` e o estoque volta a ser o campo único de produto.

O Multi-CD conecta-se a vários outros pontos do fluxo Tray. A atualização de
estoque exige o `product_id` (ver `tray-produtos`) ou o `variant_id` (ver
`tray-variacoes`) do item, e o `id` do CD obtido via `GET
/multicd/distribution-centers`. O `zip_code` de cada CD alimenta o **cálculo de
frete** e a regra de **proximidade** na seleção do CD de origem do pedido (ver
`tray-frete` para cotar via `GET /shippings/cotation/` e `tray-configuracao-frete`
para as formas/tabelas de frete da loja). A lógica de seleção de CD em um pedido
combina disponibilidade de estoque, `priority` (menor número = maior prioridade),
proximidade (CEP do CD x CEP de entrega) e status ativo — diagnósticos de
"produto disponível mas pedido não fecha" caem aqui (ver `tray-pedidos`). Para
sincronização em tempo real com ERPs, qualquer alteração de saldo em qualquer CD
dispara os webhooks `product_stock`/`variant_stock` (ação `update`); o webhook
sinaliza **qual** item mudou (`scope_id`), e o saldo real por CD deve ser
reconsultado via estoque detalhado (formato e retry dos webhooks em `tray-webhooks`).

Invariantes da plataforma que valem para **toda** chamada deste recurso: (1) o
`access_token` é passado **sempre como query parameter** (`?access_token={token}`),
nunca em header `Authorization` — token em header retorna `HTTP 401`; (2) a URL
base é `https://{api_address}/`, e o `api_address` **varia por loja** (retornado
no callback OAuth) — usar o endereço errado, ou chamar com Multi-CD inativo,
retorna `HTTP 404`; (3) todo body de `POST`/`PUT` de CD deve estar envolto na
chave de recurso `DistributionCenter`, e a atualização de estoque na chave
`DistributionCenterProduct` ou `DistributionCenterVariant` conforme o item tenha
ou não variações; (4) listagens paginam com `limit` (padrão 30, **máximo 50**) e
`page`, lendo `paging.total` para iterar; (5) datas usam `YYYY-MM-DD` e
timestamps `YYYY-MM-DD HH:MM:SS` (horário de Brasília); (6) o rate limit é 180
req/min e 10.000 req/dia — `HTTP 429` exige backoff exponencial (1s, 2s, 4s, 8s)
e, em sincronização de estoque em lote, lotes de até **150 itens com pausa de
60 s**. Validação BR: o `zip_code` do CD é um CEP de **8 dígitos numéricos sem
traço** (`01310100`, não `01310-100`); enviar com máscara quebra o cálculo de
frete e pode retornar `HTTP 400`. Como o recurso ainda não tem `validate.mjs`,
revise manualmente esses campos contra os schemas em `skills/multicd/schemas/`
antes de enviar.

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/multicd/distribution-centers` | Listar centros de distribuição da loja com paginação |
| GET | `/multicd/distribution-centers/:id` | Consultar os dados de um centro de distribuição por ID |
| POST | `/multicd/distribution-centers` | Cadastrar um novo centro de distribuição |
| PUT | `/multicd/distribution-centers/:id` | Atualizar os dados de um centro de distribuição existente |
| DELETE | `/multicd/distribution-centers/:id` | Excluir um centro de distribuição |
| GET | `/multicd/stock/detailed/product/:id` | Consultar o estoque detalhado de um produto em todos os CDs |
| GET | `/multicd/stock/detailed/variant/:id` | Consultar o estoque detalhado de uma variação em todos os CDs |
| PUT | `/multicd/distribution-centers/:id/stock` | Atualizar o estoque de um produto/variação dentro de um CD específico |

**Autenticação:** `?access_token={token}` em **todas** as chamadas — sempre como query parameter, nunca em header (`Authorization: Bearer` é ignorado e retorna HTTP 401). A URL base `https://{api_address}/` varia por loja (retornada no callback OAuth). MultiCD precisa estar **ativo** no painel da loja.

### GET /multicd/distribution-centers

Lista os centros de distribuição cadastrados na loja, com paginação.

**Quando usar:** para inventariar os CDs cadastrados, descobrir os IDs e prioridades antes de atualizar estoque ou diagnosticar de qual CD um pedido foi atendido.

**Pré-requisitos:**

- `access_token` válido como query param.
- `TRAY_API_ADDRESS` da loja (varia por loja, retornado no callback OAuth).
- MultiCD ativo na loja (configurado no painel Tray).

**Schema:** sem body — apenas query params de paginação.

| Parâmetro | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `access_token` | string | Sim | Token de acesso (query param). |
| `limit` | number | Não | Itens por página (padrão 30, máximo 50). |
| `page` | number | Não | Número da página. Use `paging.total` da resposta para paginar. |

**Exemplo (curl):**

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s -G "https://${TRAY_API_ADDRESS}/multicd/distribution-centers" \
  --data-urlencode "access_token=${TRAY_ACCESS_TOKEN}" \
  --data-urlencode "limit=50" \
  --data-urlencode "page=1"
```

**Exemplo (Node):**

```javascript
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;

const url = new URL(`https://${base}/multicd/distribution-centers`);
url.searchParams.set("access_token", token);
url.searchParams.set("limit", "50");
url.searchParams.set("page", "1");

const res = await fetch(url);
if (res.status === 429) throw new Error("Rate limit — aplicar backoff exponencial");
const data = await res.json();
console.log(data.paging?.total, data);
```

**Erros comuns:**

| Código | Causa | Como resolver |
|:--|:--|:--|
| 401 | `access_token` expirado (3h) ou enviado em header `Authorization` em vez de query param | Renovar via `GET /auth?refresh_token={token}`; sempre passar `?access_token={token}` na query string |
| 404 | `api_address` incorreto (varia por loja) ou MultiCD não ativo na loja | Usar o `api_address` do callback OAuth; confirmar que o recurso MultiCD está habilitado |
| 429 | Rate limit (180 req/min ou 10k/dia) | Backoff exponencial (1s, 2s, 4s, 8s) |

### GET /multicd/distribution-centers/:id

Consulta os dados completos de um único centro de distribuição por ID.

**Quando usar:** para obter a configuração completa de um único CD (CEP, endereço, prioridade, status) antes de editar ou diagnosticar a lógica de seleção de CD.

**Pré-requisitos:**

- `access_token` válido.
- `id` do CD (obtido via `GET /multicd/distribution-centers`).

**Schema:** sem body — apenas parâmetro de path `:id`.

| Parâmetro | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `access_token` | string | Sim | Token de acesso (query param). |
| `:id` | number | Sim | ID do CD (path param). |

**Exemplo (curl):**

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s -G "https://${TRAY_API_ADDRESS}/multicd/distribution-centers/45" \
  --data-urlencode "access_token=${TRAY_ACCESS_TOKEN}"
```

**Exemplo (Node):**

```javascript
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;
const cdId = 45;

const url = new URL(`https://${base}/multicd/distribution-centers/${cdId}`);
url.searchParams.set("access_token", token);

const res = await fetch(url);
if (res.status === 404) throw new Error("CD inexistente ou api_address errado");
const data = await res.json();
console.log(data);
```

**Erros comuns:**

| Código | Causa | Como resolver |
|:--|:--|:--|
| 401 | Token expirado ou enviado em header | Renovar token; usar query param |
| 404 | ID de CD inexistente ou `api_address` errado | Confirmar o `id` via listagem e o `api_address` da loja |
| 429 | Rate limit | Backoff exponencial (1s, 2s, 4s, 8s) |

### POST /multicd/distribution-centers

Cadastra um novo centro de distribuição na loja.

**Quando usar:** ao adicionar um novo depósito/CD físico à loja, definindo CEP, endereço, prioridade e status ativo.

**Pré-requisitos:**

- `access_token` válido.
- MultiCD ativo na loja.
- `name`, `zip_code`, `address`, `city` e `state` definidos.
- CEP do CD validado (8 dígitos, apenas números, sem traço).

**Schema:** [`schemas/distribution_center.create.json`](schemas/distribution_center.create.json). Body envolto na chave de recurso `DistributionCenter`.

| Campo | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `name` | string | Sim | Nome do CD (ex: "CD São Paulo"). |
| `zip_code` | string | Sim | CEP do CD — 8 dígitos numéricos, sem traço. |
| `address` | string | Sim | Endereço completo do CD. |
| `city` | string | Sim | Cidade do CD. |
| `state` | string | Sim | Estado/UF — sigla de 2 letras (ex: SP, MG). |
| `priority` | number | Não | Prioridade na seleção; menor número = maior prioridade. |
| `active` | number | Não | `1` = ativo, `0` = inativo. |

**Exemplo (curl):**

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s -X POST "https://${TRAY_API_ADDRESS}/multicd/distribution-centers?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "DistributionCenter": {
      "name": "CD São Paulo",
      "zip_code": "01310100",
      "address": "Av. Paulista, 1000",
      "city": "São Paulo",
      "state": "SP",
      "priority": 1,
      "active": 1
    }
  }'
```

**Exemplo (Node):**

```javascript
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;

const payload = {
  DistributionCenter: {
    name: "CD São Paulo",
    zip_code: "01310100", // 8 dígitos, sem traço
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    priority: 1,
    active: 1,
  },
};

const url = `https://${base}/multicd/distribution-centers?access_token=${token}`;
const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
if (res.status === 400) throw new Error("Validar wrapper DistributionCenter e obrigatórios");
const data = await res.json();
console.log(data.id, data);
```

**Erros comuns:**

| Código | Causa | Como resolver |
|:--|:--|:--|
| 400 | Faltou a chave `DistributionCenter`, campo obrigatório ausente (`name`/`zip_code`/`address`/`city`/`state`) ou CEP com formato inválido (com traço/letras) | Envolver os dados na chave `DistributionCenter`; preencher todos os obrigatórios; normalizar o `zip_code` para 8 dígitos numéricos |
| 401 | Token expirado ou enviado em header | Renovar token; usar query param |
| 429 | Rate limit | Backoff exponencial (1s, 2s, 4s, 8s) |

### PUT /multicd/distribution-centers/:id

Atualiza os dados de um centro de distribuição existente.

**Quando usar:** para renomear o CD, ajustar a prioridade, corrigir o CEP/endereço ou desativar (`active=0`) o CD sem excluí-lo.

**Pré-requisitos:**

- `access_token` válido.
- `id` do CD.
- Payload com a chave de recurso `DistributionCenter`.

**Schema:** [`schemas/distribution_center.update.json`](schemas/distribution_center.update.json). Body envolto na chave de recurso `DistributionCenter`.

| Campo | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `:id` | number | Sim | ID do CD (path param). |
| `name` | string | Não | Novo nome do CD. |
| `zip_code` | string | Não | CEP — 8 dígitos numéricos, sem traço. |
| `address` | string | Não | Endereço completo. |
| `city` | string | Não | Cidade. |
| `state` | string | Não | UF — sigla de 2 letras. |
| `priority` | number | Não | Prioridade na seleção; menor número = maior prioridade. |
| `active` | number | Não | `1` = ativo, `0` = inativo (forma segura de tirar de operação). |

**Exemplo (curl):**

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s -X PUT "https://${TRAY_API_ADDRESS}/multicd/distribution-centers/45?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "DistributionCenter": {
      "priority": 2,
      "active": 0
    }
  }'
```

**Exemplo (Node):**

```javascript
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;
const cdId = 45;

const payload = {
  DistributionCenter: {
    priority: 2,
    active: 0, // desativa sem excluir
  },
};

const url = `https://${base}/multicd/distribution-centers/${cdId}?access_token=${token}`;
const res = await fetch(url, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
if (res.status === 404) throw new Error("ID de CD inexistente");
const data = await res.json();
console.log(data);
```

**Erros comuns:**

| Código | Causa | Como resolver |
|:--|:--|:--|
| 400 | Falta da chave `DistributionCenter` ou CEP em formato inválido | Envolver na chave `DistributionCenter`; normalizar `zip_code` |
| 401 | Token expirado ou enviado em header | Renovar token; usar query param |
| 404 | ID de CD inexistente | Confirmar `id` via listagem |
| 429 | Rate limit | Backoff exponencial (1s, 2s, 4s, 8s) |

### DELETE /multicd/distribution-centers/:id

Exclui definitivamente um centro de distribuição.

**Quando usar:** ao descomissionar definitivamente um depósito. Antes de excluir, desative (`active=0`) e zere/realoque o estoque para evitar impacto em pedidos em aberto.

**Pré-requisitos:**

- `access_token` válido.
- `id` do CD.
- CD preferencialmente já desativado (`active=0`).

**Schema:** sem body — apenas parâmetro de path `:id`.

| Parâmetro | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `access_token` | string | Sim | Token de acesso (query param). |
| `:id` | number | Sim | ID do CD a excluir (path param). |

**Exemplo (curl):**

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s -X DELETE "https://${TRAY_API_ADDRESS}/multicd/distribution-centers/45?access_token=${TRAY_ACCESS_TOKEN}"
```

**Exemplo (Node):**

```javascript
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;
const cdId = 45;

const url = `https://${base}/multicd/distribution-centers/${cdId}?access_token=${token}`;
const res = await fetch(url, { method: "DELETE" });
if (res.status === 404) throw new Error("ID inexistente ou já excluído");
const data = await res.json();
console.log(data);
```

**Erros comuns:**

| Código | Causa | Como resolver |
|:--|:--|:--|
| 401 | Token expirado ou enviado em header | Renovar token; usar query param |
| 404 | ID inexistente ou já excluído | Confirmar `id` via listagem |
| 429 | Rate limit | Backoff exponencial (1s, 2s, 4s, 8s) |

### GET /multicd/stock/detailed/product/:id

Consulta o estoque detalhado de um produto, discriminado por CD.

**Quando usar:** após receber um webhook `product_stock`, para obter o estoque por CD do produto e sincronizar com o ERP; ou para auditar a distribuição de estoque de um produto.

**Pré-requisitos:**

- `access_token` válido.
- `product_id` do produto (ver `tray-produtos`).
- MultiCD ativo.

**Schema:** sem body — apenas parâmetro de path `:id` (`product_id`).

| Parâmetro | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `access_token` | string | Sim | Token de acesso (query param). |
| `:id` | number | Sim | `product_id` do produto (path param). |

**Exemplo (curl):**

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s -G "https://${TRAY_API_ADDRESS}/multicd/stock/detailed/product/123" \
  --data-urlencode "access_token=${TRAY_ACCESS_TOKEN}"
```

**Exemplo (Node):**

```javascript
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;
const productId = 123;

const url = new URL(`https://${base}/multicd/stock/detailed/product/${productId}`);
url.searchParams.set("access_token", token);

const res = await fetch(url);
if (res.status === 404) throw new Error("product_id inexistente ou api_address errado");
const data = await res.json();
// Some o stock dos CDs com active=1 para obter o estoque de vitrine
console.log(data);
```

**Erros comuns:**

| Código | Causa | Como resolver |
|:--|:--|:--|
| 401 | Token expirado ou enviado em header | Renovar token; usar query param |
| 404 | `product_id` inexistente ou `api_address` errado | Confirmar `product_id` via `tray-produtos` e o `api_address` da loja |
| 429 | Rate limit | Backoff exponencial (1s, 2s, 4s, 8s) |

### GET /multicd/stock/detailed/variant/:id

Consulta o estoque detalhado de uma variação, discriminado por CD.

**Quando usar:** após receber um webhook `variant_stock`, para obter o estoque por CD da variação específica (cor/tamanho) e sincronizar com sistemas externos.

**Pré-requisitos:**

- `access_token` válido.
- `variant_id` da variação (ver `tray-variacoes`).
- MultiCD ativo.

**Schema:** sem body — apenas parâmetro de path `:id` (`variant_id`).

| Parâmetro | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `access_token` | string | Sim | Token de acesso (query param). |
| `:id` | number | Sim | `variant_id` da variação (path param). |

**Exemplo (curl):**

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
curl -s -G "https://${TRAY_API_ADDRESS}/multicd/stock/detailed/variant/789" \
  --data-urlencode "access_token=${TRAY_ACCESS_TOKEN}"
```

**Exemplo (Node):**

```javascript
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;
const variantId = 789;

const url = new URL(`https://${base}/multicd/stock/detailed/variant/${variantId}`);
url.searchParams.set("access_token", token);

const res = await fetch(url);
if (res.status === 404) throw new Error("variant_id inexistente ou api_address errado");
const data = await res.json();
console.log(data);
```

**Erros comuns:**

| Código | Causa | Como resolver |
|:--|:--|:--|
| 401 | Token expirado ou enviado em header | Renovar token; usar query param |
| 404 | `variant_id` inexistente ou `api_address` errado | Confirmar `variant_id` via `tray-variacoes` e o `api_address` da loja |
| 429 | Rate limit | Backoff exponencial (1s, 2s, 4s, 8s) |

### PUT /multicd/distribution-centers/:id/stock

Atualiza o estoque de um produto ou variação dentro de um CD específico.

**Quando usar:** para definir/ajustar a quantidade em estoque de um item em um CD individual — base da sincronização de estoque distribuído com o ERP.

**Pré-requisitos:**

- `access_token` válido.
- `id` do CD na URL.
- `product_id` ou `variant_id` do item a atualizar.
- Payload com a chave de recurso `DistributionCenterProduct` (produto sem variações) ou `DistributionCenterVariant` (variação).

**Schema:** [`schemas/distribution_center.update.json`](schemas/distribution_center.update.json). Body envolto em `DistributionCenterProduct` **ou** `DistributionCenterVariant` conforme o item tenha variações.

| Campo | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `:id` | number | Sim | ID do CD (path param). |
| `product_id` | number | Condicional | ID do produto (sem variações) — dentro de `DistributionCenterProduct`. |
| `variant_id` | number | Condicional | ID da variação — dentro de `DistributionCenterVariant`. |
| `stock` | number | Sim | Quantidade em estoque do item no CD (inteiro >= 0). |

**Exemplo (curl):**

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
# Produto sem variações: wrapper DistributionCenterProduct
curl -s -X PUT "https://${TRAY_API_ADDRESS}/multicd/distribution-centers/45/stock?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "DistributionCenterProduct": {
      "product_id": 123,
      "stock": 40
    }
  }'

# Variação: wrapper DistributionCenterVariant
curl -s -X PUT "https://${TRAY_API_ADDRESS}/multicd/distribution-centers/45/stock?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "DistributionCenterVariant": {
      "variant_id": 789,
      "stock": 15
    }
  }'
```

**Exemplo (Node):**

```javascript
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;
const cdId = 45;

// Item COM variações -> use DistributionCenterVariant + variant_id.
// Item SEM variações -> use DistributionCenterProduct + product_id.
const payload = {
  DistributionCenterVariant: {
    variant_id: 789,
    stock: 15,
  },
};

const url = `https://${base}/multicd/distribution-centers/${cdId}/stock?access_token=${token}`;
const res = await fetch(url, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
if (res.status === 400) throw new Error("Wrapper trocado — usar Variant p/ item com variações");
if (res.status === 429) throw new Error("Rate limit — lotes de 150 itens com pausa de 60s");
const data = await res.json();
console.log(data);
```

**Erros comuns:**

| Código | Causa | Como resolver |
|:--|:--|:--|
| 400 | Faltou a chave `DistributionCenterProduct`/`DistributionCenterVariant`, ou wrapper trocado (usar `Variant` para produto sem variações) | Usar o wrapper correto conforme o item ter ou não variações; envolver `stock` na chave certa |
| 401 | Token expirado ou enviado em header | Renovar token; usar query param |
| 404 | `id` do CD inexistente ou item não associado ao CD | Confirmar o `id` do CD via listagem e que o item existe |
| 429 | Rate limit; comum em sincronização em lote de estoque | Backoff exponencial; lotes de até 150 itens com pausa de 60s |

## Edge cases

> Comportamentos do MultiCD que não são óbvios pela leitura dos endpoints e que mudam a forma de gerar código, depurar pedidos e sincronizar estoque. Antes de aplicar qualquer um, confirme contra a doc via `node skills/tray-dev/scripts/search_docs.mjs --topic=multicd "<termo>"`.

- **Produto com variações exige o wrapper `DistributionCenterVariant`, nunca `DistributionCenterProduct`.** O estoque de um produto que possui variações é a **soma das variações**, não um valor próprio do produto-pai. Atualizar o estoque pelo `product_id` (com `DistributionCenterProduct`) em um item que tem variações deixa o saldo inconsistente: a vitrine continua somando as variações e ignora o valor gravado no pai. Sempre identifique se o item tem variações (via `tray-variacoes` ou o array `Variant` em `GET /products/:id`) e atualize cada `variant_id`.

  ```bash
  # ERRADO para item com variações — grava no pai, vitrine ignora
  # PUT /multicd/distribution-centers/12/stock
  # {"DistributionCenterProduct": {"product_id": 555, "stock": 40}}

  # CORRETO — atualiza a variação dentro do CD
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X PUT \
    "https://${TRAY_API_ADDRESS}/multicd/distribution-centers/12/stock?access_token=${TRAY_ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"DistributionCenterVariant": {"variant_id": 9001, "stock": 40}}'
  ```

- **O estoque exibido na vitrine é a SOMA de todos os CDs `active=1`, não o do CD prioritário.** Um produto pode aparecer disponível ao cliente mesmo com o CD de maior prioridade (`priority` menor) zerado, desde que outro CD ativo tenha saldo. Ao depurar "produto aparece disponível mas o pedido não fecha" ou "vendi mais do que tinha no CD principal", consulte `GET /multicd/stock/detailed/product/:id` e some apenas os CDs com `active=1` — não confie no saldo de um único CD.

  ```bash
  # Inspecionar o saldo por CD antes de concluir o diagnóstico
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl "https://${TRAY_API_ADDRESS}/multicd/stock/detailed/product/555?access_token=${TRAY_ACCESS_TOKEN}"
  # Some o stock somente das entradas com active=1; CDs inativos não contam para a vitrine.
  ```

- **CD desativado (`active=0`) sai da seleção e da soma, mas mantém o saldo cadastrado.** Desativar é a forma segura de tirar um CD de operação sem perder histórico: o saldo continua gravado, porém não é considerado nem na vitrine nem na seleção de atendimento. Isso é o passo correto **antes** de um `DELETE` — primeiro `active=0`, depois realoque/zere o estoque, e só então exclua. Excluir direto um CD que ainda participa de pedidos em aberto impacta esses pedidos.

  ```bash
  # Tirar o CD de operação sem perder o histórico de estoque
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X PUT \
    "https://${TRAY_API_ADDRESS}/multicd/distribution-centers/7?access_token=${TRAY_ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"DistributionCenter": {"active": 0}}'
  ```

- **Uma única alteração de estoque pode gerar múltiplos webhooks — um por CD afetado.** Com MultiCD ativo, os escopos `product_stock` e `variant_stock` (ação `update`) disparam para alteração em **qualquer** CD. O mesmo `scope_id` (id do item) pode chegar várias vezes em sequência, uma para cada CD movimentado. Trate idempotência e, em vez de confiar no valor do disparo, **reconsulte o estoque detalhado** para obter o saldo real por CD. O payload do webhook chega sempre como `application/x-www-form-urlencoded`, então `scope_id`/`scope_name`/`act` saem de campos de formulário, não de JSON.

  ```js
  // Receptor: responde 200 rápido, reconsulta o estoque por CD
  // NÃO-VERIFICADO contra sandbox — validar antes do merge.
  app.post('/webhooks/tray', express.urlencoded({ extended: false }), async (req, res) => {
    res.sendStatus(200); // responda antes de processar
    const { scope_name, scope_id, act } = req.body; // x-www-form-urlencoded, não JSON
    if ((scope_name === 'product_stock' || scope_name === 'variant_stock') && act === 'update') {
      const tipo = scope_name === 'variant_stock' ? 'variant' : 'product';
      await fetch(
        `https://${process.env.TRAY_API_ADDRESS}/multicd/stock/detailed/${tipo}/${scope_id}` +
        `?access_token=${process.env.TRAY_ACCESS_TOKEN}`
      ); // fonte de verdade do saldo por CD
    }
  });
  ```

- **CEP do CD com máscara ou incorreto degrada frete e seleção por proximidade.** O `zip_code` do CD alimenta tanto o cálculo de frete quanto a regra de proximidade (CEP do CD x CEP de entrega). Um CEP com traço/letras (`01310-100`) pode retornar `HTTP 400` no cadastro; um CEP numericamente correto mas **errado** faz a loja escolher um CD distante, encarecendo o frete e aumentando o prazo — mesmo com `priority` configurada corretamente. Normalize sempre para 8 dígitos numéricos e valide o CEP real do depósito.

  ```bash
  # zip_code DEVE ter 8 dígitos numéricos, sem traço
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -X POST \
    "https://${TRAY_API_ADDRESS}/multicd/distribution-centers?access_token=${TRAY_ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"DistributionCenter": {"name": "CD São Paulo", "zip_code": "01310100", "address": "Av. Paulista, 1000", "city": "São Paulo", "state": "SP", "priority": 1, "active": 1}}'
  ```

- **Pedido sem CD elegível não é alocado — valide cobertura por CEP antes de prometer prazo.** Se nenhum CD `active=1` tem estoque suficiente para **todos** os itens do pedido, a Tray pode não conseguir alocar o pedido a um CD único. Antes de prometer prazo ou fechar o carrinho, teste a cobertura simulando o frete por CEP de destino via `GET /shippings/cotation/` (ver `tray-frete`); se nenhum método retornar, provavelmente não há CD elegível para aquele destino + combinação de itens.

  ```bash
  # Simular cobertura por CEP de destino antes de prometer prazo
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl "https://${TRAY_API_ADDRESS}/shippings/cotation/?access_token=${TRAY_ACCESS_TOKEN}&zipcode=04001001&products[0][product_id]=555&products[0][price]=58.90&products[0][quantity]=2"
  # Resposta vazia / sem método = sem CD elegível para esse destino + itens.
  ```

## Antipadrões

- ❌ **Token em header `Authorization: Bearer`:** a API Tray **ignora** o header e responde `HTTP 401` em toda chamada de MultiCD. O `access_token` precisa ir como **query parameter** (`?access_token={token}`), não em header. Corrija anexando o token à URL: `https://{api_address}/multicd/distribution-centers?access_token=${TRAY_ACCESS_TOKEN}`. Nunca escreva o token literal — use `TRAY_ACCESS_TOKEN` via env.

- ❌ **Omitir a chave de recurso no body de POST/PUT:** enviar `{"name": "CD SP", ...}` em vez de `{"DistributionCenter": {...}}` é a causa #1 de `HTTP 400` na API Tray. Os dados do CD devem ser envoltos em `DistributionCenter`; o estoque deve ir em `DistributionCenterProduct` (produto sem variações) ou `DistributionCenterVariant` (variação). Por quê quebra: a Tray procura a chave de recurso para desempacotar o payload; sem ela, lê os campos obrigatórios como ausentes. Correção: sempre envolva — `{"DistributionCenter": {"name": "CD SP", "zip_code": "01310100", ...}}`.

- ❌ **Excluir (`DELETE`) um CD com estoque/pedidos ativos sem desativar antes:** remover direto um CD que ainda tem saldo ou participa de pedidos em aberto impacta esses pedidos e tira saldo da vitrine de forma abrupta. Por quê quebra: o `DELETE` é definitivo e não dá margem para realocar estoque ou drenar pedidos pendentes. Correção: primeiro `PUT` com `{"DistributionCenter": {"active": 0}}`, realoque ou zere o estoque dos itens daquele CD, confirme que não há pedidos em aberto atrelados, e só então execute o `DELETE`.

- ❌ **Tratar o estoque do CD prioritário como o estoque total da loja:** assumir que o CD de maior `priority` representa todo o saldo leva a **oversell** (vender além do que existe no CD principal, ignorando que outro CD tinha saldo) ou a **esconder itens** que ainda têm estoque em outro CD. Por quê quebra: a vitrine soma **todos** os CDs `active=1`, não um único. Correção: para qualquer decisão de disponibilidade, consulte `GET /multicd/stock/detailed/product/:id` (ou `/variant/:id`) e some apenas as entradas com `active=1`.

- ❌ **Enviar o CEP do CD com máscara (`01310-100`):** o `zip_code` deve ter 8 dígitos numéricos sem traço; máscara ou letras quebram o cálculo de frete e podem retornar `HTTP 400` no cadastro/atualização. Por quê quebra: o motor de frete e a regra de proximidade esperam o CEP normalizado. Correção: normalize antes de enviar — `zip_code.replace(/\D/g, '')` deixando exatamente 8 dígitos.

- ❌ **Confiar no webhook de estoque como fonte de verdade do saldo:** o webhook `product_stock`/`variant_stock` apenas **sinaliza** que houve alteração (`scope_id` = id do item), não entrega o saldo confiável por CD, e pode chegar duplicado ou múltiplo (um por CD). Por quê quebra: usar o disparo como valor leva a saldos defasados, sobrescritos por uma corrida entre webhooks de CDs diferentes. Correção: trate idempotência e **sempre reconsulte** `GET /multicd/stock/detailed/product/:id` (ou `/variant/:id`) para obter os valores reais por CD antes de gravar no ERP.

- ❌ **Parsear o corpo do webhook como JSON:** os webhooks de estoque do MultiCD chegam como `application/x-www-form-urlencoded`, como todos os webhooks Tray. Fazer `JSON.parse(body)` ou ler `req.body` esperando JSON resulta em payload vazio e perda silenciosa do evento. Por quê quebra: `scope_id`/`scope_name`/`act` vêm como campos de formulário, não como propriedades JSON. Correção: use um parser de formulário (`express.urlencoded({ extended: false })` ou equivalente) e leia os campos de `req.body`.

## Webhooks relacionados

O MultiCD reage e emite eventos pela API de notificação Tray. Veja [`../webhooks/SKILL.md`](../webhooks/SKILL.md) para o endpoint receptor, parsing e idempotência.

| Escopo | Ação | Quando dispara no contexto MultiCD | Como reagir |
|:--|:--|:--|:--|
| `product_stock` | `update` | Estoque de um produto alterado em **qualquer** CD ativo. Um único ajuste pode gerar múltiplos disparos (um por CD afetado). | Reconsultar `GET /multicd/stock/detailed/product/:id` para obter o saldo real por CD; não confiar no disparo isolado. |
| `variant_stock` | `update` | Estoque de uma variação (cor/tamanho) alterado em qualquer CD ativo. | Reconsultar `GET /multicd/stock/detailed/variant/:id` antes de sincronizar com o ERP. |
| `store_config` | `update` | Alteração de configuração da loja, **incluindo ativação/desativação do MultiCD**. | Reavaliar se o recurso MultiCD continua ativo antes de assumir estoque por CD. |
| `order` | `insert` / `update` | Pedido criado/atualizado — reflete a alocação de CD feita pela lógica de seleção. | Consultar o pedido para descobrir de qual CD foi atendido. |

**Pontos de atenção:**

- Webhooks Tray **sempre** chegam como `Content-Type: application/x-www-form-urlencoded` — inclusive os de estoque do MultiCD. Parsear o corpo como JSON resulta em payload vazio.
- O campo `scope_id` carrega o **ID do produto ou variação** alterado; use-o para reconsultar o estoque detalhado por CD.
- Por padrão a Tray libera apenas o escopo `order`. Para receber `product_stock`/`variant_stock`/`store_config`, abra chamado no suporte Tray informando a URL de notificação e os escopos desejados.
- Responda **HTTP 200 imediatamente** e processe de forma assíncrona; qualquer código diferente de 200 faz a Tray reenviar com backoff progressivo.
- Trate **idempotência**: o mesmo evento pode chegar mais de uma vez, e um único ajuste de estoque em múltiplos CDs gera múltiplos webhooks.

## Glossário

| Termo | Definição |
|:--|:--|
| **MultiCD** | Recurso da Tray para operar múltiplos Centros de Distribuição (depósitos) em uma mesma loja, com estoque por CD e seleção automática de origem do pedido. Precisa estar ativo no painel da loja. |
| **Centro de Distribuição (CD)** | Depósito físico com endereço, CEP, prioridade e status ativo próprios. Representado pela chave de recurso `DistributionCenter`. |
| **`DistributionCenter`** | Chave de recurso (wrapper) que envolve o payload de POST/PUT de CD: `{"DistributionCenter": {...}}`. |
| **`DistributionCenterProduct`** | Chave de recurso para atualizar o estoque de um produto (sem variações) dentro de um CD: `{"DistributionCenterProduct": {"stock": n}}`. |
| **`DistributionCenterVariant`** | Chave de recurso para atualizar o estoque de uma variação dentro de um CD: `{"DistributionCenterVariant": {"stock": n}}`. |
| **`priority`** | Número de prioridade do CD; menor valor = preferência maior na seleção de atendimento do pedido. |
| **estoque detalhado** | Visão do saldo de um item discriminado por CD, obtida via `GET /multicd/stock/detailed/product/:id` ou `/variant/:id`. |
| **lógica de seleção de CD** | Critérios que a Tray aplica para escolher o CD de um pedido: disponibilidade de estoque, prioridade, proximidade (CEP do CD x CEP de entrega) e status ativo. |
| **estoque total / vitrine** | Quantidade exibida ao cliente na loja, calculada como a soma do estoque de todos os CDs ativos (`active=1`). |
| **`product_stock` / `variant_stock`** | Escopos de webhook (ação `update`) disparados em qualquer alteração de estoque de produto/variação em qualquer CD; usados para sincronização em tempo real com ERPs. |
| **`scope_id`** | Campo do payload do webhook que carrega o ID do produto ou variação alterada; usado para reconsultar o estoque detalhado por CD. |

## Referências

- **Documentação oficial Tray:** https://developers.tray.com.br — seção de MultiCD / Centros de Distribuição e estoque distribuído.
- **Skills relacionadas:**
  - [`../visao-geral/SKILL.md`](../visao-geral/SKILL.md) — regras invariantes da plataforma (auth, payload, paginação, rate limit).
  - [`../produtos/SKILL.md`](../produtos/SKILL.md) — obter `product_id` e entender estoque do produto-pai.
  - [`../variacoes/SKILL.md`](../variacoes/SKILL.md) — obter `variant_id`; estoque do produto-pai é a soma das variações.
  - [`../webhooks/SKILL.md`](../webhooks/SKILL.md) — endpoint receptor, escopos `product_stock`/`variant_stock`/`store_config`, idempotência.
  - [`../frete/SKILL.md`](../frete/SKILL.md) — validar cobertura por CEP (`GET /shippings/cotation/`); o `zip_code` do CD alimenta a seleção por proximidade.
  - [`../pedidos/SKILL.md`](../pedidos/SKILL.md) — descobrir de qual CD um pedido foi atendido.
  - [`../autorizacao/SKILL.md`](../autorizacao/SKILL.md) — fluxo OAuth, renovação de `access_token` e `api_address` por loja.
- **Issue:** ai/tasks#100 (P2.1) — Fase 2: aprofundamento de skills densas.

## Como Usar no Claude Code

### Exemplos de Prompt

- "lista os centros de distribuição da loja com IDs e prioridades"
- "cadastra um novo CD em São Paulo com CEP 01310100 e prioridade 1"
- "atualiza o estoque do produto 123 para 40 unidades no CD 2"
- "consulta o estoque detalhado por CD do produto 123 depois do webhook product_stock"
- "desativa o CD 5 antes de excluí-lo sem impactar pedidos em aberto"
- "por que o produto aparece disponível na vitrine mas o pedido não fecha?"

### O que o Claude faz

1. Identifica a operação (inventariar CDs, cadastrar/editar/excluir CD, ou consultar/atualizar estoque por CD) e seleciona o endpoint correto.
2. Envolve payloads de CD na chave `DistributionCenter` e payloads de estoque na chave certa — `DistributionCenterProduct` (produto sem variações) ou `DistributionCenterVariant` (variação).
3. Passa o `access_token` como **query parameter** e usa o `api_address` da loja, nunca header nem URL fixa.
4. Normaliza o `zip_code` do CD para 8 dígitos numéricos (sem traço) e valida campos obrigatórios (`name`, `zip_code`, `address`, `city`, `state`) antes de enviar.
5. Para diagnóstico de "disponível mas não fecha", consulta `GET /multicd/stock/detailed/product/:id` e inspeciona o campo `active` e o saldo de cada CD, lembrando que a vitrine soma todos os CDs ativos.
6. Em sincronização de estoque com ERP, reconsulta o estoque detalhado após o webhook (não confia no disparo isolado) e aplica lotes de até 150 itens com pausa de 60 s para respeitar o rate limit.
7. Orienta a sequência segura de descomissionamento: `active=0` → realocar/zerar estoque → `DELETE`.

### O que você recebe

- Código de listagem e consulta de CDs com paginação (`limit` máx 50, lendo `paging.total`).
- Código de criação/atualização de CD com wrapper `{"DistributionCenter": {...}}` e `zip_code` normalizado.
- Código de atualização de estoque por CD com o wrapper correto conforme o item tenha ou não variações.
- Rotina de sincronização ERP que reconsulta o estoque detalhado por CD após webhooks `product_stock`/`variant_stock`, com backoff exponencial em HTTP 429.
- Tratamento dos erros comuns: 401 (token em header ou expirado), 400 (falta da chave de recurso ou CEP com máscara), 404 (`api_address`/ID errado ou MultiCD inativo).

### Pré-requisitos

- `access_token` válido configurado via `TRAY_ACCESS_TOKEN` e `api_address` da loja via `TRAY_API_ADDRESS` (variam por loja; retornados no callback OAuth).
- **MultiCD ativo** na loja (configurado no painel Tray).
- `id` do CD para operações específicas (via `GET /multicd/distribution-centers`); `product_id`/`variant_id` (via `tray-produtos`/`tray-variacoes`) para estoque.
- Escopos de webhook `product_stock`/`variant_stock` habilitados via suporte Tray, se for sincronizar estoque em tempo real.

> Todos os exemplos de código gerados são **NÃO-VERIFICADOS contra sandbox — validar antes do merge.**
