import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { htmlToMarkdown, looksLikeHtml, decodeEntities } from '../../scripts/lib/html-to-markdown.mjs';
import { splitMarkdown } from '../../scripts/lib/markdown-splitter.mjs';
import { SLATE_PAGE } from './helpers/slate-page.mjs';

test('looksLikeHtml: distingue HTML de Markdown', () => {
  assert.equal(looksLikeHtml(SLATE_PAGE), true);
  assert.equal(looksLikeHtml('# Titulo\n\ntexto'), false);
  assert.equal(looksLikeHtml(''), false);
  assert.equal(looksLikeHtml(null), false);
});

test('decodeEntities: nomeadas, decimais e hexadecimais', () => {
  assert.equal(decodeEntities('Autoriza&ccedil;&atilde;o'), 'Autorização');
  assert.equal(decodeEntities('&lt;?php'), '<?php');
  assert.equal(decodeEntities('&#65;&#x42;'), 'AB');
});

test('htmlToMarkdown: headings viram markdown com âncora do HTML', () => {
  const md = htmlToMarkdown(SLATE_PAGE);
  assert.ok(md.includes('# Autorização {#autorizacao}'));
  assert.ok(md.includes('## Método POST {#metodo-post}'));
  assert.ok(md.includes('## Método POST {#metodo-post-2}'));
});

test('htmlToMarkdown: descarta head, script, style e menu lateral', () => {
  const md = htmlToMarkdown(SLATE_PAGE);
  assert.ok(!md.includes('nao sou heading'), 'script vazou');
  assert.ok(!md.includes('.highlight {'), 'style vazou');
  assert.ok(!md.includes('toc-list'), 'menu vazou');
  // O menu repete os títulos: se vazasse, cada seção apareceria duas vezes.
  assert.equal(md.match(/# Autorização/g).length, 1);
});

test('htmlToMarkdown: blocos de código viram fences com linguagem', () => {
  const md = htmlToMarkdown(SLATE_PAGE);
  assert.ok(md.includes('```shell'));
  assert.ok(md.includes('```php'));
  assert.ok(md.includes("curl --request POST '{{api_address}}/auth'"));
  assert.ok(md.includes('<?php'), 'entidades dentro do código não decodificadas');
  assert.ok(!md.includes('<span'), 'spans de highlight vazaram para o código');
});

test('htmlToMarkdown: tabelas viram linhas markdown', () => {
  const md = htmlToMarkdown(SLATE_PAGE);
  assert.ok(md.includes('| Campo | Tipo | Descrição |'));
  assert.ok(md.includes('| consumer_key | string | Chave pública do aplicativo |'));
  assert.ok(md.includes('| free_shipping | boolean | Produto com frete grátis |'));
});

test('htmlToMarkdown: listas e código inline', () => {
  const md = htmlToMarkdown(SLATE_PAGE);
  assert.ok(md.includes('- Item um'));
  assert.ok(md.includes('- Item dois'));
  assert.ok(md.includes('`access_token`'));
});

test('htmlToMarkdown: entrada vazia ou inválida retorna string vazia', () => {
  assert.equal(htmlToMarkdown(''), '');
  assert.equal(htmlToMarkdown(null), '');
});

test('htmlToMarkdown + splitMarkdown: pipeline completo produz seções', () => {
  const sections = splitMarkdown(htmlToMarkdown(SLATE_PAGE));
  assert.equal(sections.length, 3);

  const [autorizacao, post1, post2] = sections;
  assert.equal(autorizacao.level, 'h1');
  assert.equal(autorizacao.anchor, 'autorizacao');
  assert.ok(autorizacao.body.includes('chaves de acesso'));

  assert.equal(post1.h1, 'Autorização');
  assert.equal(post1.code.length, 2);
  assert.equal(post1.code[0].lang, 'shell');
  assert.equal(post1.code[1].lang, 'php');
  assert.ok(post1.body.includes('free_shipping'), 'tabela deve ser indexável');

  // Títulos repetidos precisam manter âncoras distintas para a URL do
  // resultado apontar para a seção certa.
  assert.equal(post1.title, post2.title);
  assert.equal(post1.anchor, 'metodo-post');
  assert.equal(post2.anchor, 'metodo-post-2');
});
