---
name: tray-setup
description: Guia rápido para configuração inicial de integração com a API da Tray
disable-model-invocation: true
---

# Configuração Rápida — API Tray

## Checklist de Pré-requisitos

Antes de começar, confirme que você possui:

1. **consumer_key** — chave do seu aplicativo Tray
2. **consumer_secret** — segredo do seu aplicativo Tray
3. **Domínio da loja** — URL da loja que será integrada

Se não possui, crie seu aplicativo em https://developers.tray.com.br seguindo a seção "Criando seu Aplicativo".

## Fluxo de Autorização (OAuth 2.0)

### Passo 1: Redirecione o lojista

```
https://{dominio_loja}/auth.php?response_type=code&consumer_key={sua_consumer_key}&callback={sua_callback_url}
```

### Passo 2: Receba o callback

Sua URL de callback receberá: `code`, `adm_user`, `store`, `api_address`

### Passo 3: Troque por tokens

```
POST https://{api_address}/auth
Body: { "consumer_key": "xxx", "consumer_secret": "xxx", "code": "xxx" }
```

Resposta: `access_token` (expira em 3h) + `refresh_token` (expira em 30 dias)

## Teste Inicial

Faça sua primeira chamada para validar:

```
GET https://{api_address}/store?access_token={seu_access_token}
```

Se retornar os dados da loja, a integração está funcionando.

## Lembrete Importante

- O `access_token` expira em **3 horas** — implemente renovação automática
- Use `GET /auth?refresh_token={token}` para renovar
- Armazene tokens em **variáveis de ambiente**, nunca hardcoded
- Limites: 180 req/min, 10.000 req/dia

## Próximos Passos

1. Configure webhooks (via ticket de suporte Tray)
2. Explore os endpoints de produtos (`GET /products`)
3. Consulte `/tray-api:referencia-api` para ver todos os endpoints disponíveis

Documentação completa: https://developers.tray.com.br
