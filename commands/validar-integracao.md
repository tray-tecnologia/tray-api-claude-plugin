---
name: tray-validar-integracao
description: Valida o código de integração com a Tray verificando problemas comuns e boas práticas
disable-model-invocation: true
---

# Validação de Integração — Tray

Analise o código do projeto atual e verifique os itens abaixo:

## Checklist de Validação

### 1. Autenticação OAuth
- [ ] Fluxo de 3 etapas implementado (redirecionamento → callback → troca de token)
- [ ] `consumer_key` e `consumer_secret` em variáveis de ambiente (nunca hardcoded)
- [ ] `access_token` armazenado de forma segura

### 2. Renovação de Token
- [ ] Renovação automática antes de 3 horas (ex: a cada 2h30)
- [ ] Uso de `GET /auth?refresh_token={token}` para renovar
- [ ] Tratamento de `refresh_token` expirado (30 dias → nova autorização completa)

### 3. Tratamento de Erros
- [ ] Código 1000 — token expirado, loja ativa → renovar automaticamente
- [ ] Código 1001 — loja bloqueada → notificar administrador
- [ ] Código 1002 — loja inativa → verificar ativação
- [ ] Código 1003 — loja cancelada → suspender operações
- [ ] Código 1004 — loja suspensa → verificar com suporte
- [ ] Código 400 — validação de campos antes do envio
- [ ] Código 401 — renovação automática de token
- [ ] Código 404 — tratamento de recurso não encontrado
- [ ] Código 429 — backoff exponencial para rate limit

### 4. Limites de Requisições
- [ ] Controle de 180 requisições por minuto
- [ ] Controle de 10.000 requisições diárias (50.000 corporate)
- [ ] Backoff exponencial implementado (1s → 2s → 4s → 8s...)
- [ ] Operações em lote com intervalos

### 5. Paginação
- [ ] Parâmetro `limit` definido (máximo 50, padrão 30)
- [ ] Iteração correta por todas as páginas quando necessário
- [ ] Uso do campo `total` da resposta para controle

### 6. Formato de Dados
- [ ] Body JSON envolvido na chave do recurso (`{"Product": {...}}`)
- [ ] Datas no formato `YYYY-MM-DD`
- [ ] Timestamps no formato `YYYY-MM-DD HH:MM:SS`
- [ ] CPF/CNPJ validados antes do envio

### 7. Segurança
- [ ] Tokens em variáveis de ambiente (não no código-fonte)
- [ ] `consumer_secret` protegido
- [ ] HTTPS em todas as chamadas
- [ ] Webhook validando `seller_id` recebido

### 8. Webhooks (se aplicável)
- [ ] Endpoint retornando HTTP 200 rapidamente
- [ ] Processamento assíncrono (fila)
- [ ] Idempotência (tratar duplicatas)
- [ ] Logs de webhooks recebidos

Documentação oficial: https://developers.tray.com.br
