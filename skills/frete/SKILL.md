---
name: tray-frete
description: >
  API de cotação e listagem de frete da Tray (recurso `shippings`, somente
  leitura). Cobre dois endpoints GET: `/shippings/cotation/` calcula valor e
  prazo de entrega para um ou mais produtos rumo a um CEP, consultando os
  gateways de frete configurados na loja (Frete-X API, Correios,
  transportadoras); e `/shippings/` lista as formas de envio ativas (id, nome,
  status), sem preço nem prazo. DISAMBIGUATION: este recurso NÃO cria nem
  configura métodos de envio, tabelas de CEP ou gateways — para isso use
  tray-configuracao-frete (`/shippings/method/gateway`,
  `/shippings/method/zipcode_table`). Apenas `/shippings/cotation/` retorna
  preço/prazo; `/shippings/` só lista métodos.
when_to_use: >
  Use quando o desenvolvedor mencionar: frete, cálculo de frete, cotação de
  frete, cotation, shipping, shippings, GET /shippings/cotation/, GET
  /shippings/, calcular frete por CEP, exibir opções de frete no checkout,
  prazo de entrega, delivery_time, frete de carrinho com múltiplos produtos,
  PAC, SEDEX, transportadora, retirada na loja, listar métodos de envio,
  mapear shipping_id, frete grátis na cotação, gateway de frete ou Frete-X API.
when_not_to_use: >
  Não use para CRIAR ou CONFIGURAR métodos de envio, gateways de frete ou
  tabelas de CEP — este recurso é somente leitura (apenas GET); use
  tray-configuracao-frete (`/shippings/method/gateway`,
  `/shippings/method/zipcode_table`). Não use para aplicar desconto de frete
  ou frete grátis por código no checkout (use tray-cupons,
  `shipping_relationship`). Não use para definir peso/dimensões do produto —
  esses vêm do cadastro (use tray-produtos e tray-variacoes). Para emissão de
  etiqueta/rastreamento, use tray-etiquetas-hub / tray-status-pedido.
---

## MANDATORY: Tool Calls Required Before Answering

> **Estas chamadas são OBRIGATÓRIAS, não opcionais.** Execute-as antes de gerar
> qualquer código de consulta. Se você está respondendo sem ter chamado a
> ferramenta abaixo, **pare e chame agora**.

### 1. Buscar documentação atualizada (sempre)

```bash
node skills/tray-dev/scripts/search_docs.mjs --topic=frete "<termo da pergunta>"
```

- `<TOPIC_SLUG>`: ver tabela em `skills/tray-dev/SKILL.md`.
- Use os trechos retornados como fonte primária; este SKILL.md é resumo denso.

### 2. Revisar parâmetros (este recurso NÃO tem `validate.mjs`)

> **Nota:** o recurso `frete` ainda **não** possui `scripts/validate.mjs` local
> — e por ser somente leitura (apenas GET), não há payload de body para
> validar. A chamada **OBRIGATÓRIA** a `search_docs.mjs` acima continua valendo.
> Como não há validador automático, **você é responsável** por revisar
> manualmente cada parâmetro de query contra a doc retornada por
> `search_docs.mjs` e contra os schemas de referência em
> `skills/frete/schemas/` (ver [`schemas/shippings.cotation.json`](schemas/shippings.cotation.json))
> antes de retornar qualquer código. Confira em especial: `zipcode` com 8
> dígitos numéricos (sem traço/ponto), índices `products[n]` incrementados por
> item (não repetir `products[0]`), e `product_id`/`price`/`quantity`
> presentes em cada item.

## Antes de responder

> Execute estas verificações antes de gerar qualquer payload ou código:

1. Confirme o método HTTP e endpoint correto para a operação solicitada:
   `GET /shippings/cotation/` para calcular preço/prazo, ou `GET /shippings/`
   apenas para listar métodos ativos (sem valores).
2. Identifique os parâmetros obrigatórios da cotação — `zipcode`,
   `products[n][product_id]`, `products[n][price]` e `products[n][quantity]`;
   não omita nenhum e incremente o índice `n` por item.
3. Verifique que `access_token` não aparece como literal string no código
   gerado — use sempre `TRAY_ACCESS_TOKEN` e `TRAY_API_ADDRESS` por variável
   de ambiente, e passe o token como query param (`?access_token={token}`),
   nunca em header.
4. Confirme que esta é a skill correta para o recurso: cotação/listagem é
   somente leitura; se for criar/configurar método, gateway ou tabela de CEP,
   leia `when_not_to_use` e redirecione para `tray-configuracao-frete`.

# Frete — API Tray

Documentação oficial: https://developers.tray.com.br/#api-de-integracao-de-frete

> **Atenção (disambiguation):** apenas `GET /shippings/cotation/` retorna preço
> e prazo; `GET /shippings/` somente lista métodos ativos (id, name, active).
> Este recurso é **somente leitura** — não cria nem configura nada. Configuração
> de métodos, gateways e tabelas de CEP fica em `tray-configuracao-frete`.

## Visão geral

A API de Frete da Tray resolve a pergunta "quanto custa e em quantos dias este
carrinho chega neste CEP?". Ela expõe dois endpoints GET e somente leitura:
`GET /shippings/cotation/`, a **única** rota que calcula valores — recebe um
CEP de destino (`zipcode`) e uma lista indexada de produtos
(`products[0]`, `products[1]`, ...) com `product_id`, `price` e `quantity`, e
devolve os métodos de envio disponíveis com `price`, `delivery_time` e
`delivery_time_text`; e `GET /shippings/`, que apenas lista as formas de envio
ativas na loja (id, name, active), sem realizar cotação. A cotação é tipicamente
chamada no checkout ou na página de produto para exibir opções de entrega ao
cliente antes de fechar o pedido.

Por baixo, a cotação consulta automaticamente os **gateways de frete**
configurados na loja (ex.: Frete-X API, Correios, transportadoras) e consolida
o resultado no formato padrão. Isso conecta o frete a vários outros recursos
Tray: o `product_id` e o `price` vêm do cadastro em `tray-produtos`; o peso (em
gramas) e as dimensões usados implicitamente no cálculo vêm de `tray-produtos`
e `tray-variacoes` (a cotação **não** recebe peso/dimensões como parâmetros); a
flag `free_shipping` do produto pode zerar o `price` do frete conforme a
configuração da loja; o `id` do método retornado é o mesmo `shipping_id` usado
ao vincular frete a um cupom (`shipping_relationship` em `tray-cupons`); e a
criação/configuração de métodos, gateways e tabelas de CEP é feita em
`tray-configuracao-frete`, não aqui.

