# Plano de Correção — Skill `variacoes` (e gaps relacionados)

**Data:** 2026-05-29
**Autor:** análise via confronto código-fonte × skill × docs oficiais
**Fonte de verdade:** `git.tray.net.br/commerce/api_php8` — `app/Model/Variant.php`, `app/Controller/VariantsController.php`

---

## 1. Diagnóstico

### 1.1 Causa-raiz da falha de criação de variações

A skill `tray-variacoes` documenta um formato de atributo que **não existe na API**.

**O que a skill diz** (`skills/variacoes/SKILL.md`, linhas 57, 76–78):

```json
{
  "Variant": {
    "product_id": 123,
    "values": [
      {"name": "Cor", "value": "Azul"},
      {"name": "Tamanho", "value": "M"}
    ]
  }
}
```

**O que a API realmente exige** (campos planos `type_N`/`value_N`):

```json
{
  "Variant": {
    "product_id": 123,
    "type_1": "Cor",
    "value_1": "Azul",
    "type_2": "Tamanho",
    "value_2": "M"
  }
}
```

### 1.2 Evidência no código-fonte (ground truth)

`app/Model/Variant.php`:

- **Validação `required` no create** (linhas 175–198):
  - `type_1` → `notEmptyCreate` com `required => true`, `on => create`
  - `value_1` → `notEmptyCreate` com `required => true`, `on => create`
  - `type_2` / `value_2` → opcionais, mas **se um for informado o outro vira obrigatório** (`__validateTypeAndValueTwo`, linhas 1629–1638)
- **Campos persistidos** (`fillable`/save, linhas 77, 84, 101, 107, 113–114): `type_1, value_1, type_2, value_2` — campos planos.
- **Mapa de tradução** (linhas 26–29): `type_1 => tipo1`, `value_1 => valor1`, etc.
- **`grep 'values'` no model → zero ocorrências.** O array `values: [{name, value}]` é ficção da documentação.

`app/Controller/VariantsController.php`:
- `add()` só valida `product_id` e delega a `parent::add()`; toda a validação de atributo está no Model.

`app/webroot/api-docs/api-docs/variants` (Swagger oficial, linhas 282–301):
- `properties`: `product_id, type_1, value_1, type_2, value_2, price, stock, promotional_price` — confirma campos planos.

**Conclusão:** o conector/MCP não "falhou em mapear". A skill ensinou um formato inexistente. O modelo seguiu a skill e a API rejeitou. Bug está na **documentação da skill**, não no MCP — embora o MCP herde o mesmo schema errado (ver §3).

### 1.3 Gaps de conformidade adicionais (CLAUDE.md vs realidade)

`CLAUDE.md` (linhas 24, 29–30) afirma que 8 skills da "categoria A" têm `scripts/validate.mjs`:
`autorizacao, produtos, pedidos, clientes, webhooks, variacoes, categorias, marcas`.

**Realidade** (`find skills -name validate.mjs`): só **5 existem** —
`autorizacao, pedidos, webhooks, clientes, produtos`.

**Faltam:** `variacoes`, `categorias`, `marcas` (validate.mjs + assets/schema.json).
→ `npm run lint:skills` está documentado no CLAUDE.md mas **não existe em `package.json`** (sem script `lint:skills`). O lint que deveria pegar isso não roda.

### 1.4 Outras inconsistências reportadas (validar separadamente)

Da imagem de validação de endpoints (não confirmadas contra código nesta análise — confirmar antes de corrigir):
- `POST /customers` → `birth_date` exigido (skill diz opcional)
- `POST /discount_coupons` → `description`, `type`, `value` exigidos (não documentados)
- `POST /newsletter` → `email` exigido (não documentado)
- `POST /brands` → erro genérico "Invalid data provided" (skill `marcas` precisa de schema p/ diagnosticar)
- `/customers/:id/addresses` → 404 (path documentado pode estar errado)

Essas saem do escopo de "variações" mas entram no mesmo plano de saneamento (§4, fase 3).

---

## 2. Correção da skill `variacoes` (prioridade ALTA — desbloqueia criação)

### 2.1 Reescrever o bloco de payload em `skills/variacoes/SKILL.md`

Substituir a tabela de campos (linha 57) e o exemplo JSON (linhas 70–82) por:

