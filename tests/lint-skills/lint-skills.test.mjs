import { readFileSync, mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  lintSkill,
  findSkillFiles,
  SKIP_SKILLS,
  DENSE_SKILLS,
  PENDING_DENSE_SKILLS,
  MIN_DENSE_LINES,
} from '../../scripts/lint-skills.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fx = (name) => readFileSync(join(__dirname, 'fixtures', name), 'utf-8');

test('lintSkill: valid-a.md + produtos → sem erros', () => {
  const errors = lintSkill('produtos', fx('valid-a.md'));
  assert.deepEqual(errors, []);
});

test('lintSkill: valid-b.md + kits → sem erros (skill leve, sem piso de densidade)', () => {
  // kits não é VALIDATE_SKILLS nem DENSE_SKILLS → só checagem estrutural.
  const errors = lintSkill('kits', fx('valid-b.md'));
  assert.deepEqual(errors, []);
});

test('lintSkill: valid-c.md + usuarios → sem erros', () => {
  const errors = lintSkill('usuarios', fx('valid-c.md'));
  assert.deepEqual(errors, []);
});

test('lintSkill: invalid-no-mandatory.md inclui R1', () => {
  const errors = lintSkill('cupons', fx('invalid-no-mandatory.md'));
  assert.ok(errors.some((e) => e.rule === 'R1'));
});

test('lintSkill: invalid-mandatory-after.md inclui R2', () => {
  const errors = lintSkill('cupons', fx('invalid-mandatory-after.md'));
  assert.ok(errors.some((e) => e.rule === 'R2'));
});

test('lintSkill: invalid-a-no-validate.md + produtos inclui R4', () => {
  const errors = lintSkill('produtos', fx('invalid-a-no-validate.md'));
  assert.ok(errors.some((e) => e.rule === 'R4'));
});

test('lintSkill: invalid-a-leftover-step5.md + produtos inclui R5', () => {
  const errors = lintSkill('produtos', fx('invalid-a-leftover-step5.md'));
  assert.ok(errors.some((e) => e.rule === 'R5'));
});

test('lintSkill: invalid-no-obrigatoria.md inclui R6', () => {
  const errors = lintSkill('cupons', fx('invalid-no-obrigatoria.md'));
  assert.ok(errors.some((e) => e.rule === 'R6'));
});

test('lintSkill: SKIP_SKILLS retorna lista vazia (tray-dev)', () => {
  assert.ok(SKIP_SKILLS.includes('tray-dev'));
  assert.deepEqual(lintSkill('tray-dev', ''), []);
});

test('findSkillFiles: temp dir com 3 skills → 3 paths absolutos', () => {
  const root = mkdtempSync(join(tmpdir(), 'lint-skills-'));
  for (const dir of ['tray-dev', 'produtos', 'outra']) {
    const d = join(root, dir);
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, 'SKILL.md'), '', 'utf-8');
  }
  const paths = findSkillFiles(root);
  assert.equal(paths.length, 3);
  for (const p of paths) {
    assert.ok(p.endsWith('SKILL.md'));
  }
  const basenames = paths.map((p) => basename(dirname(p))).sort();
  assert.deepEqual(basenames, ['outra', 'produtos', 'tray-dev']);
});

/* ─── R7: densidade mínima de skills aprofundadas (issue #100) ──────── */

test('cupons é a skill densa piloto (Fase 1)', () => {
  assert.ok(DENSE_SKILLS.includes('cupons'));
});

test('DENSE_SKILLS + PENDING_DENSE_SKILLS = as 5 skills priorizadas da #100', () => {
  const todas = [...DENSE_SKILLS, ...PENDING_DENSE_SKILLS].sort();
  assert.deepEqual(todas, [
    'cupons',
    'frete',
    'multicd',
    'pagamentos',
    'status-pedido',
  ]);
});

test('lintSkill: dense skill curta (valid-b.md + cupons) inclui R7', () => {
  // valid-b.md é estruturalmente válida mas curta (< MIN_DENSE_LINES).
  const errors = lintSkill('cupons', fx('valid-b.md'));
  assert.ok(errors.some((e) => e.rule === 'R7'));
});

test('lintSkill: dense skill com ≥ MIN_DENSE_LINES não inclui R7', () => {
  const padding = '\nlinha de conteúdo'.repeat(MIN_DENSE_LINES);
  const content = fx('valid-b.md') + padding;
  const errors = lintSkill('cupons', content);
  assert.ok(!errors.some((e) => e.rule === 'R7'));
});

test('lintSkill: skill leve curta NÃO recebe R7 (piso só vale p/ DENSE_SKILLS)', () => {
  const errors = lintSkill('kits', fx('valid-b.md'));
  assert.ok(!errors.some((e) => e.rule === 'R7'));
});