Valem todas as invariantes da plataforma. O `access_token` vai **sempre** como
query param (`?access_token={token}`) — enviá-lo no header `Authorization`
resulta em `HTTP 401`. A URL base `https://{api_address}/` **varia por loja** e
é retornada no callback OAuth; reaproveitar o `api_address` de outra loja gera
`HTTP 404` (use `TRAY_API_ADDRESS` por env). Como esses endpoints são GET, não
há payload envolto em chave de recurso no request; a **response** de cotação usa
o wrapper `Shipping` (array) e a de listagem usa `ShippingMethods[].ShippingMethod`.
O rate limit é de 180 req/min e 10.000 req/dia — e a cotação é especialmente
sensível porque consulta APIs externas (logo é lenta) e costuma ser disparada em
loop a cada digitação de CEP no checkout, estourando facilmente o `HTTP 429`;
aplique backoff exponencial (1s, 2s, 4s, 8s) e cache por CEP + produtos +
quantidade. CEP segue validação BR: 8 dígitos numéricos, sem traço nem ponto.

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/shippings/cotation/` | Calcular o frete (preço e prazo) para um ou mais produtos em direção a um CEP de destino |
| GET | `/shippings/` | Listar as formas de envio (métodos de frete) configuradas e ativas na loja, sem cotação |

**Autenticação:** `?access_token={token}` em **todas** as chamadas — sempre como query parameter, **nunca** em header `Authorization` (header → HTTP 401).

**URL base:** `https://{api_address}/` — varia por loja, retornada no callback OAuth. Use `TRAY_API_ADDRESS` via variável de ambiente.

> **Recurso somente leitura:** a skill `tray-frete` expõe apenas endpoints `GET`. Para **criar/configurar** métodos de envio, gateways ou tabelas de CEP, use `tray-configuracao-frete` (`/shippings/method/gateway`, `/shippings/method/zipcode_table`).

---

### GET /shippings/cotation/

Calcula o frete para um ou mais produtos em direção a um CEP de destino, retornando os métodos de envio disponíveis com **preço** e **prazo**. A Tray consulta automaticamente os gateways de frete configurados na loja (ex.: Frete-X API, Correios, transportadoras) e consolida a resposta no formato padrão da API. É a **única** rota que retorna valores de frete.

**Quando usar:**

- No checkout ou em página de produto, para exibir as opções de frete ao cliente.
- Para calcular o frete de um carrinho com **múltiplos itens** antes de fechar o pedido.

**Pré-requisitos:**

- `access_token` válido como query param (`?access_token={token}`, nunca em header).
- `TRAY_API_ADDRESS` da loja (varia por loja, retornado no callback OAuth).
- `product_id` e `price` de cada produto disponíveis (ver `tray-produtos`).
- CEP de destino com **apenas 8 dígitos numéricos** (sem traço/ponto).
- Quantidade de cada produto.

**Schema:** sem body — apenas query params: `access_token`, `zipcode`, `products[n][product_id]`, `products[n][price]`, `products[n][quantity]`.

**Parâmetros (query):**

| Parâmetro | Tipo | Obrigatório | Formato | Descrição |
|:--|:--|:--|:--|:--|
| `access_token` | string | Sim | — | Token de acesso na query string |
| `zipcode` | string | Sim | `cep` — 8 dígitos numéricos, sem traço/ponto (ex.: `04001001`) | CEP de destino da cotação |
| `products[n][product_id]` | number | Sim | inteiro positivo | ID do produto a cotar; índice `n` inicia em `0` e permite múltiplos produtos na mesma requisição |
| `products[n][price]` | decimal | Sim | decimal com ponto (ex.: `58.90`) | Preço unitário do produto, usado no cálculo de seguro/valor declarado |
| `products[n][quantity]` | number | Sim | inteiro positivo | Quantidade do produto; multiplica peso e dimensões na cotação |

> O **peso** e as **dimensões** não são parâmetros de query — a Tray usa os valores do cadastro do produto/variação (peso em gramas; ver `tray-produtos` e `tray-variacoes`). Cadastro com peso `0` ou dimensões ausentes faz os Correios aplicarem mínimos (16x11x2 cm) ou retornarem erro, distorcendo o valor.

**Campos da resposta** (wrapper `Shipping`, array — cada item é um método de envio cotado):

| Campo | Tipo | Descrição |
|:--|:--|:--|
| `id` | number | ID do método de envio (vem como string na resposta JSON) |
| `name` | string | Nome do método (ex.: `PAC`, `SEDEX`, `Transportadora`) |
| `price` | decimal | Valor do frete em reais; pode vir `0.00` para frete grátis (string na resposta) |
| `delivery_time` | number | Prazo de entrega estimado em dias úteis (string na resposta) |
| `delivery_time_text` | string | Texto formatado do prazo para exibição (ex.: `8 dias úteis`) |

**Exemplo de resposta:**

```json
{
  "Shipping": [
    { "id": "1", "name": "PAC", "price": "25.90", "delivery_time": "8", "delivery_time_text": "8 dias úteis" },
    { "id": "2", "name": "SEDEX", "price": "45.50", "delivery_time": "3", "delivery_time_text": "3 dias úteis" }
  ]
}
```

**Exemplo (curl):**

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
# Requer TRAY_ACCESS_TOKEN e TRAY_API_ADDRESS no ambiente.
curl -s -G "https://${TRAY_API_ADDRESS}/shippings/cotation/" \
  --data-urlencode "access_token=${TRAY_ACCESS_TOKEN}" \
  --data-urlencode "zipcode=04001001" \
  --data-urlencode "products[0][product_id]=123" \
  --data-urlencode "products[0][price]=58.90" \
  --data-urlencode "products[0][quantity]=2"
```

**Exemplo (Node):**

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
// Requer TRAY_ACCESS_TOKEN e TRAY_API_ADDRESS no ambiente.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;

// Normaliza o CEP para 8 dígitos numéricos (remove traço/ponto)
const zipcode = "04001-001".replace(/\D/g, "");

const cart = [
  { product_id: 123, price: "58.90", quantity: 2 },
  { product_id: 456, price: "19.90", quantity: 1 },
];

const params = new URLSearchParams({ access_token: token, zipcode });
cart.forEach((item, n) => {
  params.append(`products[${n}][product_id]`, String(item.product_id));
  params.append(`products[${n}][price]`, item.price);
  params.append(`products[${n}][quantity]`, String(item.quantity));
});

const res = await fetch(`https://${base}/shippings/cotation/?${params}`);
if (res.status === 429) throw new Error("Rate limit — aplicar backoff exponencial");
const data = await res.json();
const metodos = data.Shipping ?? [];
if (metodos.length === 0) {
  // Estado legítimo: frete indisponível para a região (CEP fora de cobertura)
  console.log("Frete indisponível para este CEP");
} else {
  metodos.forEach((m) => console.log(`${m.name}: R$ ${m.price} — ${m.delivery_time_text}`));
}
```

**Erros comuns:**

| Código | Causa | Como resolver |
|:--|:--|:--|
| `200` (Shipping vazio) | Frete indisponível para a região — CEP fora de cobertura ou transportadora não atende; o array `Shipping` volta vazio ou parcial | Tratar como estado legítimo na UI (`"frete indisponível para este CEP"`); nunca assumir que ao menos um método sempre retorna |
| `400` | CEP enviado com máscara (`04001-001`) ou parâmetros `products[n]` malformados | Normalizar `zipcode` para 8 dígitos numéricos; usar índices `products[0]`, `products[1]`... corretos |
| `401` | `access_token` expirado (3h) ou enviado como header `Authorization` em vez de query param | Renovar via `GET /auth?refresh_token={token}`; sempre passar `?access_token={token}` na query string |
| `404` | `api_address` incorreto (varia por loja) | Usar o `api_address` retornado no callback OAuth da loja |
| `429` | Rate limit (180 req/min ou 10k/dia) — agravado porque a cotação consulta APIs externas e pode ser repetida em loop no checkout | Backoff exponencial (1s, 2s, 4s, 8s) e cache de resultados por CEP + produtos + quantidade + dimensões; debounce na UI |

---

### GET /shippings/

Lista as formas de envio (métodos de frete) configuradas e **ativas** na loja, **sem** realizar cotação. Retorna `id`, `name` e `active` de cada método (ex.: PAC, SEDEX, Retirada na Loja). Não retorna preço nem prazo — para isso use `/shippings/cotation/`.

**Quando usar:**

- Para descobrir quais métodos de envio existem na loja antes de exibir/filtrar opções.
- Para mapear IDs de método — necessário, por exemplo, ao vincular frete a um cupom via `shipping_relationship` (ver `tray-cupons`).

**Pré-requisitos:**

- `access_token` válido como query param.
- `TRAY_API_ADDRESS` da loja.

**Schema:** sem body — apenas query param `access_token`.

**Parâmetros (query):**

| Parâmetro | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `access_token` | string | Sim | Token de acesso na query string |

**Campos da resposta** (wrapper `ShippingMethods[].ShippingMethod`):

| Campo | Tipo | Descrição |
|:--|:--|:--|
| `id` | number | ID do método de envio (string na resposta); usável em outros recursos (ex.: `shipping_relationship` em `tray-cupons`) |
| `name` | string | Nome do método (ex.: `PAC`, `SEDEX`, `Retirada na Loja`) |
| `active` | string | Status: `'1'` = ativo, `'0'` = inativo |

**Exemplo de resposta:**

```json
{
  "ShippingMethods": [
    { "ShippingMethod": { "id": "1", "name": "PAC", "active": "1" } },
    { "ShippingMethod": { "id": "2", "name": "SEDEX", "active": "1" } },
    { "ShippingMethod": { "id": "3", "name": "Retirada na Loja", "active": "1" } }
  ]
}
```

**Exemplo (curl):**

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
# Requer TRAY_ACCESS_TOKEN e TRAY_API_ADDRESS no ambiente.
curl -s "https://${TRAY_API_ADDRESS}/shippings/?access_token=${TRAY_ACCESS_TOKEN}"
```

