#!/usr/bin/env node
/**
 * Valida um payload da API de Marcas da Tray contra o schema local.
 * Uso: node skills/marcas/scripts/validate.mjs '<payload_json>'
 * Também aceita payload via stdin redirecionado.
 */
import { runValidator } from '../../../scripts/lib/validate-schema.mjs';

await runValidator({
  callerUrl: import.meta.url,
  skillName: 'marcas',
  usageExample: '{"Brand":{"brand":"Nike"}}',
});
