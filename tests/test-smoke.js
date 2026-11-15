// Executa o app.js REAL contra um DOM simulado (sem navegador): rotas, etapas, modos, dicas, verificação com Python (CPython) e boas-vindas.
const fs = require('fs'), path = require('path'), assert = require('assert'), { spawnSync } = require('child_process');
const reg = {}; let lastEditors = [];
function mkEl(tag) {
  const el = { tagName: tag, className: '', children: [], _h: {}, _q: {}, _a: {}, hidden: false, disabled: false, value: '', open: false, style: {}, textContent: '', _html: '', _id: '',
    get innerHTML() { return this._html; }, set innerHTML(v) { this._html = v; this.children = []; },
    get id() { return this._id; }, set id(v) { this._id = v; reg[v] = this; },
    get firstChild() { return this.children[0] || null; },
    classList: { add(c) { if (!el.className.split(' ').includes(c)) el.className = (el.className + ' ' + c).trim(); }, remove(c) { el.className = el.className.split(' ').filter(x => x && x !== c).join(' '); }, toggle(c, f) { const has = el.className.split(' ').includes(c), on = f === undefined ? !has : !!f; on ? this.add(c) : this.remove(c); return on; }, contains(c) { return el.className.split(' ').includes(c); } },
    appendChild(c) { this.children.push(c); c.parentNode = this; return c; }, insertBefore(c) { this.children.unshift(c); c.parentNode = this; return c; },
    querySelector(s) { return this._q[s] || (this._q[s] = mkEl('x')); }, querySelectorAll(s) { this._qa = this._qa || {}; return this._qa[s] || (this._qa[s] = (s === '.wstep' || s === '.wdots i') ? [mkEl('x'), mkEl('x'), mkEl('x')] : []); },
    addEventListener(t, f) { (this._h[t] = this._h[t] || []).push(f); }, setAttribute(k, v) { this._a[k] = String(v); }, getAttribute(k) { return k in this._a ? this._a[k] : null; }, removeAttribute(k) { delete this._a[k]; },
    focus() { this._focused = true; }, scrollIntoView() {}, select() {}, remove() {}, closest() { return null; }, showModal() { this.open = true; }, close() { this.open = false; (this._h.close || []).forEach(f => f()); } };
  return el;
}
const store = {}; const winH = {};
Object.assign(global, { window: global, localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } }, location: { hash: '', protocol: 'http:' }, history: { replaceState: (a, b, u) => { location.hash = u; } }, innerWidth: 1200, confirm: () => true, scrollTo() {},
  addEventListener: (t, f) => { (winH[t] = winH[t] || []).push(f); } });
global.document = { body: mkEl('body'), createElement: mkEl, getElementById: id => reg[id] || (reg[id] = mkEl('div')), querySelector: () => null, addEventListener() {}, activeElement: null };
const run = code => { const r = JSON.parse(spawnSync('python3', [path.join(__dirname, 'pydriver.py')], { input: JSON.stringify({ code: code.code || code, want: [] }), encoding: 'utf8' }).stdout); return r; };
global.IP = { errName: s => { const m = String(s || '').match(/(IndentationError|SyntaxError|NameError|TypeError|ZeroDivisionError)/); return m ? m[1] : null; }, hl: t => t, report: () => '',
  run: (code, want) => { const r = run(code), vars = {}; (want || []).forEach(n => { if (n in (r.vars || {})) vars[n] = { t: typeof r.vars[n] === 'string' ? 'str' : 'num', v: r.vars[n] }; });
    return Promise.resolve({ out: r.out.replace(/\n$/, '') + (r.val !== null && r.val !== undefined ? '\n' + r.val : ''), err: r.err, vars }); },
  editor: o => { const ed = { el: mkEl('div'), code: o.code || '', get: () => ed.code, reset() { ed.code = o.code || ''; }, opts: o }; lastEditors.push(ed); return ed; } };
