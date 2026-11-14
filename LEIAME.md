# Inside Python V3

Executar: abra `index.html` (precisa de internet para as fontes e para o Python/Pyodide).
Publicar: envie a pasta para o GitHub Pages ou a Vercel (site estático, sem backend).

## Adicionar conteúdo (só editar `js/lessons.js`)
- **Vídeo**: preencha `video:'https://www.youtube.com/watch?v=...'` na aula. Vazio = "Vídeo em breve".
- **Aula nova**: copie um bloco `{id, title, short, state:'ready', video, goal, topics, ex, sum}`. Use `state:'dev'` para "Em desenvolvimento".
- **Exercício**: `check.cases` define os testes: `set` (troca a linha `variavel = ...`), `num` (números esperados na saída, em ordem), `has`/`no` (palavras que devem/não devem aparecer), `lines` (mínimo de linhas); `vars` confere variáveis; `src` exige um trecho no código.
- O progresso fica no `localStorage` (chave `ip3:progress`).

## Novidades da V4
- `js/lessons2.js`: tópicos extras, exercícios por nível/formato, revisão (5 questões por aula), "Hora de Praticar" (`PRACTICE`) e glossário (`GLOSS`).
- Campos de exercício: `lvl`, `kind`, `why` (explicação ao acertar), `exp` (saída esperada), `predict:1` + `code` (preveja o resultado). Em `set`, use `true`/`false` para booleanos.
- Revisão: `quiz:[{q, o:[opções], a:índice, w:explicação}]` na aula. Revisão do tópico: campo `r`.
- Glossário: em um tópico, `<a href="#" class="gt" data-t="chave">termo</a>` abre a definição sem sair da aula.
- O Python roda em um Web Worker; programas que passam de 8 s são interrompidos.

## Diagnóstico do Python (se o editor não executar)
1. Abra `diagnostico.html` no mesmo lugar do problema (arquivo local, servidor local ou Netlify) e clique em "Executar diagnóstico". Ele testa: ambiente, WebAssembly, acesso a cada arquivo do Pyodide, `loadPyodide()`, execução real de Python e Web Worker.
2. No site, o console do navegador (F12) mostra cada etapa com o prefixo `[Inside Python]`; em caso de falha, o painel "Resultado" do editor exibe o mesmo diagnóstico.
3. Para hospedar o Pyodide no próprio site (sem CDN), baixe a distribuição `pyodide-0.26.4.tar.bz2` em github.com/pyodide/pyodide/releases, extraia em `pyodide/` e adicione, antes dos outros scripts do `index.html`: `<script>window.IP_PYODIDE_BASE='pyodide/';</script>`.
4. Testes automáticos (precisam de Node e Python 3, sem internet): `node tests/test-worker.js` e `node tests/test-verify.js`.

## Logo e arquivos de identidade (`images/`)
- `logo-dark.svg` (para fundos escuros), `logo-light.svg` (fundos claros), `logo-symbol.svg` (só o símbolo), `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`. Todos com fundo transparente, exceto os ícones PNG de 180/512 px, que têm fundo azul-marinho.
- No cabeçalho e no rodapé, o símbolo é SVG embutido (`<symbol id="py">` no início do `index.html`) e o nome é texto na fonte Sora, por isso fica nítido em qualquer tela. Nos arquivos `logo-*.svg` o nome é texto SVG com Sora e fontes de reserva; se precisar de um arquivo "à prova de fonte" para impressão, abra-o no Figma/Inkscape e converta o texto em curvas.
- A logo anterior foi guardada em `images/legado/logo-original.png`.

## Botão "Comece Agora" inteligente
- Destino: `#aula-N-tX` (tópico), `#aula-N-eX` (exercício), `#aula-N-quiz` (revisão) ou `#praticar`. Esses endereços funcionam como links diretos.
- Regras (em `js/app.js`, bloco "Retomada"): sem progresso → Aula 1, tópico 1 · exercício iniciado e não concluído (mais recente que a última conclusão) → esse exercício · senão, o ponto onde o estudante parou, se ainda estiver pendente · senão, o primeiro item pendente da aula atual · aula concluída → próxima aula com pendências (volta às anteriores se as seguintes estiverem prontas) · tudo concluído → Hora de Praticar.
- Abrir um tópico NÃO o marca como concluído; só os botões "Marcar como concluído", os exercícios verificados e a revisão (≥ 60%) contam.
- Armazenamento: mesma chave `ip3:progress`. Foram acrescentados `a` (tentativas), `pos` (última posição) e `at` (última conclusão); dados antigos continuam válidos.
- Teste: `node tests/test-resume.js`.

## V5 — ambiente de estudo por etapas
- **Etapas por tópico:** Entenda → Observe → Experimente → Pratique → Revise. Em "Estudo guiado" aparece uma etapa por vez; em "Navegação livre", todas as etapas do tópico. Mesmo conteúdo e mesmo progresso nos dois modos; nada é bloqueado.
- **Onde editar o conteúdo:** `js/lessons.js` e `js/lessons2.js` (textos, exemplos, exercícios, revisões) e `js/lessons3.js` (camada didática: `ob` = explicação linha a linha do 1º exemplo de cada tópico, `tr` = o que modificar, `vis` = figura, `tp` = tópico de cada exercício/pergunta, erros comuns, prática por tema).
- **Resultados do "Observe":** `js/outputs.js` é gerado com Python real: depois de editar um exemplo, rode `node tools/gen-outputs.js`.
- **Dicas progressivas:** 1) conceito (resumo do tópico), 2) estratégia (campo `hint`), 3) estrutura da solução com lacunas (gerada automaticamente a partir de `sol`).
- **Boas-vindas:** aparece uma única vez, ao entrar na Aula 1 sem progresso (chave `ip5:welcome`). Modo de estudo: `ip5:mode`. Progresso: `ip3:progress` (inalterada).
- **Testes** (Node + Python 3, sem internet): `node tests/test-smoke.js` (interface em DOM simulado), `test-verify.js`, `test-resume.js`, `test-welcome.js`, `test-data.js`, `test-worker.js`.

## V5.1 — correções
- **Hora de Praticar:** a sobreposição vinha de uma colisão de classes (os botões de tema usavam `.chip`, que no hero é um elemento flutuante posicionado de forma absoluta). Botões renomeados para `.tchip` e cabeçalho do exercício refeito em grade (número · título + etiquetas · "Concluído"). A classe `.stage` do estudo guiado, que colidia com o contêiner do hero, virou `.stg-wrap`.
- **Menu:** Início · Sobre o Projeto · Equipe · **Aprender** (Aulas, Hora de Praticar, Glossário, Entenda o Erro) + botão amarelo separado. O suspenso abre por clique ou teclado (Enter/Espaço, ↓ ↑ Home End), fecha com Esc, clique fora ou ao escolher um item; marca o item atual (`aria-current`). No celular, "Aprender" expande dentro do menu.
- **Boas-vindas:** abre ao entrar na Aula 1 sem nenhum histórico (conclusões, tentativas ou posição salva) e sem o registro `ip5:welcome`. Quem tem progresso de versões anteriores não a vê, e nenhum dado é apagado. Para testar: apague `ip3:progress` e `ip5:welcome` do localStorage, ou use o link "Ver apresentação inicial" nas perguntas frequentes (reabre sem alterar progresso nem o registro).
- **Auditoria:** `node tests/test-css.js` (colisões de classes, `[hidden]`, contraste WCAG, larguras fixas) e `node tests/test-v51.js` (menu, boas-vindas, persistência, os 12 exercícios de prática pela interface).
