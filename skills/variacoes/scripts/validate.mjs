#!/usr/bin/env node
/**
 * Valida um payload da API de Variações da Tray contra o schema local.
 * Uso: node skills/variacoes/scripts/validate.mjs '<payload_json>'
 * Também aceita payload via stdin redirecionado.
 */
import { runValidator } from '../../../scripts/lib/validate-schema.mjs';

await runValidator({
  callerUrl: import.meta.url,
  skillName: 'variacoes',
  usageExample: '{"Variant":{"product_id":"<id>","type_1":"Cor","value_1":"Azul"}}',
});
