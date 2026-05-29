---
name: tray-marcas
description: >
  API de Marcas da Tray. Utilize quando o desenvolvedor precisar gerenciar
  as marcas (fabricantes) dos produtos da loja, incluindo listagem, consulta individual,
  criação, atualização e exclusão. Inclui os campos da marca (brand, slug),
  paginação e filtros.
when_to_use: >
  Use quando o desenvolvedor mencionar: marca, fabricante, brand, GET /brands,
  POST /brands, PUT /brands, brand_id, filtrar por marca ou cadastrar fabricante.
when_not_to_use: >
  Não use para categorias da loja (use tray-categorias) nem para características de
  produto como cor ou material (use tray-caracteristicas).
---

## MANDATORY: Tool Call(s) Required Before Answering

- **OBRIGATÓRIO:** `node skills/tray-dev/scripts/search_docs.mjs "<termo>"` — confirme o comportamento da API antes de gerar código.
- **OBRIGATÓRIO:** `node skills/marcas/scripts/validate.mjs '<payload_json>'` — valide a estrutura do payload de marca antes de retornar código ao usuário.

## Antes de responder

> Execute estas verificações antes de gerar qualquer payload ou código:

1. Confirme o método HTTP e endpoint correto para a operação solicitada.
2. Identifique os campos obrigatórios listados neste documento — não omita nenhum.
3. Verifique que `access_token` não aparece como literal string no código gerado.
4. Confirme que esta é a skill correta para o recurso (leia `when_not_to_use` no frontmatter).
5. Execute `node skills/marcas/scripts/validate.mjs '<payload_json>'`
   para confirmar a estrutura do payload que vai gerar. O validador checa
   apenas **estrutura** (campos obrigatórios, tipos e campos desconhecidos),
   nunca valores reais — então monte um payload sintético com placeholders
   sempre que os valores vierem de variáveis de ambiente, da entrada do
   usuário ou de outras chamadas. Exemplo:
   `node skills/marcas/scripts/validate.mjs '{"Brand":{"brand":"<nome>"}}'`.
   Corrija todos os erros antes de retornar o código ao usuário. Até 3
   tentativas — se persistir, explique o problema ao usuário.

# API de Marcas — Tray

Documentação oficial: https://developers.tray.com.br/#api-de-marca-do-produto

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/products/brands` | Listagem de marcas com paginação e filtros |
| GET | `/products/brands/:id` | Consultar dados de uma marca por ID |
| POST | `/products/brands` | Cadastrar nova marca |
| PUT | `/products/brands/:id` | Atualizar dados da marca |
| DELETE | `/products/brands/:id` | Excluir marca |

**Autenticação:** `?access_token={token}` em todas as chamadas.

> **Alias não oficial:** a rota `/brands` (sem o prefixo `/products/`) também retorna HTTP 200 nesta API, mas não é documentada oficialmente pela Tray. Use sempre `/products/brands` para garantir compatibilidade e aderência à documentação oficial.

## Campos da Marca

| Campo | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `id` | number | — | ID da marca (retornado pela API) |
| `brand` | string | **Sim** | Nome da marca |
| `slug` | string | Não | Slug para URL amigável (gerado automaticamente se não informado) |

> ⚠️ **O campo do nome da marca é `brand`, NÃO `name`.** Enviar `name` resulta
> em `"Invalid data provided"` (HTTP 400) — a API ignora o campo desconhecido e
> falha por `brand` ausente. Os campos aceitos no payload são apenas `brand` e
> `slug`. Os campos `description` e `image` **não** existem nesta API de marcas.

## Paginação

| Parâmetro | Descrição |
|:--|:--|
| `limit` | Itens por página (máximo **50**, padrão **30**) |
| `page` | Número da página |

**Resposta inclui:** `total`, `page`, `offset`, `limit`, `maxLimit`

## Filtros de Listagem

| Filtro | Tipo | Descrição |
|:--|:--|:--|
| `id` | number | Filtrar por ID da marca |
| `brand` | string | Filtrar por nome da marca |

## Corpo da Requisição (POST/PUT)

```json
{
  "Brand": {
    "brand": "Nike",
    "slug": "nike"
  }
}
```

## Respostas

| Operação | Código | Mensagem |
|:--|:--|:--|
| Criação | 201 | `{"message": "Created", "id": 10, "code": 201}` |
| Atualização | 200 | `{"message": "Saved", "id": 10, "code": 200}` |
| Exclusão | 200 | `{"message": "Deleted", "id": 10, "code": 200}` |

## Exemplo de Resposta — Listar Marcas

```json
{
  "paging": {
    "total": 25,
    "page": 1,
    "offset": 0,
    "limit": 30,
    "maxLimit": 50
  },
  "Brands": [
    {
      "Brand": {
        "id": "1",
        "brand": "Nike",
        "slug": "nike"
      }
    }
  ]
}
```

## Exemplo de Resposta — Consultar Marca por ID

```json
{
  "Brand": {
    "id": "1",
    "brand": "Nike",
    "slug": "nike"
  }
}
```

## Boas Práticas

1. **Crie marcas antes dos produtos** — ao cadastrar produtos, o `brand_id` deve referenciar uma marca existente
2. **Use slugs descritivos** — o slug é usado na URL da página de marca na vitrine; mantenha-o limpo e legível
3. **Evite duplicidade** — consulte a listagem antes de criar para evitar marcas duplicadas
4. **Campo correto** — use sempre `brand` para o nome da marca; `name` é ignorado e causa erro
5. **Exclusão segura** — não exclua marcas que possuam produtos associados; reatribua os produtos antes

## Como Usar no Claude Code

### Exemplos de Prompt

- "cadastra as marcas Nike, Adidas e Puma"
- "lista todas as marcas disponíveis na loja"
- "verifica se a marca Samsung já existe antes de criar"
- "atualiza o slug da marca ID 10"

### O que o Claude faz

1. Gera o código de criação com wrapper `Brand`, usando o campo `brand` (e slug automático)
2. Inclui verificação de duplicidade via `GET /products/brands?brand=...` antes de criar
3. Monta o payload apenas com os campos aceitos (`brand`, `slug`)
4. Explica que o `brand_id` retornado deve ser usado ao cadastrar produtos

### O que você recebe

- Código de criação de marca com wrapper `{"Brand": {...}}` correto e campo `brand`
- Verificação de duplicidade antes de criar
- `brand_id` extraído da resposta para uso em produtos
- Código de listagem com paginação

### Pré-requisitos

- `access_token` configurado
