# Template de exemplos executáveis (curl + Node)

> Spec da issue [ai/tasks#101](https://git.tray.net.br/ai/tasks/-/issues/101) (P2.2).
> Cada endpoint documentado numa skill tem **pelo menos um par** de exemplos
> runáveis: `<endpoint>.curl.sh` + `<endpoint>.node.mjs`. Endpoints com corpo
> (`POST`/`PUT`) trazem também `<endpoint>.fixture.json`.

## Estrutura por skill

```
skills/<skill>/
├── SKILL.md
├── schemas/
│   └── <recurso>.<op>.json          # já existem nas skills categoria A
└── examples/
    ├── <endpoint>.curl.sh           # bash + curl, runável
    ├── <endpoint>.node.mjs          # Node 18+, fetch nativo, zero-install
    └── <endpoint>.fixture.json      # payload do request (só POST/PUT)
```

## Convenções da API Tray (obrigatórias)

Estes exemplos seguem as regras invariantes da plataforma (ver `CLAUDE.md` e
`skills/visao-geral/SKILL.md`) — **não** a convenção genérica da issue:

| Regra | Valor |
|:--|:--|
| Base da API | `${TRAY_API_BASE}` (o `api_address` da loja, retornado no callback OAuth) |
| Auth | `access_token` como **query parameter**, nunca header |
| Wrapper de payload | `{"Product": {...}}` — PascalCase singular EN |
| Endpoint | `/products`, `/orders`, `/customers` (sem prefixo `/web_api` para rotas autenticadas) |
| Decimais | ponto, não vírgula (`49.90`) |

## Variáveis de ambiente

Padronizadas em `.env.example` na raiz:

| Var | Uso |
|:--|:--|
| `TRAY_API_BASE` | Host da API da loja (ex: `https://api.lojateste.commercesuite.com.br`) |
| `TRAY_ACCESS_TOKEN` | Token de acesso (expira em 3h) |
| `TRAY_STORE_URL` | URL da vitrine — só para fluxo OAuth (redirect) |
| `TRAY_CONSUMER_KEY` / `TRAY_CONSUMER_SECRET` | Credenciais do app — só para `autorizacao` |

## Regras dos exemplos

- **Sandbox-first** — rodam contra loja sandbox sem efeito destrutivo. Endpoints
  destrutivos (`DELETE`, `cancel`) usam ID via env (`TRAY_PRODUCT_ID`) e exigem
  confirmação explícita; nunca apagam recurso fixo hardcoded.
- **Fail-fast** — saem com exit ≠ 0 em env var faltando ou HTTP non-2xx.
- **Zero-install** — só `curl`+`jq` (bash) e `fetch` nativo (Node 18+). Sem deps.
- **Sem credencial hardcoded** — tokens sempre via env (o hook `PostToolUse` bloqueia literais).
- **Fixture = input do validador** — o `.fixture.json` é o payload wrapped que
  passa direto em `node skills/<skill>/scripts/validate.mjs --schema=<op> "$(cat fixture)"`.
- **Comentário de cabeçalho** — cada arquivo aponta a doc oficial e diz quando usar.

## Template `<endpoint>.curl.sh`

```bash
#!/usr/bin/env bash
# Exemplo: Criar produto via API Tray
# Doc: https://developers.tray.com.br/#api-de-produtos
# Quando usar: cadastrar um produto novo. Não usar para variações (ver tray-variacoes).
# Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN exportados.
set -euo pipefail
cd "$(dirname "$0")"

: "${TRAY_API_BASE:?defina TRAY_API_BASE=https://api.sualoja.commercesuite.com.br}"
: "${TRAY_ACCESS_TOKEN:?defina TRAY_ACCESS_TOKEN}"

curl --fail-with-body -sS \
  -X POST \
  "${TRAY_API_BASE}/products?access_token=${TRAY_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @produto-criar.fixture.json \
  | jq .
```

## Template `<endpoint>.node.mjs`

```js
#!/usr/bin/env node
/**
 * Exemplo: Criar produto via API Tray
 * Run: node skills/produtos/examples/produto-criar.node.mjs
 * Doc: https://developers.tray.com.br/#api-de-produtos
 * Pré-requisitos: TRAY_API_BASE e TRAY_ACCESS_TOKEN no env.
 */
import { readFile } from 'node:fs/promises';

const { TRAY_API_BASE, TRAY_ACCESS_TOKEN } = process.env;
if (!TRAY_API_BASE || !TRAY_ACCESS_TOKEN) {
  throw new Error('Defina TRAY_API_BASE e TRAY_ACCESS_TOKEN');
}

const payload = JSON.parse(
  await readFile(new URL('./produto-criar.fixture.json', import.meta.url))
);

const url = new URL(`${TRAY_API_BASE}/products`);
url.searchParams.set('access_token', TRAY_ACCESS_TOKEN);

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  console.error(`HTTP ${res.status}`, await res.text());
  process.exit(1);
}
console.log(JSON.stringify(await res.json(), null, 2));
```

## Template `<endpoint>.fixture.json`

Payload wrapped na chave do recurso (PascalCase). Serve como input do `validate.mjs`:

```json
{
  "Product": {
    "name": "Camiseta Exemplo",
    "price": 49.90,
    "stock": 10,
    "category_id": 1,
    "available": 1,
    "description": "Produto de teste — fixture do exemplo do plugin"
  }
}
```

## Troubleshooting comum

| HTTP | Causa | Correção |
|:--|:--|:--|
| `401` | `access_token` expirado (3h) ou em header em vez de query param | Renovar via `refresh_token`; mover para query param |
| `403` | Escopo/permissão do app insuficiente | Verificar permissões do app no painel de parceiros |
| `404` | `api_address` errado (varia por loja) | Usar `TRAY_API_BASE` do callback OAuth da loja |
| `429` | Rate limit (180/min, 10k/dia) | Backoff exponencial; reduzir batch para 150 |
| `400` | Faltou wrapper `{"Product":{...}}` ou campo obrigatório | Rodar `validate.mjs` com a fixture antes |
