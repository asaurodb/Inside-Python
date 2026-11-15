// Coerência pedagógica (V5.2): nenhum exemplo/exercício usa um conceito antes de ele ser ensinado; exemplos executam; indentação automática.
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert'), { spawnSync } = require('child_process');
global.window = {}; ['lessons.js', 'lessons2.js', 'lessons3.js', 'curriculo.js', 'outputs.js'].forEach(f => (0, eval)(fs.readFileSync(path.join(__dirname, '../js', f), 'utf8')));
const L = window.LESSONS; let bad = 0, n = 0; const no = m => { bad++; console.log('✘', m); }; const ok = m => { n++; console.log('✔', m); };
const idx = (li, tid) => { const k = L[li - 1].topics.findIndex(t => t.id === tid); if (k < 0) throw new Error('tópico inexistente ' + li + '.' + tid); return li * 100 + k; };
/* conceito → onde é ensinado (aula, tópico) */
const C = [
  ['operadores + - * /', c => /[+\-*\/]/.test(c.replace(/\*\*|\/\//g, '')), 1, 't3'], ['// (divisão inteira)', c => /\/\//.test(c), 3, 't2'], ['% (resto)', c => /%/.test(c), 3, 't2'], ['** (potência)', c => /\*\*/.test(c), 3, 't3'],
  ['atribuição (variáveis)', c => /^[ \t]*[^\s=!<>"'()]+[ \t]*=(?!=)/m.test(c), 2, 't1'], ['print com vírgula', c => /print\(.*,/.test(c), 1, 't5'], ['type()', c => /\btype\(/.test(c), 2, 't5'], ['True/False', c => /\b(True|False)\b/.test(c), 2, 't5'],
  ['comparações', c => /(==|!=|>=|<=|(?<![-=>])>(?![=>])|<(?!=))/.test(c), 4, 't1'], ['if / else', c => /\b(if|else)\b/.test(c), 4, 't2'], ['elif', c => /\belif\b/.test(c), 4, 't3'], ['and / or / not', c => /\b(and|or|not)\b/.test(c), 4, 't4'],
  ['if dentro de if', c => /^ {4,}if\b/m.test(c) && /^if\b/m.test(c) || /^ {4,}(if|elif)\b[^\n]*\n(?:.*\n)*?/m.test(c) && c.split('\n').filter(l => /^ {4,}if\b/.test(l)).length > 0, 5, 't7']];
const strip = code => code.replace(/#.*$/gm, '').replace(/"[^"\n]*"|'[^'\n]*'/g, '""');
const FORBIDDEN = /\b(while|for|def|import|input|class|lambda|try|except|range|len)\b|\[|\]/;
function audit(code, pos, where, extraFString) {
  const sc = strip(code); const bits = [];
  C.forEach(([nm, f, li, tid]) => { if (f(sc) && pos < idx(li, tid)) bits.push(nm + ' (ensinado na Aula ' + li + ', tópico ' + tid + ')'); });
  if (/\bf"/.test(code) && pos < idx(2, 't6')) bits.push('f-string (ensinado na Aula 2, t6)');
  if (/#/.test(code) && pos < idx(1, 't5')) bits.push('comentário # (Aula 1, t5)');
  if (FORBIDDEN.test(sc)) bits.push('recurso não ensinado');
  if (bits.length) no(`${where} usa antes de ensinar: ${bits.join('; ')}`);
}
const lastOf = li => idx(li, L[li - 1].topics[L[li - 1].topics.length - 1].id), themeEnd = { comandos: lastOf(1), variaveis: lastOf(2), operacoes: lastOf(3), condicionais: lastOf(4), mistos: lastOf(5) };
let snippets = 0;
L.forEach(l => { l.topics.forEach(t => (t.ex || []).forEach((c, i) => { snippets++; audit(c, idx(l.id, t.id), `Aula ${l.id} ${t.id} exemplo ${i + 1}`); }));
  l.ex.forEach(e => { const pos = idx(l.id, e.tp); [e.starter, e.sol, e.code].filter(Boolean).forEach(c => { snippets++; audit(c, pos, `Aula ${l.id} exercício ${e.id}`); }); }); });
window.PRACTICE.forEach(e => [e.starter, e.sol, e.code].filter(Boolean).forEach(c => { snippets++; audit(c, themeEnd[e.th], `Prática ${e.id} (${e.th})`); }));
if (!bad) ok(`${snippets} trechos de código (exemplos, exercícios e prática) usam apenas conceitos já ensinados`);
/* exemplos: só os dois erros intencionais podem falhar; resultado esperado do Observe confere */
const run = c => JSON.parse(spawnSync('python3', [path.join(__dirname, 'pydriver.py')], { input: JSON.stringify({ code: c }), encoding: 'utf8' }).stdout);
const erros = []; L.forEach(l => l.topics.forEach(t => (t.ex || []).forEach(c => { if (run(c).err) erros.push(l.id + '.' + t.id); })));
if (JSON.stringify(erros.sort()) === JSON.stringify(['1.t6', '5.t4'])) ok('Exemplos: todos executam sem erro, exceto os dois erros didáticos intencionais (Aula 1 t6 e Aula 5 t4)'); else no('exemplos com erro inesperado: ' + erros);
/* cobertura pedagógica */
let sem = []; L.forEach(l => l.topics.forEach(t => { ['h', 'r'].forEach(k => { if (!t[k]) sem.push(l.id + '.' + t.id + ' sem ' + k); }); if (t.ex && (!t.ob || !t.tr)) sem.push(l.id + '.' + t.id + ' sem Observe/Experimente'); if (t.tr && !/[.!]$/.test(t.tr)) sem.push(l.id + '.' + t.id + ' tr sem ponto final'); }));
sem.length ? no('lacunas: ' + sem.join('; ')) : ok('Todos os tópicos têm Entenda e Revise; os que têm código trazem explicação linha a linha e orientação específica para Experimentar');
const longo = []; L.forEach(l => l.topics.forEach(t => { const w = t.h.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length; if (w > 170) longo.push(l.id + '.' + t.id + ':' + w); }));
longo.length ? no('Entenda longo demais (>170 palavras): ' + longo) : ok('Nenhum bloco "Entenda" passa de 170 palavras (blocos curtos)');
/* sem videoaulas */
const dump = JSON.stringify(window.LESSONS), vid = [...dump.matchAll(/v[ií]deo|youtube/gi)]; vid.length ? no('referência a vídeo nos dados das aulas') : ok('Dados das aulas: nenhuma referência a videoaula');
['index.html', 'js/app.js', 'js/main.js', 'js/editor.js', 'css/style.css'].forEach(f => { const s = fs.readFileSync(path.join(__dirname, '..', f), 'utf8'); const m = s.split('\n').filter(l => /v[ií]deo|youtube|\bplayer\b/i.test(l) && !/Criador da videoaula/.test(l)); m.length ? no(f + ' ainda tem referência a vídeo: ' + m[0].slice(0, 80)) : ok(f + ': sem referências a videoaula (exceto o crédito real da equipe)'); });
/* dicas */
const sem3 = []; L.forEach(l => l.ex.concat(window.PRACTICE).forEach(e => { if (!e.h1 || !e.hint || e.h1 === e.hint || /revise o conte/i.test(e.h1 + e.hint)) sem3.push(e.id); })); sem3.length ? no('dicas ausentes, repetidas ou genéricas: ' + sem3) : ok('Todos os exercícios têm dica 1 (conceito) e dica 2 (estratégia) próprias; a dica 3 é a estrutura da solução');
/* indentação automática (função real do editor) */
const ctx = { console, performance }; ctx.window = ctx; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/editor.js'), 'utf8'), ctx); const f = ctx.window.IP.indentFor;
[['idade = 20', ''], ['if idade >= 18:', '    '], ['    print("a")', '    '], ['    if x:', '        '], ['else:', '    '], ['# nota:', ''], ['x = "a:"', ''], ['print("a") # nota:', ''], ['if x: # comentário', '    '], ['    ', '    '], ['a = 1\nif a:', '    '], ['if a:\n    b = 1', '    ']].forEach(([i, o]) => { try { assert.strictEqual(f(i), o); n++; } catch (e) { no(`indentFor(${JSON.stringify(i)}) = ${JSON.stringify(f(i))}, esperado ${JSON.stringify(o)}`); } });
ok('Indentação automática: Enter mantém o recuo e acrescenta 4 espaços após ":" (12 casos, incluindo comentários e textos com ":")');
console.log(bad ? `\nFALHAS: ${bad}` : '\nTESTE DE CURRÍCULO: tudo OK'); process.exit(bad ? 1 : 0);
