/* CURRÍCULO REVISADO (V5.2) — carregado depois de lessons.js, lessons2.js e lessons3.js: sobrescreve os textos
   (Entenda), exemplos, explicações do Observe, sugestões do Experimente e resumos (Revise) de cada tópico, reordena
   e acrescenta tópicos, e revisa enunciados e dicas dos exercícios. As IDs dos tópicos e exercícios foram mantidas
   para preservar o progresso já salvo pelos estudantes. */
(function () {
  var L = window.LESSONS;
  function T(i, id) { return L[i - 1].topics.filter(function (t) { return t.id === id; })[0]; }
  function S(i, id, o) { var t = T(i, id); if (!t) { t = { id: id }; L[i - 1].topics.push(t); } for (var k in o) t[k] = o[k]; return t; }
  function ORD(i, ids) { L[i - 1].topics = ids.map(function (id) { return T(i, id); }); }
  function EX(i, id, o) { var e = L[i - 1].ex.filter(function (x) { return x.id === id; })[0]; for (var k in o) e[k] = o[k]; }
  function Q(i, q) { L[i - 1].quiz.push(q); }
  function J(a) { return a.join('\n'); }
  L.forEach(function (l) { delete l.video; });

  /* ================= AULA 1 — Conhecendo Python ================= */
  L[0].goal = 'Entender o que é programar e escrever seus primeiros programas com print().';
  L[0].short = 'O que é programar e os primeiros programas.';
  S(1, 't7', { t: 'O que é programação', r: 'Um programa é uma lista de instruções; a linguagem de programação é o idioma usado para escrevê-las.',
    h: `<p>Programar é <b>dar instruções claras a um computador</b>. Ele é muito rápido, mas só faz exatamente o que mandamos: não adivinha nada.</p>
<p>Pense em uma receita de bolo: uma lista de passos, em ordem, que qualquer pessoa pode seguir. Um <b><a href="#" class="gt" data-t="programa">programa</a></b> é uma receita para o computador.</p>
<p>Computadores não entendem português. Por isso usamos uma <b>linguagem de programação</b>: um conjunto de palavras e regras para escrever essas instruções de um jeito que o computador consiga ler.</p>
<div class="tip"><b>Em resumo:</b> programa = lista de instruções · linguagem de programação = o "idioma" em que as instruções são escritas.</div>` });
  S(1, 't1', { t: 'O que é Python e para que serve', r: 'Python é uma linguagem legível, usada em sites, automação, dados e inteligência artificial.',
    h: `<p><b>Python</b> é uma linguagem de programação criada por Guido van Rossum e lançada em 1991. O nome vem de um grupo de humor britânico, o Monty Python, e não da cobra.</p>
<p>Ela é muito escolhida por iniciantes porque o código é fácil de ler. Compare: <code>print("Olá")</code> quase diz, em português, "mostre Olá".</p>
<p>Python é usada em muitas áreas: criação de sites e sistemas, <b>automação</b> de tarefas repetitivas, análise de dados e inteligência artificial. Você vai começar pelo básico, que é a base de todas elas.</p>` });
  S(1, 't2', { t: 'Como um programa funciona', r: 'O Python executa as linhas de cima para baixo; o que o programa mostra aparece na saída.',
    h: `<p>Quando você executa um programa, o <b><a href="#" class="gt" data-t="interpretador">interpretador</a></b> do Python lê o código <b>de cima para baixo, uma linha de cada vez</b>, e faz o que cada linha manda.</p>
<p>A <b>ordem importa</b>: se a linha 2 depende da linha 1, a linha 1 precisa vir antes.</p>
<p>O que o programa mostra aparece em uma área chamada <b>saída</b>. No editor do Inside Python, a saída fica logo abaixo do código, em "Resultado".</p>`,
    ex: [J(['print("Primeiro")', 'print("Segundo")', 'print("Terceiro")'])], ob: 'Primeira instrução: aparece primeiro na saída. | Segunda instrução: aparece depois. | Terceira: aparece por último. A ordem do código é a ordem da saída.',
    tr: 'Troque a ordem das linhas e execute de novo. A saída muda de ordem junto: por exemplo, "Terceiro" passa a aparecer primeiro.' });
  S(1, 't3', { t: 'Python como calculadora', r: 'Os símbolos + - * / fazem contas; o editor mostra o valor da última linha.',
    h: `<p>Antes de escrever programas maiores, use o Python como uma calculadora. Os símbolos das contas, chamados <b>operadores</b>, são:</p>
<ul><li><code>+</code> soma</li><li><code>-</code> subtrai</li><li><code>*</code> multiplica (o asterisco faz o papel do ×)</li><li><code>/</code> divide</li></ul>
<p>No editor, o valor da <b>última linha</b> do código é mostrado automaticamente. Você estudará todos os operadores com calma na Aula 3.</p>`,
    ex: ['2 + 3'], ob: 'O Python calcula 2 + 3 e o editor mostra o resultado: 5.', tr: 'Troque o + por *. O resultado esperado passa a ser 6. Depois, tente - e /.' });
  S(1, 't4', { t: 'A função print()', r: 'print() mostra algo na tela; o texto vai entre aspas.',
    h: `<p>Um programa precisa <b>mostrar</b> resultados. Para isso usamos o <code>print()</code>.</p>
<p><code>print</code> é uma <b><a href="#" class="gt" data-t="funcao">função</a></b>: um comando com nome que realiza uma tarefa. Os parênteses guardam o que queremos mostrar.</p>
<p>O texto vai entre <b>aspas</b>. As aspas avisam ao Python: "isto é um texto; mostre exatamente assim".</p>
<div class="tip">Este é o primeiro programa de quase todo programador: mostrar "Olá, mundo!".</div>`,
    ex: ['print("Olá, mundo!")'], ob: 'print() mostra algo na tela. O texto entre aspas aparece exatamente como foi escrito.', tr: 'Troque o texto entre aspas por uma frase sua e execute. A saída passa a mostrar a sua frase.' });
  S(1, 't5', { t: 'Textos (strings) e mensagens', r: 'Textos ficam entre aspas; vírgulas juntam as partes com um espaço; # inicia um comentário.',
    h: `<p>Em programação, um texto se chama <a href="#" class="gt" data-t="string">string</a>. Ele fica entre aspas duplas (<code>"..."</code>) ou simples (<code>'...'</code>); abra e feche com o mesmo tipo.</p>
<p>O <code>print()</code> aceita várias partes separadas por <b>vírgula</b> e coloca <b>um espaço</b> entre elas. Números não levam aspas.</p>
<p>Uma linha que começa com <code>#</code> é um <b><a href="#" class="gt" data-t="comentario">comentário</a></b>: o Python a ignora. Serve para explicar o código a quem lê.</p>`,
    ex: [J(['# Veja na prática', 'print("Olá!")', "print('Aspas simples também funcionam')", 'print("Meu nome é", "Ana")', 'print("Tenho", 17, "anos")'])],
    ob: 'Comentário: começa com # e o Python o ignora. | Mostra um texto entre aspas duplas. | Aspas simples também criam textos. | A vírgula junta as partes e coloca um espaço entre elas. | Um número pode vir junto do texto, sem aspas.',
    tr: 'Troque "Ana" pelo seu nome e 17 pela sua idade. As duas últimas linhas da saída passam a mostrar os seus dados.' });
  S(1, 't6', { t: 'Erros de programação', r: 'Erro não é fracasso: leia a mensagem, ache a linha e corrija aspas, parênteses ou maiúsculas.',
    h: `<p>Todo programador comete erros, e isso é normal. Quando o Python não entende o código, ele para e mostra uma <b>mensagem de erro</b>. Ela é uma pista, não uma bronca.</p>
<p>Os erros mais comuns no começo:</p>
<ul><li><b>Esquecer de fechar aspas ou parênteses</b>: gera um <a href="#" class="gt" data-t="errosint">erro de sintaxe</a> (a "gramática" do código ficou errada).</li><li><b>Errar as maiúsculas</b>: <code>Print</code> não é <code>print</code>.</li><li><b>Escrever um texto sem aspas</b>: o Python acha que é o nome de outra coisa.</li></ul>
<p>Execute o exemplo, leia a mensagem e depois corrija.</p>`,
    ex: ['print("Olá, mundo!)'], ob: 'Falta a aspa que fecha o texto. O Python não sabe onde ele termina e avisa com um erro de sintaxe.',
    tr: 'Execute e leia a mensagem. Depois feche as aspas, deixando print("Olá, mundo!"), e execute de novo: agora o texto aparece.' });
  ORD(1, ['t7', 't1', 't2', 't3', 't4', 't5', 't6']);
  L[0].sum = ['Programar é dar instruções ao computador; o Python as executa de cima para baixo.', 'print() mostra resultados; textos ficam entre aspas.', 'Comentários começam com # e são ignorados.', 'Mensagens de erro são pistas para corrigir o código.'];

  /* ================= AULA 2 — Entendendo variáveis ================= */
  L[1].goal = 'Guardar informações em variáveis e usá-las em programas.';
  S(2, 't1', { t: 'O que são variáveis', vis: 'var', r: 'Variável = nome + valor guardado.',
    h: `<p>Programas precisam lembrar de informações: o nome de um usuário, o preço de um produto, a idade de alguém. Para isso usamos <b><a href="#" class="gt" data-t="variavel">variáveis</a></b>.</p>
<p>Imagine uma caixa com uma etiqueta. A <b>etiqueta</b> é o <b>nome</b> da variável; o que está dentro da caixa é o <b>valor</b>. Podemos olhar o valor, usá-lo em contas ou trocá-lo por outro.</p>
<p>Para guardar um valor escrevemos <code>nome = valor</code>. No próximo tópico você vai olhar esse sinal <code>=</code> de perto.</p>
<div class="tip"><b>Atenção:</b> nome e valor são coisas diferentes. Em <code>idade = 17</code>, <code>idade</code> é o nome e <code>17</code> é o valor.</div>`,
    ex: [J(['idade = 17', 'print(idade)'])], ob: 'Cria a variável idade e guarda nela o valor 17. | Mostra o valor guardado em idade (17), e não a palavra "idade".', tr: 'Troque 17 por outro número. A saída passa a mostrar o novo valor, sem mexer no print().' });
  S(2, 't2', { t: 'Atribuição com =', r: 'O = guarda o valor da direita no nome da esquerda.',
    h: `<p>Para criar uma variável usamos o sinal <code>=</code>, chamado de <b><a href="#" class="gt" data-t="atribuicao">atribuição</a></b>: o valor da <b>direita</b> é guardado no nome da <b>esquerda</b>.</p>
<p>Leia <code>nome = valor</code> como "nome recebe valor". Aqui o <code>=</code> não significa "igual a", como na matemática.</p>
<p>Depois de criada, a variável pode ser usada em contas e no <code>print()</code>. <b>Sem aspas</b>, o Python usa o valor guardado.</p>`,
    ex: [J(['a = 2', 'b = 3', 'print(a + b)'])], ob: 'Cria a variável a e guarda o valor 2 nela. | Cria b com o valor 3. | Soma os valores guardados em a e b (2 + 3) e mostra 5.', tr: 'Mude os valores de a e b e troque o + por *. Com a = 2 e b = 3, a saída passa a ser 6.' });
  S(2, 't3', { t: 'Nomes de variáveis', r: 'Nomes: letras, números e _, sem espaço e sem começar por número; maiúscula importa.',
    h: `<p>Você escolhe o nome das variáveis, mas há regras:</p>
<ul><li>use letras, números e <code>_</code> (sem espaços);</li><li>não comece com número: <code>2nota</code> não vale, <code>nota2</code> vale;</li><li>maiúsculas e minúsculas diferem: <code>nome</code> e <code>Nome</code> são variáveis diferentes.</li></ul>
<p>Prefira nomes que expliquem o conteúdo: <code>preco_total</code> é melhor do que <code>x</code>.</p>
<p>Textos (<b>strings</b>) vão entre aspas; números não: <code>"Ana"</code> e <code>17</code>.</p>`,
    ex: [J(['nome = "Ana"', 'idade = 17', 'print(nome)', 'print(idade)', 'print("Olá,", nome)'])], ob: 'Guarda o texto "Ana" na variável nome. | Guarda o número 17 em idade (número não leva aspas). | Mostra o valor guardado em nome. | Mostra o valor de idade. | Junta um texto e o valor da variável.',
    tr: 'Troque nome e idade pelos seus dados. As duas primeiras linhas da saída mostram os seus valores, e a última mostra "Olá," com o seu nome.' });
  S(2, 't5', { t: 'Tipos básicos de dados', r: 'int = inteiro, float = decimal (com ponto), str = texto, bool = True ou False.',
    h: `<p>Todo valor tem um <b>tipo</b>, que diz que espécie de informação ele é. Os quatro tipos básicos:</p>
<table><tr><th>Tipo</th><th>Para quê</th><th>Exemplo</th></tr><tr><td><a href="#" class="gt" data-t="integer">int</a></td><td>número inteiro</td><td><code>17</code></td></tr><tr><td><a href="#" class="gt" data-t="float">float</a></td><td>número decimal (com ponto, não vírgula)</td><td><code>2.5</code></td></tr><tr><td><a href="#" class="gt" data-t="string">str</a></td><td>texto</td><td><code>"Ana"</code></td></tr><tr><td><a href="#" class="gt" data-t="boolean">bool</a></td><td>verdadeiro ou falso</td><td><code>True</code></td></tr></table>
<p>Cuidado: <code>"7"</code> (com aspas) é <b>texto</b>, e <code>7</code> é <b>número</b>. Com texto não dá para fazer contas.</p>
<p>A função <code>type()</code> mostra o tipo de um valor.</p>`,
    ex: [J(['print(type(17))', 'print(type(2.5))', 'print(type("Ana"))', 'print(type(True))'])], ob: 'type(17): número inteiro (int). | type(2.5): número decimal (float). | type("Ana"): texto (str). | type(True): valor lógico (bool).',
    tr: 'Troque o 17 da primeira linha por "17" (com aspas). A primeira linha da saída passa de int para str.' });
  S(2, 't4', { t: 'Atualizando valores', r: 'Uma variável pode ser atualizada; o lado direito é calculado primeiro.',
    h: `<p>O valor de uma variável pode mudar durante o programa: basta atribuir um novo valor ao mesmo nome.</p>
<p>Também podemos usar o valor antigo para calcular o novo. Em <code>pontos = pontos + 5</code>, o Python calcula primeiro o lado direito (valor antigo + 5) e só depois guarda o resultado em <code>pontos</code>.</p>
<p>No segundo exemplo, um aumento de 5% sobre um salário: <code>salário * aumento / 100</code> calcula 5% do salário, e esse valor é somado ao salário. (A ordem das contas será estudada com detalhe na Aula 3.)</p>`,
    ex: [J(['pontos = 10', 'pontos = pontos + 5', 'print(pontos)']), J(['salário = 1500', 'aumento = 5', 'print(salário + (salário * aumento / 100))'])],
    ob: 'Cria pontos com o valor 10. | Calcula o valor antigo mais 5 (10 + 5) e guarda o resultado de volta em pontos. | Mostra o valor atual: 15.', tr: 'Mude o 5 por 20: a saída passa a ser 30. Depois execute o segundo exemplo e mude o aumento para 10: o resultado esperado é 1650.0.' });
  S(2, 't6', { t: 'Variáveis em mensagens', r: 'f"...{variavel}..." coloca o valor da variável dentro do texto.',
    h: `<p>Para colocar variáveis dentro de uma mensagem há duas formas:</p>
<ol><li>Com <b>vírgulas</b> no <code>print()</code>: as partes são juntadas com um espaço.</li><li>Com um <b>f-string</b>: um texto com a letra <code>f</code> antes das aspas, em que o que está entre chaves <code>{ }</code> é trocado pelo valor da variável.</li></ol>
<p>As duas levam a resultados parecidos; o f-string deixa a frase mais natural de escrever.</p>`,
    ex: [J(['nome = "Ana"', 'idade = 17', 'print("Nome:", nome, "- Idade:", idade)', 'print(f"{nome} tem {idade} anos.")']), J(['preco = 12.5', 'quantidade = 4', 'total = preco * quantidade', 'print(f"Total da compra: R$ {total}")'])],
    ob: 'Guarda o nome. | Guarda a idade. | A vírgula separa as partes: texto, variável, texto, variável. | Com f"...", o que está entre chaves vira o valor da variável.', tr: 'Mude nome e idade. As duas mensagens mudam juntas, sem você mexer nos print().' });
  ORD(2, ['t1', 't2', 't3', 't5', 't4', 't6']);
  L[1].sum = ['Variável é um nome que guarda um valor: o nome é a etiqueta e o valor é o conteúdo.', 'O = guarda o valor da direita no nome da esquerda.', 'Tipos básicos: int, float, str e bool; "7" é texto e 7 é número.', 'O valor de uma variável pode ser atualizado, e variáveis entram em mensagens e contas.'];

  /* ================= AULA 3 — Aprendendo operações ================= */
  L[2].goal = 'Fazer contas em Python e entender em que ordem elas acontecem.';
  S(3, 't1', { t: 'Soma e subtração', r: '+ soma e - subtrai; contas do mesmo tipo são feitas da esquerda para a direita.',
    h: `<p>Os <b>operadores</b> são os símbolos das contas. A soma usa <code>+</code> e a subtração usa <code>-</code>.</p>
<p>Quando há várias contas seguidas do mesmo tipo, o Python resolve da esquerda para a direita: <code>10 - 4 + 2</code> é (10 - 4) + 2 = 8.</p>
<p>Para <b>ver</b> o resultado de uma conta dentro de um programa, coloque-a em um <code>print()</code>.</p>`,
    ex: [J(['print(2 + 3)', 'print(5 - 3)', 'print(10 - 4 + 2)'])], ob: '2 + 3 = 5. | 5 - 3 = 2. | 10 - 4 + 2 é feito da esquerda para a direita: 6 + 2 = 8.', tr: 'Invente uma conta com + e -, preveja o resultado e confira executando.' });
  S(3, 't2', { t: 'Multiplicação e divisão', vis: 'ops', r: '* multiplica; / dá a divisão comum, // dá a parte inteira e % dá o resto.',
    h: `<p>A multiplicação usa <code>*</code>. A divisão tem <b>três formas</b>, e é aqui que muita gente se confunde:</p>
<ul><li><code>/</code> <b>divisão comum</b>: o resultado pode ter parte decimal: <code>10 / 4</code> → <code>2.5</code>;</li><li><code>//</code> <b>divisão inteira</b>: só a parte inteira do resultado: <code>10 // 4</code> → <code>2</code>;</li><li><code>%</code> <b>resto</b> da divisão: o que sobra: <code>10 % 4</code> → <code>2</code>.</li></ul>
<p>Exemplo do dia a dia: 17 balas para 5 crianças. Cada uma recebe 3 (<code>17 // 5</code>) e sobram 2 (<code>17 % 5</code>). A divisão comum, <code>17 / 5</code>, dá 3.4.</p>`,
    ex: [J(['print(2 * 10)', 'print(10 / 4)', 'print(10 // 4)', 'print(10 % 4)'])], ob: 'Multiplicação: 2 × 10 = 20. | Divisão comum: 10 ÷ 4 = 2.5. | Divisão inteira: o 4 cabe 2 vezes no 10 (parte inteira de 2.5). | Resto: 10 = 2 × 4 + 2, então sobram 2.',
    tr: 'Troque o 10 por 17 e o 4 por 5 nas três últimas linhas. Resultado esperado: 3.4, 3 e 2.' });
  S(3, 't3', { t: 'Tabela de operadores e potência', r: 'Potência usa **; a tabela reúne os sete operadores.',
    h: `<p>Resumo dos operadores. Guarde esta tabela:</p>
<table><tr><th>Operador</th><th>Operação</th></tr><tr><td><code>+</code></td><td>adição</td></tr><tr><td><code>-</code></td><td>subtração</td></tr><tr><td><code>*</code></td><td>multiplicação</td></tr><tr><td><code>/</code></td><td>divisão comum (resultado fracionário)</td></tr><tr><td><code>//</code></td><td>divisão inteira</td></tr><tr><td><code>%</code></td><td>resto da divisão</td></tr><tr><td><code>**</code></td><td>potenciação</td></tr></table>
<p>A <b>potenciação</b> usa dois asteriscos: <code>2 ** 3</code> significa 2 × 2 × 2 = 8. Não confunda com <code>*</code>, que multiplica.</p>`,
    ex: ['print(2 ** 3)'], ob: '** eleva à potência: 2 × 2 × 2 = 8.', tr: 'Mude o expoente 3 para 10. Resultado esperado: 1024.' });
  S(3, 't6', { t: 'Contas com variáveis', r: 'Variáveis nas contas fazem o programa servir para qualquer valor.',
    h: `<p>Contas ficam muito mais úteis com variáveis: o programa continua valendo mesmo quando os valores mudam.</p>
<p>O resultado de uma conta também pode ser guardado em uma variável (aqui, <code>total</code>) para ser usado depois.</p>`,
    ex: [J(['preco = 8', 'quantidade = 3', 'total = preco * quantidade', 'print(total)'])], ob: 'Guarda o preço de uma unidade. | Guarda quantas unidades serão compradas. | Calcula preço × quantidade e guarda o resultado em total. | Mostra o total: 24.',
    tr: 'Mude quantidade para 5: o total passa a ser 40. Mude também o preço e veja o total se ajustar.' });
  S(3, 't4', { t: 'Ordem das operações', r: 'Parênteses primeiro, depois **, depois * / // %, depois + e -.',
    h: `<p>Em uma conta com vários operadores, o Python segue uma ordem, como na matemática:</p>
<ol><li>parênteses <code>( )</code></li><li>potência <code>**</code></li><li><code>*</code>, <code>/</code>, <code>//</code> e <code>%</code></li><li><code>+</code> e <code>-</code></li></ol>
<p>Operadores do mesmo nível são resolvidos da esquerda para a direita. Na dúvida, use parênteses: eles deixam a intenção clara.</p>`,
    ex: [J(['print(2 + 3 * 4)', 'print((2 + 3) * 4)']), 'print(1500 + (1500 * 5 / 100))'], ob: 'A multiplicação vem antes: 3 * 4 = 12, depois 2 + 12 = 14. | Com parênteses, a soma vem primeiro: 5 * 4 = 20.',
    tr: 'Em print(2 + 3 * 4), coloque parênteses em volta de 3 * 4. O resultado continua 14: ali eles não mudam a ordem.' });
  S(3, 't5', { t: 'Cálculos do dia a dia', r: 'Parênteses garantem que a soma aconteça antes da divisão.',
    h: `<p>Programas fazem contas do cotidiano o tempo todo: total de uma compra, média de notas, troco.</p>
<p>Para a <b>média</b> de três notas, some as notas e divida por 3. Cuidado: a soma precisa estar entre parênteses; senão, só a última nota seria dividida por 3.</p>`,
    ex: [J(['n1 = 7', 'n2 = 8', 'n3 = 6', 'media = (n1 + n2 + n3) / 3', 'print("Média:", media)']), J(['valor = 50', 'troco = 100 - valor', 'print("Troco:", troco)'])],
    ob: 'Primeira nota. | Segunda nota. | Terceira nota. | Soma as notas entre parênteses e divide por 3: a média. | Mostra a média com um texto.', tr: 'Mude as notas para 6, 7 e 8. A média passa a ser 7.0.' });
  ORD(3, ['t1', 't2', 't3', 't6', 't4', 't5']);
  L[2].sum = ['Operadores: + - * / // % **.', '/ dá a divisão comum, // dá a parte inteira e % dá o resto.', 'A ordem: parênteses, potência, * / // %, depois + e -.', 'Variáveis nas contas fazem o mesmo programa servir para valores diferentes.'];

  /* ================= AULA 4 — Estruturas condicionais ================= */
  L[3].goal = 'Fazer o programa tomar decisões usando condições, if, elif e else.';
  S(4, 't1', { t: 'Condições: verdadeiro ou falso', r: 'Comparações resultam em True ou False. = guarda um valor; == compara.',
    h: `<p>Uma <b><a href="#" class="gt" data-t="condicao">condição</a></b> é uma pergunta que só tem duas respostas possíveis: <b>sim</b> ou <b>não</b>. Em Python, elas se chamam <code>True</code> (verdadeiro) e <code>False</code> (falso): os valores <a href="#" class="gt" data-t="boolean">booleanos</a>.</p>
<p>Para fazer essas perguntas usamos os <b>operadores de comparação</b>:</p>
<table><tr><th>Símbolo</th><th>Significa</th></tr><tr><td><code>==</code></td><td>igual a</td></tr><tr><td><code>!=</code></td><td>diferente de</td></tr><tr><td><code>&gt;</code></td><td>maior que</td></tr><tr><td><code>&lt;</code></td><td>menor que</td></tr><tr><td><code>&gt;=</code></td><td>maior ou igual a</td></tr><tr><td><code>&lt;=</code></td><td>menor ou igual a</td></tr></table>
<div class="tip"><b>Atenção:</b> em Python escreva <code>&gt;=</code> e <code>&lt;=</code> (o sinal de maior ou menor vem <b>antes</b> do <code>=</code>). E lembre: <code>=</code> guarda um valor, enquanto <code>==</code> compara dois valores.</div>`,
    ex: [J(['idade = 17', 'print(idade >= 18)', 'print(idade == 17)', 'print(idade != 17)'])], ob: 'Guarda a idade 17. | 17 >= 18? Resultado: False. | 17 == 17? Resultado: True. | 17 != 17? Resultado: False.', tr: 'Mude a idade para 18. Resultado esperado: True, False e True.' });
  S(4, 't2', { t: 'if e else: o programa decide', vis: 'flow', r: 'if executa o bloco se a condição for verdadeira; else cobre o contrário.',
    h: `<p>O <code>if</code> ("se") executa um bloco de código <b>somente quando a condição é verdadeira</b>. O <code>else</code> ("senão") executa o bloco alternativo quando ela é falsa.</p>
<pre class="code">if condição:
    o que fazer se for verdadeira
else:
    o que fazer se for falsa</pre>
<p>Repare nos <b>dois-pontos</b> ao final de <code>if</code> e <code>else</code> e nas linhas seguintes <b>recuadas</b> (indentadas): é isso que mostra ao Python quais linhas pertencem a cada bloco.</p>`,
    ex: [J(['idade = 17', 'if idade >= 18:', '    print("Maior de idade")', 'else:', '    print("Menor de idade")'])],
    ob: 'Guarda a idade. | Pergunta: a idade é 18 ou mais? Se sim, roda o bloco recuado abaixo. | Linha recuada: só roda se a condição for verdadeira. | Senão (else), roda o bloco abaixo. | Só roda se a condição for falsa. Aqui é este que aparece.', tr: 'Mude a idade para 20. O programa passa a mostrar "Maior de idade".' });
  S(4, 't6', { t: 'Dois-pontos e indentação', r: 'O if termina com dois-pontos; as linhas do bloco ficam recuadas com 4 espaços.',
    h: `<p>Dois detalhes fazem o <code>if</code> funcionar:</p>
<ul><li><b>Dois-pontos</b> (<code>:</code>) no final da linha do <code>if</code>, do <code>elif</code> e do <code>else</code>.</li><li><b><a href="#" class="gt" data-t="indentacao">Indentação</a></b>: as linhas do bloco ficam recuadas com <b>quatro espaços</b>. No editor, a tecla Tab insere os quatro espaços, e ao apertar Enter depois dos dois-pontos o recuo já vem pronto.</li></ul>
<p>Uma linha <b>sem recuo</b> está fora do bloco e sempre executa. Esquecer os dois-pontos ou o recuo causa erro (veja "Entenda o Erro").</p>`,
    ex: [J(['idade = 20', 'if idade >= 18:', '    print("Pode entrar")', '    print("Bem-vindo!")', 'print("Fim do programa")'])],
    ob: 'Guarda a idade 20. | Condição: idade >= 18? Termina com dois-pontos. | Linha recuada (4 espaços): pertence ao if. | Também recuada: também pertence ao if. | Sem recuo: está fora do if e roda sempre.', tr: 'Mude a idade para 15. As duas primeiras mensagens somem e só "Fim do programa" aparece.' });
  S(4, 't3', { t: 'elif: mais de duas opções', r: 'elif testa mais condições em sequência; vale o primeiro bloco verdadeiro.',
    h: `<p>Quando há <b>mais de dois caminhos</b>, usamos <code>elif</code> (de "else if", "senão se"). O Python testa as condições <b>em ordem</b> e executa apenas o primeiro bloco verdadeiro; o resto é ignorado.</p>
<p>Por isso a ordem importa. Com notas, comece pela condição mais exigente (<code>nota &gt;= 7</code>). Se começasse por <code>nota &gt;= 5</code>, uma nota 9 cairia na recuperação.</p>`,
    ex: [J(['nota = 6', 'if nota >= 7:', '    print("Aprovado")', 'elif nota >= 5:', '    print("Recuperação")', 'else:', '    print("Reprovado")'])],
    ob: 'Guarda a nota 6. | Primeira pergunta: nota >= 7? | Se sim, mostra Aprovado. | Se não, faz a segunda pergunta: nota >= 5? | Se sim, mostra Recuperação (o caso da nota 6). | Se nenhuma anterior valeu... | ...mostra Reprovado.', tr: 'Teste as notas 9, 6 e 3, uma de cada vez. Resultados esperados: Aprovado, Recuperação e Reprovado.' });
  S(4, 't4', { t: 'Operadores lógicos: and, or, not', r: 'and = as duas; or = pelo menos uma; not = inverte.',
    h: `<p>Às vezes uma decisão depende de <b>mais de uma condição</b>. Os operadores lógicos combinam condições:</p>
<ul><li><code>and</code> ("e"): verdadeiro só se <b>as duas</b> forem verdadeiras;</li><li><code>or</code> ("ou"): verdadeiro se <b>pelo menos uma</b> for verdadeira;</li><li><code>not</code> ("não"): <b>inverte</b> o valor; <code>not True</code> é <code>False</code>.</li></ul>
<p>Exemplo do dia a dia: para entrar em um parque, é preciso ter ingresso <b>e</b> ter mais de 10 anos.</p>`,
    ex: [J(['idade = 20', 'print(idade >= 18 and idade <= 65)', 'print(idade < 18 or idade > 65)', 'print(not idade >= 18)'])],
    ob: 'Guarda a idade. | and: as duas condições valem (20 >= 18 e 20 <= 65)? True. | or: pelo menos uma vale? Nenhuma vale: False. | not inverte: idade >= 18 é True, então not dá False.', tr: 'Mude a idade para 70. Resultado esperado: False, True e False.' });
  S(4, 't5', { t: 'Condições combinadas', r: 'Combine condições no if com and/or para decidir com mais de um critério.',
    h: `<p>Use <code>and</code> e <code>or</code> diretamente na linha do <code>if</code>. No cinema, por exemplo, paga meia-entrada quem é estudante <b>ou</b> tem mais de 60 anos.</p>
<p>Aqui <code>estudante</code> guarda um valor <code>True</code> ou <code>False</code>, então pode ser usado como condição sozinho.</p>`,
    ex: [J(['idade = 25', 'estudante = True', 'if idade > 60 or estudante:', '    print("Meia-entrada")', 'else:', '    print("Inteira")'])],
    ob: 'Guarda a idade. | estudante guarda um valor lógico (True ou False). | Com or, basta uma condição valer: aqui, estudante é True. | Roda se a condição do if for verdadeira. | Caso contrário... | ...paga inteira.', tr: 'Troque estudante por False. Como a idade é 25, a mensagem muda para "Inteira".' });
  ORD(4, ['t1', 't2', 't6', 't3', 't4', 't5']);
  L[3].sum = ['Condições dão True ou False; compare com == != > < >= <=.', 'if / elif / else escolhem qual bloco executar; só o primeiro bloco verdadeiro roda.', 'Dois-pontos no fim da linha e quatro espaços de recuo definem o bloco.', 'and, or e not combinam condições.'];

  /* ================= AULA 5 — Primeiros projetos ================= */
  L[4].goal = 'Construir pequenos programas juntando variáveis, operações e condições.';
  S(5, 't1', { t: 'Planeje antes de programar', r: 'Planejar em passos pequenos facilita escrever e testar o programa.',
    h: `<p>Antes de escrever código, descreva o problema <b>com palavras</b>. Pergunte: que dados o programa recebe? O que ele precisa calcular ou decidir? O que deve mostrar?</p>
<p>Depois divida em <b>passos pequenos</b> e programe um de cada vez, testando a cada passo. Assim, quando algo der errado, você sabe onde procurar.</p>
<p>Nesta aula você constrói três projetos, sempre com os conceitos que já estudou.</p>` });
  S(5, 't2', { t: 'Organize o código', r: 'Organize o código em blocos: dados, decisão e resultado, com comentários.',
    h: `<p>Um código organizado é mais fácil de ler e de consertar. Separe o programa em três blocos: <b>dados</b> (variáveis, no início), <b>cálculos ou decisões</b> (no meio) e <b>resultado</b> (no final).</p>
<p>Use <b>comentários</b> (<code>#</code>) para nomear os blocos e escolha nomes de variáveis que expliquem o conteúdo.</p>`,
    ex: [J(['# dados', 'a = 8', 'b = 2', '# cálculo', 'resultado = a + b', '# resultado', 'print("Resultado:", resultado)'])],
    ob: 'Comentário: o bloco de dados. | Guarda o primeiro número. | Guarda o segundo número. | Comentário: o bloco de cálculo. | Calcula a soma e guarda em resultado. | Comentário: o bloco de resultado. | Mostra um texto junto com o resultado.', tr: 'Troque o + por *. O programa passa a mostrar 16.' });
  S(5, 't4', { t: 'Encontrando e corrigindo erros', r: 'Leia o erro, localize a linha e use print() para espiar as variáveis.',
    h: `<p>Procurar erros faz parte de programar. Um método simples:</p>
<ol><li><b>Leia a mensagem</b> de erro: ela diz o tipo e a linha.</li><li><b>Localize</b> a linha e compare com os exemplos que funcionam.</li><li><b>Espie</b> os valores com <code>print()</code>.</li><li><b>Teste</b> com valores simples (como 0, 1 e 10).</li></ol>`,
    ex: [J(['a = 10', 'b = 0', 'print("a vale", a)', 'print("b vale", b)', 'print(a / b)'])],
    ob: 'Guarda 10 em a. | Guarda 0 em b. | Espia o valor de a (ajuda a depurar). | Espia o valor de b: aqui aparece o 0. | Divide por zero: o Python mostra ZeroDivisionError. Os prints acima ajudaram a achar o motivo.', tr: 'Mude b para 2. O erro desaparece e o programa mostra 5.0 no final.' });
  S(5, 't7', { t: 'Projeto 1: Calculadora simples', r: 'Uma calculadora é: dados + decisão + resultado.',
    h: `<p><b>Contexto:</b> caixas de loja e aplicativos fazem contas assim todos os dias.</p>
<p><b>Objetivo:</b> uma calculadora que, com dois números e uma operação (+, -, * ou /), mostra o resultado.</p>
<p><b>Conceitos usados:</b> variáveis, operações e <code>if/elif/else</code>.</p>
<p><b>Novo recurso:</b> um <code>if</code> pode ficar <b>dentro de outro</b> <code>if</code>, recuado mais 4 espaços. Usaremos isso para evitar a divisão por zero.</p>
<p><b>Etapas:</b> (1) guardar os dados; (2) escolher o cálculo conforme a operação; (3) tratar casos especiais. Resolva uma etapa por vez nos exercícios.</p>`,
    ex: [J(['a = 8', 'b = 2', 'operacao = "+"', 'if operacao == "+":', '    print(a + b)', 'else:', '    print("outra operação")'])],
    ob: 'Primeiro número. | Segundo número. | A operação escolhida, como texto. | Pergunta: a operação é a soma? | Se for, mostra a + b. | Senão... | ...avisa que é outra operação.', tr: 'Mude operacao para "-". A saída passa a ser "outra operação". Depois acrescente um elif para tratar o "-".' });
  S(5, 't5', { t: 'Projeto 2: Verificador de resultados', r: 'Dividir em passos pequenos facilita: notas, média, decisão, resultado.',
    h: `<p><b>Contexto:</b> escolas usam regras como esta para definir a situação de cada aluno.</p>
<p><b>Objetivo:</b> calcular a média de três notas e dizer se o aluno foi aprovado, ficou em recuperação ou foi reprovado.</p>
<p><b>Conceitos usados:</b> variáveis, média (operações), comparações e <code>if/elif/else</code>.</p>
<p><b>Etapas:</b> (1) guardar as notas; (2) calcular a média; (3) decidir a situação (média ≥ 7 aprovado, ≥ 5 recuperação, senão reprovado); (4) mostrar o resultado.</p>`,
    ex: [J(['n1 = 8', 'n2 = 6', 'n3 = 7', 'media = (n1 + n2 + n3) / 3', 'print("Média:", media)'])],
    ob: 'Primeira nota. | Segunda nota. | Terceira nota. | Soma as notas entre parênteses e divide por 3. | Mostra a média: é a etapa 2 do projeto.', tr: 'Mude as notas e veja a média mudar. Nos exercícios, você vai acrescentar a decisão.' });
  S(5, 't6', { t: 'Projeto 3: Sistema de decisões', r: 'Compare textos com == e some pontos a cada acerto.',
    h: `<p><b>Contexto:</b> jogos e provas online conferem respostas e decidem mensagens desta forma.</p>
<p><b>Objetivo:</b> conferir respostas de um quiz, contar os pontos e decidir a mensagem final.</p>
<p><b>Conceitos usados:</b> variáveis de texto, <code>==</code> (que também compara <b>textos</b>), <code>if/else</code> e contagem de pontos.</p>
<p>O site não tem digitação interativa (<code>input()</code>), então as respostas ficam guardadas em variáveis.</p>
<p><b>Etapas:</b> (1) guardar as respostas; (2) comparar cada uma com a correta; (3) somar um ponto a cada acerto; (4) decidir a mensagem final.</p>`,
    ex: [J(['resposta = "Brasília"', 'pontos = 0', 'if resposta == "Brasília":', '    pontos = pontos + 1', 'print(pontos)'])],
    ob: 'A resposta guardada. | Começa a contagem em zero. | Compara o texto guardado com a resposta correta. | Se acertou, soma 1 ponto. | Mostra os pontos: 1.', tr: 'Troque a resposta para "Lisboa". Como erra, a saída passa a ser 0.' });
  S(5, 't3', { t: 'Revisão rápida', r: 'Variáveis guardam valores, operadores calculam e if/elif/else decidem.',
    h: `<p>Antes de seguir em frente, relembre as ferramentas que você já tem:</p>
<ul><li><b>variáveis</b> guardam valores;</li><li><b>operadores</b> fazem contas e comparações;</li><li><b>if / elif / else</b> escolhem o que executar;</li><li><b>print()</b> mostra o resultado.</li></ul>
<p>Qualquer programa dos primeiros passos é uma combinação dessas peças. Continue praticando na "Hora de Praticar".</p>` });
  delete T(5, 't3').ex; delete T(5, 't3').ob; delete T(5, 't3').tr;
  ORD(5, ['t1', 't2', 't4', 't7', 't5', 't6', 't3']);
  L[4].sum = ['Planeje em passos pequenos e teste a cada passo.', 'Organize o código em dados, decisão e resultado.', 'Você construiu uma calculadora, um verificador de resultados e um sistema de decisões.', 'Um if pode ficar dentro de outro; == também compara textos.'];
})();

