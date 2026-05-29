#!/usr/bin/env node
/**
 * Valida um payload da API de Categorias da Tray contra o schema local.
 * Uso: node skills/categorias/scripts/validate.mjs '<payload_json>'
 * Também aceita payload via stdin redirecionado.
 */
import { runValidator } from '../../../scripts/lib/validate-schema.mjs';

await runValidator({
  callerUrl: import.meta.url,
  skillName: 'categorias',
  usageExample: '{"Category":{"name":"Eletrônicos"}}',
});
