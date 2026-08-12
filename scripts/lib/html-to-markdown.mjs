/**
 * Conversão HTML → Markdown da doc pública (developers.tray.com.br).
 *
 * A doc é uma página Slate: todo o conteúdo já vem renderizado no servidor
 * (headings com id, blocos de código destacados e tabelas de campos). O
 * pipeline de busca espera Markdown — este módulo é a etapa entre o fetch e
 * o `splitMarkdown`.
 *
 * Headings saem com âncora explícita (`## Título {#ancora-real}`) para que a
 * URL do resultado aponte para a seção certa: a doc repete títulos como
 * "Método GET" dezenas de vezes e o Slate desambigua com sufixo (`-2`, `-3`),
 * coisa que um slug derivado do título não reproduz.
 */

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', laquo: '«', raquo: '»',
  copy: '©', reg: '®', trade: '™', deg: '°', middot: '·', bull: '•',
  rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', times: '×', euro: '€',
  ccedil: 'ç', ntilde: 'ñ', szlig: 'ß', aelig: 'æ',
};

// A doc é em PT-BR e o Slate escapa os acentos (`Autoriza&ccedil;&atilde;o`).
// Sem isso os títulos entram no índice com o entity cru e nenhuma busca casa.
const ACCENTED = {
  acute: { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', y: 'ý' },
  grave: { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù' },
  circ: { a: 'â', e: 'ê', i: 'î', o: 'ô', u: 'û' },
  tilde: { a: 'ã', n: 'ñ', o: 'õ' },
  uml: { a: 'ä', e: 'ë', i: 'ï', o: 'ö', u: 'ü', y: 'ÿ' },
};
for (const [accent, letters] of Object.entries(ACCENTED)) {
  for (const [letter, char] of Object.entries(letters)) {
    NAMED_ENTITIES[letter + accent] = char;
    NAMED_ENTITIES[letter.toUpperCase() + accent] = char.toUpperCase();
  }
}
NAMED_ENTITIES.Ccedil = 'Ç';
NAMED_ENTITIES.Ntilde = 'Ñ';

const CODE_TOKEN = (i) => `%%TRAYCODE${i}%%`;

export function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    // Entities de letra são case-sensitive (`&Aacute;` ≠ `&aacute;`); só as
    // básicas caem no fallback insensível.
    .replace(
      /&([a-z]+);/gi,
      (m, name) => NAMED_ENTITIES[name] ?? NAMED_ENTITIES[name.toLowerCase()] ?? m
    );
}

export function looksLikeHtml(text) {
  if (typeof text !== 'string') return false;
  return /^\s*<(!doctype\s+html|html)\b/i.test(text) || /<\/(html|body)>/i.test(text);
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ');
}

/** Texto de um trecho inline (título de heading, célula de tabela). */
function inlineText(html) {
  return decodeEntities(stripTags(html)).replace(/\s+/g, ' ').trim();
}

/** `highlight shell tab-shell` → `shell`; sem linguagem → `text`. */
function langFromClass(className) {
  const tokens = (className || '').trim().split(/\s+/);
  const lang = tokens.find((t) => t && t !== 'highlight' && !t.startsWith('tab-'));
  return lang || 'text';
}

function codeText(html) {
  // O Slate embrulha cada token em <span class="...">; o código real é o texto.
  return decodeEntities(html.replace(/<[^>]+>/g, '')).replace(/\s+$/, '');
}

function tableToMarkdown(inner) {
  const rows = [];
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let r;
  while ((r = rowRe.exec(inner)) !== null) {
    const cells = [];
    const cellRe = /<(t[hd])[^>]*>([\s\S]*?)<\/\1>/gi;
    let c;
    while ((c = cellRe.exec(r[1])) !== null) cells.push(inlineText(c[2]));
    if (cells.length > 0) rows.push(cells);
  }
  if (rows.length === 0) return '\n\n';
  const lines = [`| ${rows[0].join(' | ')} |`, `| ${rows[0].map(() => '---').join(' | ')} |`];
  for (const cells of rows.slice(1)) lines.push(`| ${cells.join(' | ')} |`);
  return `\n\n${lines.join('\n')}\n\n`;
}

function heading(level, inner, anchor) {
  const title = inlineText(inner);
  if (!title) return '\n\n';
  const hashes = '#'.repeat(Number(level));
  const suffix = anchor ? ` {#${anchor}}` : '';
  return `\n\n${hashes} ${title}${suffix}\n\n`;
}

/**
 * Converte o HTML da doc em Markdown indexável.
 * Entrada que já é Markdown passa direto (ver `looksLikeHtml`).
 */
export function htmlToMarkdown(html) {
  if (typeof html !== 'string' || html.trim() === '') return '';

  let s = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|head|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, '');

  // Só o container de conteúdo: o menu lateral do Slate repete todos os
  // títulos e inflaria o índice com seções fantasma.
  const contentAt = s.search(/<div[^>]+class=["'][^"']*\bcontent\b[^"']*["'][^>]*>/i);
  if (contentAt !== -1) s = s.slice(contentAt);

  // Blocos de código viram placeholders antes de qualquer limpeza: o corpo
  // deles tem tags e entidades que não podem passar pelo stripper genérico.
  const blocks = [];
  const stash = (lang, body) => {
    blocks.push({ lang, content: codeText(body) });
    return `\n\n${CODE_TOKEN(blocks.length - 1)}\n\n`;
  };
  s = s.replace(
    /<pre[^>]*\bclass=["']([^"']*)["'][^>]*>([\s\S]*?)<\/pre>/gi,
    (_, cls, body) => stash(langFromClass(cls), body)
  );
  s = s.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, body) => stash('text', body));

  s = s.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, inner) => tableToMarkdown(inner));

  s = s.replace(
    /<h([1-6])[^>]*\sid=["']([^"']*)["'][^>]*>([\s\S]*?)<\/h\1>/gi,
    (_, level, id, inner) => heading(level, inner, id)
  );
  s = s.replace(
    /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi,
    (_, level, inner) => heading(level, inner, null)
  );

  s = s.replace(/<li[^>]*>/gi, '\n- ');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/(p|div|section|aside|ul|ol|li|blockquote)>/gi, '\n\n');
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, inner) => {
    const t = inlineText(inner);
    return t ? `\`${t}\`` : '';
  });

  s = decodeEntities(stripTags(s));

  s = s
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Reinjeta os blocos como fences — formato que o splitMarkdown consome.
  s = s.replace(/%%TRAYCODE(\d+)%%/g, (_, i) => {
    const b = blocks[Number(i)];
    return b ? `\`\`\`${b.lang}\n${b.content}\n\`\`\`` : '';
  });

  return s + '\n';
}
