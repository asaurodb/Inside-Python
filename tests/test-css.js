// Auditoria visual estática (sem navegador): colisões de classes, [hidden], contraste (WCAG) e larguras fixas.
const fs = require('fs'), path = require('path'); const rd = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const css = rd('css/style.css'), app = rd('js/app.js') + rd('js/editor.js'), html = rd('index.html'); let bad = 0, n = 0;
const ok = (c, m) => { n++; if (!c) bad++; console.log(c ? '✔' : '✘', m); };
// 1) classes que o app.js/editor.js cria NÃO podem coincidir com classes de componentes posicionados/animados (hero etc.)
const rules = [...css.matchAll(/(?<![\w-])\.([a-zA-Z][\w-]*)\s*\{([^}]*)\}/g)].map(m => [m[1], m[2]]);
/* ta = textarea do editor (sobreposta ao realce, dentro de .ed__box); dot = marcador da trilha (dentro de .path li): posicionamento intencional e restrito ao contêiner */
const positioned = [...new Set(rules.filter(([c, b]) => /position:\s*(absolute|fixed)/.test(b) && !/^(snav|dd__list|nav__menu|toast|skip|progress|nav|ta|dot)$/.test(c)).map(r => r[0]))];
const heroOnly = ['chip', 'chip--a', 'chip--b', 'chip--c', 'py', 'win', 'glow', 'stage', 'caret', 'a-py', 'a-card', 'a-chip'];
const usedByApp = new Set([...app.matchAll(/class(?:Name)?="([^"]+)"/g)].flatMap(m => m[1].split(/\s+/)).concat([...app.matchAll(/h\('\w+',\s*'([^']+)'/g)].flatMap(m => m[1].split(/\s+/))));
const colide = heroOnly.filter(c => usedByApp.has(c));
ok(colide.length === 0, 'Classes do hero (chip, stage, py, win, glow...) não são usadas pelo ambiente de estudo' + (colide.length ? ' → colisão: ' + colide : ''));
const colide2 = positioned.filter(c => usedByApp.has(c));
ok(colide2.length === 0, 'Nenhuma classe criada pelo app tem position:absolute/fixed em alguma regra' + (colide2.length ? ' → ' + colide2 : ''));
// 2) [hidden] não pode ser derrotado por display de classe
ok(/\[hidden\]\{display:none!important\}/.test(css), 'Regra global [hidden]{display:none!important} presente (display de classe não reexibe elementos ocultos)');
// 3) contraste WCAG (texto normal >= 4.5)
const hex = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
const lum = c => { const [r, g, b] = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
const cr = (a, b) => { const [x, y] = [lum(hex(a)), lum(hex(b))].sort((p, q) => q - p); return (x + .05) / (y + .05); };
const blend = (fg, a, bg) => { const f = hex(fg), b = hex(bg); return '#' + f.map((v, i) => Math.round(v * a + b[i] * (1 - a)).toString(16).padStart(2, '0')).join(''); };
const V = { bg: '#050b1f', bg2: '#08122b', muted: '#a3b3d1', text: '#e8eefc', yellow: '#ffd43b', cyan: '#22d3ee', blue2: '#6aa8ff', green: '#4ade80' }, card = blend('#14224d', .55, V.bg);
[['texto sobre fundo', V.text, V.bg], ['texto secundário sobre fundo', V.muted, V.bg], ['texto secundário sobre cartão', V.muted, card], ['amarelo sobre fundo', V.yellow, V.bg], ['ciano sobre fundo', V.cyan, V.bg], ['ciano sobre cartão', V.cyan, card], ['azul claro sobre fundo', V.blue2, V.bg], ['verde sobre fundo', V.green, V.bg],
  ['botão amarelo (texto escuro)', '#14161f', V.yellow], ['número da linha (editor)', '#8394bd', '#0a1637'], ['etiqueta cinza no cabeçalho do exercício', V.muted, blend('#2f6bff', .08, card)], ['link do menu (secundário)', V.muted, V.bg]]
  .forEach(([nm, f, b]) => { const r = cr(f, b); ok(r >= 4.5, `Contraste ${r.toFixed(1)}:1 — ${nm}`); });
// 4) larguras fixas grandes (risco de rolagem horizontal em 320 px) fora de max-width/min()
const fixed = rules.filter(([c, b]) => /(^|;)\s*width:\s*(\d{3,})px/.test(b) && !/position:\s*absolute/.test(b) && !/max-width/.test(b)).map(([c, b]) => c + ':' + b.match(/(^|;)\s*width:\s*(\d{3,})px/)[2]).filter(x => +x.split(':')[1] > 300);
ok(fixed.length === 0, 'Sem larguras fixas acima de 300px fora de max-width' + (fixed.length ? ' → ' + fixed : ''));
// 5) blocos com white-space:pre precisam de overflow para não alargar a página
const pre = rules.filter(([c, b]) => /white-space:\s*pre(?!-)/.test(b)).filter(([c, b]) => !/overflow/.test(b)).map(r => r[0]);
console.log('ℹ regras com white-space:pre sem overflow próprio (verificar se o contêiner rola):', pre.join(', ') || 'nenhuma');
// 6) textos do cabeçalho do exercício quebram linha
ok(/\.exc \.exh__t\{[^}]*overflow-wrap:anywhere/.test(css) && /\.exc \.q\{[^}]*overflow-wrap:anywhere/.test(css), 'Título e enunciado do exercício quebram palavras longas (sem invadir outros elementos)');
ok(/\.exc \.exh\{display:grid;grid-template-columns:auto minmax\(0,1fr\) auto/.test(css) && /max-width:480px\)\{\.exc \.exh\{grid-template-columns:auto minmax\(0,1fr\)/.test(css), 'Cabeçalho do exercício em grade (sem sobreposição), com versão para telas de até 480px');
console.log(bad ? `\nFALHAS: ${bad}` : `\nAUDITORIA CSS: ${n} verificações OK`); process.exit(bad ? 1 : 0);
