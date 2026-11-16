"use strict";

/*
  PokéCode · trilha de missões
  ---------------------------------------------------------------
  Ideia central: o aluno constrói UM ÚNICO JOGO que cresce a cada missão.
  Cada missão abre o arquivo da missão anterior, acrescenta uma peça
  (geralmente uma tecla nova) e salva com um número novo.

  Teclas do jogo (nenhuma missão reaproveita a tecla de outra):
    bandeira = preparar a cena · setas = andar · C = capturar
    E = equipe · M = mapa · X = testar o XP

  Cada bloco desenhado: [categoria, texto, blocos internos opcionais].
  Categorias: event, motion, look, control, data, sense, op, custom, break.
*/
(() => {
  const img = (name, alt = "") => `<img src="img/pokemon/${name}.png" alt="${alt}">`;
  const ball = state => `<img src="img/movimentos/pokebola/${state}.svg" alt="">`;
  const card = (visual, title, text) => `<div class="idea-card"><div class="idea-picture" aria-hidden="true">${visual}</div><h3>${title}</h3><p>${text}</p></div>`;
  const key = text => `<div class="memory-line"><span aria-hidden="true">✓</span><p>${text}</p></div>`;
  const task = (title, actor, where, instruction, blocks, success, tip = "", visual = "") => ({title, actor, where, instruction, blocks, success, tip, visual});
  const m = text => ["motion", text];
  const flag = ["event", "quando ⚑ for clicado"];
  const keyHat = k => ["event", `quando a tecla [${k}] for pressionada`];
  const gap = ["break", ""];

  // Blocos que se repetem em várias missões (assim o texto é sempre idêntico)
  const sway = [m("adicione (8) a x"), ["control", "espere (0.2) seg"], m("adicione (-8) a x"), ["control", "espere (0.2) seg"]];
  const pokeballFlag = [flag, ["look", "mostre"], m("vá para x: (-140) y: (-20)")];
  const pokemonFlag = [flag, ["look", "mostre"], m("vá para x: (100) y: (-20)"), ["look", "diga [Um Pokémon selvagem apareceu!] por (2) segundos"]];
  const reappear = [["look", "esconda"], ["control", "espere (1) seg"], m("vá para x: (número aleatório entre (-200) e (200)) y: (-20)"), ["look", "mostre"]];

  window.POKECODE_GAME_KEYS = [
    {key: "⚑", text: "Prepara a cena"},
    {key: "← ↑ → ↓", text: "O Pokémon anda"},
    {key: "C", text: "Lança a Pokébola"},
    {key: "E", text: "Mostra a equipe"},
    {key: "M", text: "Consulta o mapa"},
    {key: "X", text: "Testa o cálculo de XP"}
  ];

  window.POKECODE_LESSONS = [
    /* ───────────────────────────── 1 · PREPARAR ───────────────────────────── */
    {
      id: "preparar", label: "Prepare seu Pokémon", topic: "Atores e fantasias", symbol: "↑", time: "15 min",
      title: "Coloque seu Pokémon no palco.",
      lead: "Hoje você começa o seu jogo. Ao final desta missão, o Pokémon e a Pokébola estarão no palco e o Pokémon vai falar.",
      summary: "Coloque o Pokémon e a Pokébola no Scratch e faça o primeiro comando.",
      file: {open: "Um projeto novo no Scratch", save: "aventura-1.sb3"},
      adds: [{key: "⚑", text: "Bandeira verde: o Pokémon aparece e fala"}],
      concept: `<div class="idea-cards">${card(img("pikachu"), "Ator = quem participa", "O Pokémon é um ator. A Pokébola é outro ator. Cada ator tem o seu próprio código.")}${card(`${img("pikachu")}${img("pikachu-costas")}`, "Fantasia = aparência", "Frente e costas são duas fantasias do <strong>mesmo</strong> ator. Não é preciso criar um ator novo.")}${card('<span class="mini-code">⚑ → Olá!</span>', "Código = o que ele faz", "Os blocos são encaixados de cima para baixo. O Scratch executa nessa ordem.")}</div>${key("Antes de arrastar qualquer bloco, <strong>clique no ator</strong> que você quer programar, na lista abaixo do palco.")}<div class="editor-tour"><h3>As 4 partes do Scratch que você vai usar</h3><ol><li><b>Categorias</b> (coluna colorida à esquerda): Movimento, Aparência, Eventos… A cor do bloco mostra onde ele está.</li><li><b>Área de código</b> (meio): onde você arrasta e encaixa os blocos.</li><li><b>Palco</b> (direita, em cima): onde o jogo acontece. A bandeira verde começa; o botão vermelho para.</li><li><b>Lista de atores</b> (direita, embaixo): clique em um ator para ver e editar o código dele.</li></ol></div>`,
      demo: "upload", demoTitle: "Escolha e baixe seu Pokémon",
      plan: [
        task("Abra o Scratch em português", "Navegador", "Botão “Abrir Scratch” no topo da página", 'Clique em <strong>Abrir Scratch ↗</strong>. Se o editor estiver em inglês, clique no <strong>globo 🌐</strong> no canto superior esquerdo e escolha <strong>Português Brasileiro</strong>.', [], "O editor está aberto e os menus estão em português.", "Não precisa criar conta. Você vai salvar o arquivo no computador."),
        task("Apague o gato", "Ator1 (gato)", "Lista de atores, abaixo do palco", 'Todo projeto novo começa com um gato. Clique nele na lista de atores e depois no <strong>ícone da lixeira</strong> que aparece no canto da miniatura.', [], "A lista de atores está vazia.", "Se apagar sem querer outra coisa, use Editar → Restaurar."),
        task("Envie o Pokémon", "Pokemon", "Escolher um Ator → Enviar Ator ↑", 'Passe o mouse sobre o botão redondo <strong>Escolher um Ator</strong> (canto inferior direito). No menu que sobe, clique na <strong>seta para cima ↑ (Enviar Ator)</strong> e escolha o arquivo <code>.sprite3</code> que você baixou na etapa Experimente.', [], "O Pokémon aparece no palco e na lista de atores.", "Baixou o PNG em vez do .sprite3? Também funciona: envie o PNG de frente. Depois, em Fantasias → Enviar Fantasia, envie o PNG de costas.", "upload"),
        task("Dê um nome e ajuste o tamanho", "Pokemon", "Painel de informações, acima da lista de atores", 'No campo <strong>Ator</strong>, troque o nome para <code>Pokemon</code> (sem acento). No campo <strong>Tamanho</strong>, ajuste até o Pokémon ficar mais ou menos do tamanho de uma moeda na tela.', [], "O ator se chama Pokemon e tem um tamanho bom.", "Pokémon pequenos, como Bulbasaur, ficam bons com 150. Grandes, como Charizard, com 60."),
        task("Confira as duas fantasias", "Pokemon", "Aba Fantasias (no alto, ao lado de Código)", 'Clique na aba <strong>Fantasias</strong>. Você verá <strong>frente</strong> e <strong>costas</strong>. Clique em cada uma e veja o palco mudar. Volte para a <strong>frente</strong> e depois para a aba <strong>Código</strong>.', [], "Um único ator tem duas aparências.", "Enviar em Fantasias acrescenta uma aparência. Enviar em Escolher um Ator cria outro personagem.", "costume"),
        task("Envie a Pokébola", "Pokebola", "Escolher um Ator → Enviar Ator ↑", 'Envie o arquivo <code>pokebola-captura.sprite3</code> (baixado na etapa Experimente) como <strong>outro ator</strong>. Renomeie para <code>Pokebola</code> e ajuste o tamanho para <strong>60</strong>.', [], "Há dois atores separados: Pokemon e Pokebola.", "Ela tem 6 fantasias (fechada, balançando, capturada…). Por enquanto, deixe na fantasia fechada."),
        task("Programe a primeira fala", "Pokemon", "Eventos (amarelo) + Aparência (roxo) + Movimento (azul)", 'Clique no ator <strong>Pokemon</strong>. Arraste os blocos ao lado, <strong>um embaixo do outro, até ouvir o encaixe</strong>. Depois clique na bandeira verde.', pokemonFlag, "O Pokémon vai para a direita do palco e diz “Um Pokémon selvagem apareceu!”.", "Para trocar o texto ou os números, clique dentro do espaço branco do bloco e digite."),
        task("Prepare a Pokébola", "Pokebola", "Eventos + Aparência + Movimento", 'Agora clique no ator <strong>Pokebola</strong>. A área de código fica vazia, porque cada ator tem o seu código. Monte os blocos abaixo e clique na bandeira.', pokeballFlag, "A Pokébola fica à esquerda; o Pokémon, à direita.", "O sinal de menos faz parte do número: digite -140."),
        task("Salve seu jogo", "Projeto inteiro", "Arquivo → Baixar para o seu computador", 'No menu <strong>Arquivo</strong>, escolha <strong>Baixar para o seu computador</strong>. Salve com o nome <code>aventura-1.sb3</code>.', [], "O arquivo aventura-1.sb3 está na pasta Downloads (ou na pasta indicada pelo professor).", "Na próxima aula, abra com Arquivo → Carregar do seu computador.")
      ],
      scripts: [{name: "Pokemon", blocks: pokemonFlag}, {name: "Pokebola", blocks: pokeballFlag}],
      checks: ["Apaguei o gato e enviei meu Pokémon.", "O ator se chama Pokemon e tem duas fantasias.", "A Pokebola é um ator separado.", "Ao clicar na bandeira, o Pokémon aparece à direita e fala.", "Salvei como aventura-1.sb3 (no site, o jogo é salvo sozinho)."],
      expected: "Ao clicar na bandeira, a Pokébola fica à esquerda e o Pokémon fica à direita, dizendo “Um Pokémon selvagem apareceu!”.",
      tests: ["Arraste o Pokémon com o mouse para outro lugar e clique na bandeira: ele precisa voltar para a direita.", "Clique na Pokebola na lista de atores: os blocos do Pokémon NÃO aparecem nela."],
      errors: [
        ["Os blocos não fazem nada quando clico na bandeira.", "Confira se o primeiro bloco é o amarelo “quando ⚑ for clicado” e se os outros estão encaixados nele (sem espaço entre eles)."],
        ["Montei o código no ator errado.", "Arraste o conjunto de blocos até a miniatura do ator certo, na lista de atores. Ele é copiado. Depois apague o conjunto do ator errado."],
        ["O Pokémon tem fundo branco quadrado.", "Use o .sprite3 ou o PNG da galeria da aula: eles já vêm sem fundo."],
        ["Não acho o arquivo que baixei.", "Procure na pasta Downloads. Arquivos .sprite3 e .sb3 não abrem com dois cliques: é preciso enviá-los pelo Scratch."]
      ],
      question: "Se eu quiser o Pokémon de costas, preciso criar outro ator?",
      answer: "Não. Basta trocar a fantasia do mesmo ator. Assim, todo o código continua no mesmo personagem.",
      extension: "Encaixe <code>mude para a fantasia [costas]</code> e depois <code>mude para a fantasia [frente]</code> no fim da fala. Ele vira de costas e volta."
    },

    /* ─────────────────────────── 2 · COORDENADAS ─────────────────────────── */
    {
      id: "coordenadas", label: "Ande pelo palco", topic: "Coordenadas X e Y", symbol: "✛", time: "20 min",
      title: "X anda para os lados. Y sobe e desce.",
      lead: "Na missão 1 você digitou x: 100 e y: −20 sem saber bem o que era. Agora vai descobrir esse endereço e fazer o Pokémon andar com as setas do teclado.",
      summary: "Entenda X e Y e faça o Pokémon andar com as setas.",
      file: {open: "aventura-1.sb3", save: "aventura-2.sb3"},
      adds: [{key: "← ↑ → ↓", text: "Setas: o Pokémon anda pelo palco"}],
      concept: `<div class="coordinate-intro"><div class="axis-poster" role="img" aria-label="X positivo à direita, X negativo à esquerda, Y positivo acima e Y negativo abaixo. Centro zero, zero."><span class="poster-up">↑<b>+Y</b> sobe</span><span class="poster-left">← <b>−X</b></span><span class="poster-center">0, 0</span><span class="poster-right"><b>+X</b> →</span><span class="poster-down"><b>−Y</b> desce ↓</span></div><div class="coordinate-rules"><div><b class="x-ink">X · horizontal ↔</b><span>Negativo: esquerda.<br>Positivo: direita.</span></div><div><b class="y-ink">Y · vertical ↕</b><span>Negativo: abaixo.<br>Positivo: acima.</span></div></div></div>${key("<strong>(0, 0) é o centro do palco.</strong> O endereço (100, −20) quer dizer: 100 para a direita e 20 para baixo.")}<p class="one-note">O palco vai de X −240 a 240 e de Y −180 a 180. Dica: quando você arrasta um ator com o mouse, o Scratch mostra o X e o Y dele no painel do ator.</p>`,
      demo: "coordinates", demoTitle: "Leve Pikachu até a estrela",
      plan: [
        task("Abra o seu jogo", "Projeto inteiro", "Arquivo → Carregar do seu computador", 'Abra o Scratch e escolha <strong>Arquivo → Carregar do seu computador</strong>. Selecione <code>aventura-1.sb3</code>.', [], "O Pokémon e a Pokébola estão de volta, com o código da missão 1.", "Se o Scratch perguntar se quer substituir o projeto atual, clique em OK."),
        task("Descubra o endereço com o mouse", "Pokemon", "Palco + painel do ator", 'Arraste o Pokémon com o mouse pelo palco. Observe os campos <strong>x</strong> e <strong>y</strong> no painel do ator mudarem. Leve-o ao centro: os dois ficam perto de 0.', [], "Você percebeu: para a direita, x cresce. Para cima, y cresce."),
        task("Programe a seta para a direita", "Pokemon", "Eventos → quando a tecla… + Movimento → adicione a x", 'Crie um conjunto <strong>novo e separado</strong> (não encaixe na bandeira). No menu do bloco amarelo, escolha <strong>seta para direita</strong>.', [keyHat("seta para direita"), m("adicione (10) a x")], "Cada toque na seta → move o Pokémon 10 passos para a direita.", "Clique no palco antes de apertar a tecla, para o Scratch “ouvir” o teclado."),
        task("Faça as outras três setas", "Pokemon", "Clique com o botão direito → Duplicar", 'Duplique o conjunto três vezes (botão direito → <strong>Duplicar</strong>) e troque a tecla e o número de cada um.', [keyHat("seta para esquerda"), m("adicione (-10) a x"), gap, keyHat("seta para cima"), m("adicione (10) a y"), gap, keyHat("seta para baixo"), m("adicione (-10) a y")], "As quatro setas movem o Pokémon na direção certa.", "Esquerda e baixo usam −10. Cima e baixo usam o bloco de <strong>y</strong>, não de x."),
        task("Vire o Pokémon de costas ao subir", "Pokemon", "Aparência → mude para a fantasia", 'No conjunto da <strong>seta para cima</strong>, acrescente “costas”. No da <strong>seta para baixo</strong>, acrescente “frente”. Assim parece que ele anda para o fundo e volta.', [keyHat("seta para cima"), m("adicione (10) a y"), ["look", "mude para a fantasia [costas]"], gap, keyHat("seta para baixo"), m("adicione (-10) a y"), ["look", "mude para a fantasia [frente]"]], "Ao subir, o Pokémon fica de costas. Ao descer, de frente."),
        task("Volte a frente na bandeira", "Pokemon", "Conjunto da bandeira", 'Se o jogo terminar com o Pokémon de costas, ele recomeça de costas. Encaixe <strong>mude para a fantasia [frente]</strong> logo abaixo da bandeira.', [flag, ["look", "mude para a fantasia [frente]"], ["look", "mostre"], m("vá para x: (100) y: (-20)"), ["look", "diga [Um Pokémon selvagem apareceu!] por (2) segundos"]], "Toda vez que você clica na bandeira, o Pokémon começa de frente, no mesmo lugar."),
        task("Salve como aventura-2", "Projeto inteiro", "Arquivo → Baixar para o seu computador", 'Salve com o nome <code>aventura-2.sb3</code>. Guarde também o aventura-1: se algo der errado, você pode voltar.', [], "Você tem aventura-1.sb3 e aventura-2.sb3.")
      ],
      scripts: [{name: "Pokemon · bandeira", blocks: [flag, ["look", "mude para a fantasia [frente]"], ["look", "mostre"], m("vá para x: (100) y: (-20)"), ["look", "diga [Um Pokémon selvagem apareceu!] por (2) segundos"]]}, {name: "Pokemon · quatro setas", blocks: [keyHat("seta para direita"), m("adicione (10) a x"), gap, keyHat("seta para esquerda"), m("adicione (-10) a x"), gap, keyHat("seta para cima"), m("adicione (10) a y"), ["look", "mude para a fantasia [costas]"], gap, keyHat("seta para baixo"), m("adicione (-10) a y"), ["look", "mude para a fantasia [frente]"]]}],
      checks: ["Abri o aventura-1 e salvei como aventura-2.", "As setas → e ← mudam o X.", "As setas ↑ e ↓ mudam o Y.", "O Pokémon vira de costas ao subir e de frente ao descer.", "A bandeira coloca o Pokémon de frente em (100, −20)."],
      expected: "Na bandeira, o Pokémon aparece de frente à direita. Com as setas ele anda 10 passos de cada vez, e fica de costas quando sobe.",
      tests: ["Aperte → 5 vezes: o x deve aumentar 50.", "Aperte ↑ 3 vezes: o y deve aumentar 30 e o Pokémon fica de costas.", "Clique na bandeira: ele volta para (100, −20), de frente."],
      errors: [
        ["Aperto a seta e nada acontece.", "Clique uma vez no palco antes de usar o teclado. Confira também se escolheu “seta para direita” no menu do bloco amarelo (e não “espaço”)."],
        ["Aperto a seta para cima e ele vai para o lado.", "Você usou “adicione a x”. Para subir e descer, o bloco certo é “adicione a y”."],
        ["Todos os conjuntos fazem a mesma coisa.", "Depois de duplicar, é preciso trocar a tecla do bloco amarelo E o número de cada conjunto."],
        ["Encaixei a seta embaixo da bandeira.", "Cada tecla precisa do seu próprio bloco amarelo, separado. Arraste para longe e monte outro conjunto."]
      ],
      question: "Se eu mudar só o X, o Pokémon sobe?",
      answer: "Não. X muda a posição para os lados. Para subir ou descer, é o Y que muda.",
      extension: "Crie a tecla <code>espaço</code> para o Pokémon pular: repita 10 vezes adicione 4 a y, depois repita 10 vezes adicione −4 a y. Veja mais movimentos na <a href=\"movimentos.html\">oficina de movimentos</a>."
    },

    /* ─────────────────────── 3 · ALGORITMO E REPETIÇÃO ─────────────────────── */
    {
      id: "algoritmos", label: "Lance a Pokébola", topic: "Algoritmo e repetição", symbol: "↻", time: "25 min",
      title: "Uma captura. Quatro momentos em ordem.",
      lead: "Agora o jogo ganha ação: ao apertar C, a Pokébola vai até o Pokémon, balança três vezes e o captura. Depois, outro Pokémon selvagem aparece em outro lugar.",
      summary: "Tecla C: lançar, balançar 3 vezes e capturar.",
      file: {open: "aventura-2.sb3", save: "aventura-3.sb3"},
      adds: [{key: "C", text: "Tecla C: a Pokébola captura o Pokémon"}],
      concept: `<div class="capture-story"><div><span class="story-icon" aria-hidden="true">${ball("fechada")}</span><b>1 · Preparar</b><small>Pokébola no ponto de partida.</small></div><span class="story-arrow" aria-hidden="true">→</span><div><span class="story-icon" aria-hidden="true">→ ${ball("fechada")}</span><b>2 · Lançar</b><small>Uma única vez.</small></div><span class="story-arrow" aria-hidden="true">→</span><div class="repeat-focus"><span class="story-icon" aria-hidden="true">↔ ${ball("balanco-direita")}</span><b>3 · Balançar</b><small>Repetir 3 vezes.</small></div><span class="story-arrow" aria-hidden="true">→</span><div><span class="story-icon" aria-hidden="true">${ball("capturada")}</span><b>4 · Capturar</b><small>Avisar o Pokémon.</small></div></div>${key("<strong>Algoritmo = uma sequência de passos em ordem.</strong> Se você trocar a ordem, a história não faz sentido.")}<div class="analogy-grid"><div><h3>O que acontece uma vez</h3><p>Ir para o ponto de partida e lançar. Fica <strong>fora</strong> do repita.</p></div><div><h3>O que acontece várias vezes</h3><p>Um balanço = ir 8 para a direita e voltar 8. Fica <strong>dentro</strong> do repita 3 vezes.</p></div></div><p class="one-note">Os dois atores conversam por <strong>mensagem</strong>: a Pokébola transmite <code>capturado</code> e o Pokémon reage quando recebe. É como gritar “peguei!” para o outro ouvir.</p>`,
      demo: "sequence", demoTitle: "Coloque a captura em ordem",
      plan: [
        task("Abra o seu jogo", "Projeto inteiro", "Arquivo → Carregar do seu computador", 'Abra <code>aventura-2.sb3</code>. Clique na bandeira e nas setas para conferir que tudo continua funcionando.', [], "O jogo da missão 2 está aberto e funcionando."),
        task("Crie a tecla C na Pokébola", "Pokebola", "Eventos + Aparência + Movimento", 'Clique no ator <strong>Pokebola</strong>. Crie um conjunto novo com a tecla <strong>c</strong>. Ele começa colocando a Pokébola no ponto de partida.', [keyHat("c"), ["look", "mostre"], m("vá para x: (-140) y: (-20)")], "Ao apertar C, a Pokébola aparece à esquerda.", "O conjunto da bandeira que você fez na missão 1 continua lá. Este é outro conjunto."),
        task("Lance até o Pokémon", "Pokebola", "Movimento → deslize por 1 segs. até [ ]", 'Encaixe o bloco <strong>deslize… até</strong> que tem um menu (não o que tem x e y). No menu, escolha <strong>Pokemon</strong>.', [m("deslize por (1) segs. até [Pokemon ▾]")], "A Pokébola voa até onde o Pokémon estiver, mesmo que ele tenha andado com as setas.", "Se a opção Pokemon não aparece no menu, confira se o outro ator se chama exatamente Pokemon."),
        task("Repita só o balanço", "Pokebola", "Controle → repita", 'Encaixe <strong>repita 3 vezes</strong> abaixo do deslize. <strong>Dentro da “boca” do repita</strong>, monte os quatro blocos do balanço.', [["control", "repita (3) vezes", sway]], "Depois de chegar, a Pokébola balança 3 vezes no mesmo lugar.", "Use ponto, não vírgula: 0.2. O deslize fica FORA do repita, senão ela é lançada 3 vezes."),
        task("Avise que capturou", "Pokebola", "Eventos → transmita", 'Abaixo do repita (fora dele), encaixe <strong>transmita</strong>. Abra o menu do bloco → <strong>Nova mensagem</strong> → digite <code>capturado</code>. Depois, faça a Pokébola sumir.', [["event", "transmita [capturado ▾]"], ["control", "espere (1) seg"], ["look", "esconda"]], "Depois do terceiro balanço, a mensagem é enviada e a Pokébola some.", "Ainda não acontece nada visível: falta o Pokémon “ouvir” a mensagem."),
        task("Faça o Pokémon reagir", "Pokemon", "Eventos → quando eu receber", 'Clique no ator <strong>Pokemon</strong>. Crie um conjunto novo que começa com <strong>quando eu receber [capturado]</strong>.', [["event", "quando eu receber [capturado ▾]"], ["look", "diga [Fui capturado!] por (1) segundos"], ...reappear], "O Pokémon fala, some e reaparece em outro lugar: um novo Pokémon selvagem!", "O bloco verde “número aleatório” fica em Operadores. Encaixe-o no espaço do x."),
        task("Teste e salve", "Projeto inteiro", "Bandeira → setas → C", 'Clique na bandeira. Ande com as setas e aperte <strong>C</strong>. Repita algumas vezes. Depois, salve como <code>aventura-3.sb3</code>.', [], "Você consegue capturar várias vezes seguidas, em lugares diferentes.")
      ],
      scripts: [{name: "Pokebola · tecla C", blocks: [keyHat("c"), ["look", "mostre"], m("vá para x: (-140) y: (-20)"), m("deslize por (1) segs. até [Pokemon ▾]"), ["control", "repita (3) vezes", sway], ["event", "transmita [capturado ▾]"], ["control", "espere (1) seg"], ["look", "esconda"]]}, {name: "Pokemon · ao ser capturado", blocks: [["event", "quando eu receber [capturado ▾]"], ["look", "diga [Fui capturado!] por (1) segundos"], ...reappear]}],
      checks: ["A tecla C lança a Pokébola uma única vez.", "Só o balanço está dentro do repita 3 vezes.", "Criei a mensagem capturado e o Pokémon reage a ela.", "Depois da captura, o Pokémon reaparece em outro lugar.", "Salvei como aventura-3.sb3 (no site, o jogo é salvo sozinho)."],
      expected: "Ao apertar C, a Pokébola sai da esquerda, voa até o Pokémon, balança três vezes e some. O Pokémon diz “Fui capturado!”, desaparece e surge em outro ponto.",
      tests: ["Troque 3 por 1 no repita: deve acontecer um único balanço.", "Troque 3 por 5: cinco balanços, mas só um lançamento.", "Ande com as setas e aperte C: a Pokébola encontra o Pokémon onde ele estiver."],
      errors: [
        ["A Pokébola é lançada 3 vezes.", "O bloco deslize está dentro do repita. Arraste-o para cima, para fora da “boca” do repita."],
        ["A Pokébola sai do lugar a cada balanço.", "Os dois números do balanço precisam se anular: +8 e −8. Confira o sinal de menos."],
        ["O Pokémon não reage à captura.", "O nome da mensagem precisa ser igual nos dois blocos (transmita e quando eu receber). Confira se o “quando eu receber” está no ator Pokemon."],
        ["Não vejo o balanço.", "Faltou o espere 0.2 seg. Sem ele, o movimento é rápido demais para os olhos."]
      ],
      question: "Por que somamos 8 e depois −8 ao x?",
      answer: "O +8 empurra para a direita e o −8 traz de volta. Juntos formam um balanço completo, e a Pokébola termina no mesmo lugar onde começou.",
      extension: "Use as fantasias da Pokébola: dentro do repita, troque para <code>balanco-direita</code> e <code>balanco-esquerda</code>. No fim, mude para <code>capturada</code>. Na bandeira, volte para <code>fechada</code>."
    },

    /* ───────────────────────────── 4 · VETOR ───────────────────────────── */
    {
      id: "vetor", label: "Monte sua equipe", topic: "Vetor / lista", symbol: "[ ]", time: "25 min",
      title: "Cada Pokémon tem uma posição na equipe.",
      lead: "Até agora você captura, mas não guarda ninguém. Nesta missão, o jogo ganha uma equipe: uma lista com nomes em ordem. Toda captura acrescenta um nome nela.",
      summary: "Crie a lista equipe, percorra com a tecla E e guarde cada captura.",
      file: {open: "aventura-3.sb3", save: "aventura-4.sb3"},
      adds: [{key: "E", text: "Tecla E: mostra o próximo Pokémon da equipe"}, {key: "+", text: "Cada captura entra na lista equipe"}],
      concept: `<div class="static-team"><div><b>1</b>${img("pikachu")}<strong>Pikachu</strong></div><div class="chosen"><b>2</b>${img("charmander")}<strong>Charmander</strong></div><div><b>3</b>${img("squirtle")}<strong>Squirtle</strong></div></div><div class="address-result"><span>índice <b>2</b></span><span aria-hidden="true">→</span><span>conteúdo <b>Charmander</b></span></div>${key("<strong>Vetor = vários valores em sequência.</strong> Cada um tem um endereço numérico, o <strong>índice</strong>. No Scratch, usamos uma <strong>lista</strong>.")}<div class="analogy-grid"><div><h3>Variável</h3><p>Uma caixa com <strong>um</strong> valor. A variável <code>posição</code> guarda qual índice estamos olhando.</p></div><div><h3>Lista</h3><p>Uma fila de caixas numeradas. A lista <code>equipe</code> guarda <strong>vários</strong> nomes. No Scratch, o primeiro índice é <strong>1</strong>.</p></div></div>`,
      demo: "vector", demoTitle: "Toque em uma posição da equipe",
      plan: [
        task("Abra o seu jogo", "Projeto inteiro", "Arquivo → Carregar do seu computador", 'Abra <code>aventura-3.sb3</code>.', [], "A captura com a tecla C funciona."),
        task("Crie a lista e a variável", "Pokemon", "Variáveis (laranja) → Criar uma Lista / Criar uma Variável", 'Clique em <strong>Criar uma Lista</strong> e digite <code>equipe</code>. Depois <strong>Criar uma Variável</strong>: <code>posição</code>. Deixe marcado “Para todos os atores”.', [], "Aparece uma caixa vazia chamada equipe no palco.", "A caixa da lista no palco ajuda a ver o que está guardado. Você pode arrastá-la para um canto."),
        task("Coloque a equipe inicial", "Pokemon", "Conjunto da bandeira (no final)", 'No conjunto da <strong>bandeira</strong> do Pokemon, acrescente no final: limpar a lista e adicionar três nomes, <strong>um bloco para cada nome</strong>.', [["data", "apague todos os itens de [equipe ▾]"], ["data", "adicione [Pikachu] a [equipe ▾]"], ["data", "adicione [Charmander] a [equipe ▾]"], ["data", "adicione [Squirtle] a [equipe ▾]"], ["data", "mude [posição ▾] para (0)"]], "Ao clicar na bandeira, a caixa equipe mostra 1 Pikachu, 2 Charmander, 3 Squirtle.", "O “apague todos” evita que os nomes se repitam toda vez que você clica na bandeira."),
        task("Crie a tecla E", "Pokemon", "Eventos + Variáveis", 'Novo conjunto: tecla <strong>e</strong>. Cada toque aumenta a posição em 1.', [keyHat("e"), ["data", "adicione (1) a [posição ▾]"]], "A cada E, a variável posição aumenta: 1, 2, 3…", "Marque a caixinha ao lado de posição na paleta: o valor aparece no palco."),
        task("Volte ao começo no fim da lista", "Pokemon", "Controle → se + Operadores → maior que", 'Continue abaixo. Se a posição passar do tamanho da equipe, volte para 1.', [["control", "se <(posição) > (tamanho de [equipe ▾])> então", [["data", "mude [posição ▾] para (1)"]]]], "Depois do último, a posição volta para 1.", "Use o bloco “tamanho de equipe” em vez do número 3: assim funciona mesmo quando a equipe crescer."),
        task("Diga o nome daquela posição", "Pokemon", "Aparência → diga + Variáveis → item de", 'Encaixe um <strong>diga</strong>. Dentro dele, o bloco <strong>item (…) de equipe</strong>. Dentro do item, arraste o oval <strong>posição</strong>.', [["look", "diga (item (posição) de [equipe ▾]) por (1) segundos"]], "Apertando E: Pikachu → Charmander → Squirtle → Pikachu…"),
        task("Guarde cada captura na equipe", "Pokemon", "Conjunto “quando eu receber capturado”", 'No conjunto da missão 3, logo abaixo de “Fui capturado!”, acrescente o nome do <strong>seu</strong> Pokémon na equipe.', [["event", "quando eu receber [capturado ▾]"], ["look", "diga [Fui capturado!] por (1) segundos"], ["data", "adicione [Bulbasaur] a [equipe ▾]"], ["look", "esconda"], ["control", "…o resto continua igual"]], "Cada captura aumenta a lista. Depois de capturar, a tecla E mostra o novo nome.", "Escreva o nome do Pokémon que você escolheu, não precisa ser Bulbasaur."),
        task("Teste e salve", "Projeto inteiro", "Bandeira → E, E, E → C → E", 'Clique na bandeira. Aperte E três vezes. Capture com C. Aperte E de novo até ver o novo nome. Salve como <code>aventura-4.sb3</code>.', [], "A equipe começa com 3 e cresce a cada captura.")
      ],
      scripts: [{name: "Pokemon · final da bandeira", blocks: [["data", "apague todos os itens de [equipe ▾]"], ["data", "adicione [Pikachu] a [equipe ▾]"], ["data", "adicione [Charmander] a [equipe ▾]"], ["data", "adicione [Squirtle] a [equipe ▾]"], ["data", "mude [posição ▾] para (0)"]]}, {name: "Pokemon · tecla E", blocks: [keyHat("e"), ["data", "adicione (1) a [posição ▾]"], ["control", "se <(posição) > (tamanho de [equipe ▾])> então", [["data", "mude [posição ▾] para (1)"]]], ["look", "diga (item (posição) de [equipe ▾]) por (1) segundos"]]}],
      checks: ["Criei a lista equipe e a variável posição.", "A bandeira limpa a lista e coloca 3 nomes.", "A tecla E mostra um nome de cada vez, pela posição.", "Depois do último nome, volta para o primeiro.", "Cada captura acrescenta um nome à equipe.", "Salvei como aventura-4.sb3 (no site, o jogo é salvo sozinho)."],
      expected: "Na bandeira, a equipe tem 3 nomes. Apertando E, o Pokémon diz Pikachu, Charmander, Squirtle e volta ao começo. Depois de uma captura, a lista ganha mais um nome e o E também o mostra.",
      tests: ["Clique na bandeira duas vezes: a lista continua com 3 itens.", "Capture duas vezes: a lista fica com 5 itens.", "Aperte E várias vezes: depois do último item, volta para Pikachu."],
      errors: [
        ["A lista fica com nomes repetidos.", "Faltou o bloco “apague todos os itens de equipe” no começo, antes de adicionar os nomes."],
        ["O Pokémon diz um número em vez do nome.", "Você colocou só o oval posição no diga. Ele precisa estar DENTRO do bloco “item ( ) de equipe”."],
        ["Aparece um balão vazio depois do Squirtle.", "Confira o “se”: use “maior que” e o bloco “tamanho de equipe”."],
        ["A tecla E muda o x.", "Você usou “adicione 1 a x” (azul). O certo é “adicione 1 a posição” (laranja, Variáveis)."]
      ],
      question: "Se eu colocar Eevee antes de Pikachu, Pikachu continua no índice 1?",
      answer: "Não. O índice é a posição na fila. Se Eevee entrar na primeira posição, Pikachu passa para a segunda.",
      extension: "Faça a tecla <code>q</code> mostrar o Pokémon anterior: diminua 1 da posição e, se ficar menor que 1, mude para o tamanho da equipe."
    },

    /* ───────────────────────────── 5 · MATRIZ ───────────────────────────── */
    {
      id: "matriz", label: "Explore o mapa", topic: "Matriz: linhas e colunas", symbol: "▦", time: "30–40 min",
      title: "Dois números encontram um lugar no mapa.",
      lead: "Seu jogo vai ganhar um mapa da região com caminhos, árvores e um ginásio. Ao apertar M, o jogo pergunta linha e coluna e diz o que existe ali.",
      summary: "Tecla M: perguntar linha e coluna e descobrir o terreno.",
      file: {open: "aventura-4.sb3", save: "aventura-5.sb3"},
      adds: [{key: "M", text: "Tecla M: consulta uma célula do mapa"}],
      concept: `<div class="matrix-reading"><div class="mini-map" role="img" aria-label="Mapa de três linhas e três colunas. O ginásio está na linha 3, coluna 3."><span></span><b>1</b><b>2</b><b>3</b><b>1</b><span>·</span><span>♠</span><span>·</span><b>2</b><span>·</span><span>♠</span><span>·</span><b>3</b><span>·</span><span>·</span><span class="gym">★</span></div><div><span class="eyebrow green">ENDEREÇO DO GINÁSIO</span><h3>Linha 3 ↓<br>Coluna 3 →</h3><p>Primeiro a linha (de cima para baixo).<br>Depois a coluna (da esquerda para a direita).</p></div></div>${key("<strong>Vetor: um número de endereço. Matriz: dois números</strong> (linha e coluna). Cada encontro é uma <strong>célula</strong>.")}<p>Códigos do mapa: <strong>0 = caminho</strong> · <strong>1 = árvore</strong> · <strong>2 = ginásio</strong>.</p><details><summary>Por que vamos usar uma fórmula?</summary><div class="details-body"><p>O Scratch não tem tabela pronta, só listas. Então guardamos o mapa <strong>linha por linha</strong> em uma lista de 9 itens:</p><div class="map-rows"><span>linha 1 → itens 1, 2, 3: <b>0 · 1 · 0</b></span><span>linha 2 → itens 4, 5, 6: <b>0 · 1 · 0</b></span><span>linha 3 → itens 7, 8, 9: <b>0 · 0 · 2</b></span></div><div class="formula">índice = (linha − 1) × 3 + coluna</div><p>Para linha 2, coluna 3: pulo a linha 1 inteira (3 itens) e ando mais 3. Chego no item <strong>6</strong>.</p></div></details>`,
      demo: "matrix", demoTitle: "Clique no mapa e veja o endereço na lista",
      plan: [
        task("Abra o seu jogo", "Projeto inteiro", "Arquivo → Carregar do seu computador", 'Abra <code>aventura-4.sb3</code>.', [], "Bandeira, setas, C e E funcionam."),
        task("Crie a lista e as variáveis", "Pokemon", "Variáveis", 'Crie a lista <code>mapa</code> e quatro variáveis: <code>linha</code>, <code>coluna</code>, <code>índice</code> e <code>terreno</code>.', [], "Você tem uma lista nova e quatro variáveis novas.", "Desmarque as caixinhas das variáveis para o palco não ficar poluído. Deixe só a lista mapa visível por enquanto."),
        task("Guarde o mapa na bandeira", "Pokemon", "Conjunto da bandeira (no final)", 'No final da bandeira, limpe a lista e adicione os 9 valores <strong>nesta ordem</strong>: 0, 1, 0, 0, 1, 0, 0, 0, 2. Um bloco “adicione” para cada número.', [["data", "apague todos os itens de [mapa ▾]"], ["data", "adicione [0] a [mapa ▾]"], ["data", "adicione [1] a [mapa ▾]"], ["data", "adicione [0] a [mapa ▾]"], ["control", "… mais 6 blocos: 0, 1, 0, 0, 0, 2"]], "Ao clicar na bandeira, a lista mapa mostra 9 itens. O item 9 é 2.", "Monte um bloco, clique com o botão direito → Duplicar, e só troque o número."),
        task("Pergunte linha e coluna", "Pokemon", "Sensores (azul-claro) → pergunte + Variáveis", 'Novo conjunto com a tecla <strong>m</strong>. Faça duas perguntas e guarde cada <strong>resposta</strong> na sua variável.', [keyHat("m"), ["sense", "pergunte [Qual linha? (1, 2 ou 3)] e espere"], ["data", "mude [linha ▾] para (resposta)"], ["sense", "pergunte [Qual coluna? (1, 2 ou 3)] e espere"], ["data", "mude [coluna ▾] para (resposta)"]], "Ao apertar M, aparece uma caixa de digitação embaixo do palco.", "Guarde a resposta logo depois de cada pergunta: a segunda pergunta apaga a primeira resposta."),
        task("Calcule o índice", "Pokemon", "Operadores (verde) → − , × , +", 'Monte de dentro para fora: <strong>① linha − 1</strong>, encaixe em <strong>② ( ) × 3</strong>, encaixe em <strong>③ ( ) + coluna</strong>. Guarde em índice.', [["data", "mude [índice ▾] para (((linha) - (1)) * (3) + (coluna))"]], "Linha 2 e coluna 3 dão índice 6.", "Monte primeiro o bloco verde solto na área de código, teste clicando nele, e só depois encaixe."),
        task("Leia o terreno", "Pokemon", "Variáveis → item de", 'Use o índice para pegar o valor da lista mapa.', [["data", "mude [terreno ▾] para (item (índice) de [mapa ▾])"]], "Linha 3 e coluna 3 → índice 9 → terreno 2."),
        task("Decida o que dizer", "Pokemon", "Controle → se + Operadores → igual", 'Três “se”, um para cada código do mapa.', [["control", "se <(terreno) = (0)> então", [["look", "diga [Caminho livre!] por (2) segundos"]]], ["control", "se <(terreno) = (1)> então", [["look", "diga [Uma árvore bloqueia o caminho.] por (2) segundos"]]], ["control", "se <(terreno) = (2)> então", [["look", "diga [Encontrei o ginásio!] por (2) segundos"]]]], "A fala muda de acordo com a célula consultada."),
        task("Teste e salve", "Projeto inteiro", "Bandeira → M", 'Clique na bandeira, aperte M e teste (1,1), (1,2) e (3,3). Salve como <code>aventura-5.sb3</code>.', [], "Caminho, árvore e ginásio aparecem nos lugares certos.")
      ],
      scripts: [{name: "Pokemon · final da bandeira", blocks: [["data", "apague todos os itens de [mapa ▾]"], ["data", "adicione [0] a [mapa ▾]"], ["data", "adicione [1] a [mapa ▾]"], ["data", "adicione [0] a [mapa ▾]"], ["data", "adicione [0] a [mapa ▾]"], ["data", "adicione [1] a [mapa ▾]"], ["data", "adicione [0] a [mapa ▾]"], ["data", "adicione [0] a [mapa ▾]"], ["data", "adicione [0] a [mapa ▾]"], ["data", "adicione [2] a [mapa ▾]"]]}, {name: "Pokemon · tecla M", blocks: [keyHat("m"), ["sense", "pergunte [Qual linha? (1, 2 ou 3)] e espere"], ["data", "mude [linha ▾] para (resposta)"], ["sense", "pergunte [Qual coluna? (1, 2 ou 3)] e espere"], ["data", "mude [coluna ▾] para (resposta)"], ["data", "mude [índice ▾] para (((linha) - (1)) * (3) + (coluna))"], ["data", "mude [terreno ▾] para (item (índice) de [mapa ▾])"], ["control", "se <(terreno) = (0)> então", [["look", "diga [Caminho livre!] por (2) segundos"]]], ["control", "se <(terreno) = (1)> então", [["look", "diga [Uma árvore bloqueia o caminho.] por (2) segundos"]]], ["control", "se <(terreno) = (2)> então", [["look", "diga [Encontrei o ginásio!] por (2) segundos"]]]]}],
      checks: ["A lista mapa tem 9 itens separados.", "A tecla M pergunta linha e coluna e guarda as duas.", "Calculei o índice com a fórmula.", "Usei o índice para ler o terreno.", "As três falas aparecem nos lugares certos.", "Salvei como aventura-5.sb3 (no site, o jogo é salvo sozinho)."],
      expected: "Ao apertar M e digitar linha 1, coluna 2, o Pokémon diz que há uma árvore. Com linha 3, coluna 3, diz que encontrou o ginásio.",
      tests: ["(1, 1) → índice 1 → Caminho livre.", "(2, 2) → índice 5 → Árvore.", "(3, 3) → índice 9 → Ginásio."],
      errors: [
        ["A lista mapa tem só 1 item com “010010002”.", "Cada número precisa de um bloco “adicione” próprio. São 9 blocos."],
        ["O índice dá um número errado.", "Clique no bloco verde solto para testar. A ordem é: primeiro linha − 1, depois × 3, por último + coluna."],
        ["Ele não diz nada.", "Se o Pokémon acabou de ser capturado, ele pode estar escondido. Clique na bandeira antes de testar."],
        ["Diz “Caminho livre” para tudo.", "Confira se o terreno usa o bloco “item (índice) de mapa”, e não o oval índice sozinho."]
      ],
      question: "Por que não dá para achar a célula só com a coluna?",
      answer: "Porque a coluna 2 existe em três linhas diferentes (em cima, no meio e embaixo). Só com linha e coluna juntas o lugar fica único.",
      extension: "Antes de calcular, verifique se linha e coluna estão entre 1 e 3. Se não estiverem, diga “Endereço inválido” e não consulte o mapa."
    },

    /* ─────────────────────────── 6 · PROCEDIMENTO ─────────────────────────── */
    {
      id: "procedimento", label: "Crie seu próprio bloco", topic: "Procedimento e parâmetro", symbol: "{ }", time: "20 min",
      title: "Ensine uma ação uma vez. Use quantas vezes quiser.",
      lead: "O balanço da Pokébola tem 5 blocos. Agora você vai empacotar esses blocos dentro de um bloco novo, inventado por você: balançar (vezes).",
      summary: "Transforme o balanço em um bloco reutilizável com parâmetro.",
      file: {open: "aventura-5.sb3", save: "aventura-6.sb3"},
      adds: [{key: "{ }", text: "Bloco novo: balançar (vezes) na Pokébola"}],
      concept: `<div class="procedure-visual"><div><span class="eyebrow">1 · ENSINAR (definir)</span><div class="sb custom">defina balançar (vezes)</div><div class="visual-sway">→ 8 <span class="pokeball" aria-hidden="true"></span> −8 ←</div><p>Explica uma vez como balançar.</p></div><span class="big-arrow" aria-hidden="true">→</span><div><span class="eyebrow">2 · PEDIR (chamar)</span><div class="sb custom">balançar (3)</div><div class="visual-sway">↔ ↔ ↔</div><p>Usa o bloco onde precisar.</p></div></div>${key("<strong>Procedimento = um conjunto de passos com nome.</strong> O <strong>parâmetro</strong> “vezes” é o detalhe que muda a cada chamada.")}<p class="one-note">É como uma receita: você escreve uma vez “como fazer bolo” e depois só diz “faça 2 bolos”. O bloco fica em <strong>Meus Blocos</strong> (rosa) e só existe no ator onde foi criado: aqui, a <strong>Pokebola</strong>.</p>`,
      demo: "procedure", demoTitle: "A mesma ação, quantidades diferentes",
      plan: [
        task("Abra o seu jogo", "Projeto inteiro", "Arquivo → Carregar do seu computador", 'Abra <code>aventura-5.sb3</code> e clique no ator <strong>Pokebola</strong>.', [], "Você vê o código da bandeira e da tecla C da Pokébola."),
        task("Crie o bloco", "Pokebola", "Meus Blocos (rosa) → Criar um Bloco", 'Digite <code>balançar</code>. Clique em <strong>Adicionar uma entrada (número ou texto)</strong> e digite <code>vezes</code>. Clique em OK.', [["custom", "defina balançar (vezes)"]], "Aparece o bloco rosa “defina balançar (vezes)” na área de código.", "Não marque “Executar sem atualizar a tela”: queremos ver a animação."),
        task("Mova o repita para a definição", "Pokebola", "Conjunto da tecla C", 'No conjunto da tecla C, arraste o <strong>repita 3 vezes</strong> (ele leva junto o que está embaixo). Solte embaixo do <strong>defina</strong>. Depois arraste de volta só o <strong>transmita</strong> e o que vem depois para a tecla C.', [["custom", "defina balançar (vezes)"], ["control", "repita (3) vezes", sway]], "A definição tem o repita com o balanço dentro. A tecla C ficou sem o repita.", "Arrastar um bloco leva junto todos os que estão embaixo dele. Por isso é preciso devolver o transmita."),
        task("Use o parâmetro", "Pokebola", "Oval “vezes” no bloco defina", 'Arraste o oval <strong>vezes</strong> de dentro do “defina” e solte no espaço do número 3 do repita.', [["custom", "defina balançar (vezes)"], ["control", "repita (vezes) vezes", sway]], "O repita não tem mais um número fixo: quem decide é a chamada."),
        task("Chame o bloco na tecla C", "Pokebola", "Meus Blocos → balançar", 'Arraste o bloco rosa <strong>balançar ( )</strong> da paleta e encaixe <strong>entre o deslize e o transmita</strong>. Digite 3.', [keyHat("c"), ["look", "mostre"], m("vá para x: (-140) y: (-20)"), m("deslize por (1) segs. até [Pokemon ▾]"), ["custom", "balançar (3)"], ["event", "transmita [capturado ▾]"], ["control", "espere (1) seg"], ["look", "esconda"]], "A captura com C funciona igual a antes, mas agora usando o seu bloco."),
        task("Mude só o número", "Pokebola", "Bloco balançar na tecla C", 'Troque o 3 por <strong>1</strong> e teste. Depois por <strong>5</strong>. Antes de testar, diga em voz alta quantos balanços espera.', [["custom", "balançar (5)"]], "A definição não mudou. Só a quantidade de balanços muda."),
        task("Salve", "Projeto inteiro", "Arquivo → Baixar para o seu computador", 'Volte para <strong>balançar (3)</strong> e salve como <code>aventura-6.sb3</code>.', [], "O jogo funciona igual, mas o código ficou mais organizado.")
      ],
      scripts: [{name: "Pokebola · definição", blocks: [["custom", "defina balançar (vezes)"], ["control", "repita (vezes) vezes", sway]]}, {name: "Pokebola · tecla C", blocks: [keyHat("c"), ["look", "mostre"], m("vá para x: (-140) y: (-20)"), m("deslize por (1) segs. até [Pokemon ▾]"), ["custom", "balançar (3)"], ["event", "transmita [capturado ▾]"], ["control", "espere (1) seg"], ["look", "esconda"]]}],
      checks: ["Criei o bloco balançar no ator Pokebola.", "O bloco tem o parâmetro vezes.", "O repita da definição usa o oval vezes.", "A tecla C chama balançar (3).", "Salvei como aventura-6.sb3 (no site, o jogo é salvo sozinho)."],
      expected: "A captura funciona igual à missão 3, mas a tecla C agora tem um bloco rosa balançar (3). Trocando o número, muda a quantidade de balanços.",
      tests: ["balançar (1) → um balanço.", "balançar (5) → cinco balanços.", "No fim, a Pokébola está no mesmo x de antes do balanço."],
      errors: [
        ["A Pokébola não balança mais.", "Você criou a definição mas não chamou o bloco. Encaixe balançar (3) na tecla C."],
        ["Balança sempre 3 vezes, mesmo com balançar (5).", "O repita da definição ainda tem o número 3. Troque pelo oval vezes, arrastado do bloco defina."],
        ["Não acho o bloco balançar no ator Pokemon.", "Blocos criados ficam só no ator onde foram feitos. Ele está na Pokebola."],
        ["A captura não termina.", "O transmita capturado ficou dentro da definição ou sumiu. Ele precisa estar na tecla C, depois do balançar."]
      ],
      question: "Só criar a definição já faz a Pokébola balançar?",
      answer: "Não. A definição só ensina como fazer. A ação acontece quando o bloco é chamado, como balançar (3).",
      extension: "Crie o bloco <code>comemorar</code> no ator Pokemon, com uma fala e uma troca de fantasia. Chame-o depois de “Fui capturado!”."
    },

    /* ───────────────────────────── 7 · FUNÇÃO ───────────────────────────── */
    {
      id: "funcao", label: "Calcule o XP", topic: "Função: entrada e resultado", symbol: "ƒ", time: "25 min",
      title: "Um número entra. Um resultado sai.",
      lead: "Cada captura vale 10 pontos de experiência (XP). Você vai criar um bloco que recebe a quantidade de capturas e calcula o XP da equipe.",
      summary: "Crie calcular XP (capturas) e mostre o XP depois de cada captura.",
      file: {open: "aventura-6.sb3", save: "aventura-7.sb3"},
      adds: [{key: "X", text: "Tecla X: testa o cálculo com qualquer número"}, {key: "XP", text: "Cada captura soma XP"}],
      concept: `<div class="function-flow concept-flow"><div class="flow-part"><small>ENTRADA</small><strong>3 capturas</strong></div><span class="flow-arrow" aria-hidden="true">→</span><div class="flow-part"><small>REGRA</small><strong>× 10</strong></div><span class="flow-arrow" aria-hidden="true">→</span><div class="flow-part flow-result"><small>RESULTADO</small><strong>30 XP</strong></div></div>${key("<strong>Função = recebe uma entrada, faz um cálculo e devolve um resultado.</strong> O procedimento faz uma ação; a função produz um valor.")}<div class="precision-note"><strong>Como fazer isso no Scratch</strong><p>Os blocos de “Meus Blocos” não devolvem um valor. Então vamos <strong>simular</strong> uma função: o bloco faz a conta e guarda o resultado na variável <code>XP</code>. Depois de chamar o bloco, a gente lê a variável.</p></div>`,
      demo: "function", demoTitle: "Mude a entrada e preveja o resultado",
      plan: [
        task("Abra o seu jogo", "Projeto inteiro", "Arquivo → Carregar do seu computador", 'Abra <code>aventura-6.sb3</code> e clique no ator <strong>Pokemon</strong>.', [], "O jogo da missão 6 está aberto."),
        task("Crie as variáveis", "Pokemon", "Variáveis → Criar uma Variável", 'Crie <code>capturas</code> (quantas vezes você capturou) e <code>XP</code> (o resultado do cálculo). Deixe as duas marcadas para aparecerem no palco.', [], "No palco aparecem os mostradores capturas e XP."),
        task("Crie o bloco com entrada", "Pokemon", "Meus Blocos → Criar um Bloco", 'Nome: <code>calcular XP</code>. Adicione uma entrada <strong>número ou texto</strong> chamada <code>qtd</code>.', [["custom", "defina calcular XP (qtd)"]], "Aparece o bloco “defina calcular XP (qtd)”.", "Usamos o nome qtd para não confundir o parâmetro com a variável capturas."),
        task("Ensine a conta", "Pokemon", "Variáveis + Operadores → ×", 'Embaixo da definição, mude XP para <strong>qtd × 10</strong>. Arraste o oval <strong>qtd</strong> de dentro do “defina”.', [["custom", "defina calcular XP (qtd)"], ["data", "mude [XP ▾] para ((qtd) * (10))"]], "Entrada 3 → conta 3 × 10 → XP = 30."),
        task("Teste o cálculo com a tecla X", "Pokemon", "Novo conjunto", 'Antes de ligar no jogo, teste a função sozinha. A tecla X pergunta um número e mostra o resultado.', [keyHat("x"), ["sense", "pergunte [Quantas capturas?] e espere"], ["custom", "calcular XP (resposta)"], ["look", "diga (junte [XP: ] com (XP)) por (2) segundos"]], "Digitando 3, aparece “XP: 30”. Digitando 5, “XP: 50”.", "Diga ao colega qual resultado espera antes de apertar Enter."),
        task("Zere tudo na bandeira", "Pokemon", "Conjunto da bandeira (no final)", 'Todo jogo novo começa com zero capturas e zero XP.', [["data", "mude [capturas ▾] para (0)"], ["data", "mude [XP ▾] para (0)"]], "Ao clicar na bandeira, os dois mostradores voltam para 0."),
        task("Ligue o cálculo à captura", "Pokemon", "Conjunto “quando eu receber capturado”", 'Depois de adicionar o nome à equipe, conte a captura, chame o cálculo e mostre o XP.', [["event", "quando eu receber [capturado ▾]"], ["look", "diga [Fui capturado!] por (1) segundos"], ["data", "adicione [Bulbasaur] a [equipe ▾]"], ["data", "adicione (1) a [capturas ▾]"], ["custom", "calcular XP (capturas)"], ["look", "diga (junte [XP da equipe: ] com (XP)) por (1) segundos"], ["look", "esconda"], ["control", "…o resto continua igual"]], "Na 1ª captura: XP 10. Na 2ª: XP 20. Na 3ª: XP 30.", "Aqui você arrasta a VARIÁVEL capturas (paleta laranja) para dentro da chamada calcular XP ( )."),
        task("Teste e salve", "Projeto inteiro", "Bandeira → C, C, C", 'Clique na bandeira e capture 3 vezes. Salve como <code>aventura-7.sb3</code>.', [], "capturas = 3 e XP = 30.")
      ],
      scripts: [{name: "Pokemon · definição", blocks: [["custom", "defina calcular XP (qtd)"], ["data", "mude [XP ▾] para ((qtd) * (10))"]]}, {name: "Pokemon · tecla X (teste)", blocks: [keyHat("x"), ["sense", "pergunte [Quantas capturas?] e espere"], ["custom", "calcular XP (resposta)"], ["look", "diga (junte [XP: ] com (XP)) por (2) segundos"]]}, {name: "Pokemon · quando eu receber capturado", blocks: [["event", "quando eu receber [capturado ▾]"], ["look", "diga [Fui capturado!] por (1) segundos"], ["data", "adicione [Bulbasaur] a [equipe ▾]"], ["data", "adicione (1) a [capturas ▾]"], ["custom", "calcular XP (capturas)"], ["look", "diga (junte [XP da equipe: ] com (XP)) por (1) segundos"], ...reappear]}],
      checks: ["Criei as variáveis capturas e XP.", "O bloco calcular XP tem a entrada qtd.", "A conta multiplica qtd por 10.", "A tecla X testa o cálculo com qualquer número.", "Cada captura soma 1 e o XP aumenta 10.", "Salvei como aventura-7.sb3 (no site, o jogo é salvo sozinho)."],
      expected: "A tecla X responde 3 → XP 30. No jogo, cada captura aumenta capturas em 1 e o XP em 10, e o Pokémon diz o XP da equipe.",
      tests: ["Tecla X com 0 → XP 0.", "Tecla X com 7 → XP 70.", "Bandeira + 2 capturas → capturas 2, XP 20."],
      errors: [
        ["O XP fica sempre 0.", "A conta está na definição, mas o bloco não foi chamado. Confira se calcular XP (capturas) está no conjunto da captura."],
        ["O XP mostra o valor antigo.", "O diga está ANTES da chamada do cálculo. Primeiro calcule, depois mostre."],
        ["O XP não zera.", "Faltou mudar capturas e XP para 0 no conjunto da bandeira."],
        ["Aparece “XP da equipe: XP”.", "Você digitou a palavra XP dentro do junte. Arraste o oval laranja da variável XP."]
      ],
      question: "Mostrar “Você ganhou XP!” é a mesma coisa que calcular o XP?",
      answer: "Não. A frase não faz conta nenhuma. A função recebe a quantidade, multiplica por 10 e produz um número que o programa pode usar.",
      extension: "Adicione uma segunda entrada ao bloco: <code>calcular XP (qtd) (pontos)</code>, para mudar o valor de cada captura sem editar a definição."
    },

    /* ───────────────────────────── 8 · PROJETO FINAL ───────────────────────────── */
    {
      id: "projeto", label: "Expedição final", topic: "Projeto integrado", symbol: "★", time: "1 aula",
      title: "Ligue o mapa à captura e deixe o jogo com a sua cara.",
      lead: "Seu jogo já tem quase tudo. Falta uma regra: o Pokémon só pode ser capturado quando você encontrar o ginásio no mapa. Depois, é hora de personalizar e apresentar.",
      summary: "Encontrar o ginásio dispara a captura. Cenários e apresentação.",
      file: {open: "aventura-7.sb3", save: "expedicao-final.sb3"},
      adds: [{key: "★", text: "Encontrar o ginásio no mapa inicia a captura"}, {key: "🎨", text: "Cenários e personalização"}],
      concept: `<div class="project-parts">${card("[1] [2] [3]", "Vetor", "Tecla E · equipe")}${card("▦", "Matriz", "Tecla M · mapa")}${card("↔", "Procedimento", "balançar (3)")}${card("3 × 10", "Função", "calcular XP")}</div>${key("<strong>Mensagens ligam as partes.</strong> O mapa transmite <code>lançar</code> → a Pokébola captura e transmite <code>capturado</code> → o Pokémon entra na equipe e o XP é calculado.")}<div class="connection-flow" aria-label="Fluxo das mensagens"><span>Tecla M<br><small>acha o ginásio</small></span><b>→ lançar →</b><span>Pokebola<br><small>balançar (3)</small></span><b>→ capturado →</b><span>Pokemon<br><small>equipe + XP</small></span></div>`,
      demo: "final", demoTitle: "Qual parte do jogo usa cada conceito?",
      plan: [
        task("Abra o seu jogo", "Projeto inteiro", "Arquivo → Carregar do seu computador", 'Abra <code>aventura-7.sb3</code>. Teste tudo: bandeira, setas, C, E, M e X.', [], "Todas as teclas funcionam. Se alguma falhar, volte à missão dela."),
        task("Troque a tecla C por uma mensagem", "Pokebola", "Conjunto da tecla C", 'Arraste o bloco amarelo <strong>quando a tecla c</strong> para fora (os outros ficam no lugar). Coloque no topo <strong>quando eu receber [lançar]</strong>, criando a mensagem nova <code>lançar</code>. Apague o bloco da tecla c que sobrou.', [["event", "quando eu receber [lançar ▾]"], ["look", "mostre"], m("vá para x: (-140) y: (-20)"), m("deslize por (1) segs. até [Pokemon ▾]"), ["custom", "balançar (3)"], ["event", "transmita [capturado ▾]"], ["control", "espere (1) seg"], ["look", "esconda"]], "A Pokébola agora espera uma mensagem, e não mais uma tecla.", "Para segurar só o bloco do topo, arraste o bloco de baixo dele para longe, depois junte de novo."),
        task("O ginásio dispara a captura", "Pokemon", "Tecla M → último “se”", 'No “se terreno = 2”, depois da fala, acrescente <strong>transmita [lançar]</strong>.', [["control", "se <(terreno) = (2)> então", [["look", "diga [Encontrei o ginásio!] por (2) segundos"], ["event", "transmita [lançar ▾]"]]]], "Ao consultar (3, 3), a Pokébola é lançada sozinha."),
        task("Mude o cenário", "Palco", "Escolher um Cenário → Enviar Cenário", 'Baixe <a href="img/movimentos/cenarios/rota.svg" download>rota</a> e <a href="img/movimentos/cenarios/ginasio.svg" download>ginásio</a>. Clique no <strong>Palco</strong> (à direita da lista de atores) e envie os dois. Programe o palco:', [flag, ["look", "mude para o cenário [rota ▾]"], gap, ["event", "quando eu receber [lançar ▾]"], ["look", "mude para o cenário [ginasio ▾]"]], "O jogo começa na rota e muda para o ginásio na hora da captura.", "O Palco também tem código próprio: clique nele antes de montar."),
        task("Deixe com a sua cara", "Você escolhe", "Qualquer categoria", 'Escolha <strong>pelo menos uma</strong>: um som na captura, um pulo com espaço, uma comemoração com troca de fantasia, uma mensagem final quando o XP chegar a 50…', [["control", "se <(XP) > (40)> então", [["look", "diga [Você é um mestre Pokémon!] por (2) segundos"]]]], "Seu jogo tem pelo menos uma ideia que é só sua.", "Ideias de movimentos prontos estão na oficina de movimentos."),
        task("Teste com outra dupla e salve", "Projeto inteiro", "Bandeira → M → (1,1), (1,2), (3,3)", 'Peça a outra dupla para jogar sem a sua ajuda. Salve como <code>expedicao-final.sb3</code>.', [], "A outra dupla conseguiu capturar encontrando o ginásio."),
        task("Explique o seu algoritmo", "Dupla", "Sem olhar para os blocos", 'Conte, em voz alta ou por escrito: <strong>qual a entrada</strong> (teclas e respostas), <strong>quais decisões</strong> o jogo toma, <strong>o que se repete</strong> e <strong>qual o resultado</strong>.', [], "Vocês explicam onde estão o vetor, a matriz, o procedimento e a função.")
      ],
      scripts: [{name: "Plano completo do jogo, em português", blocks: [["event", "⚑ BANDEIRA: preparar atores, equipe, mapa, capturas = 0, XP = 0"], ["motion", "SETAS: o Pokémon anda (x e y)"], ["data", "E: mostrar item (posição) da equipe  · VETOR"], ["sense", "M: perguntar linha e coluna, calcular índice  · MATRIZ"], ["control", "se terreno = ginásio", [["event", "transmitir lançar"]]], ["custom", "Pokebola ao receber lançar: deslizar, balançar (3)  · PROCEDIMENTO"], ["event", "transmitir capturado"], ["custom", "Pokemon ao receber capturado: equipe + 1, calcular XP  · FUNÇÃO"]]}],
      scriptNote: "Este é o mapa do jogo inteiro, em português. Os blocos de verdade estão nas missões anteriores.",
      checks: ["A Pokébola espera a mensagem lançar.", "Encontrar o ginásio (3, 3) lança a Pokébola.", "Caminho e árvore NÃO lançam a Pokébola.", "O palco muda de cenário.", "Acrescentei pelo menos uma ideia minha.", "Outra dupla testou e salvei como expedicao-final.sb3."],
      expected: "Na bandeira, o jogo começa na rota. Ao apertar M e encontrar o ginásio, o cenário muda, a Pokébola captura o Pokémon, a equipe cresce e o XP aumenta.",
      tests: ["M com (1, 1): caminho livre, sem captura.", "M com (1, 2): árvore, sem captura.", "M com (3, 3): ginásio, captura e +10 XP.", "Bandeira: capturas e XP voltam a 0."],
      errors: [
        ["Nada acontece quando encontro o ginásio.", "O nome da mensagem precisa ser igual no transmita (Pokemon) e no quando eu receber (Pokebola)."],
        ["A tecla C ainda captura.", "Sobrou o conjunto antigo da tecla C. Apague-o ou deixe como “atalho de teste”."],
        ["O cenário não muda.", "O código do cenário precisa estar no Palco, e o nome do cenário precisa ser igual ao do bloco (ginasio, sem acento)."],
        ["Perdi parte do jogo.", "Abra o aventura-7.sb3: ele é a sua cópia de segurança."]
      ],
      question: "Como explicar o seu jogo sem mostrar os blocos?",
      answer: "Diga a entrada (teclas e respostas), a ordem das ações, as decisões (se é ginásio, captura) e a saída (equipe e XP). Isso é descrever o algoritmo.",
      extension: "Escreva o algoritmo do jogo em pseudocódigo, como uma receita numerada. Sublinhe as variáveis, circule as decisões e marque as repetições."
    }
  ];

  window.POKECODE_LESSONS.forEach((lesson, index) => { lesson.number = String(index + 1).padStart(2, "0"); });
})();
