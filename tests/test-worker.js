// Testa o código REAL do worker (gerado por editor.js) com um Pyodide simulado que executa Python de verdade (CPython).
const vm = require('vm'), fs = require('fs'), path = require('path'), { Worker } = require('worker_threads'), assert = require('assert');
const ctx = { console: { log() {}, warn() {}, error() {} }, performance, location: { protocol: 'http:' } };
ctx.window = ctx; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/editor.js'), 'utf8'), ctx);
const SRC = ctx.window.IP._workerSource;
try { new Function(SRC); console.log('✔ código do worker: sintaxe válida'); } catch (e) { console.log('✘ SINTAXE DO WORKER INVÁLIDA:', e.message); process.exit(1); }
assert(SRC.includes(ctx.window.IP.base + '') && ctx.window.IP.base.endsWith('pyodide/v0.26.4/full/'));
console.log('✔ indexURL/base:', ctx.window.IP.base);
const shim = `
const { parentPort } = require('worker_threads'), { spawnSync } = require('child_process');
global.postMessage = m => parentPort.postMessage(m);
parentPort.on('message', m => global.onmessage && global.onmessage({ data: m }));
global.importScripts = u => { if (!/pyodide\\.js$/.test(u)) throw new Error('URL inesperada ' + u); };
global.loadPyodide = async o => { if (!o || !/\\/full\\/$/.test(o.indexURL)) throw new Error('indexURL ausente'); let so, se;
  return { setStdout(c) { so = c.batched; }, setStderr(c) { se = c.batched; },
    toPy() { return { _d: {}, has(k) { return k in this._d; }, get(k) { return this._d[k]; }, destroy() {} }; },
    async runPythonAsync(code, opt) {
      const r = spawnSync('python3', [${JSON.stringify(path.join(__dirname, 'pydriver.py'))}], { input: JSON.stringify({ code, want: global.__want || [] }), encoding: 'utf8' });
      const j = JSON.parse(r.stdout); Object.assign(opt.globals._d, j.vars);
      j.out.split('\\n').filter((x, i, a) => !(i === a.length - 1 && x === '')).forEach(l => so(l));
      if (j.err) throw new Error(j.err); return j.val; } }; };
`;
// o shim precisa saber quais variáveis pedir: repassamos via mensagem (want) sem alterar o código testado
const patched = shim.replace('global.__want || []', 'global.__w || []') + `parentPort.on('message', m => { global.__w = m.want; });\n` + SRC;
const w = new Worker(patched, { eval: true });
const waitMsg = pred => new Promise(res => { const h = m => { if (pred(m)) { w.off('message', h); res(m); } }; w.on('message', h); });
let id = 0; const run = (code, want = []) => { const i = ++id, p = waitMsg(m => m.id === i); w.postMessage({ id: i, code, want }); return p; };
(async () => {
  const logs = []; w.on('message', m => m.log && logs.push(m.log[0]));
  await waitMsg(m => m.ready); assert(logs.includes('worker iniciado') && logs.includes('importScripts OK')); console.log('✔ worker inicializa e envia "ready"; etapas registradas:', logs.join(' → '));
  let r = await run('print("Olá, mundo!")\nprint(2 + 3)'); assert.strictEqual(r.out, 'Olá, mundo!\n5'); assert.strictEqual(r.err, null); console.log('✔ print() em várias linhas →', JSON.stringify(r.out));
  r = await run('2 + 3'); assert.strictEqual(r.out, '5'); console.log('✔ valor da última expressão →', r.out);
  r = await run('print(Print("x"))'); assert(/NameError/.test(r.err)); console.log('✔ erro de execução é devolvido (NameError)');
  r = await run('print("oi)'); assert(/SyntaxError/.test(r.err)); console.log('✔ erro de sintaxe é devolvido (SyntaxError)');
  r = await run('nome = "Ana"\nidade = 17\nprint(nome)', ['nome', 'idade', 'x']); assert.deepStrictEqual(r.vars, { nome: { t: 'str', v: 'Ana' }, idade: { t: 'num', v: 17 } }); console.log('✔ variáveis lidas do namespace →', JSON.stringify(r.vars));
  r = await run('x = 1 / 0'); assert(/ZeroDivisionError/.test(r.err)); console.log('✔ ZeroDivisionError devolvido');
  await w.terminate(); console.log('\nTESTE DO WORKER: tudo OK');
})().catch(e => { console.log('✘ FALHA:', e.message); process.exit(1); });
