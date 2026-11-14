// DOM simulado para testes sem navegador. Uso: const E = require('./domstub'); E.fresh(storeInicial, {blocked}); E.load([...arquivos]);
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const E = { reg: {}, store: {}, winH: {}, docH: {}, editors: [], blocked: false };
function mkEl(tag) {
  const el = { tagName: tag, className: '', children: [], _h: {}, _q: {}, _qa: {}, _a: {}, hidden: false, disabled: false, value: '', open: false, style: {}, textContent: '', _html: '', _id: '', _in: null,
    get innerHTML() { return this._html; }, set innerHTML(v) { this._html = v; this.children = []; },
    get id() { return this._id; }, set id(v) { this._id = v; E.reg[v] = this; }, get firstChild() { return this.children[0] || null; },
    classList: { add(c) { if (!el.className.split(' ').includes(c)) el.className = (el.className + ' ' + c).trim(); }, remove(c) { el.className = el.className.split(' ').filter(x => x && x !== c).join(' '); },
      toggle(c, f) { const has = el.className.split(' ').includes(c), on = f === undefined ? !has : !!f; on ? this.add(c) : this.remove(c); return on; }, contains(c) { return el.className.split(' ').includes(c); } },
    appendChild(c) { this.children.push(c); c.parentNode = this; return c; }, insertBefore(c) { this.children.unshift(c); c.parentNode = this; return c; },
    querySelector(s) { return this._q[s] || (this._q[s] = mkEl('x')); },
    querySelectorAll(s) { return this._qa[s] || (this._qa[s] = (E.lists[s] ? E.lists[s]() : [])); },
    addEventListener(t, f) { (this._h[t] = this._h[t] || []).push(f); }, setAttribute(k, v) { this._a[k] = String(v); }, getAttribute(k) { return k in this._a ? this._a[k] : null; }, removeAttribute(k) { delete this._a[k]; },
    focus() { E.focused = this; }, scrollIntoView() {}, select() {}, remove() {}, closest() { return null; }, contains(t) { return !!t && (t === this || t._in === this._ddname); }, getBoundingClientRect() { return { right: 100 }; },
    showModal() { this.open = true; }, close() { this.open = false; (this._h.close || []).forEach(f => f()); } };
  return el;
}
E.mkEl = mkEl; E.lists = {};
E.fresh = (init = {}, opts = {}) => {
  E.reg = {}; E.winH = {}; E.docH = {}; E.editors = []; E.focused = null; E.blocked = !!opts.blocked; E.store = Object.assign({}, init);
  E.lists = { '.wstep': () => [mkEl('x'), mkEl('x'), mkEl('x')], '.wdots i': () => [mkEl('x'), mkEl('x'), mkEl('x')],
    'a,button': () => ['Aulas', 'Hora de Praticar', 'Glossário', 'Entenda o Erro'].map(t => { const e = mkEl('a'); e._in = 'dd'; e.textContent = t; return e; }),
    'a:not(.btn)': () => ['inicio', 'sobre', 'equipe', 'aulas', 'praticar', 'glossario'].map((k, i) => { const e = mkEl('a'); e._a.href = '#' + k; if (i >= 3) e._in = 'dd'; return e; }) };
  const store = E.store;
  Object.assign(global, { window: global, localStorage: { getItem: k => { if (E.blocked) throw new Error('SecurityError'); return k in store ? store[k] : null; }, setItem: (k, v) => { if (E.blocked) throw new Error('SecurityError'); store[k] = String(v); } },
    location: { hash: '', protocol: 'http:' }, history: { replaceState: (a, b, u) => { global.location.hash = u; } }, innerWidth: 1200, confirm: () => true, scrollTo() {},
    addEventListener: (t, f) => { (E.winH[t] = E.winH[t] || []).push(f); } });
  const doc = { documentElement: { scrollTop: 0, scrollHeight: 1, clientHeight: 1 }, body: mkEl('body'), createElement: mkEl, getElementById: id => E.reg[id] || (E.reg[id] = mkEl('div')), querySelector: () => null, querySelectorAll: () => [], activeElement: null,
    addEventListener: (t, f) => { (E.docH[t] = E.docH[t] || []).push(f); } };
  doc.body.className = ''; global.document = doc;
  E.reg.dd = mkEl('div'); E.reg.dd._ddname = 'dd'; E.reg['dd-list'] = mkEl('ul'); E.reg['dd-list']._ddname = 'dd'; E.reg['dd-list'].hidden = true;
  const ddBtn = E.reg.dd._q['.dd__btn'] = mkEl('button'); ddBtn._a['aria-expanded'] = 'false';
  const burger = doc.querySelector; doc.querySelector = s => (s === '.nav__btn' ? (E.reg.__burger = E.reg.__burger || (() => { const b = mkEl('button'); b._a['aria-expanded'] = 'false'; return b; })()) : null);
  const run = (c, want) => JSON.parse(spawnSync('python3', [path.join(__dirname, 'pydriver.py')], { input: JSON.stringify({ code: c.code || c, want: want || [] }), encoding: 'utf8' }).stdout);
  global.IP = { errName: s => { const m = String(s || '').match(/(IndentationError|SyntaxError|NameError|TypeError|ZeroDivisionError)/); return m ? m[1] : null; }, hl: t => t, report: () => '',
    run: (code, want) => { const r = run(code, want), vars = {}; (want || []).forEach(n => { if (n in (r.vars || {})) vars[n] = { t: typeof r.vars[n] === 'string' ? 'str' : 'num', v: r.vars[n] }; });
      return Promise.resolve({ out: r.out.replace(/\n$/, '') + (r.val !== null && r.val !== undefined ? '\n' + r.val : ''), err: r.err, vars }); },
    editor: o => { const ed = { el: mkEl('div'), code: o.code || '', get: () => ed.code, reset() { ed.code = o.code || ''; }, opts: o }; E.editors.push(ed); return ed; } };
  delete global.IPNav;
};
E.load = files => files.forEach(f => (0, eval)(fs.readFileSync(path.join(__dirname, '../js', f), 'utf8')));
E.data = ['lessons.js', 'lessons2.js', 'lessons3.js', 'outputs.js'];
E.app = [...E.data, 'main.js', 'app.js'];
E.hashchange = h => { global.location.hash = h; (E.winH.hashchange || []).forEach(f => f()); };
E.sleep = ms => new Promise(r => setTimeout(r, ms));
E.key = (el, key) => (el._h.keydown || []).forEach(f => f({ key, preventDefault() {} }));
E.docKey = key => (E.docH.keydown || []).forEach(f => f({ key, preventDefault() {} }));
E.docClick = target => (E.docH.click || []).forEach(f => f({ target, preventDefault() {} }));
E.click = (el, target) => (el._h.click || []).forEach(f => f({ target: target || { closest: () => null }, preventDefault() {} }));
module.exports = E;
