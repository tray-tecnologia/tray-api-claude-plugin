---
name: tray-informacoes-loja
description: >
  API de Informações da Loja da Tray. Utilize quando o desenvolvedor
  precisar consultar dados de configuração da loja como nome, razão social,
  CNPJ, endereço, contatos, URLs (domínio) e status interno da loja.
when_to_use: >
  Use quando o desenvolvedor mencionar: informações da loja, dados da loja, GET /info,
  domínio da loja, CNPJ da loja, api_address, nome da loja, razão social ou status da loja.
when_not_to_use: >
  Não use para alterar dados da loja — esta API é somente leitura. Para usuários
  administrativos, use tray-usuarios. A API NÃO retorna dados de plano/pacote
  contratado (id/nome/grupo do plano) — esses dados não existem na API pública.
---

## MANDATORY: Tool Call Required Before Answering

> **Esta chamada é OBRIGATÓRIA, não opcional.** Execute-a antes de gerar
> qualquer código de consulta. Se você está respondendo sem ter chamado a
> ferramenta abaixo, **pare e chame agora**.

### Buscar documentação atualizada (sempre)

```bash
node skills/tray-dev/scripts/search_docs.mjs --topic=informacoes-loja "<termo da pergunta>"
```

- `<TOPIC_SLUG>`: ver tabela em `skills/tray-dev/SKILL.md`.
- Use os trechos retornados como fonte primária; este SKILL.md é resumo.

> **Nota:** este recurso é só de leitura (apenas endpoints GET) — não há payload
> para validar. Foque em parâmetros de query.

## Antes de responder

> Execute estas verificações antes de gerar qualquer payload ou código:

1. Confirme o método HTTP e endpoint correto para a operação solicitada.
2. Identifique os campos retornados listados neste documento — não invente campos.
3. Verifique que `access_token` não aparece como literal string no código gerado.
4. Confirme que esta é a skill correta para o recurso (leia `when_not_to_use` no frontmatter).

# API de Informações da Loja — Tray

Documentação oficial: https://developers.tray.com.br/#apis-de-informacoes-da-loja

## Endpoints

| Método | Endpoint | Autenticação | Descrição |
|:--|:--|:--|:--|
| GET | `/info` | `?access_token={token}` | Consultar dados completos da loja |
| GET | `/info` | pública (sem token) | Consulta pública — retorna apenas `id`, `uri`, `secure_uri` |

**Autenticação:** `?access_token={token}` como **query parameter** para a resposta completa.

> **Não existe endpoint `/store`.** O endpoint correto é `GET /info` (com barra
> final opcional: `/info/`).

## Formato da Resposta

A resposta é um objeto JSON **flat** (sem wrapper de recurso — **não** vem
envolta em `{"Store": {...}}`).

## Dados Retornados (autenticado)

| Campo | Tipo | Descrição |
|:--|:--|:--|
| `id` | number | Código da loja |
| `name` | string | Nome da loja |
| `company_name` | string | Razão social |
| `cnpj` | string | CNPJ |
| `address` | string | Logradouro |
| `postal_code` | string | CEP |
| `city` | string | Cidade |
| `state` | string | Estado (UF) |
| `country` | string | País |
| `phone_number_1` | string | Telefone 1 |
| `phone_number_2` | string | Telefone 2 |
| `phone_number_3` | string | Telefone 3 |
| `email_1` | string | E-mail 1 |
| `email_2` | string | E-mail 2 |
| `office_hour` | string | Horário de operação |
| `uri` | string | URL da loja |
| `secure_uri` | string | URL segura (https) da loja |
| `logo` | object | `{http, https}` — URLs do logo |
| `logo_mobile` | object | `{http, https}` — URLs do logo mobile |
| `favicon` | object | `{http, https}` — URLs do favicon |
| `messages` | object | `{footer}` — mensagens da loja |
| `internal_status` | string | Status da loja (ex.: `ativa`) |
| `user` | string | Usuário |

> **Não há campo de plano/pacote.** A API `GET /info` **não** retorna dados de
> plano contratado — não existem campos `plan`, `plan_id`, `plan_name` nem
> `group`/grupo de plano na resposta. Se precisar do plano da loja, obtenha por
> outro canal (painel de parceiros / contrato), não por esta API.

## Dados Retornados (consulta pública, sem token)

| Campo | Tipo | Descrição |
|:--|:--|:--|
| `id` | string | ID da loja |
| `uri` | string | URL da loja |
| `secure_uri` | string | URL segura (https) |

## Exemplo de Resposta (autenticado)

```json
{
  "id": "123",
  "name": "Nome da Loja",
  "company_name": "Razão Social da Loja LTDA",
  "cnpj": "00.000.000/0000-00",
  "address": "Endereço da loja, 123",
  "postal_code": "04001-001",
  "city": "São Paulo",
  "state": "SP",
  "country": "Brasil",
  "phone_number_1": "(11)3333-0000",
  "phone_number_2": "(11)99999-0000",
  "phone_number_3": "",
  "email_1": "emailda@loja.com.br",
  "email_2": "",
  "office_hour": "",
  "uri": "http://loja.commercesuite.com.br",
  "secure_uri": "https://loja.commercesuite.com.br",
  "logo": {
    "http": "http://images.tcdn.com.br/img/img_prod/123/123_logotipo.png",
    "https": "https://images.tcdn.com.br/img/img_prod/123/123_logotipo.png"
  },
  "logo_mobile": {
    "http": "http://images.tcdn.com.br/img/arquivos/123/themed/img/123_logotipo-mobile.png",
    "https": "https://images.tcdn.com.br/img/arquivos/123/themed/img/123_logotipo-mobile.png"
  },
  "user": "",
  "internal_status": "ativa",
  "favicon": {
    "http": "http://images.tcdn.com.br/img/img_prod/123/123_favicon.ico",
    "https": "https://images.tcdn.com.br/img/img_prod/123/123_favicona.ico"
  },
  "messages": {
    "footer": "Mensagem do rodapé da loja."
  }
}
```

## Exemplo de Chamada

```bash
# NÃO-VERIFICADO contra sandbox — validar antes do merge.
# Requer TRAY_ACCESS_TOKEN e TRAY_API_ADDRESS no ambiente.
curl -s "https://${TRAY_API_ADDRESS}/info/?access_token=${TRAY_ACCESS_TOKEN}"
```

## Uso Recomendado

Este endpoint é ideal para:

1. **Primeira chamada de teste** — após obter o `access_token`, use `GET /info` para validar que a autenticação funcionou
2. **Dados de configuração** — obter informações da loja para configurar sua integração
3. **Verificação de status** — confirmar `internal_status` da loja antes de realizar operações

## Como Usar no Claude Code

### Exemplos de Prompt

- "valida se minha autenticação com a Tray está funcionando"
- "consulta os dados da loja para configurar minha integração"
- "verifica o status interno da loja"
- "pega nome, CNPJ e domínio da loja"

### O que o Claude faz

1. Gera o código para `GET /info?access_token={token}` (token como query param)
2. Extrai os campos relevantes da resposta **flat** (sem wrapper `Store`)
3. Inclui verificação de `internal_status` antes de prosseguir com operações

### O que você recebe

- Código de consulta de dados da loja via `GET /info`
- Verificação de `internal_status`
- Extração dos dados de configuração necessários para a integração

### Pré-requisitos

- `access_token` configurado (use `tray-autorizacao` primeiro)
