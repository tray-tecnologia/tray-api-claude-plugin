# Changelog

## [Unreleased]

### Alterado

- **Licença migrada de GPL-3.0 para MIT.** Aplica-se a versões futuras; cópias previamente distribuídas mantêm os termos GPL-3.0 originais. Atualizados `LICENSE`, badge e seções de licença em `README.md`, `CONTRIBUTING.md` e o campo `license` em `package.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.cursor-plugin/plugin.json` e `.codex-plugin/plugin.json`. Decisão alinhada com o padrão permissivo adotado por toolkits de IA de referência (ex.: Shopify/Shopify-AI-Toolkit)
- **Repositório renomeado de `tray-api-claude-plugin` para `tray-api-ai-plugin`** para refletir compatibilidade multi-plataforma (Claude Code, Cursor, Codex, Gemini CLI, GitHub Copilot, JetBrains AI, Windsurf). Comandos de instalação atualizados em `README.md`, `CONTRIBUTING.md` e `SECURITY.md`. Campo `repository` atualizado nos cinco manifests de plugin. Nome do pacote npm (`@tray-tecnologia/tray-api-plugin`) e ID do plugin (`tray-api`) **não foram alterados**, preservando comandos como `npm install @tray-tecnologia/tray-api-plugin` e `/plugin install tray-api@tray-plugins`. `scripts/cleanup-plugin-installations.sh` reconhece ambos os nomes durante a transição. URLs antigas continuam funcionando via redirect permanente do GitHub

## [2.1.0] - 2026-06-17

### Adicionado

