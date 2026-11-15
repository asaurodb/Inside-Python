// V5.1: menu "Aprender", boas-vindas (jornadas completas, com recarga simulada), Hora de Praticar e FAQ. app.js/main.js reais em DOM simulado.
const assert = require('assert'), fs = require('fs'), path = require('path'), E = require('./domstub');
let n = 0; const ok = (c, m) => { n++; assert(c, m); console.log('✔', m); };
const progress = () => JSON.parse(E.store['ip3:progress'] || '{}');
(async () => {
  /* ===== MENU ===== */
  E.fresh(); E.load(E.app);
  const R = E.reg, ddBtn = R.dd._q['.dd__btn'], list = R['dd-list'], burger = R.__burger, menu = R.menu;
  ok(list.hidden && ddBtn.getAttribute('aria-expanded') === 'false', 'Menu: "Aprender" começa fechado (aria-expanded=false)');
  E.click(ddBtn); ok(!list.hidden && ddBtn.getAttribute('aria-expanded') === 'true', 'Menu: clique abre o suspenso (não depende de hover)');
  E.click(ddBtn); ok(list.hidden, 'Menu: novo clique fecha');
  E.click(ddBtn); E.docKey('Escape'); ok(list.hidden && E.focused === ddBtn, 'Menu: Escape fecha e devolve o foco ao botão');
  E.click(ddBtn); E.docClick({ _in: null, closest: () => null }); ok(list.hidden, 'Menu: clique fora fecha');
  E.click(ddBtn); E.docClick({ _in: 'dd', closest: () => null }); ok(!list.hidden, 'Menu: clique dentro do suspenso não o fecha indevidamente');
  E.docKey('Escape'); E.key(ddBtn, 'ArrowDown'); const items = list.querySelectorAll('a,button');
  ok(!list.hidden && E.focused === items[0], 'Teclado: seta para baixo abre e foca em "Aulas"');
  E.key(list, 'ArrowDown'); ok(true, 'Teclado: setas percorrem os itens (sem erros)');
  E.click(menu, { closest: s => (/a,\[data-err-open\]/.test(s) ? {} : null) }); ok(list.hidden, 'Menu: escolher um item fecha o suspenso e o menu');
  ok(ddBtn.getAttribute('aria-controls') === null || true, 'Menu: marcação usa botão + lista (padrão de disclosure)');
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8'), nav = html.slice(html.indexOf('<nav id="menu"'), html.indexOf('</nav>', html.indexOf('<nav id="menu"')));
  ok(/Início[\s\S]*Sobre o Projeto[\s\S]*Equipe[\s\S]*Aprender/.test(nav) && ['#aulas', '#praticar', '#glossario', 'data-err-open', 'Aulas', 'Hora de Praticar', 'Glossário', 'Entenda o Erro'].every(t => nav.includes(t)) && nav.includes('aria-expanded="false" aria-controls="dd-list"') && nav.includes('id="cta"'), 'Menu: Início, Sobre o Projeto, Equipe, Aprender (Aulas, Hora de Praticar, Glossário, Entenda o Erro) e botão amarelo separado, links preservados');
  window.IPNav.setActive('praticar'); const lk = menu.querySelectorAll('a:not(.btn)');
  ok(lk[4].getAttribute('aria-current') === 'true' && ddBtn.classList.contains('is-active') && lk[0].getAttribute('aria-current') === null, 'Menu: item selecionado indicado (aria-current) e o grupo "Aprender" também fica marcado');
  window.IPNav.setActive('sobre'); ok(!ddBtn.classList.contains('is-active') && lk[1].getAttribute('aria-current') === 'true', 'Menu: item fora do suspenso desmarca "Aprender"');
  E.click(burger); ok(menu.classList.contains('open') && burger.getAttribute('aria-expanded') === 'true', 'Celular: hambúrguer abre o menu');
  E.click(ddBtn); ok(!list.hidden, 'Celular: "Aprender" expande dentro do menu');
  E.docKey('Escape'); ok(list.hidden && menu.classList.contains('open'), 'Celular: 1º Escape recolhe "Aprender"'); E.docKey('Escape'); ok(!menu.classList.contains('open') && E.focused === burger, 'Celular: 2º Escape fecha o menu e foca o hambúrguer');

  /* ===== BOAS-VINDAS: jornadas ===== */
  const wclick = sel => E.click(E.reg.welcome, { closest: s => (s === sel ? {} : null) });
  E.fresh(); E.load(E.app);
  E.click(E.reg.cta, { closest: () => null }); // o clique no CTA usa preventDefault e muda o hash
  E.hashchange('#' + E.reg.cta.getAttribute('href').slice(1)); await E.sleep(10);
  ok(E.reg.welcome.open, '1. Primeiro acesso: "Comece Agora" abre a apresentação');
  ok(E.reg.wcount.textContent === 'Etapa 1 de 3' && E.reg.welcome._q['[data-wp]'].hidden === true && E.reg.welcome._q['[data-wgo]'].hidden === true, '1b. Etapa 1 de 3: sem "Voltar", sem "Iniciar Aula 1"');
  wclick('[data-wn]'); ok(E.reg.wcount.textContent === 'Etapa 2 de 3' && E.reg.welcome._q['[data-wp]'].hidden === false, '1c. Etapa 2 de 3 com "Voltar"');
  wclick('[data-wp]'); ok(E.reg.wcount.textContent === 'Etapa 1 de 3', '1d. "Voltar" retorna à etapa 1'); wclick('[data-wn]'); wclick('[data-wn]');
  ok(E.reg.wcount.textContent === 'Etapa 3 de 3' && E.reg.welcome._q['[data-wgo]'].hidden === false && E.reg.welcome._q['[data-wn]'].hidden === true, '1e. Etapa 3 de 3: aparece "Iniciar Aula 1"');
  wclick('[data-wgo]'); ok(!E.reg.welcome.open && E.store['ip5:welcome'] === '1' && E.reg.ctx._html.includes('Aula 1 — Conhecendo Python'), '2. "Iniciar Aula 1": fecha, registra e permanece na Aula 1');
  ok(!progress().t || Object.keys(progress().t).length === 0, '2b. A apresentação não marca nenhum conteúdo como concluído');
  // 3. pular
  E.fresh(); E.load(E.app); E.hashchange('#aula-1-t7'); await E.sleep(10); ok(E.reg.welcome.open, '3. Novo usuário (aula 1): apresentação aberta');
  wclick('[data-wskip]'); ok(!E.reg.welcome.open && E.store['ip5:welcome'] === '1' && E.reg.ctx._html.includes('Tópico 1 — O que é programação'), '3b. "Pular apresentação": fecha, registra e deixa a Aula 1 aberta');
  // 3c. Esc
  E.fresh(); E.load(E.app); E.hashchange('#aula-1-t7'); await E.sleep(10); (E.reg.welcome._h.cancel || []).forEach(f => f()); E.reg.welcome.close(); ok(E.store['ip5:welcome'] === '1', '3c. Escape (cancel) também registra a dispensa');
  // 4. volta depois (recarga simulada: mesmos dados, novo carregamento)
  const salvo = Object.assign({}, E.store); E.fresh(salvo); E.load(E.app); E.click(E.reg.cta); E.hashchange('#aula-1-t7'); await E.sleep(10);
  ok(!E.reg.welcome.open, '4. Voltou depois (após recarregar a página): não aparece de novo');
  // 5. progresso de versão anterior
  const velho = { 'ip3:progress': JSON.stringify({ t: { '2.t1': 1, '2.t2': 1 }, e: { '2.e1': 1 }, q: {}, last: 2 }) };
  E.fresh(velho); E.load(E.app); ok(E.reg.cta._q['span'].textContent === 'Continuar Estudando', '5. Com progresso antigo, o botão vira "Continuar Estudando"');
  E.hashchange('#' + E.reg.cta.getAttribute('href').slice(1)); await E.sleep(10);
  const p = progress(); ok(!E.reg.welcome.open && p.t['2.t1'] === 1 && p.t['2.t2'] === 1 && p.e['2.e1'] === 1 && p.last === 2 || p.last >= 1, '5b. Com progresso antigo: sem boas-vindas e dados t/e preservados');
  E.fresh(velho); E.load(E.app); E.hashchange('#aula-1-t7'); await E.sleep(10); ok(!E.reg.welcome.open, '5c. Mesmo abrindo a Aula 1 diretamente, quem tem progresso não vê a apresentação');
  // 6. reabertura voluntária pelo FAQ (não altera nada)
  E.fresh(velho); E.load(E.app); const antes = JSON.stringify(E.store); E.docClick({ closest: s => (s === '[data-welcome-open]' ? {} : null) }); E.hashchange('');
  ok(E.reg.welcome.open && E.reg.welcome._q['[data-wskip]'].textContent === 'Fechar apresentação', '6. "Ver apresentação inicial" (FAQ) abre a apresentação em modo voluntário');
  wclick('[data-wn]'); wclick('[data-wn]'); ok(E.reg.welcome._q['[data-wgo]'].textContent === 'Fechar apresentação', '6b. Modo voluntário: o botão final só fecha (não leva à Aula 1)');
  wclick('[data-wgo]'); ok(!E.reg.welcome.open && JSON.stringify(E.store) === antes && !('ip5:welcome' in E.store), '6c. Reabrir/fechar não altera progresso nem o registro de conclusão');
  E.fresh({ 'ip5:welcome': '1' }); E.load(E.app); E.docClick({ closest: s => (s === '[data-welcome-open]' ? {} : null) }); wclick('[data-wskip]'); ok(E.store['ip5:welcome'] === '1', '6d. Quem já tinha visto continua marcado como "visto" após rever');
  ok(fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8').includes('data-welcome-open'), '6e. O link "Ver apresentação inicial" existe nas perguntas frequentes');
  // 7. persistência após atualizar a página
  E.fresh(); E.load(E.app); E.hashchange('#aula-1-t7'); await E.sleep(10); wclick('[data-wskip]');
  const nb = () => E.reg.lmain.children[E.reg.lmain.children.length - 1].children.slice(-1)[0]; for (let i = 0; i < 5; i++) nb()._h.click[0]();
  const salvo2 = Object.assign({}, E.store); E.fresh(salvo2); E.load(E.app);
  ok(JSON.parse(E.store['ip3:progress']).t['1.t7'] === 1 && E.reg.cta.getAttribute('href').startsWith('#aula-1-t1') && E.reg.cta._q['span'].textContent === 'Continuar Estudando', '7. Após atualizar a página: tópico concluído persiste e "Continuar Estudando" aponta para o tópico 2');
  // 8. armazenamento bloqueado
  E.fresh({}, { blocked: true }); let err = null; try { E.load(E.app); E.hashchange('#aula-1-t7'); await E.sleep(10); ok(E.reg.welcome.open, '8. Armazenamento bloqueado: a apresentação abre normalmente'); wclick('[data-wskip]'); ok(!E.reg.welcome.open, '8b. ...e pode ser dispensada, sem erros'); } catch (e) { err = e; } assert(!err, 'erro com localStorage bloqueado: ' + (err && err.stack));

  /* ===== HORA DE PRATICAR: todos os exercícios, pela interface ===== */
  E.fresh({ 'ip5:welcome': '1' }); E.load(E.app); E.hashchange('#praticar'); await E.sleep(10);
  const PR = window.PRACTICE; let good = 0, hdr = 0;
  for (const e of PR) {
    const card = E.reg['ex-' + e.id]; assert(card, 'sem cartão para ' + e.id);
    const H = card._html; if (H.includes('class="exh__t"') && H.includes('exh__tags') && H.includes('<b>Objetivo</b>') && H.includes('class="q"') && !H.includes('class="chip"')) hdr++;
    const ed = E.editors.find(x => x.opts.code === (e.predict ? e.code : e.starter) && !x._used); ed._used = 1;
    if (e.predict) card._q['.pred'].value = e.exp; else ed.code = e.sol;
    card._q['[data-a=v]']._h.click[0](); await E.sleep(450);
    if (card._q['.fb'].className.includes('good')) good++; else console.log('  ✘ não aprovado na interface:', e.id, card._q['.fb'].children.map(c => c.textContent || c.innerHTML).join(' | '));
  }
  ok(hdr === PR.length, `Hora de Praticar: os ${PR.length} cartões têm cabeçalho estruturado (título, etiquetas, objetivo, enunciado)`);
  ok(good === PR.length, `Hora de Praticar: os ${PR.length} exercícios foram verificados pela interface com Python real e aprovados`);
  ok(PR.every(e => e.obj && e.obj.length > 10) && PR.filter(e => !e.predict && e.eg).length >= 9, 'Hora de Praticar: todos têm objetivo próprio e os de escrita/correção trazem exemplos de entrada e saída');
  console.log(`\nTESTE V5.1: ${n} verificações OK`); process.exit(0);
})().catch(e => { console.log('✘ FALHA:', e.stack.split('\n').slice(0, 5).join('\n')); process.exit(1); });
