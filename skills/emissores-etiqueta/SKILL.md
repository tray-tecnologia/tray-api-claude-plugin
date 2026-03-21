---
name: tray-emissores-etiqueta
description: >
  API de Emissores de Etiqueta da Tray. Utilize quando o desenvolvedor
  precisar integrar geração de etiquetas de envio, cadastrando URLs de etiqueta
  e vinculando-as a pedidos.
---

# API de Emissores de Etiqueta — Tray

Documentação oficial: https://developers.tray.com.br/#api-de-emissores-de-etiqueta

## Endpoints

| Método | Endpoint | Descrição |
|:--|:--|:--|
| POST | `/label-emitters` | Cadastrar URL da etiqueta |
| POST | `/label-emitters/:order_id` | Vincular URL da etiqueta ao pedido |
| DELETE | `/label-emitters/:id` | Excluir URL da etiqueta |

**Autenticação:** `?access_token={token}`

## Fluxo de Uso

1. **Cadastrar a URL** — registre a URL base do seu sistema de etiquetas
2. **Vincular ao pedido** — associe a etiqueta gerada a um pedido específico
3. **Excluir** — remova a etiqueta se necessário

## Exemplo de Cadastro

```http
POST /label-emitters?access_token={token}
Content-Type: application/json

{
  "LabelEmitter": {
    "url": "https://meusistema.com/etiquetas"
  }
}
```

## Exemplo de Vinculação ao Pedido

```http
POST /label-emitters/12345?access_token={token}
Content-Type: application/json

{
  "LabelEmitter": {
    "label_url": "https://meusistema.com/etiquetas/pedido-12345.pdf"
  }
}
```
