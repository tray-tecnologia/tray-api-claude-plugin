import { test, beforeEach, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { mockFetch, restoreFetch } from './helpers/mock-fetch.mjs';
import { SLATE_PAGE } from './helpers/slate-page.mjs';
import { loadOrFetch } from '../../scripts/lib/search-index.mjs';

// A doc real chega como HTML. Esta fixture é a que vale para o pipeline —
// a de Markdown abaixo cobre só o caminho de entrada já convertida.
const FAKE_MARKDOWN = `# API de Produtos

## POST /products

Cria produto.

\`\`\`shell
curl /products
\`\`\`
`;

let tmp;
beforeEach(() => { tmp = mkdtempSync(join(tmpdir(), 'tray-cache-')); });
afterEach(() => { rmSync(tmp, { recursive: true, force: true }); restoreFetch(); });

test('loadOrFetch: cache miss + rede OK = fetch + write', async () => {
  mockFetch([{ body: FAKE_MARKDOWN, status: 200 }]);
  const r = await loadOrFetch({ cacheDir: tmp, ttlMs: 86400000, baseUrl: 'https://example' });
  assert.equal(r.cache.hit, false);
  assert.equal(r.cache.initial, true);
  assert.ok(r.index.documents.length >= 1);
});

test('loadOrFetch: cache hit não chama fetch', async () => {
  mockFetch([{ body: FAKE_MARKDOWN, status: 200 }]);
  await loadOrFetch({ cacheDir: tmp, ttlMs: 86400000, baseUrl: 'https://example' });
  const r2 = await loadOrFetch({ cacheDir: tmp, ttlMs: 86400000, baseUrl: 'https://example' });
  assert.equal(r2.cache.hit, true);
});

test('loadOrFetch: cache vencido + rede falha = stale + warning', async () => {
  mockFetch([{ body: FAKE_MARKDOWN, status: 200 }]);
  await loadOrFetch({ cacheDir: tmp, ttlMs: 1, baseUrl: 'https://example' });
  await new Promise(r => setTimeout(r, 5));
  mockFetch([{ error: 'network' }]);
  const r = await loadOrFetch({ cacheDir: tmp, ttlMs: 1, baseUrl: 'https://example' });
  assert.equal(r.cache.stale, true);
});

test('loadOrFetch: sem cache + rede falha = lança OFFLINE_NO_CACHE', async () => {
  mockFetch([{ error: 'down' }]);
  await assert.rejects(
    () => loadOrFetch({ cacheDir: tmp, ttlMs: 86400000, baseUrl: 'https://example' }),
    /OFFLINE_NO_CACHE/
  );
});

// Regressão da issue #9: a doc é servida como HTML e era indexada como se
// fosse Markdown, o que produzia índice vazio para qualquer busca.
test('loadOrFetch: HTML da doc é convertido e indexado', async () => {
  mockFetch([{ body: SLATE_PAGE, status: 200 }]);
  const r = await loadOrFetch({ cacheDir: tmp, ttlMs: 86400000, baseUrl: 'https://example' });
  assert.ok(r.index.N > 0, 'índice não pode ficar vazio para HTML');
  assert.ok(r.index.documents.some(d => d.anchor === 'metodo-post'));
});

test('loadOrFetch: parsed.md não é cópia do raw.html', async () => {
  mockFetch([{ body: SLATE_PAGE, status: 200 }]);
  await loadOrFetch({ cacheDir: tmp, ttlMs: 86400000, baseUrl: 'https://example' });
  const raw = readFileSync(join(tmp, 'raw.html'), 'utf8');
  const parsed = readFileSync(join(tmp, 'parsed.md'), 'utf8');
  assert.notEqual(parsed, raw);
  assert.ok(!parsed.includes('<div'), 'parsed.md ainda contém HTML');
  assert.ok(parsed.includes('# Autorização'));
});

test('loadOrFetch: índice de versão anterior é reconstruído mesmo sem mudança na doc', async () => {
  mockFetch([{ body: SLATE_PAGE, status: 200 }]);
  await loadOrFetch({ cacheDir: tmp, ttlMs: 86400000, baseUrl: 'https://example' });

  // Simula o cache deixado por uma versão antiga do pipeline: índice vazio,
  // mesma doc de origem. Sem checagem de versão isso ficaria preso para sempre.
  const metaPath = join(tmp, 'metadata.json');
  const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
  meta.indexVersion = '1.0.0';
  writeFileSync(metaPath, JSON.stringify(meta), 'utf8');
  writeFileSync(join(tmp, 'index.json'), JSON.stringify({ version: '1.0.0', documents: [], docFreq: {}, avgdl: 0, N: 0 }), 'utf8');

  mockFetch([{ body: SLATE_PAGE, status: 200 }]);
  const r = await loadOrFetch({ cacheDir: tmp, ttlMs: 86400000, baseUrl: 'https://example', forceRefresh: true });
  assert.ok(r.index.N > 0, 'índice antigo deveria ter sido reconstruído');
  assert.notEqual(r.cache.sameContent, true);
});

test('loadOrFetch: cache de versão anterior não conta como fresco', async () => {
  mockFetch([{ body: SLATE_PAGE, status: 200 }]);
  await loadOrFetch({ cacheDir: tmp, ttlMs: 86400000, baseUrl: 'https://example' });

  const metaPath = join(tmp, 'metadata.json');
  const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
  meta.indexVersion = '1.0.0';
  writeFileSync(metaPath, JSON.stringify(meta), 'utf8');

  mockFetch([{ body: SLATE_PAGE, status: 200 }]);
  const r = await loadOrFetch({ cacheDir: tmp, ttlMs: 86400000, baseUrl: 'https://example' });
  assert.equal(r.cache.hit, false, 'TTL não pode segurar índice de versão antiga');
});