| Campo | Tipo | Obrigatório (create) | Descrição |
|:--|:--|:--|:--|
| `product_id` | number | Sim | ID do produto pai |
| `type_1` | string | **Sim** | Nome do 1º atributo (ex: "Cor") |
| `value_1` | string | **Sim** | Valor do 1º atributo (ex: "Azul") |
| `type_2` | string | Condicional | Nome do 2º atributo; obrigatório se `value_2` presente |
| `value_2` | string | Condicional | Valor do 2º atributo; obrigatório se `type_2` presente |
| `price` | decimal | Não | Herda do produto pai se omitido |
| `stock` | number | Não | Estoque da variação |
| `ean` | string | Não | Código de barras |
| `reference` | string | Não | Referência interna |

Exemplo correto (uma variação = uma combinação completa de atributos):

```json
{
  "Variant": {
    "product_id": 123,
    "type_1": "Cor",
    "value_1": "Azul",
    "type_2": "Tamanho",
    "value_2": "M",
    "price": "89.90",
    "stock": 50,
    "ean": "7891234567890"
  }
}
```

**Notas a adicionar na skill:**
- A API suporta **no máximo 2 eixos de atributo** (`type_1/value_1` e `type_2/value_2`). Não existe array `values`.
- Cada combinação de atributos = **uma** chamada `POST /variants`. Ex.: iPhone Prata 256GB e iPhone Preto 256GB são 2 variações (`value_1` muda, `type_2/value_2` = "Armazenamento"/"256GB" em ambas).
- Se `type_1` for "Cor"/"Color", a API resolve `color_id_1` automaticamente (linhas 1282–1286 do Model).

### 2.2 Adicionar bloco MANDATORY + chamada ao validate.mjs

Inserir após o frontmatter (exigência do CLAUDE.md §"Bloco MANDATORY"), no padrão das outras skills categoria A:

```
## MANDATORY: Tool Call(s) Required Before Answering

- OBRIGATÓRIO: node skills/tray-dev/scripts/search_docs.mjs "<termo>"
- OBRIGATÓRIO: node skills/variacoes/scripts/validate.mjs '<payload_json>'
```

### 2.3 Atualizar passo 5 do "Antes de responder"

Hoje a skill `variacoes` **não tem** o passo 5 (chamada ao validate.mjs) que produtos/pedidos/clientes têm. Adicionar texto análogo, com exemplo:
`node skills/variacoes/scripts/validate.mjs '{"Variant":{"product_id":"<id>","type_1":"<attr>","value_1":"<val>"}}'`

---

## 3. Criar `skills/variacoes/scripts/validate.mjs` + `assets/schema.json`

### 3.1 `skills/variacoes/scripts/validate.mjs`

Copiar o padrão de `skills/produtos/scripts/validate.mjs`:

```js
#!/usr/bin/env node
/**
 * Valida um payload da API de Variações da Tray contra o schema local.
 * Uso: node skills/variacoes/scripts/validate.mjs '<payload_json>'
 */
import { runValidator } from '../../../scripts/lib/validate-schema.mjs';

await runValidator({
  callerUrl: import.meta.url,
  skillName: 'variacoes',
  usageExample: '{"Variant":{"product_id":"<id>","type_1":"Cor","value_1":"Azul"}}',
});
```

### 3.2 `skills/variacoes/assets/schema.json`