- `docs/skill-template.md` — template de SKILL.md denso (endpoints com exemplos curl+Node, edge cases, antipadrões, state machine, glossário) usado para aprofundar skills estratégicas (issue #100, P2.1).
- Regra **R7** no linter (`scripts/lint-skills.mjs`): skills em `DENSE_SKILLS` exigem SKILL.md com no mínimo 800 linhas. +5 testes.
- Schemas embarcados em `schemas/` para 5 recursos: `cupons` (discount_coupons.create/update), `multicd` (distribution_center.create/update), `pagamentos` (payment.create/update), `frete` (shippings.cotation), `status-pedido` (order_status.update).

### Mudado

- 5 skills aprofundadas para densidade comparável ao benchmark Shopify (todas > 800 linhas): `cupons` (332→1006), `multicd` (287→833), `pagamentos` (290→823), `frete` (189→897), `status-pedido` (179→920).
- State machines em mermaid adicionadas a `status-pedido` e `pagamentos`.

### Notas

- Exemplos curl/Node das skills aprofundadas estão marcados `NÃO-VERIFICADO contra sandbox` — devem ser executados contra a sandbox Tray antes do release final (critério de aceite da issue #100).

## [2.0.0] - 2026-05-05

> Consolida as iterações internas de desenvolvimento 1.3.0–1.5.0 (não publicadas) desta linha, além do servidor MCP.

### Adicionado

- Servidor MCP em `mcp/` (JS puro, ESM) compatível com qualquer cliente MCP (Claude Desktop, Cursor, Continue.dev, Zed, agents customizados, backends).
- 2 tools MCP: `tray.search_docs` (BM25 em developers.tray.com.br, reusa P1.2) e `tray.validate` (validação estrutural com schemas locais, reusa P1.1).
- Entrada `bin: {tray-mcp}` em `package.json` — após `npm install -g`, comando `tray-mcp` fica disponível globalmente; via `npx --package=@tray-tecnologia/tray-api-plugin tray-mcp` sem instalar.
- Script `npm run mcp` para boot local (stdio).
- `.mcp.json` no root como template canônico para configuração de clientes MCP.
- `mcp/README.md` (212 linhas) com setup detalhado para Claude Desktop, Cursor, Continue.dev e clientes genéricos.
- `mcp/lib/load-schemas.mjs` — descobre schemas em `skills/<recurso>/schemas/*.json` em runtime (8 testes).
- `mcp/tools/validate.mjs` — handler MCP que reusa `validatePayload` com input Zod (8 testes).
- `mcp/tools/search-docs.mjs` — handler MCP que reusa `search`/`loadOrFetch` com índice memoizado (8 testes).
- `mcp/server.mjs` — entrypoint stdio com `createServer()` exportado para testes (boot < 200ms, stdout silencioso).
- Suite `tests/mcp/` com 30 testes (load-schemas, tools-validate, tools-search-docs, server in-process via `InMemoryTransport`).
- Smoke test seção 15 (3 checks via JSON-RPC stdio: ListTools, CallTool inválido, total).
- Bloco 14 em `docs/CENARIOS-DE-TESTE.md` (5 cenários manuais para clientes MCP — boot stand-alone, Claude Desktop, Cursor, schema not found, modo offline).
- Bloco `## MANDATORY: Tool Call(s) Required Before Answering` em todas as 34 skills de recursos da API:
  - 8 skills da categoria A (`autorizacao`, `produtos`, `pedidos`, `clientes`, `webhooks`, `variacoes`, `categorias`, `marcas`) com `search_docs.mjs` **e** `validate.mjs`.
  - 19 skills da categoria B (escrita sem `validate.mjs`: `cupons`, `multicd`, `pagamentos`, `notas-fiscais`, `status-pedido`, `kits`, `caracteristicas`, `carrinho-compras`, `listas-preco-b2b`, `parceiros`, `newsletter`, `imagens-produtos`, `informacoes-adicionais`, `etiquetas-hub`, `emissores-etiqueta`, `enderecos-cliente`, `perfis-cliente`, `configuracao-frete`, `scripts-externos`) com `search_docs.mjs`.
  - 7 skills da categoria C (somente leitura: `usuarios`, `produtos-vendidos`, `palavras-chave`, `listagem-carrinho`, `informacoes-loja`, `frete`, `etiquetas-mercado-livre`) com `search_docs.mjs`.
- `scripts/lint-skills.mjs` — linter de conformidade do bloco MANDATORY com 6 regras (presença, posição, comando search, comando validate, ausência de duplicata, frase imperativa). Suporta `--json`, `--help` e arquivo único; exit codes Unix (0/1/2).
- Suite `tests/lint-skills/` com 9 fixtures + 10 testes cobrindo as 6 regras + skip de `tray-dev`/`visao-geral` + `findSkillFiles`.
- Script `npm run lint:skills`.
- Step `Lint skills (bloco MANDATORY)` no CI (`.github/workflows/ci.yml`), antes do smoke.
- Seção "Mandatory Tool Calls em SKILL.md" no `README.md` e "Como adicionar uma skill nova" no `CONTRIBUTING.md` (templates A/B/C).
- Bloco 13 em `docs/CENARIOS-DE-TESTE.md` (6 cenários do `lint-skills`).
- Skill nova `tray-dev` com `scripts/search_docs.mjs` — busca lexical local (BM25 + sinônimos PT-BR) em `developers.tray.com.br`, com cache 24h em `~/.cache/tray-plugin/dev-docs/`.
- CLI `search_docs` com flags `--topic=<slug>`, `--json`, `--limit=<n>`, `--no-cache`, `--refresh`, `--list-topics`, `--help`; output JSON Shopify-like; exit codes 0/1/2.
- Mapa canônico de 35 tópicos em `scripts/lib/topics-map.mjs`; dicionário de sinônimos PT-BR em `skills/tray-dev/assets/synonyms-pt-br.json`; telemetria opt-out via `OPT_OUT_INSTRUMENTATION=true`.
- Suporte a `validate.mjs` v2: saída JSON estruturada (`--json`), entrada via stdin, seleção explícita de schema (`--schema=`), listagem (`--list-schemas`), exit codes 0/1/2 e `--help`.
- `scripts/lib/formats-br.mjs` com 9 formats (`cpf`, `cnpj`, `cep`, `ean`, `ncm`, `date`, `datetime`, `email`, `uri`) com DV para CPF/CNPJ/EAN.
- Schemas multi-operação em `skills/<skill>/schemas/<recurso>.<op>.json` para 8 skills (15 schemas); 3 skills novas com `validate.mjs` (`variacoes`, `categorias`, `marcas`).
- `scripts/lib/SUBSET.md` documentando o subset JSON Schema suportado em runtime; `scripts/lint-schemas.mjs` rejeita keywords fora do subset.

### Mudado

- `package.json` ganha bloco `dependencies` (`@modelcontextprotocol/sdk@^1.29.0`, `zod@^3.23.0`) e `devDependencies` (`ajv@^8.17.1`, `ajv-formats@^3.0.1`); `files` inclui `"mcp/**"` e `".mcp.json"`; `engines.node: ">=20"`.
- README.md ganha seções `## Servidor MCP (mcp/)`, "Busca em docs com `search_docs.mjs`" e "Validação local com `validate.mjs`"; CONTRIBUTING.md ganha "Como evoluir o servidor MCP" e guia de schemas multi-operação.
- AGENTS.md, GEMINI.md, `.cursor/rules/tray-api.mdc`, `.aiassistant/rules/tray-api.md` e `.github/copilot-instructions.md` referenciam o servidor MCP, o novo padrão MANDATORY, o linter `npm run lint:skills` e o bloco "Validação local".
- As 8 skills da categoria A tiveram o "step 5" (`validate.mjs`) movido do `## Antes de responder` para o bloco `## MANDATORY`, eliminando duplicação.
- `scripts/lib/validate-schema.mjs` v2 — refatorado para suportar `format`, `pattern`, múltiplos schemas, output JSON e seleção explícita de operação; erros carregam `path` e `keyword`.
- `npm test` cobre `tests/**/*.test.mjs` (validate + search + mcp); `.github/workflows/ci.yml` roda `npm ci && npm test` antes do `npm run smoke` em matrix Node 20/22.
- `scripts/smoke-test.js` — seções 6/7 reescritas para iterar pelos schemas multi-operação; seções novas para lint-schemas, search_docs e MCP.

### Removido

- `assets/schema.json` em todas as 5 skills migradas (`autorizacao`, `produtos`, `pedidos`, `clientes`, `webhooks`), substituído por `schemas/<recurso>.<op>.json`.

### Privacidade

- Header `X-Tray-AI-Telemetry: on` enviado por default ao buscar `developers.tray.com.br`. **Nenhuma query é enviada no header** — apenas indicação de origem do plugin. Opt-out documentado em README.

### Notas

- `console.log` é proibido em qualquer arquivo de `mcp/` (quebraria o protocolo MCP via stdio). Apenas `console.error` permitido.
- Skills com múltiplas operações exigem `--schema=<op>` ao invocar `validate.mjs`; os `SKILL.md` já trazem o exemplo correto. Automações externas que chamam o CLI direto sem flag precisam atualizar.

## [1.3.0] - 2026-05-29

Saneamento de conformidade das skills confrontando o comportamento real da API Tray e a documentação oficial. Corrige bugs que bloqueavam a criação de recursos via API.

### Corrigido

- **Variações — formato de atributos** (`skills/variacoes`): a skill documentava `values: [{name, value}]`, formato inexistente na API. A API usa campos planos `type_1`/`value_1` e `type_2`/`value_2` (`type_1`/`value_1` obrigatórios na criação; no máximo 2 eixos). Reescrita a tabela de campos, exemplos e regra de múltiplas variações
- **Marcas — campo do nome** (`skills/marcas`): a skill usava `name`, mas a API exige `brand`; `name` era ignorado, causando `"Invalid data provided"` (HTTP 400). Corrigido para `brand`; removidos campos inexistentes `description`/`image`; filtros e exemplos de resposta ajustados
- **Clientes — `birth_date` obrigatório** (`skills/clientes`): a API exige `birth_date` na criação; a skill marcava como opcional. Adicionado a `required` no schema, tabela, exemplo e alerta
- **Cupons — campos obrigatórios** (`skills/cupons`): a API exige `code`, `description`, `value` e `type` na criação; `description` estava como opcional. Documentados os quatro obrigatórios
- **Newsletter — `email` obrigatório** (`skills/newsletter`): a API exige `email` na inscrição; documentada a obrigatoriedade e tabela de campos
- **Endereços de cliente — rota incorreta** (`skills/enderecos-cliente`): a rota documentada `/customers/:id/addresses` retorna HTTP 404; a correta é `/customers/addresses` e `/customers/addresses/:id` (`customer_id` na query/corpo, não no path). Endpoints corrigidos, método `PUT` adicionado

### Adicionado

- `skills/{variacoes,categorias,marcas}/scripts/validate.mjs` + `assets/schema.json` — validadores executáveis de payload, completando as 8 skills de categoria A previstas no CLAUDE.md (`additionalProperties:false` para rejeitar campos inexistentes)
- `scripts/lint-skills.mjs` + `npm run lint:skills` — lint que exige o bloco `## MANDATORY: Tool Call(s)...` imediatamente após o frontmatter em toda skill, chamada a `search_docs.mjs` e, nas skills de categoria A, chamada a `validate.mjs` + existência de `validate.mjs`/`schema.json` válidos
- Bloco `## MANDATORY: Tool Call(s) Required Before Answering` em todas as 35 skills (33 que não o possuíam)
- `npm test` (`node --test`) cobrindo `tests/mcp/load-schemas.test.mjs`

### Alterado

- `.github/workflows/ci.yml` — executa `lint:skills` antes do `smoke` e roda `npm test` (matriz Node 20 e 22), conforme o CLAUDE.md
- `scripts/smoke-test.js` — cobre os validadores de `variacoes`, `categorias` e `marcas` (payload válido + rejeição do payload incorreto)

## [1.2.0] - 2026-04-29

### Adicionado

- `skills/visao-geral/SKILL.md` — skill de entrada com regras invariantes da API Tray (OAuth, payload com chave do recurso, rate limit, dados BR), carregada antes da skill do recurso para reforçar guardrails em todas as plataformas suportadas
- Seção `## Antes de responder` em todos os 35 `SKILL.md`, com 4 ou 5 passos de verificação (método/endpoint, campos obrigatórios, sem credenciais literais, skill correta e — quando aplicável — execução de `validate.mjs`)
- `skills/{autorizacao,produtos,pedidos,clientes,webhooks}/scripts/validate.mjs` — validadores executáveis de payload por schema, com até 3 tentativas de correção antes de devolver código ao usuário
- `scripts/test-prompt-matcher.mjs` — regressão do `matcher` do hook `UserPromptSubmit` contra os prompts dos Blocos 1, 4, 5 e 6 do `docs/CENARIOS-DE-TESTE.md`, garantindo cobertura PT-BR e ausência de falso-positivo
- `.github/workflows/ci.yml` — pipeline de CI no GitHub Actions rodando `npm run smoke` e `npm run version:check` em PRs e push para `main` (matriz Node 20 e 22)
- `SECURITY.md` — política de divulgação responsável de vulnerabilidades, com canais privados (GitHub Private Vulnerability Reporting + e-mail), SLA de primeiro contato e escopo cobrindo hooks, scripts executáveis, manifests e conteúdo de prompt
- `CONTRIBUTING.md` — guia de contribuição com fluxo de PR, regras de versão, validação local (smoke + version:check) e Conventional Commits
- `package.json` na raiz para distribuição como pacote Node instalável
- `.cursor-plugin/plugin.json` para manifesto nativo de distribuição no Cursor
- `.codex-plugin/plugin.json` para manifesto nativo de distribuição no Codex
- `gemini-extension.json` para extensão nativa no Gemini CLI
- `scripts/sync-version.js` para sincronizar e validar versão entre todos os manifests
- `scripts/smoke-test.js` — seção 11 valida o **contrato `{ok, reason}`** de todos os hooks tipo `prompt`. Diferencia hooks "informativos" (que injetam contexto sem decidir, como o `UserPromptSubmit`) de hooks "decisores" (que precisam declarar o schema oficial). Detecta o anti-padrão "prompt instrui não responda" que causa `hook stopped continuation` na origem
- `docs/ANALISE-HOOK-POSTTOOLUSE-BASH.md` — documento técnico com análise profunda do bug do hook `PostToolUse:Bash`, validação cruzada com a documentação oficial de Claude Code e Cursor, matriz de viabilidade Opção × Plataforma e plano de validação manual

### Alterado

- `hooks/hooks.json` — `matcher` do `UserPromptSubmit` reescrito para cobrir vocabulário PT-BR realista. O matcher antigo (`api.*tray|tray.*api|access_token|...`) só disparava com termos técnicos em inglês e não casava com prompts naturais como *"liste os produtos da minha loja Tray"*. O novo matcher usa classes de caracteres (`[Tt]ray`, `[Aa][Pp][Ii]`) e word boundaries para casar com **"loja Tray"**, **"API Tray"**, **"webhooks da Tray"**, **"produtos/pedidos/clientes da/na Tray"**, **"da minha Tray"**, etc., sem disparar em falsos positivos como **"bandeja (tray) de comida"** ou **"lib de UI chamada Tray"**. Validado contra os 18 cenários relevantes em `docs/CENARIOS-DE-TESTE.md` via `scripts/test-prompt-matcher.mjs`
- `hooks/hooks.json` — prompt do `PostToolUse:Write|Edit` reescrito para retornar JSON estruturado `{"ok": true | false, "reason": "..."}` conforme schema oficial documentado em [Claude Code](http://code.claude.com/docs/en/hooks#prompt-based-hooks) e [Cursor](https://cursor.com/docs/hooks.md). Hooks tipo `prompt` **devem** retornar `{ok, reason}` JSON; instruir "não responda" em linguagem natural fazia a LLM gerar prosa em PT-BR que o orquestrador interpretava como bloqueio, disparando `PostToolUse:Write hook stopped continuation` em arquivos triviais como `.env.example`. As regras de detecção (credencial real hardcoded, payload sem chave do recurso, sugestão de `validate.mjs`, ignorar templates) foram preservadas — mudou apenas o **formato de saída**
- `hooks/hooks.json` — bloco `PostToolUse:Bash` **removido**. Tinha o mesmo defeito estrutural do `Write|Edit` original (prompt instruía silêncio violando o contrato `{ok, reason}`), mas com efeito ainda pior: disparava `PostToolUse:Bash hook stopped continuation` em comandos triviais como `ls`, `find`, `git status`, **interrompendo o fluxo do agente em tarefas legítimas do plugin** (ex.: agente `configuracao-aplicativo` rodando o cenário 1.1 dos testes). A inteligência reativa que ele tentava prover (HTTP 401/429/400/404) foi migrada para o prompt do `UserPromptSubmit`, que é informativo e não bloqueia o fluxo
- `hooks/hooks.json` — prompt do `UserPromptSubmit` ampliado com orientação proativa sobre erros HTTP da Tray: HTTP 401 (renovar via `refresh_token`), HTTP 429 (backoff exponencial / lotes; limites 180 req/min e 10.000 req/dia), HTTP 400 com erro de campo (rodar `skills/<recurso>/scripts/validate.mjs`), HTTP 404 (confirmar `api_address`, específico por loja). Mantém o caráter informativo e não-bloqueante explícito no prompt
- `scripts/smoke-test.js` — adicionada seção 10 que executa `test-prompt-matcher.mjs` como regressão de CI; valida também os novos manifests de distribuição
- Contagem de skills atualizada para **35** em `README.md`, `AGENTS.md`, `.github/copilot-instructions.md` e `.claude-plugin/marketplace.json`
- `GEMINI.md`, `.aiassistant/rules/tray-api.md` e `.cursor/rules/tray-api.mdc` listam a nova skill `visao-geral` como entrypoint, carregada antes das skills de recurso
- `README.md` agora referencia `SECURITY.md` e `CONTRIBUTING.md` na introdução, e descreve fluxo de instalação via `npm`/`pnpm`/`bun` e instruções por ferramenta usando `node_modules`
- `package.json` com scripts `version:check` e `version:set`
- `docs/CENARIOS-DE-TESTE.md` — sub-grupo 7B reescrito: cenários 7.5–7.8 agora validam o comportamento **migrado** (orientação HTTP via `UserPromptSubmit` proativo); 7.9 vira regressão crítica de "Bash trivial não dispara mais nada"; novo cenário 7.10 cobre prompts off-topic dentro do plugin
- Passo 5 da seção "Antes de responder" reescrito nas 5 skills com schema (`autorizacao`, `produtos`, `pedidos`, `clientes`, `webhooks`) deixando explícito que o validador checa apenas **estrutura** (campos obrigatórios, tipos, campos desconhecidos) — não valores reais — e que payloads sintéticos com placeholders são esperados quando os valores virão de variáveis de ambiente, callback OAuth, entrada do usuário ou outras chamadas. Cada skill ganhou um exemplo concreto reaproveitando os campos do schema. Motivação: na execução manual do cenário 1.1 (`docs/CENARIOS-DE-TESTE.md`), a IA pulou o passo 5 raciocinando *"o payload só tem campos vindos de env vars — não há JSON concreto pra passar ao validador"*, leitura razoável mas incorreta da redação anterior. A nova redação remove essa fricção sem mudar comportamento do validador
- `scripts/lib/validate-schema.mjs` — quando `validate.mjs` é chamado sem payload, a mensagem de uso passou a incluir uma dica explícita de que o validador aceita placeholders nos valores. Reforça a mensagem das skills para quem invocar o validador interativamente

---

## [1.1.0] - 2026-04-23

### Adicionado

#### Suporte nativo a múltiplas ferramentas de IA

- `AGENTS.md` — carregado automaticamente por Cursor, OpenAI Codex, Windsurf e JetBrains AI; índice completo de skills e agentes com regras da API Tray
- `GEMINI.md` — carregado automaticamente pelo Gemini CLI; importa os skills principais via `@` e lista os demais
- `.cursor/rules/tray-api.mdc` — regra Cursor com frontmatter (`description`, `alwaysApply`) e referências `@` a todos os 34 skills e agentes
- `.github/copilot-instructions.md` — instrução de repositório para GitHub Copilot (VS Code)
- `.aiassistant/rules/tray-api.md` — project rule para JetBrains AI Assistant

#### Skills (34 — campo `when_to_use` adicionado a todos)

Todos os 34 skills agora possuem o campo `when_to_use` no frontmatter, garantindo
descoberta automática confiável em Codex e Gemini CLI.

### Alterado

- `README.md` — nova seção "Instalação por ferramenta" cobrindo todas as 7 ferramentas suportadas

---

## [1.0.0] - 2026-03-21

### Adicionado

#### Skills (34)
- **autorizacao** — Fluxo OAuth 2.0 completo, tokens, renovação, erros
- **webhooks** — Sistema de notificação com 9 escopos
- **produtos** — CRUD completo com todos os campos, filtros, paginação
- **variacoes** — Gestão de variantes (SKUs)
- **imagens-produtos** — Upload de imagens para produtos e variações
- **categorias** — Árvore de categorias e gestão hierárquica
- **pedidos** — Ciclo completo de pedidos
- **clientes** — Gestão de clientes com CPF/CNPJ
- **informacoes-loja** — Dados e configurações da loja
- **caracteristicas** — Atributos customizados de produtos
- **marcas** — Gestão de marcas/fabricantes
- **kits** — Produtos compostos (combos)
- **status-pedido** — Tipos de status de pedido
- **enderecos-cliente** — Endereços de entrega e cobrança
- **perfis-cliente** — Perfis e vinculações de cliente
- **frete** — Cálculo de frete e formas de envio
- **configuracao-frete** — Configuração de formas de frete e tabelas de CEP
- **multicd** — Centros de distribuição e estoque distribuído
- **notas-fiscais** — Notas fiscais eletrônicas (NF-e)
- **pagamentos** — Métodos e configurações de pagamento
- **cupons** — Cupons de desconto com 21 endpoints
- **carrinho-compras** — Gestão de carrinhos de compra
- **listagem-carrinho** — Nova API de listagem de carrinhos
- **informacoes-adicionais** — Campos customizados em produtos
- **listas-preco-b2b** — Tabelas de preço B2B/atacado
- **emissores-etiqueta** — Integração de etiquetas de envio
- **etiquetas-mercado-livre** — Etiquetas do Mercado Livre
- **etiquetas-hub** — Etiquetas do sistema HUB
- **scripts-externos** — Scripts JavaScript na vitrine
- **newsletter** — Gestão de assinantes
- **parceiros** — Gestão de parceiros/revendedores
- **palavras-chave** — Palavras-chave de SEO
- **produtos-vendidos** — Histórico de vendas
- **usuarios** — Usuários administrativos

#### Agentes (10)
- **configuracao-aplicativo** — Assistente de configuração inicial
- **gestor-catalogo** — Gestão em massa de catálogo
- **gestor-pedidos** — Gestão de ciclo de pedidos
- **debug-integracao** — Diagnóstico de problemas
- **assistente-migracao** — Orquestrador de migração de outras plataformas
- **migracao-shopify** — Mapeamento de campos Shopify → Tray
- **migracao-woocommerce** — Mapeamento de campos WooCommerce → Tray
- **migracao-magento** — Mapeamento de campos Magento 2 → Tray
- **migracao-vtex** — Mapeamento de campos VTEX → Tray
- **migracao-nuvemshop** — Mapeamento de campos Nuvemshop → Tray

#### Comandos (3)
- **setup** — Guia rápido de configuração
- **referencia-api** — Referência de todos os endpoints
- **validar-integracao** — Checklist de validação

#### Hooks (2)
- **PostToolUse** — Verificação de tokens hardcoded
- **UserPromptSubmit** — Contexto da API Tray quando mencionada