**Exemplo (Node):**

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
// Requer TRAY_ACCESS_TOKEN e TRAY_API_ADDRESS no ambiente.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;

const res = await fetch(`https://${base}/shippings/?access_token=${token}`);
if (res.status === 429) throw new Error("Rate limit — aplicar backoff exponencial");
const data = await res.json();

const metodos = (data.ShippingMethods ?? [])
  .map((m) => m.ShippingMethod)
  .filter((m) => m.active === "1");

metodos.forEach((m) => console.log(`#${m.id} ${m.name}`));
```

**Erros comuns:**

| Código | Causa | Como resolver |
|:--|:--|:--|
| `401` | Token expirado ou enviado em header `Authorization` em vez de query param | Renovar token; usar query param `?access_token={token}` |
| `404` | `api_address` incorreto (varia por loja) | Usar o `api_address` retornado no callback OAuth |
| `429` | Rate limit (180 req/min ou 10k/dia) | Backoff exponencial (1s, 2s, 4s, 8s) |


## Edge cases

- **Frete indisponível para a região (array `Shipping` vazio ou parcial).** `GET /shippings/cotation/` pode retornar `HTTP 200` com `{"Shipping": []}` ou apenas um subconjunto dos métodos quando o CEP está fora de cobertura ou uma transportadora não atende àquela região. Não é erro: é um estado legítimo. Trate o array vazio na UI exibindo "frete indisponível para este CEP" em vez de assumir que pelo menos um método sempre volta.
  - Exemplo: cotação para `zipcode=69900970` (Rio Branco/AC) com produto pesado pode voltar `{"Shipping": []}` enquanto o mesmo produto para `zipcode=04001001` (São Paulo) retorna PAC e SEDEX. O checkout deve degradar para "consulte outras formas de envio", não travar.
  ```js
  // NÃO-VERIFICADO contra sandbox — validar antes do merge.
  const data = await res.json();
  const metodos = data.Shipping ?? [];
  if (metodos.length === 0) {
    return { disponivel: false, motivo: "sem cobertura para o CEP informado" };
  }
  ```

- **Múltiplos produtos no mesmo carrinho exigem índice incremental.** A rota aceita `products[0]`, `products[1]`, `products[2]`... na mesma requisição, e cada índice precisa ser único. Omitir o índice ou repetir `products[0]` para itens diferentes faz a Tray cotar apenas um produto, gerando frete subdimensionado (peso e dimensões somados a menos). Sempre incremente o índice por item do carrinho.
  - Exemplo errado (sobrescreve o item 0): `products[0][product_id]=123&products[0][product_id]=456` → a Tray considera só `456`. Correto: `products[0][product_id]=123&products[1][product_id]=456`.
  ```bash
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  curl -s -G "https://${TRAY_API_ADDRESS}/shippings/cotation/" \
    --data-urlencode "access_token=${TRAY_ACCESS_TOKEN}" \
    --data-urlencode "zipcode=04001001" \
    --data-urlencode "products[0][product_id]=123" \
    --data-urlencode "products[0][price]=58.90" \
    --data-urlencode "products[0][quantity]=2" \
    --data-urlencode "products[1][product_id]=456" \
    --data-urlencode "products[1][price]=120.00" \
    --data-urlencode "products[1][quantity]=1"
  ```

- **Frete grátis sobrescrevendo o preço (`price='0.00'`).** Produtos cadastrados com `free_shipping=1` (ver `tray-produtos`) podem retornar `price='0.00'` em alguns métodos, dependendo da configuração da loja. O código de checkout não deve recalcular nem rejeitar frete zerado como erro de cotação — é o comportamento esperado para esses produtos.
  - Exemplo: produto com `free_shipping=1` retorna `{"id":"1","name":"PAC","price":"0.00","delivery_time":"8"}`. Tratar `price === "0.00"` como "Grátis" na UI, não como cotação falha. Atenção: o `price` vem como **string** na resposta — compare como string ou converta com `parseFloat` antes de operações numéricas.

- **Peso e dimensões herdados do cadastro do produto/variação.** A cotação **não** recebe peso/dimensões como parâmetros de query — usa os valores do cadastro do produto (`weight` em gramas) e da variação (ver `tray-produtos`/`tray-variacoes`). Cadastro com `weight=0` ou dimensões ausentes faz os Correios aplicarem mínimos (16x11x2 cm) ou retornarem erro, distorcendo o valor cotado para mais ou para menos.
  - Exemplo: produto cadastrado com `weight=0` cota como pacote mínimo dos Correios e devolve um frete artificialmente baixo; ao faturar, o custo real é maior. Auditar o `weight`/dimensões em `tray-produtos` antes de confiar na cotação. Lembre que `1 kg = 1000 g`.

- **Latência e rate limit ao cotar a cada tecla no campo de CEP.** Como a cotação consulta APIs externas (gateways/transportadoras como Frete-X API), é lenta e fácil de disparar em loop a cada caractere digitado no campo de CEP, estourando o limite de 180 req/min (`HTTP 429`). Faça **debounce** na UI (cotar só após o CEP completo, 8 dígitos) e **cache** por `CEP + produtos + quantidade`.
  ```js
  // NÃO-VERIFICADO contra sandbox — validar antes do merge.
  const cache = new Map(); // chave: cep|product_id:qty|...
  async function cotar(cep, itens) {
    if (cep.replace(/\D/g, "").length !== 8) return null; // só cota CEP completo
    const chave = `${cep}|${itens.map(i => `${i.id}:${i.qty}`).join("|")}`;
    if (cache.has(chave)) return cache.get(chave);
    const res = await fetch(/* ... */);
    if (res.status === 429) { /* backoff exponencial: 1s, 2s, 4s, 8s */ }
    const data = await res.json();
    cache.set(chave, data.Shipping ?? []);
    return cache.get(chave);
  }
  ```

- **CEP com máscara quebra a cotação.** Enviar `zipcode` com traço ou ponto (`04001-001`) pode resultar em cotação vazia ou `HTTP 400`. O campo é do formato `cep` da plataforma: 8 dígitos numéricos, sem traço nem ponto. Normalize com `String(cep).replace(/\D/g, "")` antes de chamar e valide que sobraram exatamente 8 dígitos.
  - Exemplo: `04001-001` → normalizar para `04001001`. Um CEP com 7 ou 9 dígitos após a limpeza indica entrada inválida — rejeite antes de gastar uma chamada à API.

- **Confundir `/shippings/` com `/shippings/cotation/`.** `GET /shippings/` apenas **lista** os métodos ativos da loja (`id`, `name`, `active`) — **sem** preço nem prazo. Apenas `GET /shippings/cotation/` calcula valores. Chamar `/shippings/` esperando preços retorna só `id`/`name`/`active` e leva o desenvolvedor a achar que a cotação "veio sem preço".
  - Exemplo: para montar o seletor de frete com valores no checkout, use `cotation/`; para descobrir os IDs de método (ex.: vincular frete a um cupom via `shipping_relationship`, ver `tray-cupons`), use `/shippings/`.

## Antipadrões

- ❌ **Enviar o `access_token` em header `Authorization`.** A API Tray ignora o header `Authorization: Bearer ...` e responde `HTTP 401` tanto em `/shippings/` quanto em `/shippings/cotation/`. O token **deve** ir como query param `?access_token={token}`. Por quê quebra: a autenticação da Tray é por query string, não por header — o header simplesmente não é lido. Correção: monte sempre a URL com `?access_token=${TRAY_ACCESS_TOKEN}` (ou `--data-urlencode "access_token=..."` no `curl -G`) e nunca passe credenciais via `headers`.
  ```bash
  # NÃO-VERIFICADO contra sandbox — validar antes do merge.
  # ERRADO → HTTP 401:
  #   curl -H "Authorization: Bearer $TRAY_ACCESS_TOKEN" "https://${TRAY_API_ADDRESS}/shippings/"
  # CERTO:
  curl -s "https://${TRAY_API_ADDRESS}/shippings/?access_token=${TRAY_ACCESS_TOKEN}"
  ```

- ❌ **Hardcodar o `api_address` de uma loja como base fixa.** O `api_address` **varia por loja** (é retornado no callback OAuth da Etapa 2). Reaproveitar o endereço de outra loja gera `HTTP 404` em `/shippings/cotation/`. Por quê quebra: cada loja tem um host de API próprio; um endereço fixo só funciona para uma loja e falha silenciosamente para as demais. Correção: armazene o `api_address` junto com os tokens da loja e leia-o sempre de `TRAY_API_ADDRESS` por variável de ambiente, nunca como literal no código.

- ❌ **Cotar a cada tecla no campo de CEP sem debounce nem cache.** Disparar `GET /shippings/cotation/` a cada caractere digitado estoura o rate limit (`HTTP 429`) e degrada o checkout, porque cada cotação consulta transportadoras externas e é lenta. Por quê quebra: 180 req/min se esgotam rápido quando vários clientes digitam CEP simultaneamente, e a latência externa empilha requisições. Correção: cote apenas com o CEP completo (8 dígitos), aplique debounce na UI e cacheie por `CEP + produtos + quantidade`; em `429`, aplique backoff exponencial (1s, 2s, 4s, 8s).

- ❌ **Tratar `Shipping` vazio como falha genérica e abortar o checkout.** Um array `Shipping` vazio com `HTTP 200` é um estado legítimo (região sem cobertura ou transportadora que não atende). Por quê quebra: lançar erro 500/genérico ao receber `[]` impede a compra de clientes em regiões parcialmente atendidas e mascara a causa real. Correção: detecte `Shipping.length === 0` e exiba "frete indisponível para este CEP" (ou ofereça retirada na loja, se houver), mantendo o checkout vivo.

- ❌ **Esquecer de incrementar o índice em `products[n]` com múltiplos itens.** Repetir `products[0]` para produtos diferentes ou omitir o índice faz a Tray cotar **apenas um** produto, devolvendo frete subdimensionado. Por quê quebra: o índice `n` é o identificador de posição do item no array; sem incrementá-lo, os itens posteriores sobrescrevem o primeiro e peso/dimensões somados ficam menores que o real. Correção: gere `products[0]`, `products[1]`, `products[2]`... de forma incremental, um bloco `product_id`/`price`/`quantity` por item do carrinho.

- ❌ **Hardcodar tokens literais no código (curl/Node).** Nunca escreva o `access_token` (nem `consumer_key`/`consumer_secret`) como string no código de cotação. Por quê quebra: além do risco de vazamento em logs/repositório, o `access_token` expira em 3 horas — um literal fica inválido e gera `HTTP 401`. Correção: use `TRAY_ACCESS_TOKEN` e `TRAY_API_ADDRESS` via variável de ambiente e renove o token via `GET /auth?refresh_token={token}` antes de expirar.

- ❌ **Usar a skill `tray-frete` para criar/configurar métodos de envio ou tabelas de CEP.** Este recurso é **somente leitura** — apenas endpoints `GET` (`/shippings/` e `/shippings/cotation/`). Por quê quebra: não existe `POST`/`PUT` de método de frete aqui; tentar criar/configurar pela API de Frete não tem endpoint correspondente. Correção: configuração de métodos, gateway e tabela de CEP fica em `tray-configuracao-frete` (`/shippings/method/gateway`, `/shippings/method/zipcode_table`); use `tray-frete` apenas para cotar e listar métodos ativos.

- ❌ **Tratar os campos numéricos da resposta como `number`.** Na resposta da cotação, `id`, `price` e `delivery_time` vêm como **string** (ex.: `"price": "25.90"`, `"delivery_time": "8"`), e `active` em `/shippings/` vem como `"0"`/`"1"`. Por quê quebra: somar `price` diretamente concatena strings (`"25.90" + "10.00" = "25.9010.00"`) e comparações numéricas falham. Correção: converta explicitamente com `parseFloat(price)`/`parseInt(delivery_time, 10)` antes de qualquer cálculo, e compare `active === "1"` como string ao filtrar métodos ativos.

## Webhooks relacionados

A skill `tray-frete` é **somente leitura** (apenas `GET`) e **não dispara webhooks próprios**: não existe escopo `shipping` no [sistema de notificação](../webhooks/SKILL.md). Cotação e listagem de métodos são consultas síncronas — o resultado só existe no momento da chamada e não gera evento assíncrono.

Os webhooks que **afetam indiretamente** o frete vêm de outros recursos:

| Escopo | Ações | Por que afeta o frete |
|:--|:--|:--|
| `product` | insert, update, delete | Alterações de **peso**, **dimensões** ou `free_shipping` no cadastro mudam o valor cotado em `/shippings/cotation/`. Reaja invalidando o cache de cotação do produto afetado (`scope_id`). |
| `variant` | insert, update, delete | A cotação herda peso/dimensões da variação; mudanças alteram o frete da variação cotada. |
| `store_config` | update | Inclui alteração de configuração de frete da loja (gateway, métodos ativos, frete grátis). Invalide qualquer cache de `/shippings/` e de cotação após esse evento. |
| `order` | insert, update | O pedido carrega `shipping_cost`, `shipping_method` e `tracking_number`; o frete já cotado é congelado no pedido. Use este escopo para sincronizar status de envio, não a skill de frete. |

> **Não há escopo `shipping`.** Para reagir a mudanças que impactam frete, escute `product`, `variant` e `store_config` e invalide os caches de cotação correspondentes. Detalhes de payload, ativação e retry em [`../webhooks/SKILL.md`](../webhooks/SKILL.md).

## Glossário

| Termo | Definição |
|:--|:--|
| cotação (cotation) | Cálculo do valor e prazo de frete para um conjunto de produtos rumo a um CEP, via `GET /shippings/cotation/`. É a **única** rota que retorna preço e prazo. |
| método de envio (ShippingMethod) | Forma de entrega configurada e ativa na loja (PAC, SEDEX, transportadora, retirada na loja), listada por `GET /shippings/` com `id`, `name` e `active`. |
| gateway de frete | Integração externa (ex.: Frete-X API) que a Tray consulta automaticamente na cotação para obter preços/prazos de múltiplas transportadoras; configurado no painel ou via `tray-configuracao-frete`. |
| Frete-X API | Gateway de frete suportado pela Tray para cotação automática com múltiplas transportadoras; configurado no painel administrativo da loja. |
| `delivery_time` | Prazo de entrega estimado em dias úteis retornado por método na resposta de cotação; acompanha `delivery_time_text` para exibição. |
| `free_shipping` | Flag do cadastro do produto (`tray-produtos`) que, conforme a configuração da loja, pode zerar o `price` do frete na cotação. |
| `zipcode` | CEP de destino da cotação; enviado apenas com 8 dígitos numéricos, sem traço ou ponto. |
| `shipping_id` | ID do método de envio (campo `id` de `/shippings/` ou da cotação); usado em outros recursos como vínculo de frete em cupons (`shipping_relationship`, ver `tray-cupons`). |
| `api_address` | Host base da API específico de cada loja, retornado no callback OAuth; compõe a URL `https://{api_address}/` de toda chamada. |
| peso cúbico (`cubic_weight`) | Peso volumétrico calculado a partir das dimensões do produto, usado por transportadoras quando excede o peso real; deriva do cadastro do produto e influencia o valor cotado. |

