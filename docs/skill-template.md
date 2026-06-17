<!--
  TEMPLATE DE SKILL DENSA — Tray API Plugin
  ----------------------------------------------------------------------
  Origem: issue ai/tasks#100 (P2.1 — Aprofundar skills mais finas).
  Objetivo: levar SKILL.md de recursos estratégicos à densidade de
  referência do benchmark Shopify (schemas embutidos, exemplos por
  endpoint, edge cases e antipadrões documentados).

  COMO USAR:
  1. Copie a estrutura abaixo para skills/<recurso>/SKILL.md.
  2. Substitua TODOS os placeholders <...>.
  3. Remova as instruções em comentário HTML antes de commitar.
  4. Rode `npm run lint:skills` — skills densas têm piso de 800 linhas (R7).
  5. Exemplos runáveis devem rodar contra sandbox Tray antes do merge.
     Sem sandbox, marque cada exemplo com o aviso NÃO-VERIFICADO (ver abaixo).

  MÉTRICAS DE DENSIDADE ALVO (issue #100):
  | Métrica              | Mínimo | Alvo (paridade Shopify) |
  | Linhas SKILL.md      | 800    | 1500+                   |
  | Endpoints            | 100%   | 100% + variants         |
  | Exemplos runáveis    | 1/end. | 2/end. (curl + Node)    |
  | Edge cases           | 3+     | 5+                      |
  | Antipadrões          | 2+     | 4+                      |
-->

---
name: tray-<recurso>
description: >
  <Descrição do recurso com DISAMBIGUATION explícita — o que a skill cobre.
  Cite os endpoints/quantidade. Ex.: "API completa de X da Tray (/endpoint).
  Cobre criar, editar, listar, excluir e ...">
when_to_use: >
  <Gatilhos explícitos que devem ativar a skill: termos PT + EN, nomes de
  endpoint, sinônimos. Ex.: cupom, desconto, coupon, POST /discount_coupons...>
when_not_to_use: >
  <Quando NÃO usar — aponte a skill correta. Ex.: "Não use para preços B2B
  permanentes (use tray-listas-preco-b2b)." Isto reduz invocação errada.>
---

<!--
  BLOCO MANDATORY — OBRIGATÓRIO, imediatamente após o frontmatter.
  Regra do projeto (CLAUDE.md): toda skill deve ter este bloco com chamada
  OBRIGATÓRIA a search_docs.mjs. Skills com schema local também exigem a
  chamada a validate.mjs. A substring "OBRIGATÓRIA" (com acento) é checada
  pelo linter (R6).
-->

## MANDATORY: Tool Calls Required Before Answering

> **Estas chamadas são OBRIGATÓRIAS, não opcionais.** Execute-as antes de gerar
> qualquer código ou payload. Se você está respondendo sem ter chamado as
> ferramentas abaixo, **pare e chame agora**.

### 1. Buscar documentação atualizada (sempre)

```bash
node skills/tray-dev/scripts/search_docs.mjs --topic=<recurso> "<termo da pergunta>"
```

- `<topic>`: ver tabela em `skills/tray-dev/SKILL.md`.
- Use os trechos retornados como fonte primária; este SKILL.md é resumo denso.

### 2. Validar payload localmente (quando houver schema local)

```bash
node skills/<recurso>/scripts/validate.mjs --schema=<SCHEMA_NAME> '<payload_json>'
```

- Schemas disponíveis: `<op.create>`, `<op.update>`. Use `--list-schemas`.
- Exit codes: `0` válido · `1` inválido · `2` erro de uso. `--json` p/ programático.
- Corrija todos os erros antes de retornar o código (até 3 tentativas).

<!-- Se o recurso ainda NÃO tem validate.mjs, troque a seção 2 por esta nota: -->
<!--
> **Nota:** este recurso ainda não tem `validate.mjs` local. Revise os campos
> obrigatórios contra a doc retornada por `search_docs.mjs` e os schemas em
> `skills/<recurso>/schemas/`.
-->

## Antes de responder

> Execute estas verificações antes de gerar qualquer payload ou código:

1. Confirme o método HTTP e endpoint correto para a operação solicitada.
2. Identifique os campos obrigatórios listados neste documento — não omita nenhum.
3. Verifique que `access_token` não aparece como literal string no código gerado.
4. Confirme que esta é a skill correta para o recurso (leia `when_not_to_use`).

# <Título> — API Tray

Documentação oficial: https://developers.tray.com.br/#<ancora>

## Visão geral

<!-- 2-3 parágrafos. O que é o recurso, por que existe, onde se encaixa no
     fluxo Tray (quais recursos vêm antes/depois). Aplique as 6 regras
     invariantes da plataforma (chave do recurso, access_token query param,
     paginação 50, rate limit, formato de datas, validação BR). -->

<Parágrafo 1 — o que é e qual problema resolve.>

<Parágrafo 2 — como se conecta a outros recursos (pré-requisitos, dependências,
disparo de webhooks).>

<Parágrafo 3 — invariantes específicas deste recurso (wrapper, unidades, limites).>

## Endpoints

<!-- Tabela-resumo primeiro, depois UMA subseção por endpoint. -->

| Método | Endpoint | Descrição |
|:--|:--|:--|
| GET | `/<recurso>` | Listar |
| GET | `/<recurso>/:id` | Detalhe |
| POST | `/<recurso>` | Criar |
| PUT | `/<recurso>/:id` | Atualizar |
| DELETE | `/<recurso>/:id` | Excluir |

**Autenticação:** `?access_token={token}` em todas as chamadas.

### POST /<recurso>

- **Quando usar:** <cenário concreto.>
- **Pré-requisitos:** <ex.: category_id válido, produto cadastrado.>
- **Schema do request:** [`schemas/<recurso>.create.json`](schemas/<recurso>.create.json)
- **Schema da response:** [`schemas/<recurso>.create-response.json`](schemas/<recurso>.create-response.json)
- **Campos:**

  | Campo | Tipo | Obrigatório | Descrição |
  |:--|:--|:--:|:--|
  | `<campo>` | string | Sim | <descrição + limite> |

- **Exemplo (curl):**

  <!-- NÃO-VERIFICADO: este exemplo ainda não foi executado contra a sandbox
       Tray. Validar manualmente antes do merge (critério de aceite #3 da #100). -->

  ```bash
  curl -X POST "https://${TRAY_API_ADDRESS}/<recurso>?access_token=${TRAY_ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{
      "<Recurso>": {
        "<campo>": "<valor>"
      }
    }'
  ```

- **Exemplo (Node):**

  ```js
  // NÃO-VERIFICADO contra sandbox — validar antes do merge.
  const res = await fetch(
    `https://${process.env.TRAY_API_ADDRESS}/<recurso>?access_token=${process.env.TRAY_ACCESS_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ '<Recurso>': { '<campo>': '<valor>' } }),
    },
  );
  if (res.status === 429) { /* backoff exponencial */ }
  const data = await res.json();
  ```

- **Erros comuns:**

  | Código | Causa | Como resolver |
  |:--|:--|:--|
  | 400 | Faltou a chave `"<Recurso>"` ou campo obrigatório | Reler campos; rodar `validate.mjs` |
  | 401 | `access_token` expirado/em header | Renovar via refresh; usar query param |
  | 429 | Rate limit | Backoff exponencial |

<!-- Repetir a subseção acima para CADA endpoint (GET, PUT, DELETE, relacionamentos…). -->

## Edge cases

<!-- Mínimo 3, alvo 5+. Cada um: descrição + exemplo concreto. -->

- **<Caso 1>:** <descrição + exemplo.>
- **<Caso 2>:** <descrição + exemplo.>
- **<Caso 3>:** <descrição + exemplo.>

## Antipadrões

<!-- Mínimo 2, alvo 4+. Baseados em BUGS REAIS (histórico de tickets /
     Slack #suporte-api). Marque com ❌. -->

- ❌ **<Antipadrão 1>:** <o que parece certo mas quebra + por quê + correção.>
- ❌ **<Antipadrão 2>:** <armadilha conhecida.>

## State machine

<!-- Obrigatório quando o recurso tem estados (ex.: status-pedido, pagamento).
     Diagrama mermaid + tabela de transições. Remova a seção se não se aplica. -->

```mermaid
stateDiagram-v2
    [*] --> <estado_inicial>
    <estado_inicial> --> <proximo>
    <proximo> --> [*]
```

| De | Para | Gatilho | Webhook disparado |
|:--|:--|:--|:--|
| `<a>` | `<b>` | <ação> | `<scope>` |

## Webhooks relacionados

<!-- Cross-links para tray-webhooks. Quais escopos/ações este recurso dispara. -->

- Escopo `<scope>` (ações: `<insert/update/delete>`) — ver [`tray-webhooks`](../webhooks/SKILL.md).

## Glossário

<!-- Termos específicos do domínio. -->

| Termo | Definição |
|:--|:--|
| `<termo>` | <definição> |

## Referências

- Doc oficial: https://developers.tray.com.br/#<ancora>
- Skills relacionadas: [`tray-<x>`](../<x>/SKILL.md), [`tray-<y>`](../<y>/SKILL.md)
- Issues conhecidas: <links>

## Como Usar no Claude Code

### Exemplos de Prompt

- "<prompt 1>"
- "<prompt 2>"

### O que o Claude faz

1. <passo>
2. <passo>

### O que você recebe

- <entregável>

### Pré-requisitos

- `access_token` configurado
- <outros>