`title: "Variant"` (o loader desembrulha `{"Variant":{...}}` automaticamente).
**Crítico:** `additionalProperties: false` para que o validador **rejeite ativamente** o campo `values` fictício (produtos usa `true`, o que deixaria `values` passar — não repetir o erro).

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Variant",
  "description": "Payload para POST/PUT /variants na API Tray",
  "type": "object",
  "required": ["product_id", "type_1", "value_1"],
  "properties": {
    "product_id": { "type": ["string", "number"], "description": "ID do produto pai" },
    "type_1":  { "type": "string", "description": "Nome do 1º atributo (ex: Cor)" },
    "value_1": { "type": "string", "description": "Valor do 1º atributo (ex: Azul)" },
    "type_2":  { "type": "string", "description": "Nome do 2º atributo (obrigatório se value_2 presente)" },
    "value_2": { "type": "string", "description": "Valor do 2º atributo (obrigatório se type_2 presente)" },
    "price":   { "type": ["string", "number"], "description": "Preço; herda do produto pai se omitido" },
    "cost_price": { "type": ["string", "number"] },
    "promotional_price": { "type": ["string", "number"] },
    "stock":   { "type": ["string", "number"] },
    "minimum_stock": { "type": ["string", "number"] },
    "ean":     { "type": "string" },
    "reference": { "type": "string" },
    "weight":  { "type": ["string", "number"] },
    "length":  { "type": ["string", "number"] },
    "width":   { "type": ["string", "number"] },
    "height":  { "type": ["string", "number"] },
    "cubic_weight": { "type": ["string", "number"] },
    "availability": { "type": "string" },
    "availability_days": { "type": ["string", "number"] }
  },
  "additionalProperties": false
}
```

> **Limitação conhecida do validador:** o subset Draft-07 em `scripts/lib/validate-schema.mjs` não suporta `dependencies`/`dependentRequired`. A regra condicional "type_2 ⇒ value_2 obrigatório" não é expressável no schema atual. Opções:
> - (a) Deixar para a API validar (aceitável — é caso de borda).
> - (b) Adicionar suporte a `dependentRequired` em `validate-schema.mjs` (melhoria geral). Recomendado como item separado.

### 3.3 Verificar no MCP (`mcp/lib/load-schemas`)

O commit `6a45005` adicionou descoberta de schemas no MCP. Confirmar que `tray.validate` descobre automaticamente o novo `skills/variacoes/assets/schema.json` (provável, se varre `skills/*/assets/schema.json`). Se a lista de schemas for hardcoded, adicionar `variacoes`. **Este é o ponto que faz a correção valer também para o conector MCP**, não só para a skill em Markdown.

---

## 4. Saneamento mais amplo (mesma classe de bug)

### Fase 1 — desbloquear variações (este plano, §2–3)
1. Reescrever payload em `SKILL.md`.
2. Criar `validate.mjs` + `schema.json` de variações.
3. Validar MCP descobre o schema novo.

### Fase 2 — fechar gaps de conformidade declarados no CLAUDE.md
4. Criar `validate.mjs` + `schema.json` para `categorias` e `marcas` (CLAUDE.md promete, não existem).
5. Implementar de fato o `npm run lint:skills` (ausente do `package.json`) que verifica:
   - bloco MANDATORY presente após frontmatter;
   - skills categoria A têm `scripts/validate.mjs` + `assets/schema.json`.
   Sem ele, esse drift volta a acontecer.

### Fase 3 — confirmar e corrigir as demais inconsistências da imagem
6. Confrontar contra o código-fonte (mesmo método desta análise) cada item de §1.4:
   - `Customer.php` → `birth_date` realmente required?
   - `DiscountCoupon` model → `description/type/value` required?
   - `Newsletter` model → `email` required?
   - `Brand` model → quais campos required (mensagem genérica é o sintoma)?
   - rota real de endereços de cliente (`/customers/:id/addresses` 404).
7. Para cada confirmado: atualizar a tabela de campos da skill + ajustar `required` no schema correspondente.

---

## 5. Validação da correção (critério de aceite)

Após aplicar §2–3, estes comandos devem passar:

```bash
# deve falhar — formato antigo (values) agora rejeitado
node skills/variacoes/scripts/validate.mjs '{"Variant":{"product_id":1,"values":[{"name":"Cor","value":"Azul"}]}}'
# esperado: erro "values" não é campo conhecido + "type_1"/"value_1" ausentes

# deve passar — formato correto
node skills/variacoes/scripts/validate.mjs '{"Variant":{"product_id":1,"type_1":"Cor","value_1":"Azul"}}'
# esperado: ✅ Payload válido

# teste real contra a API (loja sandbox): criar iPhone 15 Prata 256GB
# POST /variants?access_token=... com type_1/value_1/type_2/value_2 → 201 Created
```

E o smoke/lint:
```bash
npm run lint:skills   # após implementar (fase 2) — variacoes deve aparecer conforme
npm run smoke
```

---

## 6. Resumo de arquivos a tocar

| Arquivo | Ação |
|:--|:--|
| `skills/variacoes/SKILL.md` | Reescrever payload (`type_N/value_N`), add bloco MANDATORY, add passo 5 validate |
| `skills/variacoes/scripts/validate.mjs` | **Criar** (padrão produtos) |
| `skills/variacoes/assets/schema.json` | **Criar** (`additionalProperties:false`, required `product_id/type_1/value_1`) |
| `mcp/lib/load-schemas*` | Verificar descoberta do schema novo |
| `scripts/lib/validate-schema.mjs` | (Opcional) suporte a `dependentRequired` p/ regra type_2⇒value_2 |
| `package.json` | **Criar** script `lint:skills` (fase 2) |
| `skills/categorias`, `skills/marcas` | validate.mjs + schema.json (fase 2) |
| `CLAUDE.md` | Após fase 2, alinhar lista de skills com validate.mjs à realidade |
