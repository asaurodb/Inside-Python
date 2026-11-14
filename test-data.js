// Consistência dos dados didáticos + resultados do "Observe" conferidos contra o CPython (js/outputs.js não pode estar desatualizado).
const fs = require('fs'), path = require('path'), assert = require('assert'), { spawnSync } = require('child_process');
global.window = {}; ['lessons.js', 'lessons2.js', 'lessons3.js', 'outputs.js'].forEach(f => eval(fs.readFileSync(path.join(__dirname, '../js', f), 'utf8')));
const L = window.LESSONS; let bad = 0; const no = m => { bad++; console.log('✘', m); };
L.forEach(l => {
  const ids = l.topics.map(t => t.id); if (new Set(ids).size !== ids.length) no('ids de tópico repetidos na aula ' + l.id);
  l.topics.forEach(t => {
    if (!t.r) no(`sem "Revise": ${l.id}.${t.id}`);
    if (t.ex) { const n = t.ex[0].split('\n').filter(x => x.trim()).length; if (!t.ob || t.ob.split(' | ').length !== n) no(`Observe sem explicação para cada linha: ${l.id}.${t.id}`); if (!t.tr) no(`sem sugestão para Experimente: ${l.id}.${t.id}`);
      const r = JSON.parse(spawnSync('python3', [path.join(__dirname, 'pydriver.py')], { input: JSON.stringify({ code: t.ex[0] }), encoding: 'utf8' }).stdout), o = window.OUTS[l.id + '.' + t.id];
      const lines = r.out.replace(/\n$/, '').split('\n').filter((x, i, a) => !(a.length === 1 && !x)); if (r.val !== null && r.val !== undefined) lines.push(String(r.val));
      const exp = r.err ? { e: (r.err.match(/(\w+Error)/) || [, 'Error'])[1] } : { o: lines.join('\n') }; if (JSON.stringify(exp) !== JSON.stringify(o)) no(`outputs.js desatualizado em ${l.id}.${t.id}`); }
    if (t.vis && !window.VIS[t.vis]) no('figura inexistente ' + t.vis);
  });
  l.ex.forEach(e => { if (!l.topics.some(t => t.id === e.tp)) no(`exercício sem tópico ${l.id}.${e.id}`); if (!e.hint) no(`sem dica 2 ${l.id}.${e.id}`); if (!e.why) no(`sem explicação ${l.id}.${e.id}`); });
  l.quiz.forEach((q, k) => { if (!l.topics.some(t => t.id === q.tp)) no(`pergunta sem tópico ${l.id}.${k}`); });
});
window.PRACTICE.forEach(e => { if (!window.THEMES[e.th]) no('prática sem tema ' + e.id); if (!e.why || !e.hint) no('prática sem dica/explicação ' + e.id); });
Object.keys(window.THEMES).forEach(k => { const n = window.PRACTICE.filter(e => e.th === k).length; if (n < 2) no(`tema com menos de 2 exercícios: ${k} (${n})`); });
// a dica 3 (estrutura da solução) nunca pode ser a solução completa
const skeleton = sol => { const sk = sol.replace(/"[^"\n]*"|'[^'\n]*'/g, '___').replace(/\b\d+(?:\.\d+)?\b/g, '___'); return sk !== sol && sk.indexOf('___') >= 0 ? sk : null; };
let vazou = 0, total = 0; L.forEach(l => l.ex.concat(window.PRACTICE).forEach(e => { if (e.predict) return; total++; const sk = skeleton(e.sol); if (!sk) vazou++; })); console.log(`ℹ Dica 3 gerada para ${total - vazou} de ${total} exercícios (os demais usam uma dica genérica, sem expor a solução)`);
console.log(window.ERRS.length === 5 && ['SyntaxError', 'NameError', 'TypeError', 'ZeroDivisionError', 'IndentationError'].every(k => window.ERRS.some(x => x.k === k)) ? '✔ "Entenda o Erro": os 5 erros pedidos' : (bad++, '✘ erros comuns incompletos'));
// os exemplos "errados" e "corrigidos" de Entenda o Erro realmente se comportam como descrito
window.ERRS.forEach(x => { const run = c => JSON.parse(spawnSync('python3', [path.join(__dirname, 'pydriver.py')], { input: JSON.stringify({ code: c }), encoding: 'utf8' }).stdout); const b = run(x.bad), g = run(x.good);
  if (!b.err || !b.err.includes(x.k)) no(`exemplo errado de ${x.k} não gera ${x.k}: ${b.err}`); if (g.err) no(`exemplo corrigido de ${x.k} ainda dá erro: ${g.err}`); });
console.log(bad ? `FALHAS: ${bad}` : 'TESTE DE DADOS: tudo OK'); process.exit(bad ? 1 : 0);
