---
name: tray-palavras-chave
description: >
  API de Palavras-Chave da Tray. Utilize quando o desenvolvedor precisar
  consultar palavras-chave de SEO associadas à loja. API somente leitura.
---

# API de Palavras-Chave — Tray

Documentação oficial: https://developers.tray.com.br/#apis-de-palavras-chave

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/keywords` | Listagem de palavras-chave |
| GET | `/keywords/:id` | Consultar dados de uma palavra-chave |

**Autenticação:** `?access_token={token}`

**Somente leitura** — esta API não permite criação, atualização ou exclusão.

## Paginação

`limit` (máximo 50, padrão 30), `page`.

## Uso

Útil para consultar as palavras-chave de SEO configuradas na loja e integrá-las com ferramentas de marketing e analytics.
