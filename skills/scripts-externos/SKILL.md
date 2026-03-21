---
name: tray-scripts-externos
description: >
  API de Scripts Externos da Tray. Utilize quando o desenvolvedor
  precisar gerenciar scripts JavaScript customizados injetados na vitrine
  da loja, incluindo listagem, cadastro, atualização e exclusão.
---

# API de Scripts Externos — Tray

Documentação oficial: https://developers.tray.com.br/#apis-de-scripts-externos

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/scripts` | Listagem de scripts externos |
| POST | `/scripts` | Cadastrar script externo |
| PUT | `/scripts/:id` | Atualizar script |
| DELETE | `/scripts/:id` | Excluir script |

**Autenticação:** `?access_token={token}`

## Campos

| Campo | Tipo | Descrição |
|:--|:--|:--|
| `url` | string | URL do script JavaScript |
| `location` | string | Posição na página: `head`, `body` ou `footer` |
| `active` | number | 0=inativo, 1=ativo |

## Exemplo de Cadastro

```json
{
  "Script": {
    "url": "https://cdn.exemplo.com/meu-script.js",
    "location": "footer",
    "active": 1
  }
}
```

## Boas Práticas

1. **Use `footer`** — para não bloquear o carregamento da página
2. **Scripts leves** — evite scripts pesados que impactem a performance
3. **HTTPS obrigatório** — a URL deve usar HTTPS
