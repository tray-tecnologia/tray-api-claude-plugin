---
name: tray-usuarios
description: >
  API de Usuários da Tray. Utilize quando o desenvolvedor precisar
  listar os usuários administrativos da loja. API somente leitura.
---

# API de Usuários — Tray

Documentação oficial: https://developers.tray.com.br/#apis-de-usuario

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/users` | Listagem de usuários administrativos da loja |

**Autenticação:** `?access_token={token}`

**Somente leitura** — esta API não permite criação, atualização ou exclusão de usuários.

## Uso

Permite consultar os usuários com acesso administrativo à loja Tray. Útil para identificar responsáveis e configurar permissões na sua integração.
