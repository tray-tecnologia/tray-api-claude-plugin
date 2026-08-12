/**
 * Recorte fiel de uma página Slate como a servida por developers.tray.com.br:
 * menu lateral que repete os títulos, headings com id, blocos de código por
 * linguagem e tabela de campos. Serve de fixture para garantir que o pipeline
 * seja exercitado com HTML de verdade, e não com Markdown.
 */
export const SLATE_PAGE = `<!doctype html>
<html>
  <head>
    <title>Tray Developers</title>
    <style media="screen">.highlight { color: #fff; }</style>
    <script>window.foo = "# nao sou heading";</script>
  </head>
  <body class="index">
    <div class="page-wrapper">
      <div class="toc-wrapper">
        <ul id="toc" class="toc-list-h1">
          <li><a href="#autorizacao" class="toc-h1">Autoriza&ccedil;&atilde;o</a>
            <ul class="toc-list-h2">
              <li><a href="#metodo-post" class="toc-h2">M&eacute;todo POST</a></li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="content">
        <h1 id='autorizacao'>Autoriza&ccedil;&atilde;o</h1>
        <p>Para consumir as APIs &eacute; necess&aacute;rio gerar as chaves de acesso.</p>
        <h2 id='metodo-post'>M&eacute;todo POST</h2>
        <p>Gera o <code>access_token</code> a partir do consumer_key.</p>
        <div class="highlight"><pre class="highlight shell tab-shell"><code>curl <span class="nt">--request</span> POST <span class="s1">'{{api_address}}/auth'</span></code></pre></div>
        <div class="highlight"><pre class="highlight php tab-php"><code><span class="cp">&lt;?php</span> <span class="nv">$c</span> <span class="o">=</span> <span class="nb">curl_init</span><span class="p">();</span></code></pre></div>
        <table>
          <thead><tr><th>Campo</th><th>Tipo</th><th>Descri&ccedil;&atilde;o</th></tr></thead>
          <tbody>
            <tr><td>consumer_key</td><td>string</td><td>Chave p&uacute;blica do aplicativo</td></tr>
            <tr><td>free_shipping</td><td>boolean</td><td>Produto com frete gr&aacute;tis</td></tr>
          </tbody>
        </table>
        <h2 id='metodo-post-2'>M&eacute;todo POST</h2>
        <p>Segunda ocorr&ecirc;ncia do mesmo t&iacute;tulo &mdash; o Slate desambigua com sufixo.</p>
        <ul><li>Item um</li><li>Item dois</li></ul>
      </div>
    </div>
  </body>
</html>
`;
