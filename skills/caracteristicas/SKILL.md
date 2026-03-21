---
name: tray-caracteristicas
description: >
  API de Caracteristicas de Produtos da Tray. Utilize quando o desenvolvedor
  precisar gerenciar caracteristicas (propriedades) dos produtos, incluindo cadastro,
  atualização, consulta e exclusão. Permite criar caracteristicas globais reutilizáveis
  e associar valores especificos a cada produto (ex: cor, tamanho, material, voltagem).
---

# API de Caracteristicas de Produtos — Tray

Documentação oficial: https://developers.tray.com.br/#apis-de-caracteristicas

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/products/:product_id/properties` | Listar caracteristicas de um produto |
| POST | `/products/:product_id/properties` | Cadastrar ou atualizar caracteristica no produto |
| POST | `/properties` | Criar caracteristica global (reutilizável em vários produtos) |
| DELETE | `/products/:product_id/properties/:id` | Excluir caracteristica de um produto |

**Autenticação:** `?access_token={token}` em todas as chamadas.

## Campos da Caracteristica

| Campo | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `id` | number | — | ID da caracteristica (retornado pela API) |
| `property` | string | Sim | Nome da caracteristica (ex: "Cor", "Material") |
| `value` | string | Sim | Valor da caracteristica (ex: "Azul", "Algodão") |
| `product_id` | number | Sim | ID do produto associado |

## Campos da Caracteristica Global

| Campo | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `name` | string | Sim | Nome da caracteristica global |
| `presentation` | string | Não | Tipo de apresentação (ex: "select", "text") |

## Corpo da Requisição — Cadastrar/Atualizar no Produto (POST)

```json
{
  "Property": {
    "property": "Cor",
    "value": "Azul"
  }
}
```

## Corpo da Requisição — Criar Caracteristica Global (POST)

```json
{
  "Property": {
    "name": "Material",
    "presentation": "select"
  }
}
```

## Respostas

| Operação | Código | Mensagem |
|:--|:--|:--|
| Criação | 201 | `{"message": "Created", "id": 123, "code": 201}` |
| Atualização | 200 | `{"message": "Saved", "id": 123, "code": 200}` |
| Exclusão | 200 | `{"message": "Deleted", "id": 123, "code": 200}` |

## Exemplo de Resposta — Listar Caracteristicas

```json
{
  "Properties": [
    {
      "Property": {
        "id": "1",
        "property": "Cor",
        "value": "Azul",
        "product_id": "123"
      }
    },
    {
      "Property": {
        "id": "2",
        "property": "Material",
        "value": "Algodão",
        "product_id": "123"
      }
    }
  ]
}
```

## Boas Práticas

1. **Use caracteristicas globais** — crie caracteristicas globais com `POST /properties` para padronizar nomes e evitar duplicidade
2. **Padronize valores** — mantenha consistência nos valores (ex: sempre "Azul" e nunca "azul" ou "AZUL")
3. **Consulte antes de criar** — verifique as caracteristicas existentes do produto antes de adicionar novas
4. **Caracteristicas para filtros** — as caracteristicas são usadas como filtros na vitrine; escolha nomes claros para o consumidor final
5. **Não confunda com variações** — caracteristicas são informativas; para opções que geram SKUs diferentes (estoque separado), use variações
