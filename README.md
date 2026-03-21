# Plugin Tray API para Claude Code

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Claude Code Plugin](https://img.shields.io/badge/Claude%20Code-Plugin-blueviolet)](https://code.claude.com/docs/pt/plugins)
[![API Tray](https://img.shields.io/badge/API-Tray%20E--commerce-orange)](https://developers.tray.com.br)

Plugin completo para integração com as APIs da Tray. Acelera o desenvolvimento de aplicativos e-commerce por parceiros e comunidade na plataforma Tray, fornecendo documentação detalhada de **150+ endpoints**, fluxos de autenticação OAuth, webhooks e boas práticas de integração.

## Pré-requisitos

- [Claude Code](https://claude.com/claude-code) instalado
- Credenciais de API Tray (Consumer Key e Consumer Secret) — obtidas em [developers.tray.com.br
](https://developers.tray.com.br/#criando-seu-aplicativo)
## Instalação

```bash
# Via marketplace próprio
/plugin marketplace add tray-tecnologia/tray-api-claude-plugin
/plugin install tray-api@tray-plugins

# Desenvolvimento local (clone o repositório)
git clone https://github.com/tray-tecnologia/tray-api-claude-plugin.git
claude --plugin-dir ./tray-api-claude-plugin
```

## Componentes

| Componente | Quantidade | Descrição |
|:--|:--|:--|
| Skills | 34 | Documentação completa de cada recurso da API Tray |
| Agentes | 10 | Fluxos especializados (setup, catálogo, pedidos, debug, migração + 5 especialistas por plataforma) |
| Comandos | 3 | Atalhos rápidos (setup, referência, validação) |
| Hooks | 2 | Validação automática de segurança |

## Skills Disponíveis

### Núcleo
`autorizacao`, `webhooks`, `produtos`, `variacoes`, `imagens-produtos`, `categorias`, `pedidos`, `clientes`, `informacoes-loja`

### Complementar
`caracteristicas`, `marcas`, `kits`, `status-pedido`, `enderecos-cliente`, `perfis-cliente`, `frete`, `configuracao-frete`, `multicd`, `notas-fiscais`, `pagamentos`

### Avançado
`cupons`, `carrinho-compras`, `listagem-carrinho`, `informacoes-adicionais`, `listas-preco-b2b`, `emissores-etiqueta`, `etiquetas-mercado-livre`, `etiquetas-hub`, `scripts-externos`, `newsletter`, `parceiros`, `palavras-chave`, `produtos-vendidos`, `usuarios`

## Agentes

| Agente | Descrição |
|:--|:--|
| `/tray-api:configuracao-aplicativo` | Guia de setup inicial e configuração OAuth |
| `/tray-api:gestor-catalogo` | Gestão em massa de catálogo (produtos, categorias, variações) |
| `/tray-api:gestor-pedidos` | Ciclo completo de pedidos (criação, status, fulfillment) |
| `/tray-api:debug-integracao` | Diagnóstico de problemas e erros de API |
| `/tray-api:assistente-migracao` | Migração de outras plataformas (Shopify, WooCommerce, Magento, VTEX, Nuvemshop) |

## Comandos

| Comando | Descrição |
|:--|:--|
| `/tray-api:setup` | Configuração rápida de integração |
| `/tray-api:referencia-api` | Referência completa de endpoints |
| `/tray-api:validar-integracao` | Checklist de validação pré-publicação |

## Exemplo de Uso

```
> /tray-api:setup
# Configura credenciais e testa conexão com a API Tray

> Como listar todos os produtos da minha loja?
# O plugin fornece automaticamente a documentação do endpoint GET /products

> /tray-api:validar-integracao
# Valida se sua integração está pronta para homologação
```

## Contribuindo

Contribuições são bem-vindas! Abra uma issue ou envie um pull request em [GitHub](https://github.com/tray-tecnologia/tray-api-claude-plugin).

## Referências

- **API Tray:** https://developers.tray.com.br
- **Plataforma Tray:** https://tray.com.br
- **Claude Code Plugins:** https://code.claude.com/docs/pt/plugins

## Licença

GNU General Public License v3.0 — veja [LICENSE](LICENSE) para detalhes.
