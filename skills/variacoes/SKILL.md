---
name: tray-variacoes
description: >
  API de Variações de Produtos da Tray. Utilize quando o desenvolvedor
  precisar gerenciar variantes de produtos (SKUs) como diferentes tamanhos, cores
  ou modelos. Inclui listagem, consulta, cadastro, atualização, exclusão e
  informações sobre limitações de variações por produto.
when_to_use: >
  Use quando o desenvolvedor mencionar: variação, SKU, tamanho, cor, modelo,
  atributo de produto, POST /variants, PUT /variants, estoque por variação,
  preço de variação, código EAN de SKU ou limitação de variantes por produto.
when_not_to_use: >
  Não use para o produto pai (use tray-produtos) nem para características informativas
  sem estoque separado (use tray-caracteristicas). Use para SKUs com atributos como
  cor e tamanho.
---

## MANDATORY: Tool Call(s) Required Before Answering

- **OBRIGATÓRIO:** `node skills/tray-dev/scripts/search_docs.mjs "<termo>"` — confirme o comportamento da API antes de gerar código.
- **OBRIGATÓRIO:** `node skills/variacoes/scripts/validate.mjs '<payload_json>'` — valide a estrutura do payload de variação antes de retornar código ao usuário.

## Antes de responder

> Execute estas verificações antes de gerar qualquer payload ou código:

1. Confirme o método HTTP e endpoint correto para a operação solicitada.
2. Identifique os campos obrigatórios listados neste documento — não omita nenhum.
3. Verifique que `access_token` não aparece como literal string no código gerado.
4. Confirme que esta é a skill correta para o recurso (leia `when_not_to_use` no frontmatter).
5. Execute `node skills/variacoes/scripts/validate.mjs '<payload_json>'`
   para confirmar a estrutura do payload que vai gerar. O validador checa
   apenas **estrutura** (campos obrigatórios, tipos e campos desconhecidos),
   nunca valores reais — então monte um payload sintético com placeholders
   sempre que os valores vierem de variáveis de ambiente, da entrada do
   usuário ou de outras chamadas. Exemplo:
   `node skills/variacoes/scripts/validate.mjs '{"Variant":{"product_id":"<id>","type_1":"Cor","value_1":"Azul"}}'`.
   Corrija todos os erros antes de retornar o código ao usuário. Até 3
   tentativas — se persistir, explique o problema ao usuário.

# API de Variações de Produtos — Tray

Documentação oficial: https://developers.tray.com.br/#apis-de-variacao-de-produtos

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/variants` | Listagem de variações com paginação |
| GET | `/variants/:id` | Consultar dados de uma variação |
| POST | `/variants` | Cadastrar nova variação |
| PUT | `/variants/:id` | Atualizar dados da variação |
| DELETE | `/variants/:id` | Excluir variação |

**Autenticação:** `?access_token={token}`

## Campos da Variação

| Campo | Tipo | Obrigatório (create) | Descrição |
|:--|:--|:--|:--|
| `product_id` | number | **Sim** | ID do produto pai |
| `type_1` | string | **Sim** | Nome do 1º atributo (ex: "Cor") |
| `value_1` | string | **Sim** | Valor do 1º atributo (ex: "Azul") |
| `type_2` | string | Condicional | Nome do 2º atributo; **obrigatório se `value_2` presente** |
| `value_2` | string | Condicional | Valor do 2º atributo; **obrigatório se `type_2` presente** |
| `price` | decimal | Não | Preço da variação (herda do produto se não informado) |
| `cost_price` | decimal | Não | Preço de custo |
| `stock` | number | Não | Estoque da variação |
| `ean` | string | Não | Código de barras da variação |
| `reference` | string | Não | Referência interna da variação |
| `weight` | number | Não | Peso em gramas |
| `length` | number | Não | Comprimento |
| `width` | number | Não | Largura |
| `height` | number | Não | Altura |

> ⚠️ **Atributos são campos planos `type_N`/`value_N`, NÃO um array.** A API
> **não** aceita um campo `values: [{name, value}]` — esse formato resulta em
> erro de validação (campos `type_1`/`value_1` ausentes). A plataforma suporta
> **no máximo 2 eixos de atributo**: `type_1`/`value_1` e `type_2`/`value_2`.
>
> Se `type_1` for `"Cor"` ou `"Color"`, a API resolve a cor (`color_id`)
> automaticamente a partir de `value_1`.

## Herança de Dados

Quando um campo não é informado na variação, ele herda o valor do produto pai. Isso se aplica a: `price`, `weight`, `length`, `width`, `height`.

## Limitação de Variações por Produto

A plataforma Tray impõe um limite de variações por produto. Consulte a seção "Limitação de variações por produto" na documentação oficial para os limites atuais.

## Corpo da Requisição (POST/PUT)

Cada combinação de atributos é **uma** variação = **uma** chamada `POST /variants`:

```json
{
  "Variant": {
    "product_id": 123,
    "type_1": "Cor",
    "value_1": "Azul",
    "type_2": "Tamanho",
    "value_2": "M",
    "price": "89.90",
    "stock": 50,
    "ean": "7891234567890"
  }
}
```

### Criar múltiplas variações

Para um produto com várias combinações, faça **uma chamada por combinação**.
Ex.: iPhone 15 nas cores Prata, Preto e Dourado, todos 256GB → 3 chamadas,
variando apenas `value_1`:

```json
// Variação 1
{ "Variant": { "product_id": 123, "type_1": "Cor", "value_1": "Prata",   "type_2": "Armazenamento", "value_2": "256GB" } }
// Variação 2
{ "Variant": { "product_id": 123, "type_1": "Cor", "value_1": "Preto",   "type_2": "Armazenamento", "value_2": "256GB" } }
// Variação 3
{ "Variant": { "product_id": 123, "type_1": "Cor", "value_1": "Dourado", "type_2": "Armazenamento", "value_2": "256GB" } }
```

## Paginação

Mesmos parâmetros da API de Produtos: `limit` (máximo 50, padrão 30), `page`.

## Imagens de Variação

As imagens de variação são gerenciadas pela API de Imagens separada (`POST /variants/:id/images`). Consulte o skill `tray-imagens-produtos`.

## Como Usar no Claude Code

### Exemplos de Prompt

- "adiciona variações de tamanho e cor ao produto 456"
- "atualiza o estoque da variação tamanho M cor azul"
- "lista todas as variações do produto 123"
- "como crio variações com preço e estoque individuais?"

### O que o Claude faz

1. Gera o código com o wrapper `Variant` e o `product_id` do produto pai
2. Define os atributos em campos planos `type_1`/`value_1` (e `type_2`/`value_2` se houver 2 eixos)
3. Define campos individuais da variação (preço, estoque, EAN) quando necessário
4. Gera uma chamada por combinação de atributos quando há múltiplas variações
5. Explica a herança de dados do produto pai para campos não informados

### O que você recebe

- Código de criação de variação com wrapper `{"Variant": {...}}` correto
- Atributos nos campos `type_1`/`value_1` e `type_2`/`value_2` (nunca array `values`)
- Lógica de herança explicada (quais campos herdam do produto pai)
- Exemplo de listagem por `product_id`

### Pré-requisitos

- Produto pai já cadastrado com o `product_id` disponível
- `access_token` configurado
