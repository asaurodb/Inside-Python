(function () {
  'use strict';
  var VIDEO = 'https://www.youtube.com/watch?v=JPrPa5QK5l8';
  var $ = function (id) { return document.getElementById(id); };

  /* Menu: hambúrguer (celular) + suspenso "Aprender" (clique e teclado) */
  var btn = document.querySelector('.nav__btn'), menu = $('menu'), dd = $('dd'), ddBtn = dd.querySelector('.dd__btn'), ddList = $('dd-list');
  function setDD(o) {
    ddBtn.setAttribute('aria-expanded', o); ddList.hidden = !o; dd.classList.toggle('open', o);
    dd.classList.remove('dd--right');
    if (o) { var r = ddList.getBoundingClientRect(); if (r && r.right > window.innerWidth - 8) dd.classList.add('dd--right'); }
  }
  function ddOpen() { return ddBtn.getAttribute('aria-expanded') === 'true'; }
  function setMenu(o) { btn.setAttribute('aria-expanded', o); btn.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu'); menu.classList.toggle('open', o); if (!o) setDD(false); }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  ddBtn.addEventListener('click', function () { setDD(!ddOpen()); });
  ddBtn.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { e.preventDefault(); setDD(true); var it = ddList.querySelectorAll('a,button'); if (it[0]) it[0].focus(); } });
  ddList.addEventListener('keydown', function (e) {
    var it = [].slice.call(ddList.querySelectorAll('a,button')), i = it.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); it[(i + 1) % it.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); it[(i - 1 + it.length) % it.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); it[0].focus(); } else if (e.key === 'End') { e.preventDefault(); it[it.length - 1].focus(); }
  });
  dd.addEventListener('focusout', function (e) { if (ddOpen() && e.relatedTarget && !dd.contains(e.relatedTarget)) setDD(false); });
  document.addEventListener('click', function (e) { if (ddOpen() && !dd.contains(e.target)) setDD(false); });
  menu.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('a,[data-err-open]'); if (t) { setDD(false); setMenu(false); } });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (ddOpen()) { setDD(false); ddBtn.focus(); } else if (btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); }
  });

  /* Barra de progresso */
  var bar = $('progress');
  function prog() { var h = document.documentElement; bar.style.transform = 'scaleX(' + (h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)) + ')'; }
  addEventListener('scroll', prog, { passive: true }); prog();

  /* Item selecionado no menu (seção visível na página inicial; aulas e prática pelas rotas do app.js) */
  var map = { inicio: 'inicio', porque: 'sobre', sobre: 'sobre', equipe: 'equipe', aulas: 'aulas', pratique: 'aulas', caminho: 'aulas', 'praticar-home': 'praticar', glossario: 'glossario' };
  var links = {}; menu.querySelectorAll('a:not(.btn)').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  function setActive(key) {
    Object.keys(links).forEach(function (k) { links[k].classList.remove('is-active'); links[k].removeAttribute('aria-current'); });
    ddBtn.classList.remove('is-active');
    var l = key && links[key]; if (!l) return;
    l.classList.add('is-active'); l.setAttribute('aria-current', 'true'); if (dd.contains(l)) ddBtn.classList.add('is-active');
  }
  window.IPNav = { setActive: setActive, closeAll: function () { setDD(false); setMenu(false); } };
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) setActive(map[e.target.id]); }); }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = $(id); if (s) so.observe(s); });
    var ro = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }); }, { threshold: .12 });
    document.querySelectorAll('.rv').forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; ro.observe(el); });
  } else document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });

  /* Videoaula: incorpora; se o ambiente bloquear o player, abre o YouTube */
  var note = $('note'), player = $('player'), embedded = false;
  function ytLink() { return '<a href="' + VIDEO + '" target="_blank" rel="noopener noreferrer">assista no YouTube</a>'; }
  function openYT() { window.open(VIDEO, '_blank', 'noopener'); note.hidden = false; note.innerHTML = 'Abrimos a videoaula em uma nova aba. Se não abriu, ' + ytLink() + '.'; }
  document.addEventListener('securitypolicyviolation', function () { if (embedded) { embedded = false; var f = player.querySelector('iframe'); if (f) f.remove(); openYT(); } });
  function watch() {
    if (embedded) return;
    var id = VIDEO.match(/[?&]v=([\w-]{11})/)[1], f = document.createElement('iframe');
    f.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
    f.title = 'Videoaula – Aula 1: Introdução ao Python'; f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
    embedded = true; player.appendChild(f); player.querySelector('.play').hidden = true;
    note.hidden = false; note.innerHTML = 'Se o vídeo não carregar, ' + ytLink() + '.';
  }
  $('playBtn').addEventListener('click', watch); $('watchBtn').addEventListener('click', watch);

  })();
