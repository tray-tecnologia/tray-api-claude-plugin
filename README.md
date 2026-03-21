# Plugin Tray para Claude Code

Plugin completo para integração com as APIs da Tray. Acelera o desenvolvimento de aplicativos e-commerce por parceiros e comunidade na plataforma Tray.

## Instalação

```bash
# Via marketplace (quando disponível)
/plugin install tray-api

# Desenvolvimento local
claude --plugin-dir ./tray-api
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

- `/tray-api:configuracao-aplicativo` — Guia de setup inicial
- `/tray-api:gestor-catalogo` — Gestão em massa de catálogo
- `/tray-api:gestor-pedidos` — Ciclo completo de pedidos
- `/tray-api:debug-integracao` — Diagnóstico de problemas
- `/tray-api:assistente-migracao` — Migração de outras plataformas (Shopify, WooCommerce, Magento, VTEX, Nuvemshop)

## Comandos

- `/tray-api:setup` — Configuração rápida de integração
- `/tray-api:referencia-api` — Referência de endpoints
- `/tray-api:validar-integracao` — Checklist de validação

## Referências

- **API Tray:** https://developers.tray.com.br
- **Plataforma Tray:** https://tray.com.br
- **Claude Code Plugins:** https://code.claude.com/docs/pt/plugins

## Licença

GNU General Public License v3.0 — veja [LICENSE](LICENSE) para detalhes.
