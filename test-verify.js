// Executa a função REAL de verificação (extraída de app.js) contra todos os exercícios, com Python de verdade (CPython).
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
global.window = {}; eval(fs.readFileSync(path.join(__dirname, '../js/lessons.js'), 'utf8')); eval(fs.readFileSync(path.join(__dirname, '../js/lessons2.js'), 'utf8'));
const app = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
const chunk = app.slice(app.indexOf('function lit('), app.indexOf('/* ---- Exercício padronizado ---- */'));
const IP = { run: (code, want) => { const r = spawnSync('python3', [path.join(__dirname, 'pydriver.py')], { input: JSON.stringify({ code, want: want || [] }), encoding: 'utf8' }); const j = JSON.parse(r.stdout);
  const vars = {}; for (const k in j.vars) vars[k] = { t: typeof j.vars[k] === 'string' ? 'str' : typeof j.vars[k] === 'number' ? 'num' : 'o', v: j.vars[k] };
  return Promise.resolve({ out: j.out.replace(/\n$/, '') + (j.val !== null && j.val !== undefined ? '\n' + j.val : ''), err: j.err, vars }); } };
const verify = new Function('IP', chunk + '; return verify;')(IP);
(async () => {
  let n = 0, bad = 0; const all = [];
  window.LESSONS.forEach(l => l.ex.forEach(e => all.push(['A' + l.id, e]))); window.PRACTICE.forEach(e => all.push(['Prática', e]));
  for (const [tag, e] of all) {
    n++;
    if (e.predict) {
      const ok = await verify(e, '', e.exp), no = await verify(e, '', 'resposta errada 999');
      if (!ok.ok || no.ok) { bad++; console.log('✘', tag, e.id, 'predict', ok, no); } continue;
    }
    const good = await verify(e, e.sol);
    if (!good.ok) { bad++; console.log('✘ solução rejeitada:', tag, e.id, good.msg); }
    const st = await verify(e, e.starter);
    if (st.ok) { bad++; console.log('✘ código inicial aprovado indevidamente:', tag, e.id); }
  }
  console.log(`✔ ${n - bad}/${n} exercícios: solução aceita e código inicial/previsão errada rejeitados`);
  // soluções ALTERNATIVAS corretas devem passar; respostas "viciadas" (só imprimem o texto esperado) devem falhar
  const L = window.LESSONS, find = (a, id) => L[a - 1].ex.find(e => e.id === id);
  const alt = [
    [find(3, 'e2'), 'a = 17\nb = 5\nq = a // b\nr = a - q * b\nprint(q)\nprint(r)', true, 'quociente/resto por outro caminho'],
    [find(4, 'e1'), 'numero = 5\nif numero == 0:\n    print("zero")\nelif numero > 0:\n    print("positivo")\nelse:\n    print("negativo")', true, 'ordem diferente dos if'],
    [find(2, 'e3'), 'a = 4\nb = 7\nc = 10\nsoma = c + b + a\nprint(soma)', true, 'soma em outra ordem'],
    [find(4, 'e1'), 'numero = 5\nprint("positivo")', false, 'resposta fixa (sem condições)'],
    [find(3, 'e2'), 'a = 17\nb = 5\nprint(3)\nprint(2)', false, 'números fixos'],
    [find(5, 'e2'), 'a = 8\nb = 2\noperacao = "+"\nprint(10)', false, 'sempre imprime 10'],
    [find(2, 'e1'), 'nome = ""\nidade = 0\nprint(nome)\nprint(idade)', false, 'variável vazia'],
    [find(4, 'e6'), 'nota = 8\nif nota >= 7\n    print("Aprovado")', false, 'erro de sintaxe não corrigido']];
  for (const [e, code, expect, why] of alt) { const r = await verify(e, code); const ok = !!r.ok === expect; if (!ok) bad++; console.log(ok ? '✔' : '✘', expect ? 'aceita' : 'rejeita', '-', why, ok ? '' : r.msg); }
  console.log(bad ? `\nFALHAS: ${bad}` : '\nTESTE DE VERIFICAÇÃO: tudo OK'); process.exit(bad ? 1 : 0);
})();
