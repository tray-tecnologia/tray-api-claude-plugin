---
name: tray-multicd
description: >
  API de Multi-CD (Centros de Distribuição) da Tray. Utilize quando o
  desenvolvedor precisar gerenciar múltiplos centros de distribuição, incluindo
  cadastro, atualização, exclusão de CDs, gestão de estoque por produto/variação
  em cada CD, e configuração de prioridade e cobertura regional. Inclui documentação
  de webhooks para sincronização de estoque entre sistemas.
---

# API de Multi-CD (Centros de Distribuição) — Tray

Documentação oficial: https://developers.tray.com.br/#api-de-multicd

## Endpoints — Centros de Distribuição

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/distribution_centers` | Listar centros de distribuição |
| GET | `/distribution_centers/:id` | Consultar CD por ID |
| POST | `/distribution_centers` | Cadastrar novo centro de distribuição |
| PUT | `/distribution_centers/:id` | Atualizar dados do CD |
| DELETE | `/distribution_centers/:id` | Excluir centro de distribuição |

## Endpoints — Estoque por CD

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/distribution_centers/:dc_id/products` | Listar estoque de produtos no CD |
| GET | `/distribution_centers/:dc_id/products/:product_id` | Consultar estoque de um produto no CD |
| PUT | `/distribution_centers/:dc_id/products/:product_id` | Atualizar estoque do produto no CD |
| PUT | `/distribution_centers/:dc_id/variants/:variant_id` | Atualizar estoque da variação no CD |

**Autenticação:** `?access_token={token}` em todas as chamadas.

## Campos do Centro de Distribuição

| Campo | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `id` | number | — | ID do CD (retornado pela API) |
| `name` | string | Sim | Nome do centro de distribuição (ex: "CD São Paulo", "CD Minas") |
| `zip_code` | string | Sim | CEP do CD (apenas números, ex: "01310100") |
| `address` | string | Sim | Endereço completo do CD |
| `city` | string | Sim | Cidade do CD |
| `state` | string | Sim | Estado/UF do CD (ex: "SP", "MG") |
| `priority` | number | Não | Prioridade do CD (menor número = maior prioridade) |
| `active` | number | Não | 1 = ativo, 0 = inativo |

## Campos do Estoque por CD

| Campo | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `product_id` | number | — | ID do produto |
| `variant_id` | number | — | ID da variação (quando aplicável) |
| `stock` | number | Sim | Quantidade em estoque no CD |
| `distribution_center_id` | number | — | ID do centro de distribuição |

## Paginação

| Parâmetro | Descrição |
|:--|:--|
| `limit` | Itens por página (máximo **50**, padrão **30**) |
| `page` | Número da página |

**Resposta inclui:** `total`, `page`, `offset`, `limit`, `maxLimit`

## Corpo da Requisição — Criar CD (POST)

```json
{
  "DistributionCenter": {
    "name": "CD São Paulo",
    "zip_code": "01310100",
    "address": "Av. Paulista, 1000",
    "city": "São Paulo",
    "state": "SP",
    "priority": 1,
    "active": 1
  }
}
```

## Corpo da Requisição — Atualizar CD (PUT)

```json
{
  "DistributionCenter": {
    "name": "CD São Paulo - Matriz",
    "priority": 1,
    "active": 1
  }
}
```

## Corpo da Requisição — Atualizar Estoque no CD (PUT)

**Produto:**
```json
{
  "DistributionCenterProduct": {
    "stock": 150
  }
}
```

**Variação:**
```json
{
  "DistributionCenterVariant": {
    "stock": 75
  }
}
```

## Respostas

| Operação | Código | Mensagem |
|:--|:--|:--|
| Criação | 201 | `{"message": "Created", "id": 5, "code": 201}` |
| Atualização | 200 | `{"message": "Saved", "id": 5, "code": 200}` |
| Exclusão | 200 | `{"message": "Deleted", "id": 5, "code": 200}` |

## Exemplo de Resposta — Listar CDs

```json
{
  "paging": {
    "total": 3,
    "page": 1,
    "offset": 0,
    "limit": 30,
    "maxLimit": 50
  },
  "DistributionCenters": [
    {
      "DistributionCenter": {
        "id": "1",
        "name": "CD São Paulo",
        "zip_code": "01310100",
        "address": "Av. Paulista, 1000",
        "city": "São Paulo",
        "state": "SP",
        "priority": "1",
        "active": "1"
      }
    },
    {
      "DistributionCenter": {
        "id": "2",
        "name": "CD Belo Horizonte",
        "zip_code": "30130000",
        "address": "Av. Afonso Pena, 500",
        "city": "Belo Horizonte",
        "state": "MG",
        "priority": "2",
        "active": "1"
      }
    }
  ]
}
```

## Exemplo de Resposta — Estoque por CD

```json
{
  "DistributionCenterProducts": [
    {
      "DistributionCenterProduct": {
        "product_id": "100",
        "stock": "50",
        "distribution_center_id": "1"
      }
    },
    {
      "DistributionCenterProduct": {
        "product_id": "101",
        "stock": "30",
        "distribution_center_id": "1"
      }
    }
  ]
}
```

## Lógica de Seleção do CD

Quando um pedido é realizado, a Tray seleciona o CD com base nos seguintes critérios:

1. **Disponibilidade** — o CD deve ter estoque suficiente para todos os itens
2. **Prioridade** — CDs com menor número de prioridade são preferidos
3. **Proximidade** — o CEP do CD é comparado com o CEP de entrega para otimizar frete e prazo
4. **Status ativo** — apenas CDs com `active: 1` são considerados

## Webhooks de Estoque

A Tray pode disparar webhooks quando o estoque de um CD é alterado, permitindo sincronização em tempo real com ERPs e sistemas externos.

| Evento | Descrição |
|:--|:--|
| `product_stock` | Disparado quando o estoque de um produto é alterado em qualquer CD |
| `variant_stock` | Disparado quando o estoque de uma variação é alterado em qualquer CD |

### Payload do Webhook

```json
{
  "event": "product_stock",
  "product_id": 100,
  "distribution_center_id": 1,
  "stock": 50,
  "previous_stock": 55
}
```

Configure webhooks via o skill `tray-webhooks`.

## Boas Práticas

1. **CEP do CD é fundamental** — o CEP do CD é usado para calcular frete; informe o CEP correto do endereço físico
2. **Prioridade planejada** — defina prioridades estrategicamente (ex: CD mais central com prioridade 1)
3. **Estoque sincronizado** — mantenha o estoque de cada CD atualizado em tempo real via integração
4. **Estoque total** — o estoque exibido na vitrine é a soma do estoque de todos os CDs ativos
5. **Variações por CD** — se o produto tem variações, gerencie o estoque de cada variação individualmente por CD
6. **Desative antes de excluir** — mude `active` para `0` antes de excluir um CD para evitar impacto em pedidos
7. **Teste o cálculo de frete** — após configurar CDs, teste o frete com diferentes CEPs usando o skill `tray-frete`
8. **Recursos relacionados** — consulte os skills `tray-frete`, `tray-configuracao-frete` e `tray-webhooks`
