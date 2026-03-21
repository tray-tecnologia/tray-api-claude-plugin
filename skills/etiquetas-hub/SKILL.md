---
name: tray-etiquetas-hub
description: >
  API de Etiquetas do HUB da Tray. Utilize quando o desenvolvedor
  precisar criar ou consultar etiquetas de envio através do sistema HUB
  de integração logística da Tray.
---

# API de Etiquetas do HUB — Tray

Documentação oficial: https://developers.tray.com.br/#api-de-etiquetas-do-hub

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| POST | `/labels` | Criar etiquetas |
| GET | `/labels` | Consultar etiquetas |

**Autenticação:** `?access_token={token}`

## Criação de Etiquetas

```http
POST /labels?access_token={token}
Content-Type: application/json

{
  "Label": {
    "order_id": 12345
  }
}
```

## Consulta de Etiquetas

```http
GET /labels?access_token={token}&order_id=12345
```

## Observação

O sistema HUB é a integração logística interna da Tray para geração centralizada de etiquetas de envio.
