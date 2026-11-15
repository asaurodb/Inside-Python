// Testa a lógica REAL de retomada (extraída de app.js) nos cenários pedidos, incluindo migração de dados antigos.
const fs = require('fs'), path = require('path'), assert = require('assert');
global.window = {}; ['lessons.js', 'lessons2.js', 'lessons3.js', 'curriculo.js'].forEach(f => eval(fs.readFileSync(path.join(__dirname, '../js', f), 'utf8')));
const app = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8'), L = window.LESSONS;
const grab = (a, b) => app.slice(app.indexOf(a), app.indexOf(b, app.indexOf(a)));
const src = grab('function norm0(', '\n') + '\n' + grab('function pct(', '\n') + '\n' + grab('/* ---- Retomada', '/* ---- fim da retomada');
const M = new Function('L', 'var st={};' + src + ';return {target:target,ctaInfo:ctaInfo,norm0:norm0,set:function(x){st=x}};')(L);
const blank = () => M.norm0({});
function finish(s, id, parts = { t: 1, e: 1, q: 1 }) { const l = L[id - 1]; if (parts.t) l.topics.forEach(t => s.t[id + '.' + t.id] = 1); if (parts.e) l.ex.forEach(e => s.e[id + '.' + e.id] = 1); if (parts.q) s.q[id] = 1; return s; }
let n = 0, bad = 0;
function check(nome, s, hash, state, label) {
  M.set(s); const t = M.target(), c = M.ctaInfo(t); n++;
  const ok = t.hash === hash && t.state === state && c.text === label;
  if (!ok) bad++; console.log(ok ? '✔' : '✘', nome, '→', '#' + t.hash, '|', c.text, ok ? '' : `(esperado #${hash} | ${label})`);
}
// 1 usuário novo (abrir a aula, sem concluir nada, NÃO conta como progresso)
check('1. Usuário novo', blank(), 'aula-1-t7', 'new', 'Comece Agora');
let s = blank(); s.pos = { l: 3, k: 't', id: 't2' }; s.last = 3; check('1b. Só abriu a Aula 3 (nada concluído)', s, 'aula-1-t7', 'new', 'Comece Agora');
// 2 apenas um tópico concluído
s = blank(); s.t['1.t7'] = 1; s.pos = { l: 1, k: 't', id: 't7' }; s.last = 1; check('2. Só o primeiro tópico concluído', s, 'aula-1-t1', 'resume', 'Continuar Estudando');
// 3 aula interrompida (exemplo do enunciado: 3 primeiros tópicos da Aula 2)
s = blank(); ['t1', 't2', 't3'].forEach(t => s.t['2.' + t] = 1); s.pos = { l: 2, k: 't', id: 't3' }; s.last = 2; check('3. Aula 2 interrompida após 3 tópicos (o próximo da sequência é o t5)', s, 'aula-2-t5', 'resume', 'Continuar Estudando');
s.pos = { l: 2, k: 't', id: 't4' }; check('3b. ...e ele estava lendo o tópico 4', s, 'aula-2-t4', 'resume', 'Continuar Estudando');
// 4 exercício pendente (iniciado depois da última conclusão) tem prioridade; tentativa antiga é ignorada
s = blank(); L[1].topics.forEach(t => s.t['2.' + t.id] = 1); s.at = 1000; s.a['2.e3'] = 2000; s.pos = { l: 2, k: 'e', id: 'e3' }; s.last = 2; check('4. Exercício 3 iniciado e não concluído', s, 'aula-2-e3', 'resume', 'Continuar Estudando');
s.a['2.e3'] = 500; s.pos = { l: 2, k: 't', id: 't1' }; check('4b. Tentativa antiga (anterior à última conclusão) é ignorada', s, 'aula-2-e1', 'resume', 'Continuar Estudando');
s = blank(); L[1].topics.forEach(t => s.t['2.' + t.id] = 1); L[1].ex.forEach(e => s.e['2.' + e.id] = 1); s.pos = { l: 2, k: 'quiz' }; s.last = 2; check('4c. Só falta a revisão da aula', s, 'aula-2-quiz', 'resume', 'Continuar Estudando');
// 5 aula concluída → próxima aula com pendências (sem bloqueios)
s = finish(blank(), 1); s.pos = { l: 1, k: 'quiz' }; s.last = 1; check('5. Aula 1 concluída → Aula 2', s, 'aula-2-t1', 'resume', 'Continuar Estudando');
s = finish(finish(blank(), 1), 2); finish(s, 4); s.last = 2; s.pos = { l: 2, k: 'quiz' }; check('5b. Aulas 1,2,4 prontas → pula para a Aula 3', s, 'aula-3-t1', 'resume', 'Continuar Estudando');
s = blank(); [2, 3, 4, 5].forEach(i => finish(s, i)); s.last = 5; s.pos = { l: 5, k: 'quiz' }; check('5c. Só a Aula 1 pendente → volta a ela', s, 'aula-1-t7', 'resume', 'Continuar Estudando');
// 6 tudo concluído
s = blank(); [1, 2, 3, 4, 5].forEach(i => finish(s, i)); s.last = 5; check('6. Cinco aulas concluídas', s, 'praticar', 'done', 'Revisar Conteúdos');
// 7 fechar e reabrir o navegador (ida e volta pelo localStorage) + migração de dado antigo
s = blank(); ['t1', 't2'].forEach(t => s.t['2.' + t] = 1); s.last = 2; s.pos = { l: 2, k: 't', id: 't3' };
check('7. Após fechar e reabrir (JSON ida e volta)', M.norm0(JSON.parse(JSON.stringify(s))), 'aula-2-t3', 'resume', 'Continuar Estudando');
const velho = M.norm0(JSON.parse('{"t":{"2.t1":1,"2.t2":1},"e":{"2.e1":1},"q":{},"last":2}'));
assert.deepStrictEqual([velho.t, velho.e, velho.last], [{ '2.t1': 1, '2.t2': 1 }, { '2.e1': 1 }, 2]); n++; console.log('✔ 7b. Dado no formato antigo é preservado pela migração (t, e, last intactos; a/pos/at criados)');
check('7c. ...e a retomada funciona com ele', velho, 'aula-2-t3', 'resume', 'Continuar Estudando');
// rotas por hash aceitas
const re = /^aula-(\d)(?:-(t\d+|e\d+|ex|quiz))?(?:-s([1-5]))?$/;
for (const [h, ok] of [['aula-2-t4', 1], ['aula-1', 1], ['aula-3-e2', 1], ['aula-5-quiz', 1], ['aula-2-ex', 1], ['aula-2-t4-s3', 1], ['aula-2-x', 0], ['aula-2-t4-s9', 0], ['praticar', 0]]) { n++; if (!!re.test(h) !== !!ok) { bad++; console.log('✘ rota', h); } }
console.log('✔ rotas #aula-N, #aula-N-tX, #aula-N-eX, #aula-N-ex, #aula-N-quiz reconhecidas');
console.log(bad ? `\nFALHAS: ${bad}` : `\nTESTE DE RETOMADA: ${n} verificações OK`); process.exit(bad ? 1 : 0);