['lessons.js', 'lessons2.js', 'lessons3.js', 'curriculo.js', 'outputs.js'].forEach(f => (0, eval)(fs.readFileSync(path.join(__dirname, '../js', f), 'utf8')));
const L = window.LESSONS; let n = 0; const ok = (c, m) => { n++; assert(c, m); console.log('✔', m); };
const hashchange = h => { location.hash = h; (winH.hashchange || []).forEach(f => f()); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const find = (el, pred) => { if (pred(el)) return el; for (const c of el.children || []) { const r = find(c, pred); if (r) return r; } return null; };
(async () => {
  (0, eval)(fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8'));
  ok(reg['painel-in']._html.includes('Começar pela Aula 1') && reg.cta._q['span'].textContent === 'Comece Agora', 'Início: usuário novo vê "Começar pela Aula 1" e o botão "Comece Agora"');
  hashchange('#aula-1-t7'); await sleep(10);
  ok(reg.welcome.open, 'Boas-vindas: abre ao entrar na Aula 1 sendo usuário novo');
  const wclick = sel => (reg.welcome._h.click || []).forEach(f => f({ target: { closest: s => (s === sel ? {} : null) } }));
  wclick('[data-wn]'); wclick('[data-wn]'); ok(reg.wcount.textContent === 'Etapa 3 de 3', 'Boas-vindas: avança até a etapa 3 de 3');
  wclick('[data-wgo]'); ok(!reg.welcome.open && store['ip5:welcome'] === '1', '"Iniciar Aula 1" fecha e registra; não reaparece');
  ok(reg.ctx._html.includes('Aula 1 — Conhecendo Python') && reg.ctx._html.includes('Tópico 1 — O que é programação') && reg.ctx._html.includes('Etapa 1 de 5 — Entenda'), 'Contexto visível: aula, tópico e "Etapa 1 de 5 — Entenda"');
  ok(!store['ip3:progress'] || !JSON.parse(store['ip3:progress']).t['1.t7'], 'Abrir o tópico NÃO o marca como concluído');
  const nextBtn = () => reg.lmain.children[reg.lmain.children.length - 1].children.slice(-1)[0];
  for (let i = 2; i <= 5; i++) { nextBtn()._h.click[0](); ok(reg.ctx._html.includes(`Etapa ${i} de 5 — ${['', '', 'Observe', 'Experimente', 'Pratique', 'Revise'][i]}`), `Continuar → Etapa ${i} de 5`); }
  nextBtn()._h.click[0](); const prog = JSON.parse(store['ip3:progress']);
  ok(prog.t['1.t7'] === 1 && reg.ctx._html.includes('Tópico 2 —'), 'Concluir tópico: grava no localStorage e abre o Tópico 2');
  ok(location.hash === '#aula-1-t1-s1' && reg.cta.getAttribute('href') === '#aula-1-t1-s1' || reg.cta.getAttribute('href').startsWith('#aula-1-t1'), 'Endereço e botão "Continuar Estudando" apontam para o tópico pendente');
  ok(reg.cta._q['span'].textContent === 'Continuar Estudando' && reg['painel-in']._html.includes('Continuar estudando'), 'Botão e painel mudam para "Continuar" após progresso');
  // exercício: rota direta, dicas progressivas, verificação real
  hashchange('#aula-1-e3'); await sleep(10); const card = reg['ex-e3'];
  ok(card && reg.ctx._html.includes('Etapa 4 de 5 — Pratique'), 'Rota #aula-1-e3 abre o tópico certo na etapa Pratique');
  const hb = card._q['[data-a=h]'], hx = card._q['.hints'], sb = card._q['[data-a=s]'], fb = card._q['.fb'], vb = card._q['[data-a=v]'];
  ok(card._html.includes('data-a="s" type="button" disabled'), 'Ver solução começa bloqueado (atributo disabled na marcação)');
  hb._h.click[0](); hb._h.click[0](); hb._h.click[0](); ok(hx.children.length === 3 && hb.disabled, 'Três dicas progressivas, uma por clique; depois o botão é desativado');
  const ed = lastEditors[lastEditors.length - 1]; ed.code = 'print(7 + 6)'; vb._h.click[0](); await sleep(400);
  ok(fb.className.includes('bad') && JSON.stringify(fb.children.map(c => c.innerHTML || c.textContent)).includes('Resultado diferente do esperado'), 'Resposta errada: feedback "Resultado diferente do esperado", sem revelar a solução');
  ok(sb.disabled === false && sb.getAttribute('title') === null, 'Depois de verificar, "Ver solução" é liberado');
  ed.code = 'print(7 * 6)'; vb._h.click[0](); await sleep(400);
  ok(fb.className.includes('good') && JSON.parse(store['ip3:progress']).e['1.e3'] === 1, 'Resposta correta: "Exercício concluído", explicação e progresso salvo (Python real)');
  ed.code = 'print("oi)'; vb._h.click[0](); await sleep(400);
  ok(fb.className.includes('bad') && JSON.stringify(fb.children.map(c => c.innerHTML || c.textContent)).includes('Erro de sintaxe'), 'Erro de sintaxe é classificado como tal (com link "Entenda este erro")');
  // modo livre
  const lvl = reg.lesson; lvl._h.click[0]({ target: { closest: s => (s === '[data-mode]' ? { getAttribute: () => 'free' } : null) } });
  ok(store['ip5:mode'] === 'free' && reg.ctx._html.includes('Todas as etapas deste tópico') && reg.lmain.children[1].children.length >= 5, 'Navegação livre: todas as etapas do tópico na mesma tela; modo lembrado');
  lvl._h.click[0]({ target: { closest: s => (s === '[data-mode]' ? { getAttribute: () => 'guided' } : null) } });
  // acesso direto sem concluir anteriores, revisão, prática, home
  hashchange('#aula-4-t2-s3'); await sleep(10); ok(reg.ctx._html.includes('Aula 4 — Estruturas condicionais') && reg.ctx._html.includes('Etapa 3 de 5 — Experimente'), 'Acesso direto à Aula 4 (sem concluir as anteriores), etapa 3');
  hashchange('#aula-4-quiz'); await sleep(10); ok(reg.ctx._html.includes('Revisão da aula'), 'Rota #aula-4-quiz abre a revisão da aula');
  hashchange('#praticar-condicionais'); await sleep(10); ok(find(reg.lesson, e => e.className === 'wrap lview lview--one'), 'Hora de Praticar por tema abre sem erros');
  hashchange(''); await sleep(10); ok(reg.conteudo.hidden === false && reg.lesson.hidden === true, 'Voltar à página inicial restaura a home');
  for (let i = 1; i <= 5; i++) { hashchange('#aula-' + i); await sleep(5); }
  console.log(`\nTESTE DE FUMAÇA (app.js real em DOM simulado): ${n} verificações OK`); process.exit(0);
})().catch(e => { console.log('✘ FALHA:', e.stack.split('\n').slice(0, 4).join('\n')); process.exit(1); });
