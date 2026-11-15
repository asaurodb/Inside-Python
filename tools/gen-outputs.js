// Gera js/outputs.js: resultado real (CPython) do 1º exemplo de cada tópico, usado na etapa "Observe". Rode: node tools/gen-outputs.js
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
global.window = {}; ['lessons.js', 'lessons2.js', 'lessons3.js', 'curriculo.js'].forEach(f => eval(fs.readFileSync(path.join(__dirname, '../js', f), 'utf8')));
const O = {};
window.LESSONS.forEach(l => l.topics.forEach(t => { if (!t.ex) return;
  const r = JSON.parse(spawnSync('python3', [path.join(__dirname, '../tests/pydriver.py')], { input: JSON.stringify({ code: t.ex[0] }), encoding: 'utf8' }).stdout);
  const lines = r.out.replace(/\n$/, '').split('\n').filter((x, i, a) => !(a.length === 1 && x === '')); if (r.val !== null && r.val !== undefined) lines.push(String(r.val));
  O[l.id + '.' + t.id] = r.err ? { e: (r.err.match(/(\w+Error)/) || [, 'Error'])[1] } : { o: lines.join('\n') }; }));
fs.writeFileSync(path.join(__dirname, '../js/outputs.js'), '/* gerado por tools/gen-outputs.js: não editar */\nwindow.OUTS = ' + JSON.stringify(O, null, 1) + ';\n');
console.log(Object.keys(O).length + ' resultados gerados');
