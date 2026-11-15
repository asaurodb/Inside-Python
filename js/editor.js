/* Componente reutilizável: Python real (Pyodide) + editor.
   Execução: Web Worker (limite de 8 s) com reserva no thread principal. Diagnóstico por etapa: console "[Inside Python]" e IP.report(). */
window.IP = window.IP || {};
(function () {
  'use strict';
  /* Para hospedar o Pyodide no próprio site, defina window.IP_PYODIDE_BASE = 'pyodide/' antes de carregar este arquivo. */
  var base = window.IP_PYODIDE_BASE || 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
  IP.base = /\/$/.test(base) ? base : base + '/';
  var T0 = (window.performance && performance.now) ? performance.now() : 0, LOG = [], LIMIT = 8000, seq = 0, RP = null;

  /* ---- Diagnóstico ---- */
  IP.log = function (step, detail, level) {
    var ms = Math.round(((window.performance && performance.now) ? performance.now() : 0) - T0);
    LOG.push('[+' + ms + ' ms] ' + step + (detail ? ': ' + detail : ''));
    if (window.console) (console[level || 'log'] || console.log).call(console, '[Inside Python]', step, detail || '');
  };
  IP.report = function (n) { return LOG.slice(-(n || 40)).join('\n'); };
  IP.failText = function (err) { return 'Não foi possível iniciar o Python.\n' + (err && err.message ? err.message : String(err)) + '\n\nDiagnóstico (também no console do navegador, filtro "Inside Python"):\n' + IP.report(14) + '\n\nPara um teste passo a passo, abra diagnostico.html.'; };
  function probe() {
    var files = ['pyodide.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
    return Promise.all(files.map(function (f) {
      var ctl = window.AbortController ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort(); }, 8000);
      return fetch(IP.base + f, { method: 'HEAD', signal: ctl && ctl.signal }).then(function (r) { clearTimeout(to); IP.log('rede ' + f, 'HTTP ' + r.status, r.ok ? 'log' : 'error'); return r.ok; },
        function (x) { clearTimeout(to); IP.log('rede ' + f, 'FALHOU (' + (x && x.name) + ': ' + (x && x.message) + ')', 'error'); return false; });
    })).then(function (a) {
      var wasm = false; try { wasm = WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0])); } catch (x) {}
      IP.log('WebAssembly', wasm ? 'disponível' : 'INDISPONÍVEL', wasm ? 'log' : 'error');
      return { cdn: a[0], all: a.every(Boolean), wasm: wasm };
    });
  }

  /* ---- Execução de um programa (usada no worker e no thread principal) ---- */
  async function pyExec(p, d) {
    var buf = [], vars = {}, err = null, g = p.toPy({});
    p.setStdout({ batched: function (l) { buf.push(l); } }); p.setStderr({ batched: function (l) { buf.push(l); } });
    try {
      var v = await p.runPythonAsync(d.code, { globals: g });
      if (v !== undefined && v !== null) { buf.push(typeof v === 'string' ? "'" + v + "'" : String(v)); if (v.destroy) v.destroy(); }
    } catch (x) { err = String(x && x.message || x); }
    (d.want || []).forEach(function (n) {
      if (g.has(n)) { var v = g.get(n); vars[n] = { t: typeof v === 'string' ? 'str' : (typeof v === 'number' || typeof v === 'bigint') ? 'num' : 'o', v: typeof v === 'bigint' ? Number(v) : (typeof v === 'object' ? null : v) }; }
    });
    g.destroy();
    return { out: buf.join('\n'), err: err, vars: vars };
  }
  /* Código do worker: é uma função real (serializada com toString), então não há strings escapadas à mão. */
  function workerMain(cfg) {
    function log(s, d) { postMessage({ log: [s, d || ''] }); }
    var P;
    log('worker iniciado');
    try {
      importScripts(cfg.base + 'pyodide.js');
      log('importScripts OK', 'loadPyodide é ' + typeof loadPyodide);
      P = loadPyodide({ indexURL: cfg.base });
    } catch (e) { postMessage({ initError: 'Falha ao carregar pyodide.js ou chamar loadPyodide: ' + (e && e.message || e) }); return; }
    log('loadPyodide() chamado', 'baixando WebAssembly e biblioteca padrão');
    P.then(function () { log('loadPyodide concluído'); postMessage({ ready: 1 }); }, function (e) { postMessage({ initError: 'loadPyodide rejeitou: ' + (e && e.message || e) }); });
    onmessage = function (ev) {
      var d = ev.data;
      P.then(function (p) { return pyExec(p, d); }).then(function (r) { r.id = d.id; postMessage(r); }, function (x) { postMessage({ id: d.id, fatal: String(x && x.message || x) }); });
    };
  }
  var WSRC = 'var pyExec=' + pyExec.toString() + ';(' + workerMain.toString() + ')(' + JSON.stringify({ base: IP.base }) + ');';
  IP._workerSource = WSRC;

  function startWorker() {
    return new Promise(function (res, rej) {
      if (typeof Worker === 'undefined' || !window.Blob || !window.URL || !URL.createObjectURL) return rej(new Error('Web Workers indisponíveis neste navegador.'));
      var w, done = 0, to;
      try { w = new Worker(URL.createObjectURL(new Blob([WSRC], { type: 'text/javascript' }))); } catch (x) { return rej(new Error('Não foi possível criar o worker: ' + x.message)); }
      IP.log('worker criado');
      function fail(m) { if (done) return; done = 1; clearTimeout(to); try { w.terminate(); } catch (x) {} rej(new Error(m)); }
      to = setTimeout(function () { fail('Tempo esgotado (45 s) aguardando o Pyodide no worker.'); }, 45000);
      w.onerror = function (ev) { fail('Erro no worker: ' + (ev && ev.message || 'falha ao iniciar') + (ev && ev.lineno ? ' (linha ' + ev.lineno + ')' : '')); };
      w.onmessage = function (e) {
        var m = e.data;
        if (m.log) return IP.log('worker: ' + m.log[0], m.log[1]);
        if (m.initError) return fail(m.initError);
        if (m.ready && !done) {
          done = 1; clearTimeout(to);
          res({ mode: 'worker', run: function (d) {
            return new Promise(function (ok) {
              var id = ++seq, t = setTimeout(function () { w.terminate(); RP = null; ok({ out: '', err: 'O programa demorou mais de 8 segundos e foi interrompido. Verifique se há um laço infinito (por exemplo, while True).', vars: {} }); }, LIMIT);
              w.onmessage = function (ev) { var r = ev.data; if (r.log || r.id !== id) return; clearTimeout(t); ok(r.fatal ? { out: '', err: 'Falha ao executar: ' + r.fatal, vars: {} } : r); };
              w.postMessage({ id: id, code: d.code, want: d.want });
            });
          } });
        }
      };
    });
  }
  function startMain() {
    IP.log('thread principal', 'carregando o Pyodide sem worker');
    return new Promise(function (res, rej) {
      var s = document.createElement('script'), to = setTimeout(function () { rej(new Error('Tempo esgotado (60 s) no thread principal.')); }, 60000);
      s.src = IP.base + 'pyodide.js';
      s.onerror = function () { clearTimeout(to); rej(new Error('Não foi possível baixar ' + s.src)); };
      s.onload = function () {
        IP.log('pyodide.js carregado (thread principal)');
        loadPyodide({ indexURL: IP.base }).then(function (p) { clearTimeout(to); IP.log('loadPyodide concluído (thread principal)'); res({ mode: 'main', run: function (d) { return pyExec(p, d); } }); },
          function (e) { clearTimeout(to); rej(new Error('loadPyodide rejeitou: ' + (e && e.message || e))); });
      };
      document.head.appendChild(s);
    });
  }
  IP.load = function (st) {
    if (RP) return RP;
    if (st) st('Carregando o Python no navegador… (só na primeira vez)');
    IP.log('ambiente', location.protocol + ' | contexto seguro=' + window.isSecureContext + ' | Worker=' + (typeof Worker !== 'undefined') + ' | WebAssembly=' + (typeof WebAssembly !== 'undefined') + ' | base=' + IP.base);
    if (location.protocol === 'file:') IP.log('aviso', 'página aberta por file://; se falhar, tente um servidor local (python -m http.server)', 'warn');
    RP = startWorker().catch(function (e) {
      IP.log('worker falhou', e.message, 'error');
      return probe().then(function (pr) {
        if (!pr.cdn) throw new Error('Sem acesso ao Pyodide em ' + IP.base + ' (internet, firewall ou bloqueador de conteúdo?). Causa do worker: ' + e.message);
        IP.log('reserva', 'executando no thread principal (sem o limite de 8 s)', 'warn');
        return startMain();
      });
    }).then(function (ex) { IP.log('pronto', 'modo: ' + ex.mode); return ex; });
    RP.catch(function (e) { IP.log('FALHA FINAL', e.message, 'error'); RP = null; });
    return RP;
  };
  IP.run = function (code, want, st) {
    return IP.load(st).then(function (ex) { return ex.run({ code: code, want: want || [] }); })
      .then(function (r) { return { out: r.out, err: r.err ? friendly(r.err) : null, vars: r.vars }; });
  };
  var FR = [
    [/IndentationError/, function () { return 'Erro de indentação: confira os espaços no começo das linhas (use 4 espaços dentro de if/else).'; }],
    [/SyntaxError/, function () { return 'Erro de sintaxe: o Python não entendeu como o código foi escrito. Confira aspas, parênteses e dois-pontos.'; }],
    [/NameError: name '(.+?)'/, function (m) { return 'O nome "' + m[1] + '" não foi definido. Você criou essa variável antes de usá-la? Confira também maiúsculas e minúsculas.'; }],
    [/ZeroDivisionError/, function () { return 'Divisão por zero não é possível.'; }],
    [/TypeError/, function () { return 'Tipos incompatíveis, por exemplo somar texto com número.'; }]
  ];
  function friendly(msg) {
    var last = String(msg).trim().split('\n').pop();
    for (var i = 0; i < FR.length; i++) { var m = String(msg).match(FR[i][0]); if (m) return FR[i][1](m) + '\n\nDetalhe técnico: ' + last; }
    return 'Ocorreu um erro: ' + last;
  }
  IP.errName = function (s) { var m = String(s || '').match(/(IndentationError|SyntaxError|NameError|TypeError|ZeroDivisionError)/); return m ? m[1] : null; };
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  var RX = /(#.*$)|("[^"\n]*"|'[^'\n]*')|\b(def|return|if|else|elif|for|while|in|import|and|or|not|True|False|None)\b|\b(print|input|len|range|int|str|float)\b(?=\()|(\b\d+(?:\.\d+)?\b)/gm;
  /* Indentação automática: mantém o recuo da linha atual e acrescenta 4 espaços depois de uma linha que termina em ":" */
  IP.indentFor = function (before) {
    var line = before.slice(before.lastIndexOf('\n') + 1), ind = (line.match(/^ */) || [''])[0], code = '', q = null;
    for (var i = 0; i < line.length; i++) { var c = line[i]; if (q) { if (c === q) q = null; } else if (c === '"' || c === "'") q = c; else if (c === '#') break; code += c; }
    return /:\s*$/.test(code) ? ind + '    ' : ind;
  };
  IP.hl = function (t) { return esc(t).replace(RX, function (m, c, s, k, f) { return '<span class="' + (c ? 'c' : s ? 's' : k ? 'k' : f ? 'f' : 's') + '">' + m + '</span>'; }); };
  IP.editor = function (o) {
    var el = document.createElement('div'); el.className = 'ide';
    el.innerHTML = '<div class="win__bar"><i></i><i></i><i></i><span>' + (o.name || 'codigo.py') + '</span><div class="ide__btns"><button class="btn btn--blue btn--sm" data-a="run" type="button">▶ Executar código</button><button class="btn btn--ghost btn--sm" data-a="reset" type="button">Restaurar código</button><button class="btn btn--ghost btn--sm" data-a="copy" type="button">Copiar código</button></div></div><div class="ed"><div class="gut" aria-hidden="true"></div><div class="ed__box"><pre class="hl" aria-hidden="true"></pre><textarea class="ta" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Editor de código Python"></textarea></div></div><div class="out" aria-live="polite"><span class="out__t">Resultado</span><pre>Clique em “Executar” para ver o resultado.</pre></div>';
    var ta = el.querySelector('.ta'), hl = el.querySelector('.hl'), gut = el.querySelector('.gut'), ed = el.querySelector('.ed'), out = el.querySelector('.out pre'), run = el.querySelector('[data-a=run]');
    function show(t, err, name) {
      out.className = err ? 'err' : ''; out.textContent = t;
      var old = out.parentNode.querySelector('.elink'); if (old) old.remove();
      if (err && name) { var b = document.createElement('button'); b.type = 'button'; b.className = 'elink'; b.textContent = 'Entenda este erro (' + name + ') →'; b.addEventListener('click', function () { if (IP.onErr) IP.onErr(name); }); out.parentNode.appendChild(b); }
    }
    function paint() {
      var t = ta.value, n = t.split('\n').length, nums = [];
      hl.innerHTML = esc(t).replace(RX, function (m, c, s, k, f) { return '<span class="' + (c ? 'c' : s ? 's' : k ? 'k' : f ? 'f' : 's') + '">' + m + '</span>'; }) + '\n';
      for (var i = 1; i <= n; i++) nums.push(i); gut.textContent = nums.join('\n');
      ed.style.height = 'calc(' + (Math.max(n, 3) * 1.7) + 'em + 2rem)';
    }
    ta.addEventListener('input', function () { paint(); if (o.onInput) o.onInput(); });
    ta.addEventListener('scroll', function () { hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft; });
    ta.addEventListener('keydown', function (e) {
      function ins(t) { if (!document.execCommand('insertText', false, t)) { ta.setRangeText(t, ta.selectionStart, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input')); } }
      if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); ins('    '); }
      else if (e.key === 'Tab' && e.shiftKey) { /* recuar: remove até 4 espaços do início da linha */
        e.preventDefault(); var s = ta.selectionStart, st = ta.value.lastIndexOf('\n', s - 1) + 1, m = ta.value.slice(st).match(/^ {1,4}/);
        if (m) { ta.setSelectionRange(st, st + m[0].length); ins(''); ta.setSelectionRange(Math.max(st, s - m[0].length), Math.max(st, s - m[0].length)); }
      } else if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && ta.selectionStart === ta.selectionEnd) {
        e.preventDefault(); ins('\n' + IP.indentFor(ta.value.slice(0, ta.selectionStart)));
      }
    });
    ta.value = o.code || ''; paint();
    var api = {
      el: el, get: function () { return ta.value; }, show: show,
      reset: function () { ta.value = o.code || ''; paint(); show('Exemplo restaurado. Clique em “Executar”.'); },
      run: function () {
        run.disabled = true;
        return IP.run(ta.value, [], function (m) { show(m); }).then(function (r) {
          if (r.err) show((r.out ? r.out + '\n\n' : '') + r.err, 1, IP.errName(r.err)); else show(r.out || '(O código rodou sem exibir nada. Use print() para mostrar um resultado.)');
          if (o.onRun) o.onRun(r);
        }, function (err) { show(IP.failText(err), 1); })
          .then(function () { run.disabled = false; });
      }
    };
    run.addEventListener('click', api.run); var cp = el.querySelector('[data-a=copy]'); cp.addEventListener('click', function () { var done = function (m) { cp.textContent = m; setTimeout(function () { cp.textContent = 'Copiar código'; }, 1600); }; if (navigator.clipboard) navigator.clipboard.writeText(ta.value).then(function () { done('Copiado!'); }, function () { done('Não foi possível copiar'); }); else { ta.select(); try { document.execCommand('copy'); done('Copiado!'); } catch (x) { done('Não foi possível copiar'); } } }); el.querySelector('[data-a=reset]').addEventListener('click', api.reset);
    return api;
  };
})();
