---
name: tray-newsletter
description: >
  API de Newsletter da Tray. Utilize quando o desenvolvedor precisar
  gerenciar assinaturas de newsletter da loja, incluindo listagem de assinantes,
  inscrição e confirmação de cadastro.
---

# API de Newsletter — Tray

Documentação oficial: https://developers.tray.com.br/#apis-de-newsletter

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/newsletters` | Listagem de assinantes da newsletter |
| POST | `/newsletters` | Cadastrar assinante |
| POST | `/newsletters/confirm` | Confirmar cadastro de newsletter |

**Autenticação:** `?access_token={token}`

## Exemplo de Inscrição

```json
{
  "Newsletter": {
    "email": "cliente@exemplo.com",
    "name": "João Silva"
  }
}
```

## Fluxo de Inscrição

1. `POST /newsletters` — cadastra o e-mail
2. `POST /newsletters/confirm` — confirma a inscrição (double opt-in)

## Paginação

`limit` (máximo 50, padrão 30), `page`.

## Boas Práticas

1. **LGPD** — obtenha consentimento explícito antes de inscrever
2. **Double opt-in** — use o endpoint de confirmação para validar o e-mail
