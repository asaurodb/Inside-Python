/* Inside Python V5 — ambiente de estudo por etapas (Entenda, Observe, Experimente, Pratique, Revise), progresso, exercícios, revisão e boas-vindas */
(function () {
  'use strict';
  var L = window.LESSONS, G = window.GLOSS, PR = window.PRACTICE, ERRS = window.ERRS, VIS = window.VIS || {}, OUTS = window.OUTS || {}, TH = window.THEMES || {}, $ = function (i) { return document.getElementById(i); };
  var STG = ['Entenda', 'Observe', 'Experimente', 'Pratique', 'Revise'], KEY = 'ip3:progress';
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && typeof s === 'object') return s; } catch (e) {} return {}; }
  /* Migração: dados antigos ({t,e,q,last}) continuam válidos; só acrescentamos a (tentativas), pos (posição) e at (última conclusão). */
  function norm0(s) { s.t = s.t || {}; s.e = s.e || {}; s.q = s.q || {}; s.a = s.a || {}; s.at = +s.at || 0; s.pos = s.pos || null; s.last = s.last || null; s.v = 5; return s; }
  var st = norm0(load());
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function pct(l) { var d = 0, n = l.topics.length + l.ex.length + 1; l.topics.forEach(function (t) { if (st.t[l.id + '.' + t.id]) d++; }); l.ex.forEach(function (e) { if (st.e[l.id + '.' + e.id]) d++; }); if (st.q[l.id]) d++; return Math.round(100 * d / n); }
  function label(l) { return l.state === 'dev' ? 'Em desenvolvimento' : l.video ? 'Disponível' : 'Vídeo em breve'; }
  function status(l) { var p = pct(l); return p === 100 ? 'Concluída' : p > 0 ? 'Em andamento' : 'Não iniciada'; }
  function toast(m) { var t = $('toast'); if (!t) return; t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('show'); }, 2600); }

  /* ---- Retomada (lógica pura, testada em tests/test-resume.js) ---- */
  function byId(id) { for (var i = 0; i < L.length; i++) if (L[i].id === +id) return L[i]; return null; }
  function touch() { st.at = Date.now(); }
  function pendings(l) {
    var a = [];
    l.topics.forEach(function (t, i) { if (!st.t[l.id + '.' + t.id]) a.push({ k: 't', id: t.id, n: i + 1, t: t.t }); });
    l.ex.forEach(function (e, i) { if (!st.e[l.id + '.' + e.id]) a.push({ k: 'e', id: e.id, n: i + 1, t: e.t }); });
    if (!st.q[l.id]) a.push({ k: 'quiz', id: 'quiz', t: 'Revisão da aula' });
    return a;
  }
  function hasProgress() { return !!(Object.keys(st.t).length || Object.keys(st.e).length || Object.keys(st.q).length || Object.keys(st.a).length); }
  function mk(l, it, state) {
    var desc = it.k === 't' ? 'Tópico ' + it.n + ' · ' + it.t : it.k === 'e' ? 'Exercício ' + it.n + ' · ' + it.t : 'Revisão da aula';
    return { state: state, lesson: l, item: it, hash: 'aula-' + l.id + '-' + (it.k === 'quiz' ? 'quiz' : it.id), desc: desc, pct: pct(l) };
  }
  function target() {
    var ready = L.filter(function (l) { return l.state === 'ready'; });
    if (!hasProgress()) return mk(ready[0], { k: 't', id: ready[0].topics[0].id, n: 1, t: ready[0].topics[0].t }, 'new');
    var best = null;
    for (var key in st.a) { if (st.e[key] || !(st.a[key] > st.at)) continue; if (!best || st.a[key] > st.a[best]) best = key; }
    if (best) { var p = best.split('.'), le = byId(p[0]); if (le) for (var i = 0; i < le.ex.length; i++) if (le.ex[i].id === p[1]) return mk(le, { k: 'e', id: p[1], n: i + 1, t: le.ex[i].t }, 'resume'); }
    var cur0 = byId((st.pos && st.pos.l) || st.last) || ready[0], idx = ready.indexOf(cur0), order = ready.slice(idx).concat(ready.slice(0, idx));
    for (var n = 0; n < order.length; n++) {
      var l = order[n], pend = pendings(l); if (!pend.length) continue;
      if (n === 0 && st.pos && st.pos.l === l.id) for (var q = 0; q < pend.length; q++) if (pend[q].k === st.pos.k && (pend[q].id === st.pos.id || pend[q].k === 'quiz')) return mk(l, pend[q], 'resume');
      return mk(l, pend[0], 'resume');
    }
    return { state: 'done', hash: 'praticar', pct: 100, desc: '' };
  }
  function ctaInfo(t) { return t.state === 'new' ? { text: 'Comece Agora', icon: 'i-book' } : t.state === 'done' ? { text: 'Revisar Conteúdos', icon: 'i-redo' } : { text: 'Continuar Estudando', icon: 'i-play' }; }
  /* ---- fim da retomada ---- */

  /* ---- Boas-vindas (lógica) ---- */
  var WK = 'ip5:welcome', MK = 'ip5:mode', mem = {};
  function lsGet(k) { try { var v = localStorage.getItem(k); return v !== null && v !== undefined ? v : (mem[k] || null); } catch (e) { return mem[k] || null; } }
  function lsSet(k, v) { mem[k] = v; try { localStorage.setItem(k, v); } catch (e) {} }
  function welcomeSeen() { return lsGet(WK) === '1'; }
  function markWelcome() { lsSet(WK, '1'); }
  function hasHistory() { return hasProgress() || !!st.last || !!st.pos; }
  function needWelcome() { return !hasHistory() && !welcomeSeen(); }
  /* ---- fim boas-vindas ---- */

  /* ---- Verificação (Python real) ---- */
  function lit(v) { return typeof v === 'string' ? JSON.stringify(v) : typeof v === 'boolean' ? (v ? 'True' : 'False') : String(v); }
  function norm(t) { return t.split('\n').map(function (x) { return x.trim(); }).filter(Boolean).join('\n'); }
  function bad(cat, msg) { return { ok: 0, cat: cat, msg: msg }; }
  function errCat(m) { return /SyntaxError|IndentationError|Erro de sintaxe|indentação/.test(m) ? 'sintaxe' : 'execucao'; }
  var CATS = { sintaxe: 'Erro de sintaxe', execucao: 'Erro durante a execução', resultado: 'Resultado diferente do esperado', incompleta: 'Resposta incompleta' };
  function verify(e, code, pred) {
    if (e.predict) return IP.run(e.code).then(function (r) {
      if (!pred.trim()) return bad('incompleta', 'Escreva sua previsão antes de conferir.');
      return norm(r.out) === norm(pred) ? { ok: 1 } : bad('resultado', 'A saída real é diferente da sua previsão. Releia o código linha por linha ou execute-o no editor para investigar.');
    });
    var c = e.check, i = 0;
    if (code.indexOf('___') >= 0) return Promise.resolve(bad('incompleta', 'Ainda há lacunas (___) para preencher.'));
    if (c.changed && code.trim() === e.starter.trim()) return Promise.resolve(bad('incompleta', 'Altere o código do exemplo antes de verificar.'));
    if (c.src && code.indexOf(c.src) < 0) return Promise.resolve(bad('incompleta', 'Seu código precisa usar "' + c.src + '".'));
    function next() {
      if (i >= c.cases.length) return { ok: 1 };
      var cs = c.cases[i], src = code, tag = '';
      if (cs.set) for (var k in cs.set) {
        var re = new RegExp('^' + k + '\\s*=.*$', 'm');
        if (!re.test(src)) return bad('incompleta', 'Mantenha a linha "' + k + ' = ..." no código: o verificador troca o valor dela para testar seu programa.');
        src = src.replace(re, (function (kk, v) { return function () { return kk + ' = ' + lit(v); }; })(k, cs.set[k]));
        tag += (tag ? ', ' : ' (teste com ') + k + ' = ' + lit(cs.set[k]);
      }
      if (tag) tag += ')';
      var first = i === 0; i++;
      return IP.run(src, first && c.vars ? Object.keys(c.vars) : []).then(function (r) {
        if (r.err) return bad(errCat(r.err), r.err + tag);
        var lines = r.out.split('\n').filter(function (x) { return x.trim(); }), low = r.out.toLowerCase();
        if (cs.lines != null && lines.length < cs.lines) return bad('incompleta', 'O programa deveria mostrar pelo menos ' + cs.lines + ' linha(s) e mostrou ' + lines.length + '.');
        if (cs.num) {
          var nums = (r.out.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
          if (nums.length !== cs.num.length || !cs.num.every(function (v, j) { return Math.abs(nums[j] - v) <= 1e-3 * Math.max(1, Math.abs(v)); }))
            return bad('resultado', 'Resultado esperado: ' + cs.num.join(', ') + '. Seu programa mostrou: ' + (nums.join(', ') || 'nada') + '.' + tag);
        }
        for (var a = 0; cs.has && a < cs.has.length; a++) if (low.indexOf(cs.has[a]) < 0) return bad('resultado', 'Esperávamos uma mensagem com "' + cs.has[a] + '".' + tag);
        for (var b = 0; cs.no && b < cs.no.length; b++) if (low.indexOf(cs.no[b]) >= 0) return bad('resultado', 'A mensagem "' + cs.no[b] + '" não deveria aparecer neste caso.' + tag);
        if (first && c.vars) for (var n in c.vars) {
          var v = r.vars[n];
          if (!v || v.t !== c.vars[n] || (v.t === 'str' && !v.v)) return bad('incompleta', 'Crie a variável "' + n + '" com ' + (c.vars[n] === 'str' ? 'um texto (entre aspas)' : 'um número') + '.');
          if (c.show && r.out.indexOf(String(v.v)) < 0) return bad('incompleta', 'Mostre o valor de "' + n + '" com print().');
        }
        return next();
      });
    }
    return Promise.resolve(next());
  }

  /* ---- Exercício padronizado ---- */
  function attempt(key) {
    if (key.charAt(0) === 'p' || st.e[key]) return;
    var now = Date.now(), p = key.split('.');
    if (st.a[key] && now - st.a[key] < 20000) return;
    st.a[key] = now; st.pos = { l: +p[0], k: 'e', id: p[1] }; st.last = +p[0]; save(); updateCTA();
  }
  function skeleton(sol) { var sk = sol.replace(/"[^"\n]*"|'[^'\n]*'/g, '___').replace(/\b\d+(?:\.\d+)?\b/g, '___'); return sk !== sol && sk.indexOf('___') >= 0 ? sk : null; }
  function exercise(l, e, n, o) {
    o = o || {};
    var key = l.id + '.' + e.id, card = h('section', 'exc'), lv = e.lvl || 'Básico', sol = e.predict ? e.exp : e.sol, tps = l.topics || [];
    var T = tps.filter(function (t) { return t.id === e.tp; })[0], rel = T ? T.t : (TH[e.th] || 'Revisão');
    var obj = e.obj || (e.predict ? 'Prever a saída do programa e conferir com o Python.' : 'Aplicar o que você viu em “' + rel + '”.'), sk = e.predict ? null : skeleton(sol);
    var hints = ['Relembre: ' + (T && T.r ? T.r : 'releia o assunto “' + rel + '” nas aulas.'), e.hint, e.predict ? 'Execute o código no editor e compare a saída, linha por linha, com a sua previsão.' : sk ? 'Estrutura da solução (preencha os ___):\n' + sk : 'Teste seu programa passo a passo e compare com a saída esperada.'];
    card.id = 'ex-' + e.id;
    card.innerHTML = '<header class="exh"><span class="exh__n" aria-hidden="true">' + n + '</span><div class="exh__main"><h3 class="exh__t">' + e.t + '</h3><ul class="exh__tags" aria-label="Detalhes da atividade"><li class="tg tg--lv lv-' + lv[0] + '">' + lv + '</li><li class="tg">' + (e.kind || 'Escreva seu código') + '</li><li class="tg">' + esc(rel) + '</li>' + (e.nb ? '<li class="tg tg--nb">do notebook</li>' : '') + '</ul></div><span class="exh__ok" hidden>✔ Concluído</span></header><div class="exb"><p class="obj"><b>Objetivo</b>' + obj + '</p><p class="q">' + e.q + '</p>' + (e.eg ? '<ul class="eg" aria-label="Exemplos">' + e.eg.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '') + '</div>'
      + (e.predict ? '<label class="plab">Sua previsão da saída:<textarea class="pred" rows="3" spellcheck="false" placeholder="Escreva o que o programa vai mostrar (uma linha por print)"></textarea></label>' : '')
      + (e.exp && !e.predict ? '<div class="expd"><span class="out__t">Exemplo de saída esperada</span><pre>' + esc(e.exp) + '</pre></div>' : '')
      + '<div class="slot"></div><p class="cmp small" hidden></p><div class="vrow"><button class="btn btn--yellow" data-a="v" type="button">✓ ' + (e.predict ? 'Conferir previsão' : 'Verificar resposta') + '</button><button class="btn btn--ghost" data-a="h" type="button">Mostrar dica <span>(1 de 3)</span></button><button class="btn btn--ghost" data-a="s" type="button" disabled title="Tente verificar sua resposta antes de ver a solução">Ver solução</button><button class="btn btn--ghost" data-a="r" type="button" hidden>Refazer</button></div><p class="small vcap"><b>Executar código</b> só roda o programa. <b>Verificar resposta</b> confere se ele resolve o exercício.</p><div class="fb" role="status" hidden></div><div class="hints" hidden></div><div class="solu" hidden></div>';
    var fb = card.querySelector('.fb'), hb = card.querySelector('[data-a=h]'), sb = card.querySelector('[data-a=s]'), rb = card.querySelector('[data-a=r]'), hx = card.querySelector('.hints'), sx = card.querySelector('.solu'), cmp = card.querySelector('.cmp'), pred = card.querySelector('.pred'), shown = 0;
    var ed = IP.editor({ code: e.predict ? e.code : e.starter, onInput: function () { attempt(key); }, onRun: function (r) {
      attempt(key);
      if (e.exp && !e.predict && !r.err) { var same = norm(r.out) === norm(e.exp); cmp.hidden = false; cmp.textContent = same ? '✔ A saída é igual à do exemplo.' : 'A saída ainda é diferente do exemplo.'; cmp.className = 'cmp small ' + (same ? 'same' : 'diff'); }
    } });
    card.querySelector('.slot').appendChild(ed.el);
    function mark(on) { card.querySelector('.exh__ok').hidden = !on; card.classList.toggle('done', on); rb.hidden = !on; }
    mark(!!st.e[key]);
    hb.addEventListener('click', function () {
      if (shown >= 3) return; hx.hidden = false; var p = h('p', 'hint', '<b>Dica ' + (shown + 1) + ' de 3 · ' + ['conceitual', 'estratégica', 'específica'][shown] + '</b>');
      var tx = h('span'); if (hints[shown].indexOf('\n') >= 0) { tx = h('pre'); } tx.textContent = hints[shown]; p.appendChild(tx); hx.appendChild(p); shown++;
      hb.querySelector('span').textContent = shown < 3 ? '(' + (shown + 1) + ' de 3)' : '(todas mostradas)'; if (shown >= 3) hb.disabled = true;
    });
    sb.addEventListener('click', function () {
      sx.hidden = !sx.hidden; if (sx.hidden) return; sx.innerHTML = '<b>' + (e.predict ? 'Saída correta:' : 'Uma possível solução (comentada):') + '</b><pre></pre><p></p>'; sx.querySelector('pre').textContent = sol; sx.querySelector('p').textContent = e.why || '';
    });
    rb.addEventListener('click', function () { delete st.e[key]; save(); mark(false); fb.hidden = true; cmp.hidden = true; sx.hidden = true; hx.innerHTML = ''; hx.hidden = true; shown = 0; hb.disabled = false; hb.querySelector('span').textContent = '(1 de 3)'; if (pred) pred.value = ''; ed.reset(); refresh(); });
    card.querySelector('[data-a=v]').addEventListener('click', function () {
      var b = this; b.disabled = true; fb.hidden = false; fb.className = 'fb'; fb.textContent = 'Verificando… (o Python executa seu código)'; attempt(key);
      verify(e, ed.get(), pred ? pred.value : '').then(function (r) {
        sb.disabled = false; sb.removeAttribute('title'); fb.innerHTML = '';
        if (r.ok) {
          fb.className = 'fb good'; fb.appendChild(h('p', null, '<b>✔ Exercício concluído!</b>')); fb.appendChild(h('p', null, esc(e.why || 'Seu código passou nos testes.')));
          if (o.onContinue) { var c = h('button', 'btn btn--yellow btn--sm', 'Continuar →'); c.type = 'button'; c.addEventListener('click', o.onContinue); fb.appendChild(c); }
          mark(true); if (!st.e[key]) { st.e[key] = 1; delete st.a[key]; touch(); save(); refresh(); toast('✔ Exercício concluído'); }
        } else {
          fb.className = 'fb bad'; fb.appendChild(h('p', null, '<b>' + CATS[r.cat] + '</b>')); var m = h('p'); m.textContent = r.msg; fb.appendChild(m);
          var nm = IP.errName(r.msg); if (nm) { var eb = h('button', 'elink', 'Entenda este erro (' + nm + ') →'); eb.type = 'button'; eb.addEventListener('click', function () { openErr(nm); }); fb.appendChild(eb); }
          fb.appendChild(h('p', 'small', 'Você pode tentar de novo. Se precisar, use “Mostrar dica”.'));
        }
      }, function () { fb.className = 'fb bad'; fb.textContent = 'Não foi possível carregar o Python para verificar. ' + (IP.report ? IP.report(3) : ''); }).then(function () { b.disabled = false; });
    });
    return card;
  }
  /* ---- fim exercício ---- */

  /* ---- Estado da tela de aulas ---- */
  var C = null, mode = lsGet(MK) === 'free' ? 'free' : 'guided', home = $('conteudo'), lv = $('lesson');
  function refresh() { renderPath(); updateCTA(); if (C) { side(); ctxBar(); } }
  function topicKey(l, t) { return l.id + '.' + t.id; }
  function complete(l, t) { var k = topicKey(l, t); if (st.t[k]) return; st.t[k] = 1; touch(); save(); refresh(); toast('✔ Tópico concluído'); var d = document.querySelector('.stp__b.cur'); if (d) d.classList.add('pop'); }

  /* ---- Etapas de um tópico ---- */
  function walk(code, ob, out) {
    var lines = code.split('\n').filter(function (x) { return x.trim(); }), notes = ob ? ob.split(' | ') : [], i = -1, el = h('div', 'walk');
    el.innerHTML = '<pre class="wcode" aria-label="Código do exemplo"></pre><div class="wnote" role="status" aria-live="polite"></div><div class="wrow"><button class="btn btn--ghost btn--sm" type="button" data-p>← Linha anterior</button><button class="btn btn--blue btn--sm" type="button" data-n>Próxima linha →</button></div><div class="wout" hidden></div>';
    var pre = el.querySelector('pre'), note = el.querySelector('.wnote'), wo = el.querySelector('.wout'), pb = el.querySelector('[data-p]'), nb = el.querySelector('[data-n]');
    function draw() {
      pre.innerHTML = lines.map(function (ln, k) { return '<span class="wl' + (k === i ? ' on' : k < i ? ' past' : '') + '"><b>' + (k + 1) + '</b>' + IP.hl(ln) + '</span>'; }).join('');
      note.textContent = i < 0 ? 'Clique em “Próxima linha” para ver o que cada linha faz.' : 'Linha ' + (i + 1) + ': ' + (notes[i] || '');
      pb.disabled = i < 0; nb.disabled = i >= lines.length - 1;
      var fin = i >= lines.length - 1; wo.hidden = !fin;
      if (fin) wo.innerHTML = out ? (out.e ? '<span class="out__t">Resultado</span><p>O Python mostra um erro (' + out.e + '). Veja a explicação acima e experimente na próxima etapa.</p>' : '<span class="out__t">Resultado esperado</span><pre></pre>') : '';
      if (fin && out && out.o !== undefined) wo.querySelector('pre').textContent = out.o;
    }
    pb.addEventListener('click', function () { if (i >= 0) { i--; draw(); } }); nb.addEventListener('click', function () { if (i < lines.length - 1) { i++; draw(); } });
    draw(); return el;
  }
  function miniQ(q) {
    var w = h('div', 'mq', '<p><b>Pergunta rápida:</b> ' + q.q + '</p><div class="opts"></div><div class="fb" role="status" hidden></div>'), box = w.querySelector('.opts'), f = w.querySelector('.fb');
    q.o.forEach(function (o, k) { var b = h('button', 'opt', o); b.type = 'button'; b.addEventListener('click', function () { var ok = k === q.a; b.classList.add(ok ? 'right' : 'wrong'); f.hidden = false; f.className = 'fb ' + (ok ? 'good' : 'bad'); f.textContent = (ok ? '✔ Correto! ' : 'Quase. ') + q.w; }); box.appendChild(b); });
    return w;
  }
  function stageEls(l, t, ti) {
    var key = l.id + '.' + t.id, S = [], k, p;
    function stg(i, html) { var d = h('div', 'stg'); d.innerHTML = '<p class="stg__k">Etapa ' + (i + 1) + ' de 5 · ' + STG[i] + '</p>' + html; return d; }
    S[0] = stg(0, t.h + (t.vis && VIS[t.vis] ? '<figure class="vis">' + VIS[t.vis] + '</figure>' : ''));
    if (t.ex) { S[1] = stg(1, '<p>Observe o exemplo e siga a execução, linha por linha:</p>'); S[1].appendChild(walk(t.ex[0], t.ob, OUTS[key])); }
    else S[1] = stg(1, '<p class="tip">Este tópico é conceitual: não há código para observar. Siga em frente.</p>');
    if (t.ex) { S[2] = stg(2, '<p class="tip"><b>Tente:</b> ' + (t.tr || 'altere os valores e execute de novo.') + '</p>'); t.ex.forEach(function (c) { S[2].appendChild(IP.editor({ code: c }).el); }); }
    else S[2] = stg(2, '<p class="tip">Sem código neste tópico. Você vai experimentar nos próximos.</p>');
    S[3] = stg(3, ''); var any = 0;
    l.ex.forEach(function (e, i) { if (e.tp === t.id) { any = 1; S[3].appendChild(exercise(l, e, i + 1, { onContinue: function () { go(C.ti, 5); } })); } });
    if (!any) S[3].appendChild(h('p', 'tip', 'Este tópico não tem exercício próprio. Os exercícios dos próximos tópicos vão usar o que você aprendeu aqui.'));
    S[4] = stg(4, t.r ? '<div class="rev"><b>Resumo:</b> ' + t.r + '</div>' : '');
    var q = (l.quiz || []).filter(function (x) { return x.tp === t.id; })[0]; if (q) S[4].appendChild(miniQ(q));
    var b = h('button', 'btn btn--ghost btn--sm mark'); b.type = 'button';
    function lab() { b.textContent = st.t[key] ? '✔ Tópico concluído (clique para desfazer)' : 'Marcar tópico como concluído'; b.classList.toggle('is-done', !!st.t[key]); }
    b.addEventListener('click', function () { if (st.t[key]) { delete st.t[key]; save(); refresh(); } else complete(l, t); lab(); }); lab(); b.id = 'mk-' + key; S[4].appendChild(b);
    return S;
  }

  /* ---- Navegação da aula ---- */
  function go(ti, s, sc) { C.ti = ti; C.s = s; C.rev = false; C.sc = sc || null; render(); }
  function goRev() { C.rev = true; C.sc = null; render(); }
  function trackPos() {
    if (!C.rev) { var t = C.l.topics[C.ti]; st.pos = { l: C.l.id, k: 't', id: t.id, s: C.s }; } else st.pos = { l: C.l.id, k: 'quiz' };
    st.last = C.l.id; save(); updateCTA();
    try { history.replaceState(null, '', '#aula-' + C.l.id + '-' + (C.rev ? 'quiz' : C.l.topics[C.ti].id + (mode === 'guided' ? '-s' + C.s : ''))); } catch (x) {}
  }
  function ctxBar() {
    var el = $('ctx'); if (!el) return; var l = C.l, t = l.topics[C.ti], ol = '', rest = '';
    if (!C.rev) {
      STG.forEach(function (n, i) { ol += '<li><button type="button" class="stp__b' + (mode === 'guided' && C.s === i + 1 ? ' cur' : '') + '" data-s="' + (i + 1) + '" aria-label="Etapa ' + (i + 1) + ': ' + n + '"' + (mode === 'guided' && C.s === i + 1 ? ' aria-current="step"' : '') + '><i>' + (i + 1) + '</i><span>' + n + '</span></button></li>'; });
      rest = st.t[topicKey(l, t)] ? '✔ Tópico concluído' : mode === 'guided' ? (C.s < 5 ? 'Falta: ' + STG.slice(C.s).join(' · ') : 'Falta: concluir o tópico') : 'Falta: concluir o tópico';
    }
    el.innerHTML = '<div class="ctx__row"><button class="btn btn--ghost btn--sm snavbtn" type="button" aria-expanded="' + (window.innerWidth > 960) + '" aria-controls="snav">☰ Aulas</button><div><p class="ctx__l">Aula ' + l.id + ' — ' + l.title + '</p><p class="ctx__t" id="ctxfocus" tabindex="-1">' + (C.rev ? 'Revisão da aula' : 'Tópico ' + (C.ti + 1) + ' — ' + t.t) + '</p></div><div class="mode" role="group" aria-label="Modo de estudo"><button type="button" data-mode="guided" aria-pressed="' + (mode === 'guided') + '">Estudo guiado</button><button type="button" data-mode="free" aria-pressed="' + (mode === 'free') + '">Navegação livre</button></div></div>'
      + (C.rev ? '' : '<ol class="stp">' + ol + '</ol><p class="ctx__s">' + (mode === 'guided' ? 'Etapa ' + C.s + ' de 5 — ' + STG[C.s - 1] + ' · ' : 'Todas as etapas deste tópico · ') + rest + '</p>');
  }
  function footNav() {
    var l = C.l, last = C.ti === l.topics.length - 1, nav = h('nav', 'fnav', '<a class="linkbtn" href="#aulas">Voltar à lista de aulas</a>'), pv = h('button', 'btn btn--ghost', '← Voltar'), nx = h('button', 'btn btn--yellow big'); pv.type = nx.type = 'button';
    if (C.rev) { pv.addEventListener('click', function () { go(l.topics.length - 1, mode === 'guided' ? 5 : 1); }); var n = L[l.id]; nx = h('a', 'btn btn--yellow big', n && n.state === 'ready' ? 'Próxima: Aula ' + n.id + ' →' : 'Hora de Praticar →'); nx.href = n && n.state === 'ready' ? '#aula-' + n.id : '#praticar'; }
    else if (mode === 'guided') {
      pv.disabled = C.ti === 0 && C.s === 1; pv.addEventListener('click', function () { if (C.s > 1) go(C.ti, C.s - 1); else go(C.ti - 1, 5); });
      nx.textContent = C.s < 5 ? 'Continuar →' : last ? 'Concluir e ir à revisão →' : 'Concluir tópico e continuar →';
      nx.addEventListener('click', function () { if (C.s < 5) go(C.ti, C.s + 1); else { complete(l, l.topics[C.ti]); if (last) goRev(); else go(C.ti + 1, 1); } });
    } else {
      pv.disabled = C.ti === 0; pv.addEventListener('click', function () { go(C.ti - 1, 1); }); nx.textContent = last ? 'Ir à revisão da aula →' : 'Próximo tópico →';
      nx.addEventListener('click', function () { if (last) goRev(); else go(C.ti + 1, 1); });
    }
    nav.insertBefore(pv, nav.firstChild); nav.appendChild(nx); return nav;
  }
  function render() {
    var l = C.l, art = $('lmain'); art.innerHTML = '';
    var ctxEl = h('div', 'ctx'); ctxEl.id = 'ctx'; art.appendChild(ctxEl); var body = h('div', 'stagebody'); art.appendChild(body);
    if (C.rev) body.appendChild(revView(l));
    else {
      var t = l.topics[C.ti], key = topicKey(l, t), els = C.cache[key] || (C.cache[key] = stageEls(l, t, C.ti));
      if (C.ti === 0 && (mode === 'free' || C.s === 1)) { C.vid = C.vid || video(l); body.appendChild(C.vid); }
      if (mode === 'guided') { var d = h('div', 'stg-wrap'); d.appendChild(els[C.s - 1]); body.appendChild(d); }
      else els.forEach(function (el, i) { var sec = h('section', 'fstage'); sec.appendChild(h('h2', 'fstage__h', '<span class="n">' + (i + 1) + '</span>' + STG[i])); sec.appendChild(el); body.appendChild(sec); });
    }
    art.appendChild(footNav()); ctxBar(); side(); trackPos();
    if (C.sc) { var x = $(C.sc); if (x) { x.scrollIntoView(); x.classList.add('flash'); setTimeout(function () { x.classList.remove('flash'); }, 1800); } } else window.scrollTo(0, 0);
  }
  function side() {
    var l = C.l, box = $('snav'); if (!box) return;
    var html = '<a class="btn btn--ghost btn--sm back" href="#inicio">← Página principal</a><ol class="slist">';
    L.forEach(function (x) {
      html += '<li><a href="#aula-' + x.id + '"' + (x === l ? ' class="cur" aria-current="page"' : '') + '><span class="n">' + x.id + '</span><span class="tt">' + x.title + '<small>' + status(x) + ' · ' + pct(x) + '%</small></span></a>';
      if (x === l) {
        html += '<ul class="tops">'; x.topics.forEach(function (t, i) { html += '<li><a href="#" data-ti="' + i + '"' + (!C.rev && C.ti === i ? ' class="now"' : '') + '><b>' + (st.t[topicKey(x, t)] ? '✔' : '○') + '</b>' + t.t + '</a></li>'; });
        html += '<li><a href="#" data-rev' + (C.rev ? ' class="now"' : '') + '><b>' + (st.q[x.id] ? '✔' : '○') + '</b>Revisão da aula</a></li></ul>';
      }
      html += '</li>';
    });
    box.innerHTML = html + '</ol><div class="sact"><a class="btn btn--ghost btn--sm" href="#praticar">Hora de Praticar</a><button class="btn btn--ghost btn--sm" type="button" data-err-open>Entenda o Erro</button><button class="btn btn--ghost btn--sm" type="button" data-gl>Glossário</button><button class="btn btn--ghost btn--sm" type="button" data-reset>Reiniciar esta aula</button></div><p class="small priv">O progresso é salvo só neste navegador.</p>';
  }
  function video(l) {
    var b = h('div', 'vid');
    if (!l.video) { b.innerHTML = '<div class="vid__soon"><b>Vídeo em breve</b><span>O material escrito e os exercícios já estão disponíveis.</span></div>'; return b; }
    var id = l.video.match(/[?&]v=([\w-]{11})/)[1];
    b.innerHTML = '<details class="vdet"><summary>Videoaula (opcional)</summary><div class="player"><button class="play" type="button" aria-label="Assistir à videoaula"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button></div><p class="small">Se o vídeo não carregar, <a href="' + l.video + '" target="_blank" rel="noopener noreferrer">assista no YouTube</a>.</p></details>';
    var pl = b.querySelector('.player'), pb = b.querySelector('.play');
    pb.addEventListener('click', function () { var f = h('iframe'); f.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0'; f.title = 'Videoaula – Aula ' + l.id; f.referrerPolicy = 'strict-origin-when-cross-origin'; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true; pl.appendChild(f); pb.hidden = true; video.on = { pl: pl, pb: pb, url: l.video }; });
    return b;
  }
  document.addEventListener('securitypolicyviolation', function () { var v = video.on; if (v) { video.on = null; var f = v.pl.querySelector('iframe'); if (f) f.remove(); v.pb.hidden = false; window.open(v.url, '_blank', 'noopener'); } });

  /* ---- Revisão da aula ---- */
  function revView(l) {
    var s = h('section', 'topic rvw'), i = 0, score = 0, n = l.quiz.length, res = {};
    function draw() {
      if (i >= n) {
        var okq = score >= Math.ceil(n * .6), items = '';
        l.topics.forEach(function (t, k) { if (res[t.id]) items += '<li class="' + (res[t.id].ok === res[t.id].n ? 'good' : 'again') + '"><b>' + (res[t.id].ok === res[t.id].n ? '✔' : '↻') + '</b> ' + t.t + (res[t.id].ok === res[t.id].n ? '' : ' — vale revisar <button class="linkbtn" type="button" data-ti="' + k + '">abrir tópico</button>') + '</li>'; });
        if (okq && !st.q[l.id]) { st.q[l.id] = 1; touch(); save(); refresh(); toast('✔ Revisão concluída'); }
        s.innerHTML = '<h2>Revisão da aula</h2><p>Você acertou <b>' + score + ' de ' + n + '</b>. ' + (score === n ? 'Excelente!' : okq ? 'Muito bem! Veja abaixo o que merece uma releitura.' : 'Releia os tópicos indicados e tente de novo, sem pressa.') + '</p><ul class="sumlist">' + items + '</ul><h3>Resumo da aula</h3><ul>' + l.sum.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><button class="btn btn--ghost btn--sm" type="button">Refazer a revisão</button>';
        s.querySelector('.btn').addEventListener('click', function () { i = 0; score = 0; res = {}; draw(); }); return;
      }
      var q = l.quiz[i];
      s.innerHTML = '<h2>Revisão da aula</h2><p class="small">Questão ' + (i + 1) + ' de ' + n + '</p><p><b>' + q.q + '</b></p><div class="opts">' + q.o.map(function (o, k) { return '<button class="opt" type="button" data-k="' + k + '">' + o + '</button>'; }).join('') + '</div><div class="fb" role="status" hidden></div>';
      s.querySelectorAll('.opt').forEach(function (b) { b.addEventListener('click', function () {
        var k = +b.getAttribute('data-k'), ok = k === q.a, f = s.querySelector('.fb'); if (!f.hidden) return;
        if (ok) score++; res[q.tp] = res[q.tp] || { ok: 0, n: 0 }; res[q.tp].n++; if (ok) res[q.tp].ok++;
        b.classList.add(ok ? 'right' : 'wrong'); s.querySelector('[data-k="' + q.a + '"]').classList.add('right');
        f.hidden = false; f.className = 'fb ' + (ok ? 'good' : 'bad'); f.innerHTML = (ok ? '✔ Correto! ' : 'Não foi dessa vez. ') + q.w + '<br><button class="btn btn--yellow btn--sm" type="button" style="margin-top:.7rem">' + (i + 1 < n ? 'Próxima questão' : 'Ver resultado') + '</button>';
        f.querySelector('button').addEventListener('click', function () { i++; draw(); });
      }); });
    }
    draw(); return s;
  }

  /* ---- Abrir aula / rotas ---- */
  function openLesson(l, m) {
    var sub = m[2], sv = m[3] ? +m[3] : 0, fresh = !C || C.l !== l;
    var wel = fresh && l.id === 1 && needWelcome(); /* decidir ANTES de render(): render grava a posição do estudante */
    if (fresh) { C = { l: l, ti: 0, s: 1, rev: false, cache: {}, vid: null, sc: null }; home.hidden = true; lv.hidden = false; document.body.classList.add('in-lesson'); buildShell(); }
    var ti = 0, s = 1, rev = false, sc = null;
    if (sub === 'quiz') rev = true;
    else if (sub && sub.charAt(0) === 't') { ti = Math.max(0, l.topics.map(function (t) { return t.id; }).indexOf(sub)); s = sv || (st.pos && st.pos.l === l.id && st.pos.id === sub && st.pos.s) || 1; }
    else if (sub && (sub.charAt(0) === 'e' || sub === 'ex')) {
      var e = sub === 'ex' ? l.ex[0] : l.ex.filter(function (x) { return x.id === sub; })[0]; ti = Math.max(0, l.topics.map(function (t) { return t.id; }).indexOf(e && e.tp)); s = 4; sc = e ? 'ex-' + e.id : null;
    } else if (st.pos && st.pos.l === l.id && st.pos.k === 't') { ti = Math.max(0, l.topics.map(function (t) { return t.id; }).indexOf(st.pos.id)); s = st.pos.s || 1; }
    else if (st.pos && st.pos.l === l.id && st.pos.k === 'quiz') rev = true;
    C.ti = ti; C.s = s; C.rev = rev; C.sc = sc; render();
    if (wel) openWelcome(false);
  }
  function buildShell() {
    lv.innerHTML = ''; var wrap = h('div', 'wrap lview'), sd = h('aside', 'snav'); sd.id = 'snav'; var art = h('article', 'lmain'); art.id = 'lmain'; wrap.appendChild(sd); wrap.appendChild(art); lv.appendChild(wrap);
  }
  function openPractice(theme) {
    C = null; home.hidden = true; lv.hidden = false; document.body.classList.add('in-lesson'); lv.innerHTML = '';
    var wrap = h('div', 'wrap lview lview--one'), art = h('article', 'lmain'); wrap.appendChild(art); lv.appendChild(wrap);
    var done = target().state === 'done', chips = '<button type="button" class="tchip" data-th="" aria-pressed="' + !theme + '">Todos</button>' + Object.keys(TH).map(function (k) { return '<button type="button" class="tchip" data-th="' + k + '" aria-pressed="' + (theme === k) + '">' + TH[k] + '</button>'; }).join('');
    art.innerHTML = '<a class="btn btn--ghost btn--sm back" href="#inicio">← Página principal</a><header class="lhead"><h1>Hora de Praticar</h1><p class="lead">Exercícios extras por tema, diferentes dos das aulas. Sem pontuação e sem pressa: refaça quando quiser.</p>' + (done ? '<div class="rev ok-banner"><b>Parabéns!</b> Você concluiu os conteúdos principais das cinco aulas. Revise qualquer uma: ' + L.map(function (x) { return '<a href="#aula-' + x.id + '">Aula ' + x.id + '</a>'; }).join(' · ') + '</div>' : '') + '<div class="chips" role="group" aria-label="Escolha o tema">' + chips + '</div></header>';
    var fake = { id: 'p', topics: [], ex: [] }, n = 0;
    PR.forEach(function (e) { if (theme && e.th !== theme) return; art.appendChild(exercise(fake, e, ++n)); });
    window.scrollTo(0, 0);
  }
  var RT = /^aula-(\d)(?:-(t\d+|e\d+|ex|quiz))?(?:-s([1-5]))?$/;
  function route() {
    var id = location.hash.slice(1), m = id.match(RT), l = m && L[m[1] - 1];
    if (window.IPNav) { IPNav.closeAll(); IPNav.setActive(l && l.state === 'ready' ? 'aulas' : (id === 'praticar' || id.indexOf('praticar-') === 0) ? 'praticar' : null); }
    if (l && l.state === 'ready') openLesson(l, m);
    else if (id === 'praticar' || id.indexOf('praticar-') === 0) openPractice(id.slice(9) || '');
    else { var was = !lv.hidden; C = null; home.hidden = false; lv.hidden = true; document.body.classList.remove('in-lesson'); lv.innerHTML = ''; renderPath(); var t = id && $(id); if (t) t.scrollIntoView(); else if (was) window.scrollTo(0, 0); }
    updateCTA();
  }
  addEventListener('hashchange', route);

  /* ---- Cliques da área de aulas (delegação) ---- */
  lv.addEventListener('click', function (e) {
    var t = e.target, b;
    if ((b = t.closest('[data-s]')) && C) { go(C.ti, +b.getAttribute('data-s')); }
    else if ((b = t.closest('[data-mode]')) && C) { mode = b.getAttribute('data-mode'); lsSet(MK, mode); render(); }
    else if (t.closest('.snavbtn')) { var sd = $('snav'), bt = t.closest('.snavbtn'), open; if (window.innerWidth <= 960) { open = sd.classList.toggle('open'); } else { var w = sd.parentNode; w.classList.toggle('snav-off'); open = !w.classList.contains('snav-off'); } bt.setAttribute('aria-expanded', open); }
    else if ((b = t.closest('[data-ti]')) && C) { e.preventDefault(); go(+b.getAttribute('data-ti'), 1); var sd2 = $('snav'); if (sd2) sd2.classList.remove('open'); }
    else if (t.closest('[data-rev]') && C) { e.preventDefault(); goRev(); }
    else if (t.closest('[data-reset]') && C) { if (confirm('Apagar o progresso desta aula neste navegador?')) { var l = C.l; l.topics.forEach(function (x) { delete st.t[topicKey(l, x)]; }); l.ex.forEach(function (x) { delete st.e[l.id + '.' + x.id]; delete st.a[l.id + '.' + x.id]; }); delete st.q[l.id]; save(); C.cache = {}; render(); refresh(); } }
    else if ((b = t.closest('[data-th]'))) { location.hash = b.getAttribute('data-th') ? 'praticar-' + b.getAttribute('data-th') : 'praticar'; }
  });

  /* ---- Trilha e painel ---- */
  function renderPath() {
    var ol = $('path'); if (!ol) return; ol.innerHTML = '';
    L.forEach(function (l) {
      var p = pct(l), li = h('li', 'rv in' + (l.state === 'ready' ? ' on' : ''));
      var inner = '<span class="dot">' + l.id + '</span><h3>' + l.title + '</h3><p>' + l.short + '</p><span class="tag ' + (l.state === 'ready' ? (l.video ? 'tag--on' : 'tag--soon') : '') + '">' + label(l) + '</span>' + (p ? '<span class="mini"><i style="width:' + p + '%"></i></span><span class="small">' + status(l) + ' · ' + p + '%</span>' : '');
      li.innerHTML = l.state === 'ready' ? '<a class="plink" href="#aula-' + l.id + '">' + inner + '</a>' : inner; ol.appendChild(li);
    });
    var rs = $('resume'); if (rs) rs.textContent = 'Seu progresso fica salvo apenas neste dispositivo e navegador e pode ser perdido se os dados locais forem apagados. Você pode estudar na ordem que preferir.';
  }
  function totals() {
    var tot = 0, done = 0, ex = 0, exd = 0, ls = 0;
    L.forEach(function (l) { var n = l.topics.length + l.ex.length + 1, d = 0; tot += n; ex += l.ex.length; l.topics.forEach(function (t) { if (st.t[topicKey(l, t)]) d++; }); l.ex.forEach(function (e) { if (st.e[l.id + '.' + e.id]) { d++; exd++; } }); if (st.q[l.id]) d++; done += d; if (d === n) ls++; });
    return { pct: Math.round(100 * done / tot), ls: ls, ex: ex, exd: exd };
  }
  function renderPanel(t) {
    var box = $('painel-in'); if (!box) return;
    if (t.state === 'new') { box.innerHTML = '<div class="pnl pnl--new"><div><h2>Seu painel de aprendizagem</h2><p>Cinco aulas curtas, com exemplos que você executa e exercícios com dicas. Comece pela Aula 1.</p></div><a class="btn btn--yellow" href="#aula-1-t1">Começar pela Aula 1</a></div>'; return; }
    var T = totals(), lp = st.pos && byId(st.pos.l), last = '—';
    if (lp && st.pos.k === 't') { var tt = lp.topics.filter(function (x) { return x.id === st.pos.id; })[0]; if (tt) last = 'Aula ' + lp.id + ' · ' + tt.t; } else if (lp && st.pos.k === 'e') { var ee = lp.ex.filter(function (x) { return x.id === st.pos.id; })[0]; if (ee) last = 'Aula ' + lp.id + ' · exercício “' + ee.t + '”'; } else if (lp) last = 'Aula ' + lp.id + ' · revisão';
    box.innerHTML = '<div class="pnl"><h2>Seu painel de aprendizagem</h2><div class="pgrid"><div><span class="k">Aula atual</span><b>' + (t.lesson ? 'Aula ' + t.lesson.id + ' · ' + t.lesson.title : 'Todas concluídas') + '</b></div><div><span class="k">Último tópico estudado</span><b>' + esc(last) + '</b></div><div><span class="k">Progresso geral</span><b>' + T.pct + '%</b><span class="mini"><i style="width:' + T.pct + '%"></i></span></div><div><span class="k">Aulas concluídas</span><b>' + T.ls + ' de ' + L.length + '</b></div><div><span class="k">Exercícios concluídos</span><b>' + T.exd + ' de ' + T.ex + '</b></div><div><span class="k">Próxima atividade</span><b>' + (t.state === 'done' ? 'Hora de Praticar' : esc(t.desc)) + '</b></div></div><a class="btn btn--yellow" href="#' + t.hash + '">' + (t.state === 'done' ? 'Revisar conteúdos' : 'Continuar estudando') + '</a></div>';
  }
  function updateCTA() {
    var t = target(), c = $('cta'), info = ctaInfo(t);
    if (c) { c.setAttribute('href', '#' + t.hash); c.querySelector('span').textContent = info.text; c.querySelector('use').setAttribute('href', '#' + info.icon); }
    renderPanel(t);
  }
  var cta = $('cta');
  if (cta) cta.addEventListener('click', function (e) { e.preventDefault(); var t = target(); if (location.hash === '#' + t.hash) route(); else location.hash = t.hash; });
  addEventListener('storage', function (e) { if (e.key === KEY) { st = norm0(load()); refresh(); } });

  /* ---- Glossário (A–Z + busca) e "Entenda o Erro" ---- */
  var gd = $('gloss'), ed2 = $('errs');
  function fillGloss(box, q) {
    q = (q || '').toLowerCase().trim(); var list = G.slice().sort(function (a, b) { return a.t.localeCompare(b.t, 'pt'); }).filter(function (g) { return !q || (g.t + ' ' + g.d).toLowerCase().indexOf(q) >= 0; });
    box.innerHTML = list.length ? list.map(function (g) { return '<article class="gi" id="g-' + g.k + (box.id === 'glist' ? '' : '-h') + '"><h3>' + g.t + '</h3><p>' + g.d + '</p><pre>' + esc(g.e) + '</pre><a class="small" href="#aula-' + g.a + '">Ver na Aula ' + g.a + ' →</a></article>'; }).join('') : '<p class="small">Nenhum termo encontrado.</p>';
  }
  function openGloss(k) { $('gq').value = ''; fillGloss($('glist'), ''); gd.showModal(); var el = k && $('g-' + k); if (el) { el.scrollIntoView(); el.classList.add('flash'); setTimeout(function () { el.classList.remove('flash'); }, 1800); } }
  function fillErrs() { $('elist').innerHTML = ERRS.map(function (x) { return '<article class="ei" id="er-' + x.k + '"><h3>' + x.t + '</h3><p>' + x.m + '</p><p class="lbl">Exemplo com erro</p><pre class="bad"></pre><p>' + x.why + '</p><p class="lbl">Exemplo corrigido</p><pre class="good"></pre></article>'; }).join(''); ERRS.forEach(function (x) { var a = $('er-' + x.k); a.querySelector('.bad').textContent = x.bad; a.querySelector('.good').textContent = x.good; }); }
  function openErr(k) { if (!ed2.open) ed2.showModal(); var el = k && $('er-' + k); if (el) { el.scrollIntoView(); el.classList.add('flash'); setTimeout(function () { el.classList.remove('flash'); }, 1800); } }
  IP.onErr = openErr;
  [gd, ed2].forEach(function (d) { d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('[data-x]') || e.target.closest('a[href^="#aula"]')) d.close(); }); });
  document.addEventListener('click', function (e) { var t = e.target.closest('.gt'); if (t) { e.preventDefault(); openGloss(t.getAttribute('data-t')); return; } if (e.target.closest('[data-gl]')) openGloss(); if (e.target.closest('[data-err-open]')) { e.preventDefault(); openErr(); } });
  $('gq').addEventListener('input', function () { fillGloss($('glist'), this.value); });
  $('gq-home').addEventListener('input', function () { fillGloss($('gloss-home'), this.value); });
  fillGloss($('glist'), ''); fillGloss($('gloss-home'), ''); fillErrs();

  /* ---- Tela de boas-vindas ---- */
  var wd = $('welcome'), wi = 0, wManual = false;
  function wLabels() { wd.querySelector('[data-wskip]').textContent = wManual ? 'Fechar apresentação' : 'Pular apresentação'; wd.querySelector('[data-wgo]').textContent = wManual ? 'Fechar apresentação' : 'Iniciar Aula 1'; }
  function wRender() {
    var steps = wd.querySelectorAll('.wstep'), dots = wd.querySelectorAll('.wdots i');
    for (var i = 0; i < steps.length; i++) { steps[i].hidden = i !== wi; if (dots[i]) dots[i].className = i === wi ? 'on' : ''; }
    $('wcount').textContent = 'Etapa ' + (wi + 1) + ' de 3';
    wd.querySelector('[data-wp]').hidden = wi === 0; wd.querySelector('[data-wn]').hidden = wi === 2; wd.querySelector('[data-wgo]').hidden = wi !== 2;
    var hd = steps[wi].querySelector('h2'); if (hd) hd.focus();
  }
  /* manual = reabertura voluntária (FAQ): não registra nada e não navega */
  function openWelcome(manual) { if (wd.open) return; wManual = !!manual; wi = 0; wLabels(); wd.showModal(); wRender(); }
  wd.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-wn]')) { wi = Math.min(2, wi + 1); wRender(); }
    else if (t.closest('[data-wp]')) { wi = Math.max(0, wi - 1); wRender(); }
    else if (t.closest('[data-wskip]') || t.closest('[data-wgo]')) { if (!wManual) markWelcome(); wd.close(); }
  });
  wd.addEventListener('cancel', function () { if (!wManual) markWelcome(); });
  wd.addEventListener('close', function () { if (!wManual) { markWelcome(); var f = $('ctxfocus'); if (f) f.focus(); } wManual = false; });
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-welcome-open]')) { e.preventDefault(); openWelcome(true); } });

  var he = $('home-editor');
  if (he) he.appendChild(IP.editor({ code: '# Seu primeiro código Python\nnome = "Inside Python"\nprint("Olá, mundo!")\nprint("Bem-vindo ao", nome)', name: 'primeiro_codigo.py' }).el);
  route();
})();
