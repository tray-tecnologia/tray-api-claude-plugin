---
name: tray-informacoes-adicionais
description: >
  API de Informação Adicional da Tray. Utilize quando o desenvolvedor
  precisar gerenciar campos customizados de informação que podem ser vinculados
  a produtos, incluindo criação, atualização, vinculação e exclusão.
---

# API de Informação Adicional — Tray

Documentação oficial: https://developers.tray.com.br/#api-de-informacao-adicional-additional_info

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/additional-info` | Listagem geral das informações adicionais |
| GET | `/additional-info/:id` | Consultar dados por ID |
| POST | `/additional-info` | Cadastrar informação adicional |
| PUT | `/additional-info/:id` | Atualizar informação |
| PUT | `/products/:id/additional-info` | Atualizar informações relacionadas ao produto |
| POST | `/products/:id/additional-info` | Vincular informação adicional ao produto |
| DELETE | `/products/:id/additional-info/:info_id` | Excluir relação com produto |
| DELETE | `/additional-info/:id` | Excluir informação adicional |

**Autenticação:** `?access_token={token}`

## Exemplo de Criação

```json
{
  "AdditionalInfo": {
    "name": "Composição",
    "value": "100% Algodão"
  }
}
```

## Vinculação com Produto

Para vincular uma informação adicional a um produto:

```http
POST /products/123/additional-info?access_token={token}
```

```json
{
  "additional_info_id": 456
}
```

## Boas Práticas

1. **Crie antes de vincular** — primeiro crie a informação, depois vincule ao produto
2. **Reutilize** — a mesma informação pode ser vinculada a múltiplos produtos
3. **Paginação** — `limit` (máximo 50, padrão 30), `page`