## Referências

- **Documentação oficial:** [API de Integração de Frete](https://developers.tray.com.br/#api-de-integracao-de-frete)
- **Visão geral e regras invariantes:** [`../visao-geral/SKILL.md`](../visao-geral/SKILL.md)
- **Autenticação OAuth e renovação de token:** [`../autorizacao/SKILL.md`](../autorizacao/SKILL.md)
- **Webhooks (escopos `product`, `variant`, `store_config`, `order`):** [`../webhooks/SKILL.md`](../webhooks/SKILL.md)
- **Configurar métodos de envio, gateway e tabela de CEP (escrita):** [`../configuracao-frete/SKILL.md`](../configuracao-frete/SKILL.md)
- **Peso, dimensões e `free_shipping` do produto:** [`../produtos/SKILL.md`](../produtos/SKILL.md)
- **Peso/dimensões de variação:** [`../variacoes/SKILL.md`](../variacoes/SKILL.md)
- **Vínculo de frete a cupons (`shipping_relationship`):** [`../cupons/SKILL.md`](../cupons/SKILL.md)
- **Custo de frete e rastreamento no pedido:** [`../pedidos/SKILL.md`](../pedidos/SKILL.md)
- **Issue de aprofundamento:** ai/tasks#100 (P2.1, Fase 2)


## Fluxo recomendado de cotação no checkout

A cotação de frete é, na prática, a operação mais sensível desta skill: ela é
disparada repetidamente no checkout (a cada edição do campo de CEP), depende de
APIs externas lentas (gateways/transportadoras) e estoura `HTTP 429` com
facilidade. O fluxo recomendado encadeia **normalização de CEP → debounce →
cache por (cep + itens) com TTL → chamada com retry/backoff em 429 → parsing de
`Shipping[]` → escolha do método mais barato/rápido**. O bloco abaixo é um
módulo completo e comentado que cobre todas essas etapas.

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
// Requer TRAY_ACCESS_TOKEN e TRAY_API_ADDRESS no ambiente.
//
// Módulo de cotação de frete para checkout: debounce, cache com TTL,
// retry com backoff exponencial em 429, normalização de CEP e parsing.

const BASE = process.env.TRAY_API_ADDRESS;       // host por loja (callback OAuth)
const TOKEN = process.env.TRAY_ACCESS_TOKEN;      // nunca literal; renovar em 3h

// ---------------------------------------------------------------------------
// 1) Normalização de CEP — 8 dígitos numéricos, sem traço/ponto.
//    Retorna null se a entrada não tiver exatamente 8 dígitos após a limpeza.
// ---------------------------------------------------------------------------
function normalizarCep(input) {
  const digitos = String(input ?? "").replace(/\D/g, "");
  return digitos.length === 8 ? digitos : null; // 7 ou 9 dígitos = inválido
}

// ---------------------------------------------------------------------------
// 2) Chave de cache estável por (cep + itens).
//    Ordena os itens por product_id para que a mesma combinação de carrinho
//    gere sempre a mesma chave, independente da ordem de inserção.
// ---------------------------------------------------------------------------
function chaveCache(cep, itens) {
  const assinatura = [...itens]
    .map((i) => ({ id: Number(i.product_id), q: Number(i.quantity), p: String(i.price) }))
    .sort((a, b) => a.id - b.id)
    .map((i) => `${i.id}:${i.q}:${i.p}`)
    .join("|");
  return `${cep}#${assinatura}`;
}

// ---------------------------------------------------------------------------
// 3) Cache em memória com TTL. Cotação muda pouco em janelas curtas, então
//    um TTL de poucos minutos reduz drasticamente as chamadas externas.
// ---------------------------------------------------------------------------
const TTL_MS = 5 * 60 * 1000; // 5 minutos
const cache = new Map();       // chave -> { expira: epochMs, valor: Shipping[] }

function lerCache(chave) {
  const hit = cache.get(chave);
  if (!hit) return null;
  if (Date.now() > hit.expira) {
    cache.delete(chave); // expirado: descarta e força nova cotação
    return null;
  }
  return hit.valor;
}

function gravarCache(chave, valor) {
  cache.set(chave, { expira: Date.now() + TTL_MS, valor });
}

// ---------------------------------------------------------------------------
// 4) Monta os índices products[n][...] incrementando n por item do carrinho.
//    NUNCA repetir products[0] — itens posteriores sobrescreveriam o primeiro
//    e o frete viria subdimensionado (peso/dimensões somados a menos).
// ---------------------------------------------------------------------------
function montarParams(cep, itens) {
  const params = new URLSearchParams({ access_token: TOKEN, zipcode: cep });
  itens.forEach((item, n) => {
    params.append(`products[${n}][product_id]`, String(item.product_id));
    params.append(`products[${n}][price]`, String(item.price));     // ponto decimal
    params.append(`products[${n}][quantity]`, String(item.quantity));
  });
  return params;
}

// ---------------------------------------------------------------------------
// 5) Chamada com retry e backoff exponencial em 429.
//    Em 401/404 não adianta repetir — falha rápido com mensagem clara.
//    O access_token vai SEMPRE na query string (params), nunca em header.
// ---------------------------------------------------------------------------
async function cotarComRetry(cep, itens, { maxTentativas = 4 } = {}) {
  const params = montarParams(cep, itens);
  const url = `https://${BASE}/shippings/cotation/?${params}`;

  for (let tentativa = 0; tentativa < maxTentativas; tentativa++) {
    const res = await fetch(url); // GET; sem header Authorization
    if (res.status === 429) {
      // backoff exponencial: 1s, 2s, 4s, 8s...
      const esperaMs = 1000 * 2 ** tentativa;
      await new Promise((r) => setTimeout(r, esperaMs));
      continue;
    }
    if (res.status === 401) {
      throw new Error("401 — access_token expirado/em header. Renovar via GET /auth?refresh_token e usar query param.");
    }
    if (res.status === 404) {
      throw new Error("404 — api_address incorreto (varia por loja). Usar TRAY_API_ADDRESS da loja.");
    }
    if (!res.ok) {
      throw new Error(`Cotação falhou: HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.Shipping ?? []; // array vazio = sem cobertura (estado legítimo)
  }
  throw new Error("429 persistente após backoff — reduzir frequência de cotação.");
}

// ---------------------------------------------------------------------------
// 6) Orquestrador: normaliza, consulta cache, cota e grava no cache.
//    Retorna { disponivel, metodos } — disponivel=false quando Shipping[] vazio.
// ---------------------------------------------------------------------------
async function cotarFrete(cepBruto, itens) {
  const cep = normalizarCep(cepBruto);
  if (!cep) return { disponivel: false, motivo: "cep_invalido", metodos: [] };
  if (!itens?.length) return { disponivel: false, motivo: "carrinho_vazio", metodos: [] };

  const chave = chaveCache(cep, itens);
  const cacheado = lerCache(chave);
  if (cacheado) return { disponivel: cacheado.length > 0, motivo: cacheado.length ? null : "sem_cobertura", metodos: cacheado };

  const metodos = await cotarComRetry(cep, itens);
  gravarCache(chave, metodos);
  return { disponivel: metodos.length > 0, motivo: metodos.length ? null : "sem_cobertura", metodos };
}

// ---------------------------------------------------------------------------
// 7) Parsing/seleção: a resposta vem com campos numéricos como STRING.
//    Converta antes de comparar. Escolhe mais barato e mais rápido.
// ---------------------------------------------------------------------------
function escolherMetodos(metodos) {
  const normalizados = metodos.map((m) => ({
    id: m.id,
    name: m.name,
    price: parseFloat(m.price),                 // "25.90" -> 25.90
    prazo: parseInt(m.delivery_time, 10),       // "8" -> 8
    prazoTexto: m.delivery_time_text,
    gratis: parseFloat(m.price) === 0,          // free_shipping pode zerar
  }));
  const maisBarato = [...normalizados].sort((a, b) => a.price - b.price || a.prazo - b.prazo)[0] ?? null;
  const maisRapido = [...normalizados].sort((a, b) => a.prazo - b.prazo || a.price - b.price)[0] ?? null;
  return { todos: normalizados, maisBarato, maisRapido };
}

// ---------------------------------------------------------------------------
// 8) Debounce do campo de CEP: só cota após o usuário parar de digitar e
//    apenas quando o CEP estiver completo (8 dígitos). Evita disparar uma
//    cotação por tecla (causa direta de 429 no checkout).
// ---------------------------------------------------------------------------
function criarCotadorDebounced(onResultado, atrasoMs = 500) {
  let timer = null;
  return function aoDigitarCep(cepBruto, itens) {
    clearTimeout(timer);
    const cep = normalizarCep(cepBruto);
    if (!cep) return; // não cota CEP incompleto/inválido — economiza chamadas
    timer = setTimeout(async () => {
      try {
        const resultado = await cotarFrete(cep, itens);
        onResultado(escolherMetodos(resultado.metodos), resultado);
      } catch (err) {
        onResultado(null, { disponivel: false, motivo: "erro", erro: String(err) });
      }
    }, atrasoMs);
  };
}

// Exemplo de uso no checkout:
// const cotar = criarCotadorDebounced((selecao, resultado) => {
//   if (!resultado.disponivel) return mostrarUi("Frete indisponível para este CEP");
//   mostrarUi(`Mais barato: ${selecao.maisBarato.name} R$ ${selecao.maisBarato.price}`);
// });
// inputCep.addEventListener("input", (e) => cotar(e.target.value, carrinhoAtual));
```

## Integração com gateway de frete (Frete-X / transportadoras)

A cotação da Tray é um **agregador**: quando o checkout chama
`GET /shippings/cotation/`, a plataforma consulta de uma só vez todas as fontes
de frete habilitadas na loja e devolve o resultado consolidado no array
`Shipping[]`, com o mesmo formato para qualquer origem. Existem duas classes de
origem:

- **Métodos nativos** — PAC e SEDEX (Correios), retirada na loja e tabelas de
  frete por faixa de CEP configuradas na própria loja. São resolvidos
  diretamente pela Tray a partir do peso/dimensões do cadastro do produto.
- **Gateway de frete** — integrações externas como a **Frete-X API**, que por
  sua vez cotam com múltiplas transportadoras (Jadlog, Loggi, Total Express,
  etc.). A Tray repassa peso, dimensões, valor declarado e CEP ao gateway, e o
  gateway devolve uma lista de opções por transportadora.

Do ponto de vista do consumidor da API, **não há distinção de formato**: tanto
um método nativo quanto uma transportadora vinda de gateway aparecem como um
item de `Shipping[]` com `id`, `name`, `price`, `delivery_time` e
`delivery_time_text`. O `name` é o que diferencia na prática — pode vir como
`"PAC"`, `"SEDEX"`, `"Jadlog - Package"` ou `"Loggi Econômico"`, conforme a
transportadora retornada pelo gateway.

| Aspecto | Método nativo (PAC/SEDEX) | Gateway de frete (Frete-X) |
|:--|:--|:--|
| Origem do cálculo | Correios / tabela da loja, resolvido pela Tray | Gateway externo consultando N transportadoras |
| Latência típica | Baixa/média | Mais alta (rede + API da transportadora) |
| `name` na resposta | `PAC`, `SEDEX`, `Retirada na Loja` | Nome da transportadora/serviço (`Jadlog - Package`) |
| Quantidade de opções | Fixa (poucos métodos) | Variável — depende de quantas transportadoras responderam |
| Sensível a peso/dimensões zerados | Sim (aplica mínimos dos Correios) | Sim (gateway pode rejeitar item sem peso) |
| Configuração | `tray-configuracao-frete` (`/shippings/method/...`) | Painel da loja + gateway externo; também via `tray-configuracao-frete` |

**Campos extras possíveis.** O contrato estável de `Shipping[]` é
`id`/`name`/`price`/`delivery_time`/`delivery_time_text`. Cotações vindas de
gateway podem trazer campos adicionais (ex.: nome de transportadora separado,
código de serviço interno, observação de prazo) dependendo da configuração — não
dependa da presença desses campos extras; programe sempre contra o contrato
mínimo e trate qualquer campo adicional como opcional.

**Fallback quando o gateway está indisponível.** Como o gateway é uma dependência
externa, ele pode falhar ou expirar (timeout) sem que a chamada à Tray retorne
erro: nesse cenário o `HTTP 200` volta com `Shipping[]` **parcial** — apenas os
métodos nativos, sem as transportadoras do gateway — ou até vazio. O checkout
**não** deve interpretar a ausência de opções de gateway como erro fatal:

- Se `Shipping[]` tiver pelo menos um método (nativo), siga com o que veio.
- Se vier vazio, trate como "frete indisponível para este CEP" e ofereça
  alternativas (retirada na loja, contato), exatamente como no caso de região
  sem cobertura.
- Como gateways são instáveis, **uma cotação vazia agora pode não estar vazia em
  segundos**; combine com o cache de TTL curto (5 min) em vez de cachear
  resultados vazios por longos períodos — ou cacheie o vazio com TTL bem menor.

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
// Distingue métodos nativos de transportadoras de gateway pelo nome,
// e aplica fallback quando o gateway não retorna opções.
const NATIVOS = new Set(["PAC", "SEDEX", "Retirada na Loja"]);

function separarOrigem(metodos) {
  const nativos = [], gateway = [];
  for (const m of metodos) (NATIVOS.has(m.name) ? nativos : gateway).push(m);
  return { nativos, gateway, gatewayIndisponivel: gateway.length === 0 };
}
```

## Cenários por contexto

A montagem da requisição de cotação muda conforme o ponto do funil. Os cenários
abaixo cobrem os casos mais frequentes, cada um com exemplo executável.

### Página de produto (1 item)

Na página de produto exibe-se a estimativa de frete para uma única unidade (ou a
quantidade selecionada). Apenas `products[0]` é necessário.

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
# Requer TRAY_ACCESS_TOKEN e TRAY_API_ADDRESS no ambiente.
curl -s -G "https://${TRAY_API_ADDRESS}/shippings/cotation/" \
  --data-urlencode "access_token=${TRAY_ACCESS_TOKEN}" \
  --data-urlencode "zipcode=01310100" \
  --data-urlencode "products[0][product_id]=123" \
  --data-urlencode "products[0][price]=58.90" \
  --data-urlencode "products[0][quantity]=1"
```

### Carrinho multi-item (vários `products[]`)

No carrinho, cada item vira um bloco `products[n]` com índice incremental. O
peso e as dimensões de todos os itens são somados pela Tray na cotação.

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
// Requer TRAY_ACCESS_TOKEN e TRAY_API_ADDRESS no ambiente.
const base = process.env.TRAY_API_ADDRESS;
const token = process.env.TRAY_ACCESS_TOKEN;

const carrinho = [
  { product_id: 123, price: "58.90", quantity: 2 },
  { product_id: 456, price: "120.00", quantity: 1 },
  { product_id: 789, price: "19.90", quantity: 3 },
];

const params = new URLSearchParams({ access_token: token, zipcode: "01310100" });
carrinho.forEach((item, n) => {
  params.append(`products[${n}][product_id]`, String(item.product_id));
  params.append(`products[${n}][price]`, item.price);
  params.append(`products[${n}][quantity]`, String(item.quantity));
});

const res = await fetch(`https://${base}/shippings/cotation/?${params}`);
if (res.status === 429) throw new Error("Rate limit — aplicar backoff exponencial (1s, 2s, 4s, 8s)");
const data = await res.json();
(data.Shipping ?? []).forEach((m) => console.log(`${m.name}: R$ ${m.price} — ${m.delivery_time_text}`));
```

### Retirada na loja (frete zero)

A opção "Retirada na Loja" é um método de envio nativo: aparece em
`GET /shippings/` (com `id`/`name`/`active`) e, quando ativa, pode surgir na
cotação com `price='0.00'` e prazo curto. Não é necessário parâmetro especial na
cotação — ela vem junto dos demais métodos quando habilitada. Para apenas
descobrir se a loja oferece retirada (e seu `id`), use a listagem:

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
# Requer TRAY_ACCESS_TOKEN e TRAY_API_ADDRESS no ambiente.
# Lista os métodos ativos; "Retirada na Loja" aparece com active="1".
curl -s "https://${TRAY_API_ADDRESS}/shippings/?access_token=${TRAY_ACCESS_TOKEN}"
```

Na cotação, trate `price === "0.00"` como "Grátis"/"Retirada" na UI — é estado
esperado, não falha. O `price` vem como **string**, então compare como string
ou converta com `parseFloat` antes de qualquer cálculo.

### Frete grátis condicional (`free_shipping` do produto, cupom de frete)

Há dois caminhos distintos para frete grátis, e eles **não** vivem nesta skill
de forma controlável — a cotação apenas reflete o resultado:

- **`free_shipping` do produto** — flag do cadastro (ver `tray-produtos`). Quando
  ligada, a cotação pode devolver `price='0.00'` em um ou mais métodos,
  conforme a configuração da loja. É decidido no cadastro, não na chamada de
  cotação.
- **Cupom de frete grátis / desconto de frete** — aplicado no checkout via
  cupom (`shipping_relationship` / `freight_application`, ver `tray-cupons`),
  sobre um `shipping_id` que é justamente o `id` retornado por esta API. A
  cotação **não** aplica o cupom: ela devolve o preço cheio do frete, e o
  desconto/zeramento do cupom é calculado depois, no pedido (campos
  `discount`/`coupon_code`, ver `tray-pedidos`).

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
// A cotação devolve price cheio; rotula como "Grátis" só quando price=0.
// Desconto via cupom de frete NÃO entra aqui — é aplicado no pedido.
function rotularFrete(metodo) {
  const valor = parseFloat(metodo.price);
  if (valor === 0) return `${metodo.name}: Grátis — ${metodo.delivery_time_text}`;
  return `${metodo.name}: R$ ${valor.toFixed(2)} — ${metodo.delivery_time_text}`;
}
```

### Região sem cobertura

Quando o CEP está fora da área atendida (ou nenhuma transportadora responde), a
cotação retorna `HTTP 200` com `{"Shipping": []}`. É estado legítimo — o
checkout deve degradar com elegância, nunca abortar.

```js
// NÃO-VERIFICADO contra sandbox — validar antes do merge.
const data = await res.json();
const metodos = data.Shipping ?? [];
if (metodos.length === 0) {
  // Não é erro: oferecer retirada na loja, contato, ou pedir CEP alternativo.
  return { disponivel: false, motivo: "sem_cobertura", mensagem: "Frete indisponível para este CEP" };
}
```

## Campos da resposta (detalhado)

Os endpoints desta skill retornam **strings** mesmo em campos conceitualmente
numéricos (`id`, `price`, `delivery_time`, `active`). Converta explicitamente
antes de qualquer operação numérica ou comparação.

### `Shipping[]` (resposta de `GET /shippings/cotation/`)

Cada item do array representa um método de envio cotado.

| Campo | Tipo (JSON) | Tipo lógico | Obrigatório na resposta | Observações |
|:--|:--|:--|:--|:--|
| `id` | string | inteiro | Sim | ID do método de envio; corresponde ao `shipping_id` usado em `shipping_relationship` (ver `tray-cupons`). Para método nativo é estável; para gateway pode variar por transportadora. Converta com `parseInt`. |
| `name` | string | texto | Sim | Nome exibível do método/serviço: `PAC`, `SEDEX`, `Retirada na Loja`, ou nome da transportadora vinda de gateway (`Jadlog - Package`). Único campo que distingue nativo de gateway. |
| `price` | string | decimal | Sim | Valor do frete em reais, ponto decimal (`"25.90"`). `"0.00"` = grátis (free_shipping ou retirada). **Nunca** somar como string: `parseFloat` primeiro. |
| `delivery_time` | string | inteiro | Sim | Prazo estimado em **dias úteis** (`"8"`). Não inclui sábados/domingos/feriados. Converta com `parseInt(x, 10)`. |
| `delivery_time_text` | string | texto | Sim | Prazo já formatado para exibição (`"8 dias úteis"`). Preferir este campo na UI em vez de montar texto a partir de `delivery_time`. |

> Campos adicionais podem aparecer quando a origem é gateway (nome de
> transportadora separado, código de serviço, observação). Trate-os como
> **opcionais** — não dependa da presença deles.

### `ShippingMethods[].ShippingMethod` (resposta de `GET /shippings/`)

Lista de métodos configurados na loja, **sem** preço nem prazo.

| Campo | Tipo (JSON) | Tipo lógico | Obrigatório na resposta | Observações |
|:--|:--|:--|:--|:--|
| `id` | string | inteiro | Sim | ID do método; reutilizável em outros recursos (ex.: `shipping_relationship` de cupom). Converta com `parseInt` se for usar numericamente. |
| `name` | string | texto | Sim | Nome do método ativo na loja (`PAC`, `SEDEX`, `Retirada na Loja`). |
| `active` | string | booleano | Sim | `"1"` = ativo, `"0"` = inativo. Compare **como string** (`active === "1"`) ao filtrar métodos ativos — comparar com `true`/`1` numérico falha silenciosamente. |

> A listagem **não** traz `price` nem `delivery_time` — esses só existem na
> cotação (`/shippings/cotation/`). Esperar preço aqui é o erro de confundir os
> dois endpoints.

## Glossário (frete)

| Termo | Definição |
|:--|:--|
| prazo útil (`delivery_time`) | Prazo de entrega contado apenas em **dias úteis**, excluindo sábados, domingos e feriados; vem como string na resposta e acompanha `delivery_time_text` já formatado para exibição. |
| peso cúbico | Peso volumétrico derivado das dimensões (comprimento × largura × altura ÷ fator da transportadora); quando excede o peso real, é ele que define o preço do frete. Deriva do cadastro do produto/variação — a cotação não o recebe como parâmetro. |
| dimensões mínimas Correios | Limites inferiores aplicados pelos Correios (16 × 11 × 2 cm) quando o cadastro tem dimensões ausentes ou zeradas; isso distorce a cotação, podendo gerar frete artificialmente baixo. Auditar peso/dimensões em `tray-produtos`/`tray-variacoes`. |
| transportadora | Empresa de entrega (Jadlog, Loggi, Total Express, Correios) cujo serviço aparece como um item de `Shipping[]`; quando vem de gateway, o `name` carrega o nome da transportadora/serviço. |
| gateway de frete | Integração externa (ex.: Frete-X API) que a Tray consulta na cotação para agregar opções de **múltiplas** transportadoras; é dependência externa e pode ficar indisponível, retornando `Shipping[]` parcial ou vazio. |
| `free_shipping` | Flag no cadastro do produto (`tray-produtos`) que, conforme a configuração da loja, pode zerar o `price` de métodos na cotação (`price='0.00'`); é decidida no cadastro, não na chamada de cotação. |
| retirada na loja | Método de envio nativo em que o cliente busca o pedido fisicamente; aparece em `GET /shippings/` e pode surgir na cotação com `price='0.00'` e prazo curto. Não exige parâmetro especial na cotação. |

---

Arquivo de destino: /home/leandrolazari/projetos/tray-api-claude-plugin/.claude/worktrees/issue-100-skills-densas/skills/frete/SKILL.md — inserir as seções acima imediatamente antes de "## Como Usar no Claude Code" (linha 455).
## Como Usar no Claude Code

### Exemplos de Prompt

- "calcula o frete para o CEP 01310100 para 2 unidades do produto 123"
- "lista os métodos de envio ativos na loja"
- "calcula o frete para um carrinho com 3 produtos diferentes"
- "implementa o cálculo de frete com cache por CEP + produtos para evitar HTTP 429 no checkout"
- "trata o cenário de frete indisponível quando o array Shipping volta vazio"
- "normaliza o CEP digitado (remove traço/ponto) antes de cotar"

### O que o Claude faz

1. Identifica se a tarefa é **cotação** (`/shippings/cotation/`) ou **listagem de métodos** (`/shippings/`) — só a cotação retorna preço/prazo.
2. Monta a query com `access_token` como **query param** e os índices `products[0]`, `products[1]`... incrementados por item (nunca repete `products[0]`).
3. Normaliza o `zipcode` para 8 dígitos numéricos (sem traço/ponto) antes de chamar.
4. Implementa cache por CEP + produtos + quantidade e debounce na UI para evitar `HTTP 429` no checkout.
5. Trata `Shipping` vazio como estado legítimo ("frete indisponível para este CEP"), não como erro.
6. Usa `TRAY_ACCESS_TOKEN` e `TRAY_API_ADDRESS` via env — sem tokens literais nem `api_address` hardcoded.

### O que você recebe

- Código de cotação com `zipcode` normalizado e produtos indexados corretamente (`products[n][product_id|price|quantity]`).
- Tratamento da resposta extraindo `name`, `price`, `delivery_time` e `delivery_time_text` por método.
- Camada de cache (chave CEP + produtos + quantidade) e debounce para reduzir chamadas repetidas.
- Tratamento de `Shipping` vazio e de erros `401`/`404`/`429` com backoff exponencial (1s, 2s, 4s, 8s).
- Código de listagem de métodos via `GET /shippings/` quando o objetivo é só mapear `id`/`name`/`active`.

### Pré-requisitos

- `access_token` válido configurado em `TRAY_ACCESS_TOKEN` (renovado se expirado — 3h).
- `TRAY_API_ADDRESS` da loja (varia por loja, retornado no callback OAuth).
- `product_id` e `price` de cada produto disponíveis (ver `tray-produtos`).
- CEP de destino do cliente, normalizado para 8 dígitos numéricos.
- Cadastro do produto com **peso e dimensões** preenchidos (ver `tray-produtos`/`tray-variacoes`) — peso 0 distorce a cotação.
