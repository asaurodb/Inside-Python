<div align="center">🐍 Inside Python
Aprenda, pratique e evolua.

Uma plataforma educacional interativa para aprender os fundamentos de Python diretamente pelo navegador.



</div>📖 Sobre o projeto
O Inside Python nasceu como um projeto educacional desenvolvido por estudantes do Senac para facilitar o primeiro contato com a programação. A proposta evoluiu de um site de conteúdos para uma aplicação web de aprendizagem interativa, que combina explicações, exemplos de código, experimentação e atividades práticas.

O objetivo é oferecer um ponto de partida acessível para quem deseja aprender Python, sem exigir a instalação de um ambiente de desenvolvimento no computador.
Foco atual: consolidar uma experiência de aprendizagem clara, progressiva e dedicada exclusivamente à linguagem Python.

✨ Funcionalidades
- Cinco aulas introdutórias com conteúdos organizados progressivamente.
- Editor Python no navegador com execução real por meio do Pyodide.
- Exemplos executáveis para experimentar os conceitos estudados.
- Exercícios interativos, com verificação de respostas e orientações.
- Revisões e desafios extras na área Hora de Praticar.
- Glossário para consulta de termos de programação.
- Acompanhamento e retomada dos estudos, com dados salvos localmente no navegador.
- Interface responsiva, pensada para acesso em diferentes dispositivos.
As funcionalidades disponíveis podem evoluir entre versões. Este README apresenta o projeto e sua base técnica; a implementação atual deve ser conferida no código da branch principal.

🎓 Trilha de aprendizagem
Aula	Conteúdo
1. Conhecendo Python	Introdução à programação e aos primeiros comandos
2. Entendendo variáveis	Variáveis, valores e tipos básicos
3. Aprendendo operações	Operadores e cálculos em Python
4. Estruturas condicionais	Comparações, if, elif e else
5. Primeiros projetos	Aplicação prática dos conceitos estudados


Metodologia
A evolução pedagógica do Inside Python é orientada pela sequência:

Entenda → Observe → Experimente → Pratique → Revise

A proposta é combinar explicações escritas, exemplos comentados, experimentação no editor e exercícios relacionados a cada conceito, com foco na autonomia do estudante.
🛠️ Tecnologias
- HTML5 — estrutura das páginas.
- CSS3 — estilos e responsividade.
- JavaScript — navegação, interface e lógica das atividades.
- Pyodide — execução de Python com WebAssembly no navegador.
- Web Workers — execução do interpretador sem bloquear a interface principal.
- localStorage — persistência local do progresso.
- Git e GitHub — versionamento do projeto.
- Vercel — publicação do site estático.
A base do projeto utiliza tecnologias web nativas, sem necessidade de um framework frontend.
💻 Como executar localmente
1. Clone o repositório:
   git clone https://github.com/thur77K/Inside-Python.git
2. Entre na pasta:
   cd Inside-Python
3. Inicie um servidor local, por exemplo com Python:
   python -m http.server 8000
4. Abra http://localhost:8000 no navegador.
É necessário ter conexão com a internet caso a distribuição do Pyodide ou outros recursos estejam sendo carregados por CDN. Usar um servidor local também evita limitações do protocolo file://.

✅ Testes
A base anterior do projeto inclui testes em JavaScript para o editor, a verificação dos exercícios e a retomada do progresso. Se esses arquivos estiverem presentes na versão atual, eles podem ser executados com Node.js:
node tests/test-worker.js
node tests/test-verify.js
node tests/test-resume.js
O funcionamento das aulas e do editor também deve ser conferido manualmente no navegador. A presença de testes não significa que todas as funcionalidades tenham sido auditadas ou estejam livres de erros.
🔐 Privacidade e segurança
Na arquitetura atual, parte do progresso do estudante é armazenada localmente no navegador, sem sincronização automática entre dispositivos. Limpar os dados do navegador pode apagar esse progresso.

O projeto está em evolução e não deve ser considerado um serviço com autenticação, infraestrutura de contas ou conformidade com a LGPD já validada. Antes de introduzir contas e armazenar dados pessoais em servidores, estão previstas revisões de segurança, privacidade, controle de acesso e tratamento de dados.

Não envie senhas, tokens, chaves de API ou credenciais ao repositório.
🚀 Próximos passos
- Consolidar a qualidade das explicações, exemplos, exercícios e revisões.
- Aprimorar a experiência de estudo guiado e a navegação.
- Ampliar os testes automatizados, a acessibilidade e a estabilidade.
- Preparar a arquitetura para futuras contas e sincronização de progresso.
- Planejar requisitos de segurança e privacidade antes de qualquer operação com dados pessoais na nuvem.
O objetivo de longo prazo é avaliar a evolução do Inside Python para um produto educacional digital, mantendo o foco inicial no ensino de Python.
📌 Origem
Projeto acadêmico desenvolvido no contexto do Ensino Médio Técnico em Ciências de Dados do Senac.
📄 Licença
Licença ainda não definida. A disponibilização pública do código não significa, por si só, autorização para copiar, modificar ou redistribuir o projeto. Consulte o responsável antes de reutilizar o material.
<div align="center">Inside Python — Aprenda, pratique e evolua.
</div>
