---
name: tray-configuracao-frete
description: >
  API de Configuração de Frete da Tray. Utilize quando o desenvolvedor
  precisar gerenciar métodos de envio e tabelas de faixa de CEP da loja, incluindo
  criação, atualização e exclusão de formas de envio e suas respectivas tabelas de
  CEP com faixas de peso, preços e prazos. Essencial para configurar regras de frete
  personalizadas por região e faixa de peso.
---

# API de Configuração de Frete — Tray

Documentação oficial: https://developers.tray.com.br/#api-de-configuracao-de-forma-de-frete

## Endpoints — Métodos de Envio

| Método | Endpoint | Descrição |
|:--|:--|:--|
| POST | `/shipping/methods` | Cadastrar novo método de envio |
| PUT | `/shipping/methods/:id` | Atualizar método de envio |
| DELETE | `/shipping/methods/:id` | Excluir método de envio |

## Endpoints — Tabelas de CEP

| Método | Endpoint | Descrição |
|:--|:--|:--|
| POST | `/shipping/methods/:method_id/zip_ranges` | Cadastrar faixa de CEP no método de envio |
| PUT | `/shipping/methods/:method_id/zip_ranges/:id` | Atualizar faixa de CEP |
| DELETE | `/shipping/methods/:method_id/zip_ranges/:id` | Excluir faixa de CEP |

**Autenticação:** `?access_token={token}` em todas as chamadas.

## Campos do Método de Envio

| Campo | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `id` | number | — | ID do método de envio (retornado pela API) |
| `name` | string | Sim | Nome do método (ex: "PAC", "SEDEX", "Motoboy") |
| `active` | number | Não | 1 = ativo, 0 = inativo |
| `type` | string | Não | Tipo do método (ex: "correios", "custom", "gateway") |
| `delivery_time` | number | Não | Prazo padrão de entrega em dias úteis |
| `additional_delivery_time` | number | Não | Dias adicionais ao prazo de entrega |
| `free_shipping_value` | decimal | Não | Valor mínimo do pedido para frete grátis |

## Campos da Faixa de CEP

| Campo | Tipo | Obrigatório | Descrição |
|:--|:--|:--|:--|
| `id` | number | — | ID da faixa de CEP (retornado pela API) |
| `zip_start` | string | Sim | CEP inicial da faixa (ex: "01000000") |
| `zip_end` | string | Sim | CEP final da faixa (ex: "09999999") |
| `weight_start` | number | Sim | Peso inicial da faixa em gramas |
| `weight_end` | number | Sim | Peso final da faixa em gramas |
| `price` | decimal | Sim | Valor do frete para esta faixa |
| `delivery_time` | number | Não | Prazo de entrega em dias úteis para esta faixa |
| `additional_price_per_kg` | decimal | Não | Valor adicional por kg excedente |

## Corpo da Requisição — Criar Método de Envio (POST)

```json
{
  "ShippingMethod": {
    "name": "Transportadora Regional",
    "active": 1,
    "type": "custom",
    "delivery_time": 5,
    "additional_delivery_time": 2,
    "free_shipping_value": "299.90"
  }
}
```

## Corpo da Requisição — Atualizar Método de Envio (PUT)

```json
{
  "ShippingMethod": {
    "name": "Transportadora Regional - Atualizado",
    "active": 1,
    "delivery_time": 4
  }
}
```

## Corpo da Requisição — Criar Faixa de CEP (POST)

```json
{
  "ZipRange": {
    "zip_start": "01000000",
    "zip_end": "09999999",
    "weight_start": 0,
    "weight_end": 5000,
    "price": "15.90",
    "delivery_time": 5,
    "additional_price_per_kg": "2.50"
  }
}
```

## Corpo da Requisição — Atualizar Faixa de CEP (PUT)

```json
{
  "ZipRange": {
    "price": "18.90",
    "delivery_time": 4
  }
}
```

## Respostas

| Operação | Código | Mensagem |
|:--|:--|:--|
| Criação | 201 | `{"message": "Created", "id": 10, "code": 201}` |
| Atualização | 200 | `{"message": "Saved", "id": 10, "code": 200}` |
| Exclusão | 200 | `{"message": "Deleted", "id": 10, "code": 200}` |

## Fluxo de Configuração

1. **Crie o método de envio** — `POST /shipping/methods` com nome e configurações gerais
2. **Adicione faixas de CEP** — para cada região, crie faixas de CEP com `POST /shipping/methods/:id/zip_ranges`
3. **Configure pesos e preços** — defina faixas de peso com preços específicos para cada região
4. **Ative o método** — garanta que o campo `active` esteja como `1`

## Exemplo de Estrutura Completa

```
Método: "Transportadora SP Interior"
├── Faixa CEP: 13000000 - 13999999 (Campinas)
│   ├── 0g - 5000g  → R$ 12,90 (3 dias)
│   └── 5001g - 30000g → R$ 25,90 (4 dias)
├── Faixa CEP: 14000000 - 14999999 (Ribeirão Preto)
│   ├── 0g - 5000g  → R$ 18,90 (5 dias)
│   └── 5001g - 30000g → R$ 35,90 (6 dias)
```

## Boas Práticas

1. **Evite sobreposição de faixas** — não crie faixas de CEP ou peso que se sobreponham no mesmo método
2. **Cubra todas as faixas de peso** — garanta que haja faixas de peso para cobrir todos os produtos da loja
3. **Teste após configurar** — use a API de Frete (`GET /shipping`) para validar que o cálculo retorna resultados corretos
4. **Frete grátis condicional** — use `free_shipping_value` para incentivar pedidos de maior valor
5. **Dias adicionais** — use `additional_delivery_time` para incluir tempo de manuseio/embalagem
6. **Recursos relacionados** — consulte o skill `tray-frete` para calcular frete e o skill `tray-multicd` para configuração de múltiplos centros de distribuição
