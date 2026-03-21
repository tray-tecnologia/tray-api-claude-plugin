---
name: tray-kits
description: >
  API de Kits de Produtos da Tray. Utilize quando o desenvolvedor precisar
  gerenciar kits (combos/bundles) de produtos, incluindo listagem, consulta individual,
  criação e atualização. Permite agrupar múltiplos produtos em um único kit com
  quantidades específicas, ideal para combos promocionais e pacotes de produtos.
---

# API de Kits de Produtos — Tray

Documentação oficial: https://developers.tray.com.br/#api-de-kit

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/products/kits` | Listagem de kits com paginação |
| GET | `/products/kits/:id` | Consultar dados de um kit por ID |
| POST | `/products/kits` | Cadastrar novo kit |
| PUT | `/products/kits/:id` | Atualizar dados do kit |

**Autenticação:** `?access_token={token}` em todas as chamadas.

**Nota:** Para excluir um kit, use `DELETE /kits/:id` disponível na API de Produtos.

## Campos do Kit

| Campo | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `id` | number | — | ID do kit (retornado pela API) |
| `product_id` | number | Sim | ID do produto que compõe o kit |
| `kit_product_id` | number | Sim | ID do produto-kit (produto principal que representa o combo) |
| `quantity` | number | Sim | Quantidade do produto dentro do kit |
| `product_parent_id` | number | Sim | ID do produto pai (referência hierárquica do kit) |

## Paginação

| Parâmetro | Descrição |
|:--|:--|
| `limit` | Itens por página (máximo **50**, padrão **30**) |
| `page` | Número da página |

**Resposta inclui:** `total`, `page`, `offset`, `limit`, `maxLimit`

## Corpo da Requisição (POST)

```json
{
  "Kit": {
    "product_id": 456,
    "kit_product_id": 100,
    "quantity": 2,
    "product_parent_id": 100
  }
}
```

## Corpo da Requisição (PUT)

```json
{
  "Kit": {
    "quantity": 3
  }
}
```

## Respostas

| Operação | Código | Mensagem |
|:--|:--|:--|
| Criação | 201 | `{"message": "Created", "id": 50, "code": 201}` |
| Atualização | 200 | `{"message": "Saved", "id": 50, "code": 200}` |

## Exemplo de Resposta — Listar Kits

```json
{
  "paging": {
    "total": 5,
    "page": 1,
    "offset": 0,
    "limit": 30,
    "maxLimit": 50
  },
  "Kits": [
    {
      "Kit": {
        "id": "50",
        "product_id": "456",
        "kit_product_id": "100",
        "quantity": "2",
        "product_parent_id": "100"
      }
    }
  ]
}
```

## Exemplo de Resposta — Consultar Kit por ID

```json
{
  "Kit": {
    "id": "50",
    "product_id": "456",
    "kit_product_id": "100",
    "quantity": "2",
    "product_parent_id": "100"
  }
}
```

## Fluxo de Criação de Kit

1. **Crie o produto-kit** — primeiro cadastre o produto principal que representará o combo via `POST /products`
2. **Associe os produtos componentes** — para cada produto que faz parte do kit, faça `POST /products/kits` informando o `product_id` do componente e o `kit_product_id` do produto principal
3. **Defina quantidades** — informe a quantidade de cada componente dentro do kit

## Boas Práticas

1. **Produto-kit deve existir** — o `kit_product_id` deve referenciar um produto já cadastrado
2. **Produtos componentes devem existir** — o `product_id` também deve ser um produto válido
3. **Estoque automático** — o estoque do kit é calculado com base no menor estoque disponível dos componentes
4. **Preço do kit** — defina o preço do produto-kit diretamente no cadastro do produto principal
5. **Evite loops** — não inclua um kit como componente de outro kit
6. **Para excluir** — use `DELETE /kits/:id` da API de Produtos para remover o vínculo do kit
