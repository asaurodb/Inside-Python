// Boas-vindas: lógica real (extraída de app.js), cenários 1–5 e 8 do enunciado (6 e 7 exigem navegador: ver test-smoke).
const fs = require('fs'), path = require('path'), assert = require('assert');
global.window = {}; ['lessons.js', 'lessons2.js', 'lessons3.js', 'curriculo.js'].forEach(f => eval(fs.readFileSync(path.join(__dirname, '../js', f), 'utf8')));
const app = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8'), L = window.LESSONS;
const grab = (a, b) => app.slice(app.indexOf(a), app.indexOf(b, app.indexOf(a)));
const src = grab('function norm0(', '\n') + '\n' + grab('function pct(', '\n') + '\n' + grab('/* ---- Retomada', '/* ---- fim boas-vindas');
const norm0 = new Function(grab('function norm0(', '\n') + ';return norm0')();
const mkStore = (data = {}, blocked = false) => ({ getItem: k => { if (blocked) throw new Error('SecurityError'); return k in data ? data[k] : null; }, setItem: (k, v) => { if (blocked) throw new Error('SecurityError'); data[k] = String(v); }, _d: data });
function app_(store, st) { return new Function('L', 'localStorage', 'st0', 'var st=st0;' + src + ';return {need:needWelcome,mark:markWelcome,seen:welcomeSeen,target:target,st:function(){return st}};')(L, store, st); }
let n = 0; const ok = (c, m) => { n++; assert(c, m); console.log('✔', m); };
let store = mkStore(), a = app_(store, norm0({}));
ok(a.need(), '1. Primeiro acesso sem progresso: a apresentação é oferecida');
const antes = JSON.stringify(a.st()); a.mark();
ok(!a.need() && store._d['ip5:welcome'] === '1', '2. Concluiu as 3 etapas ("Iniciar Aula 1"): registrado, não volta a aparecer');
ok(JSON.stringify(a.st()) === antes, '2b. O progresso não é alterado pela apresentação');
store = mkStore(); a = app_(store, norm0({})); a.mark();
ok(!a.need(), '3. Pulou a apresentação: registrado');
const b = app_(store, norm0({}));
ok(!b.need(), '4. Voltou ao site depois (novo carregamento, mesmos dados): não aparece de novo');
store = mkStore(); const velho = norm0({ t: { '2.t1': 1 }, e: {}, q: {}, last: 2 }); const c = app_(store, velho);
ok(!c.need() && c.target().state === 'resume', '5. Progresso anterior à atualização (sem registro de boas-vindas): não aparece e a retomada continua funcionando');
const hist = app_(mkStore(), norm0({ last: 3, pos: { l: 3, k: 't', id: 't1' } }));
ok(!hist.need(), '5b. Só histórico de leitura (sem conclusões) de versão anterior: também não aparece');
const bloq = mkStore({}, true); let d; assert.doesNotThrow(() => { d = app_(bloq, norm0({})); d.need(); d.mark(); });
ok(!d.need(), '8. localStorage bloqueado: nenhum erro e a apresentação não se repete na mesma sessão');
const e2 = app_(mkStore({}, true), norm0({})); ok(e2.need(), '8b. Com armazenamento bloqueado, num novo carregamento ela pode aparecer de novo (esperado)');
// 6/7 (estático): acessibilidade da marcação
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8'), w = html.slice(html.indexOf('<dialog id="welcome"'), html.indexOf('</dialog>', html.indexOf('<dialog id="welcome"')));
ok(/<dialog[^>]*aria-label=/.test(w) && (w.match(/<h2 tabindex="-1">/g) || []).length === 3, '7a. <dialog> nativo (foco preso, Esc fecha), rótulo acessível e um título focável por etapa');
ok(w.includes('data-wskip') && /aria-live="polite" id="wcount"|id="wcount" aria-live="polite"/.test(w) && w.includes('Pular apresentação'), '7b. "Pular apresentação" presente em todas as etapas (barra superior) e contador de etapa anunciado');
ok(['Bem-vindo ao Inside Python!', 'Aprenda colocando em prática', 'Tudo pronto para começar!', 'Iniciar Aula 1', 'cinco aulas', 'salvo neste navegador'].every(t => w.includes(t)), '7c. Textos das três etapas e botão "Iniciar Aula 1" conforme o enunciado');
ok(app.includes("addEventListener('cancel'") && app.includes("hd.focus()") && app.includes("$('ctxfocus')"), '7d. Esc registra a dispensa; foco vai ao título da etapa e retorna ao título da aula ao fechar');
console.log(`\nTESTE DE BOAS-VINDAS: ${n} verificações OK`);
