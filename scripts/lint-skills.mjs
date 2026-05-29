#!/usr/bin/env node
/**
 * Lint de skills do plugin Tray.
 *
 * Verifica as regras obrigatórias declaradas no CLAUDE.md:
 *
 *  1. Toda skill deve ter o bloco "## MANDATORY: Tool Call(s) Required Before
 *     Answering" IMEDIATAMENTE após o frontmatter.
 *  2. O bloco MANDATORY deve incluir chamada a
 *     `node skills/tray-dev/scripts/search_docs.mjs` (sempre).
 *  3. Skills de categoria A (com schema local) devem:
 *       - incluir, no bloco MANDATORY, chamada a
 *         `node skills/<recurso>/scripts/validate.mjs`;
 *       - ter o arquivo `scripts/validate.mjs`;
 *       - ter o arquivo `assets/schema.json` (JSON válido).
 *
 * Exit code: 0 = tudo conforme · 1 = uma ou mais violações.
 *
 * Uso: node scripts/lint-skills.mjs   (ou `npm run lint:skills`)
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const SKILLS_DIR = join(ROOT, 'skills');

// Skills de categoria A — com schema local (espelha CLAUDE.md).
const CATEGORY_A = [
  'autorizacao',
  'produtos',
  'pedidos',
  'clientes',
  'webhooks',
  'variacoes',
  'categorias',
  'marcas',
];

const SEARCH_DOCS_CALL = 'skills/tray-dev/scripts/search_docs.mjs';
const MANDATORY_HEADING = '## MANDATORY: Tool Call(s) Required Before Answering';

let violations = 0;
let checked = 0;

function fail(skill, msg) {
  console.error(`  ❌ ${skill} — ${msg}`);
  violations++;
}

function ok(msg) {
  console.log(`  ✅ ${msg}`);
}

/** Retorna o corpo do arquivo após o frontmatter (--- ... ---), ou o todo se não houver. */
function stripFrontmatter(content) {
  const m = content.match(/^---\n[\s\S]*?\n---\n?/);
  return m ? content.slice(m[0].length) : content;
}

const skillDirs = readdirSync(SKILLS_DIR).filter((f) =>
  statSync(join(SKILLS_DIR, f)).isDirectory()
);

console.log(`\n── lint:skills — ${skillDirs.length} skills\n`);

for (const skill of skillDirs.sort()) {
  const skillPath = join(SKILLS_DIR, skill, 'SKILL.md');
  if (!existsSync(skillPath)) {
    fail(skill, 'SKILL.md ausente');
    continue;
  }
  checked++;
  const content = readFileSync(skillPath, 'utf-8');
  const body = stripFrontmatter(content);
  const trimmed = body.replace(/^\s*\n/, '');

  // Regra 1: bloco MANDATORY imediatamente após o frontmatter.
  if (!trimmed.startsWith(MANDATORY_HEADING)) {
    fail(skill, `bloco "${MANDATORY_HEADING}" deve vir imediatamente após o frontmatter`);
    continue;
  }

  // Isola o bloco MANDATORY (até o próximo heading "## ").
  const afterHeading = trimmed.slice(MANDATORY_HEADING.length);
  const nextHeadingIdx = afterHeading.indexOf('\n## ');
  const mandatoryBlock =
    nextHeadingIdx === -1 ? afterHeading : afterHeading.slice(0, nextHeadingIdx);

  // Regra 2: chamada a search_docs.mjs sempre presente.
  if (!mandatoryBlock.includes(SEARCH_DOCS_CALL)) {
    fail(skill, `bloco MANDATORY deve chamar \`${SEARCH_DOCS_CALL}\``);
  }

  // Regra 3: categoria A → validate.mjs no bloco + arquivos no disco.
  if (CATEGORY_A.includes(skill)) {
    const validateCall = `skills/${skill}/scripts/validate.mjs`;
    if (!mandatoryBlock.includes(validateCall)) {
      fail(skill, `categoria A: bloco MANDATORY deve chamar \`${validateCall}\``);
    }

    const validatePath = join(SKILLS_DIR, skill, 'scripts', 'validate.mjs');
    if (!existsSync(validatePath)) {
      fail(skill, 'categoria A: scripts/validate.mjs ausente');
    }

    const schemaPath = join(SKILLS_DIR, skill, 'assets', 'schema.json');
    if (!existsSync(schemaPath)) {
      fail(skill, 'categoria A: assets/schema.json ausente');
    } else {
      try {
        JSON.parse(readFileSync(schemaPath, 'utf-8'));
      } catch (e) {
        fail(skill, `categoria A: assets/schema.json inválido — ${e.message}`);
      }
    }
  }
}

console.log('');
if (violations === 0) {
  ok(`${checked} skills conformes — 0 violações`);
  console.log('\n🟢 lint:skills passou.\n');
  process.exit(0);
}

console.error(`\n🔴 lint:skills falhou — ${violations} violação(ões).\n`);
process.exit(1);