/* ===== Revisões, exercícios (dicas específicas e enunciados) e glossário ===== */
(function () {
  var L = window.LESSONS;
  function Q(i, q) { L[i - 1].quiz.push(q); }
  Q(1, { q: 'Uma receita de bolo se parece com um programa porque ambos são...', o: ['uma lista de passos em ordem', 'escritos em Python', 'feitos só por computadores'], a: 0, w: 'Um programa é uma lista de instruções executadas em ordem, como os passos de uma receita.', tp: 't7' });
  Q(1, { q: 'Um programa tem duas linhas: <code>print("A")</code> e, depois, <code>print("B")</code>. O que aparece na tela?', o: ['A e depois B, em linhas separadas', 'B e depois A', 'AB na mesma linha'], a: 0, w: 'O Python executa de cima para baixo e cada print() escreve em uma nova linha.', tp: 't2' });
  Q(1, { q: 'Qual é o problema em <code>print("Oi)</code>?', o: ['Falta fechar as aspas', 'Falta um comentário', 'print não existe em Python'], a: 0, w: 'O texto abriu aspas e não as fechou: é um erro de sintaxe.', tp: 't6' });
  Q(2, { q: 'Em <code>idade = 17</code>, qual é o <b>nome</b> da variável?', o: ['idade', '17', '='], a: 0, w: 'O nome é a etiqueta (idade) e o valor é o conteúdo (17).', tp: 't1' });
  Q(2, { q: 'Depois de <code>x = 3</code> e <code>x = x * 2</code>, o que <code>print(x)</code> mostra?', o: ['3', '6', 'x * 2'], a: 1, w: 'O lado direito é calculado primeiro: 3 * 2 = 6, e o resultado volta para x.', tp: 't4' });
  Q(3, { q: 'O que <code>print(20 // 6)</code> mostra?', o: ['3', '3.33', '2'], a: 0, w: '20 // 6 é a divisão inteira: o 6 cabe 3 vezes no 20 (o resto seria 2).', tp: 't2' });
  Q(3, { q: 'Quatro produtos de R$ 12 cada, com R$ 5 de desconto no total. Qual expressão dá o valor a pagar?', o: ['4 * 12 - 5', '4 * (12 - 5)', '4 + 12 - 5'], a: 0, w: 'Primeiro o total (4 * 12 = 48), depois o desconto sobre o total (48 - 5 = 43).', tp: 't6' });
  Q(4, { q: 'Com <code>nota = 5</code>, um programa tem <code>if nota &gt;= 7</code> (mostra A), <code>elif nota &gt;= 5</code> (mostra B) e <code>else</code> (mostra C). O que ele mostra?', o: ['A', 'B', 'C'], a: 1, w: '5 não é >= 7, mas é >= 5: executa o bloco do elif e ignora o resto.', tp: 't3' });
  Q(4, { q: 'Qual linha está <b>errada</b> em Python?', o: ['<code>if x &gt; 3</code> (sem dois-pontos no final)', '<code>if x &gt;= 3:</code>', '<code>if x == 3:</code>'], a: 0, w: 'A linha do if precisa terminar com dois-pontos.', tp: 't6' });
  Q(5, { q: 'Qual instrução evita a divisão por zero na calculadora?', o: ['Um if que confere se b == 0 antes de dividir', 'Usar // no lugar de /', 'Trocar a por b'], a: 0, w: 'Conferir o divisor antes de dividir evita o ZeroDivisionError.', tp: 't7' });
  Q(5, { q: 'Para comparar duas respostas em forma de texto, usamos...', o: ['==', '=', '>='], a: 0, w: '== compara valores, inclusive textos; o = apenas guarda.', tp: 't6' });

  /* vínculos de tópico atualizados pelos novos tópicos */
  function EX(i, id, o) { var e = L[i - 1].ex.filter(function (x) { return x.id === id; })[0]; for (var k in o) e[k] = o[k]; }
  EX(3, 'e5', { tp: 't6' }); EX(4, 'e6', { tp: 't6' });
  EX(2, 'e2', { q: 'Com <code>a = 3</code> e <code>b = 5</code>, calcule <b>(2 × a) × (3 × b)</b> e mostre o resultado.' });
  EX(1, 'e2', { q: 'Use <code>print()</code> três vezes ou mais para criar uma apresentação: seu nome, seu curso e seu objetivo.' });

  /* dica 1 (conceito) e dica 2 (estratégia) específicas de cada exercício */
  var H = {
    '1.e1': ['O que fica entre as aspas do print() é o texto que aparece na tela.', 'Troque apenas o que está entre as aspas, mantendo as aspas e os parênteses.'],
    '1.e2': ['Cada print() escreve uma linha nova na saída.', 'Escreva três linhas: uma com o seu nome, outra com o curso e outra com o objetivo, cada uma dentro de um print().'],
    '1.e3': ['Sem aspas, o Python calcula a conta. O símbolo da multiplicação é *.', 'Coloque a conta 7 * 6 dentro dos parênteses do print().'],
    '1.e4': ['Texto entre aspas aparece como foi escrito; uma conta sem aspas é calculada.', 'Leia linha por linha: o que o primeiro print mostra? E o segundo? Escreva as duas saídas, uma por linha.'],
    '1.e5': ['Todo texto que abre aspas precisa fechá-las.', 'Compare o começo e o fim do texto dentro do print(): falta algum símbolo?'],
    '1.e6': ['Dentro do print(), a vírgula junta partes diferentes, como um texto e uma conta.', 'Use um único print() com duas partes separadas por vírgula: o texto "Resultado:" e a conta.'],
    '2.e1': ['Textos (str) levam aspas; números (int) não. Cada variável tem um nome e um valor.', 'Dê um texto entre aspas à variável nome e um número a idade; depois mostre cada uma com print().'],
    '2.e2': ['Variáveis podem ser usadas em contas, como se fossem os próprios valores.', 'Calcule (2 * a) * (3 * b) usando as variáveis, sem digitar o 3 e o 5 de novo.'],
    '2.e3': ['Some as variáveis como somaria números: a + b + c.', 'Mantenha as três linhas dos valores e acrescente um print() que some as três variáveis.'],
    '2.e4': ['Mudando só os valores das variáveis, a mesma conta serve para outros casos.', 'Altere apenas os números das duas primeiras linhas: o salário (750) e o aumento (15).'],
    '2.e5': ['Um nome é um texto, então precisa de aspas.', 'Substitua o ___ por um nome entre aspas, por exemplo "Ana".'],
    '2.e6': ['A linha x = x + 2 usa o valor antigo de x para calcular o novo.', 'Primeiro x vale 5. Depois x recebe o valor antigo mais 2. O que o print mostra no final?'],
    '2.e7': ['O Python diferencia maiúsculas de minúsculas nos nomes das variáveis.', 'Compare como a variável foi criada na primeira linha e como aparece dentro do print().'],
    '2.e8': ['O total de uma compra é o preço de uma unidade vezes a quantidade.', 'Guarde preco * quantidade em uma variável total e mostre uma frase com ela.'],
    '3.e1': ['Potência é **, multiplicação é *, e os parênteses mudam a ordem das contas.', 'Escreva três print(), um para cada expressão, usando * na multiplicação e ** na potência.'],
    '3.e2': ['// dá a parte inteira da divisão e % dá o resto.', 'Mostre primeiro a // b e, em seguida, a % b, cada um em seu print().'],
    '3.e3': ['A potência usa dois asteriscos: 2 ** 3 é 2 × 2 × 2.', 'Coloque a base 2 antes dos ** e o expoente depois.'],
    '3.e4': ['Os parênteses fazem uma parte da conta acontecer antes das outras.', 'Para a soma 2 + 3 acontecer antes da multiplicação, coloque-a entre parênteses.'],
    '3.e5': ['Cada operador faz uma conta com os valores guardados em a e b.', 'Escreva quatro print(), um para cada operador (+, -, * e /), na ordem pedida.'],
    '3.e6': ['/ dá a divisão comum, // a parte inteira e % o resto.', 'Calcule cada linha separadamente: 7 ÷ 2 inteiro, o resto e a divisão comum.'],
    '3.e7': ['Em uma conta, * e / acontecem antes de + e -.', 'A soma das notas precisa estar entre parênteses antes de dividir por 3.'],
    '3.e8': ['O total é preço vezes quantidade, menos o desconto.', 'Troque o ___ por uma expressão que use preco, itens e desconto.'],
    '3.e9': ['Desconto de uma porcentagem: valor × porcentagem ÷ 100.', 'Calcule quanto vale o desconto em reais e subtraia do preço.'],
    '4.e1': ['Um número é positivo se for maior que 0, negativo se for menor que 0; senão, é zero.', 'Use if para o positivo, elif para o negativo e else para o zero.'],
    '4.e2': ['idade >= 18 é verdadeira para 18 ou mais.', 'Use if idade >= 18: ... else: ..., lembrando dos dois-pontos e do recuo.'],
    '4.e3': ['No if/elif/else, só o primeiro bloco verdadeiro é executado; teste a condição mais exigente primeiro.', 'Primeira condição: nota >= 7. Segunda: nota >= 5. O else cobre o resto.'],
    '4.e4': ['Comparações resultam em True ou False; == pergunta "é igual?" e != pergunta "é diferente?".', 'Resolva cada comparação separadamente: 10 > 5, 10 == 5 e 10 != 5.'],
    '4.e5': ['Quem tem 18 anos já é maior de idade; por isso a comparação inclui o 18.', 'Qual é a idade mínima para ser maior de idade? Esse é o valor da lacuna.'],
    '4.e6': ['A linha do if termina com dois-pontos.', 'Olhe com atenção o final da linha que começa com if.'],
    '4.e7': ['or é verdadeiro quando pelo menos uma condição é verdadeira.', 'A condição do desconto é: estudante or idade > 60. Mostre 10 se ela valer e 20 se não valer.'],
    '5.e1': ['Textos ficam entre aspas e números não; essas variáveis são os dados da calculadora.', 'Crie a e b (números) e operacao (um texto, como "+").'],
    '5.e2': ['Cada if/elif compara operacao com um símbolo e executa a conta correspondente.', 'Um bloco para cada operação: if operacao == "+": ..., elif operacao == "-": ..., e assim por diante.'],
    '5.e3': ['Um if pode ficar dentro de outro if, com mais 4 espaços de recuo.', 'No caso da divisão, teste primeiro se b == 0. O else final trata operações desconhecidas.'],
    '5.e4': ['Quando a condição do if é verdadeira, o bloco recuado é executado.', 'A resposta é "Brasília" e a condição compara com "Brasília": ela é verdadeira? O que acontece com pontos?'],
    '5.e5': ['A média de três notas é a soma delas, entre parênteses, dividida por 3.', 'Guarde (n1 + n2 + n3) / 3 em media e mostre o valor.'],
    '5.e6': ['Teste a condição mais exigente primeiro: média >= 7, depois >= 5.', 'Use if media >= 7, elif media >= 5 e else, cada um mostrando a situação correspondente.'],
    '5.e7': ['Cada if é avaliado separadamente: dois acertos somam dois pontos.', 'Use dois if independentes (não elif), cada um somando 1 ponto a pontos.'],
    '5.e8': ['Depois de contar, uma nova decisão usa o valor final de pontos.', 'No fim, acrescente um if pontos == 2 com a mensagem de parabéns e um else com a outra mensagem.'] };
  L.forEach(function (l) { l.ex.forEach(function (e) { var h = H[l.id + '.' + e.id]; if (!h) throw new Error('sem dicas revisadas: ' + l.id + '.' + e.id); e.h1 = h[0]; e.hint = h[1]; }); });
  var PH = { p1: ['Texto entre aspas aparece como está; sem aspas, a conta é calculada. O % dá o resto.', 'Calcule o resto de 10 por 3 para a primeira linha; a segunda é só um texto.'],
    p2: ['Entre aspas, "nome" é só a palavra; sem aspas, é o valor guardado na variável.', 'Use print("Olá,", nome), com a variável fora das aspas.'],
    p3: ['Uma variável pode entrar em uma conta como se fosse um número.', 'Mostre idade + 5.'],
    p4: ['Um número par dividido por 2 deixa sempre o mesmo resto.', 'Qual é o resto da divisão de 8 por 2? Esse é o valor da lacuna.'],
    p5: ['Um if/else decide o valor do frete; depois somamos ao total.', 'Se valor >= 100, o frete é 0; senão, é 15. Mostre valor + frete.'],
    p6: ['Cada print() escreve uma linha.', 'Use dois print(), um para cada linha pedida.'],
    p7: ['Quem abre o texto com um tipo de aspas precisa fechar com o mesmo tipo.', 'Compare as aspas do começo e do fim do texto.'],
    p8: ['Números não levam aspas.', 'Substitua ___ por um preço, como 12.'],
    p9: ['O total é horas vezes o valor da hora.', 'Mostre horas * valor_hora.'],
    p10: ['Primeiro acontecem as potências e multiplicações; depois, a soma.', 'Calcule separadamente 2 ** 3 e 4 * 2 e depois some os resultados.'],
    p11: ['O if escolhe um único caminho conforme a condição.', 'Use temperatura >= 30 como condição do if.'],
    p12: ['A média de duas notas é a soma delas, entre parênteses, dividida por 2.', 'Guarde a média em uma variável e compare com 6 em um if/else.'] };
  window.PRACTICE.forEach(function (e) { var h = PH[e.id]; if (!h) throw new Error('sem dicas revisadas: ' + e.id); e.h1 = h[0]; e.hint = h[1]; });

  /* glossário alinhado às aulas */
  var G = window.GLOSS;
  function setG(k, o) { var g = G.filter(function (x) { return x.k === k; })[0]; if (!g) { g = { k: k }; G.push(g); } for (var p in o) g[p] = o[p]; }
  setG('variavel', { t: 'Variável', d: 'Um nome que guarda um valor, como uma caixa com etiqueta: a etiqueta é o nome e o conteúdo é o valor.', e: 'idade = 17', a: 2 });
  setG('indentacao', { t: 'Indentação', d: 'O recuo no início de uma linha (em Python, quatro espaços). Mostra quais linhas pertencem a um bloco.', e: 'if x > 0:\n    print("positivo")', a: 4 });
  setG('programa', { t: 'Programa', d: 'Uma lista de instruções que o computador executa em ordem.', e: 'print("Olá!")', a: 1 });
  setG('comentario', { t: 'Comentário', d: 'Uma linha que começa com # e é ignorada pelo Python. Serve para explicar o código.', e: '# isto é um comentário', a: 1 });
  setG('atribuicao', { t: 'Atribuição', d: 'Guardar um valor em uma variável usando o sinal =. O valor da direita vai para o nome da esquerda.', e: 'nota = 8', a: 2 });
  setG('fstring', { t: 'f-string', d: 'Um texto com f antes das aspas em que o que está entre chaves é trocado pelo valor da variável.', e: 'f"Olá, {nome}!"', a: 2 });
  setG('saida', { t: 'Saída', d: 'O que o programa mostra na tela quando é executado.', e: 'print("2 + 3 =", 2 + 3)', a: 1 });
  setG('bloco', { t: 'Bloco', d: 'Um conjunto de linhas recuadas que "pertencem" a um if, elif ou else.', e: 'if x > 0:\n    print("a")\n    print("b")', a: 4 });
  setG('operador', { t: 'Operador', d: 'Símbolo que faz uma conta (+ - * / // % **) ou uma comparação (== != > < >= <=).', e: '2 + 3', a: 3 });
})();
