# Índice de Agentes — Plugin Tray API

Guia de referência rápida para escolher o agente correto.

---

## Quando usar cada agente

| Situação | Agente recomendado |
|:--|:--|
| Configurar OAuth, webhooks e primeiras chamadas do zero | `configuracao-aplicativo` |
| Criar produtos, variações, imagens, categorias em massa | `gestor-catalogo` |
| Gerenciar pedidos, status, NF-e e etiquetas | `gestor-pedidos` |
| Migrar dados de outra plataforma para a Tray | `assistente-migracao` |
| Diagnosticar erros de autenticação, 429 ou respostas inesperadas | `debug-integracao` |

---

## Agentes Principais

### `configuracao-aplicativo`
**Quando usar:** novo projeto de integração; primeiro contato com a API Tray.

Cobre: fluxo OAuth completo, geração de tokens, configuração de webhooks, estrutura inicial do projeto.

**Não usar para:** operações de catálogo ou pedidos em produção.

---

### `gestor-catalogo`
**Quando usar:** operações em catálogo — criação, atualização ou importação de produtos.

Cobre: produtos, variações, imagens, categorias, marcas, kits, características, estoque por CD (MultiCD), operações em massa via CSV.

**Skills relacionadas:** `tray-produtos`, `tray-variacoes`, `tray-categorias`, `tray-marcas`, `tray-multicd`, `tray-caracteristicas`

---

### `gestor-pedidos`
**Quando usar:** ciclo de vida de pedidos — criação, atualização, NF-e, etiquetas, cancelamentos.

Cobre: criação e atualização de pedidos, status de pedido, emissão de notas fiscais, etiquetas de envio, cancelamento, integração com marketplaces.

**Skills relacionadas:** `tray-pedidos`, `tray-notas-fiscais`, `tray-pagamentos`, `tray-frete`

---

### `assistente-migracao`
**Quando usar:** migrar catálogo, clientes ou pedidos de outra plataforma para a Tray.

Cobre: mapeamento de campos, ordem correta de migração (categorias → marcas → produtos → variações → clientes), controle de rate limit, rollback e relatório final.

**Subagentes especializados por plataforma:**

| Plataforma | Subagente |
|:--|:--|
| Shopify | `agents/migracao/shopify.md` |
| WooCommerce | `agents/migracao/woocommerce.md` |
| Magento 2 | `agents/migracao/magento.md` |
| VTEX | `agents/migracao/vtex.md` |
| Nuvemshop | `agents/migracao/nuvemshop.md` |

> Chame primeiro o `assistente-migracao` para orquestrar; ele ativa o subagente da plataforma de origem quando necessário.

---

### `debug-integracao`
**Quando usar:** algo deu errado — erros 401, 429, 400, respostas inesperadas ou comportamento incorreto.

Cobre: diagnóstico de tokens expirados (códigos 1000–1003, 1099), rate limit excedido, erros de validação de payload, recurso não encontrado, método não permitido.

**Não usar para:** implementação de funcionalidades novas.

---

## Subagentes de Migração

Usados diretamente pelo `assistente-migracao`. Cada um contém o mapeamento completo de campos (origem → Tray) para sua plataforma.

| Subagente | Dificuldade | Particularidade principal |
|:--|:--|:--|
| `shopify.md` | Média | Variantes obrigatórias, coleções → categorias |
| `woocommerce.md` | Média | Produtos variable, CPF em meta_data |
| `magento.md` | Alta | custom_attributes, multi-store, preço especial |
| `vtex.md` | Alta | Produto→SKU, preço/estoque em APIs separadas, valores em centavos |
| `nuvemshop.md` | Baixa | Estrutura similar à Tray, mapeamento direto |

---

## Regra geral de escolha

```
Novo projeto?              → configuracao-aplicativo
Problema com produto?      → gestor-catalogo
Problema com pedido?       → gestor-pedidos
Vindo de outra plataforma? → assistente-migracao
Erro na API?               → debug-integracao
```
