---
name: tray-parceiros
description: >
  API de Parceiros da Tray. Utilize quando o desenvolvedor precisar
  gerenciar parceiros/revendedores da loja, incluindo listagem, consulta,
  cadastro, atualização e exclusão.
---

# API de Parceiros — Tray

Documentação oficial: https://developers.tray.com.br/#apis-de-parceiros

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/partners` | Listagem de parceiros |
| GET | `/partners/:id` | Consultar dados do parceiro |
| POST | `/partners` | Cadastrar parceiro |
| PUT | `/partners/:id` | Atualizar dados do parceiro |
| DELETE | `/partners/:id` | Excluir parceiro |

**Autenticação:** `?access_token={token}`

## Exemplo de Criação

```json
{
  "Partner": {
    "name": "Parceiro Exemplo",
    "email": "parceiro@exemplo.com"
  }
}
```

## Paginação

`limit` (máximo 50, padrão 30), `page`.
