"use strict";

// Cada bloco: [categoria, texto, blocos internos opcionais]. Os desenhos são guias de montagem.
window.POKECODE_LESSONS = [
  {
    id: "preparar", number: "00", label: "Prepare seu Pokémon", topic: "Atores e fantasias", symbol: "↑", time: "10–15 min",
    title: "Seu Pokémon, seu projeto.", summary: "Envie uma imagem, edite o ator e prepare o palco para programar.",
    lead: "Você pode escolher qualquer Pokémon. Primeiro, vamos colocar a imagem no Scratch e descobrir onde ficam os comandos.",
    concept: `<p>No Scratch, um <strong>ator</strong> é um personagem ou objeto. O Pokémon é um ator. A Pokébola é outro. Cada um tem seus próprios blocos de código.</p><p>A <strong>fantasia</strong> é a aparência do ator. Trocar de fantasia pode mudar a pose ou a expressão. O <strong>cenário</strong> é o fundo do palco.</p><div class="key-idea"><strong>Ator = quem participa.</strong> Fantasia = como ele aparece. Código = o que ele faz.</div><div class="upload-guide"><div class="upload-tile"><b>01 · ESCOLHER</b><h3>Salve a imagem</h3><p>Use uma imagem fornecida pelo professor ou um desenho seu. Salve no computador. PNG com fundo transparente facilita a montagem.</p></div><div class="upload-tile"><b>02 · ENVIAR</b><h3>Crie o ator</h3><p>No canto inferior direito, passe o mouse sobre o botão de escolher ator. No menu, selecione o ícone de envio, com uma seta para cima.</p></div><div class="upload-tile"><b>03 · PERSONALIZAR</b><h3>Edite a fantasia</h3><p>Selecione o ator e abra Fantasias. Você pode pintar, apagar o fundo e ajustar o desenho. Em Código, programe o comportamento.</p></div></div><div class="ui-route" aria-label="Caminho para enviar uma imagem"><span>Escolher um Ator</span> → <span>Enviar Ator ↑</span> → <span>Selecionar PNG ou JPG</span> → <span>Abrir</span></div><p>Em inglês: <strong>Choose a Sprite → Upload Sprite → Costumes</strong>. Para colocar outra pose no mesmo ator, abra <strong>Fantasias</strong> e use o menu de envio de fantasia. Enviar um ator cria um personagem novo; enviar uma fantasia cria outra aparência para o mesmo personagem.</p>`,
    demo: "upload", demoTitle: "Reconheça as partes do editor",
    tasks: [
      "Abra o Scratch pelo botão ao lado. No globo de idiomas, selecione <strong>Português Brasileiro</strong>.",
      "Abra a <a href=\"imagens.html\">galeria de imagens da aula</a>, baixe o Pokémon escolhido e envie o PNG como um ator. Renomeie o ator para <code>Pokemon</code>, sem acento, para facilitar os próximos exemplos.",
      "Abra <strong>Fantasias</strong>. Se a imagem tiver fundo, use a borracha. Se quiser, selecione o desenho inteiro para ajustar o tamanho e a posição no editor de pintura.",
      "Volte a <strong>Código</strong>. No campo de tamanho do ator, comece com 40%. Ajuste se ele ficar grande ou pequeno demais.",
      "Na galeria, baixe uma Pokébola e envie como <strong>outro ator</strong>. Renomeie para <code>Pokebola</code>. Ela tem 30 × 30 pixels: comece com tamanho 200%. Se preferir, use Pintar para criar a sua. Ajuste os dois atores para ficarem com aproximadamente 60 pixels de largura no palco.",
      "No ator Pokemon, monte os blocos da dica. Clique na bandeira. Para guardar o trabalho sem conta, use <strong>Arquivo → Baixar para o seu computador</strong>. O projeto será salvo como <code>.sb3</code>."
    ],
    scripts: [{name:"No ator Pokemon", blocks:[["event","quando a bandeira verde for clicada"],["look","mostre"],["motion","vá para x: 100 y: -20"],["look","diga [Olá, treinador!] por 2 segundos"]]}],
    checks:["Enviei e renomeei o ator Pokemon.","Editei uma fantasia e ajustei o tamanho.","Criei um ator separado chamado Pokebola.","Meu Pokémon aparece e fala ao clicar na bandeira."],
    expected:"O Pokémon escolhido aparece à direita do palco e diz “Olá, treinador!”. A Pokébola é um ator separado, pronto para ser programado.",
    tests:["Clique duas vezes na bandeira, uma vez após a outra: o Pokémon deve reaparecer na mesma posição.","Selecione a Pokébola: os blocos do Pokémon não devem aparecer na área de código dela."],
    question:"Se eu quiser duas poses do mesmo Pokémon, preciso criar dois atores?", answer:"Não. Envie duas fantasias para o mesmo ator. Assim, o código continua sendo do mesmo personagem.",
    extension:"Crie uma fantasia feliz e outra surpresa. Faça o Pokémon trocar de fantasia quando você apertar espaço."
  },
  {
    id:"algoritmos",number:"01",label:"Planeje uma captura",topic:"Algoritmo e repetição",symbol:"↻",time:"20–25 min",
    title:"Uma captura começa com uma boa sequência.",summary:"Organize a captura e descubra o que realmente se repete.",
    lead:"A Pokébola será lançada uma vez. Quando chegar ao Pokémon, vai balançar três vezes. Depois, uma mensagem avisa que a captura terminou.",
    concept:`<p><strong>Algoritmo é uma sequência de instruções para resolver uma tarefa.</strong> Na nossa animação, precisamos preparar a cena, lançar a Pokébola, balançar e finalizar a captura.</p><div class="analogy-grid"><div><h3>Sequência</h3><p>O lançamento vem antes da comemoração. Se você trocar a ordem, a história fica sem sentido.</p></div><div><h3>Repetição</h3><p>A Pokébola balança três vezes. Cada balanço tem dois movimentos: ir um pouco para o lado e voltar.</p></div></div><div class="key-idea"><strong>O que fica dentro do “repita” acontece várias vezes.</strong> O lançamento fica fora dele, porque acontece uma vez.</div><p>Também usamos uma <strong>mensagem</strong> para combinar os dois atores: a Pokébola transmite <code>capturado</code>, e o Pokémon reage quando recebe essa mensagem.</p><div class="callout">Este primeiro modelo é uma animação: a captura sempre dá certo. Decidir se uma captura falhou será um desafio de condição na continuação.</div>`,
    demo:"sequence",demoTitle:"Primeiro, coloque a captura em ordem",
    tasks:[
      "Use os atores <code>Pokemon</code> e <code>Pokebola</code> da preparação. Selecione a <strong>Pokebola</strong> antes de montar o lançamento.",
      "Ao clicar na bandeira, use <code>mostre</code> e <code>vá para x: -140 y: -20</code>. Essa é a posição de onde ela será lançada.",
      "Encaixe <code>deslize por 1 seg. até x: 100 y: -20</code>. A Pokébola vai até a posição do Pokémon.",
      "Encaixe <code>repita 3 vezes</code>. Dentro dele, coloque: adicionar 8 a x, esperar 0.2 segundo, adicionar -8 a x e esperar 0.2 segundo. Isso forma um balanço completo.",
      "Abaixo da repetição, coloque <code>transmita [capturado]</code>. Crie essa mensagem no menu do próprio bloco.",
      "Selecione <strong>Pokemon</strong>. Na bandeira, faça-o mostrar e ir para x: 100 y: -20. Em outro conjunto de blocos, use <code>quando eu receber [capturado]</code>, diga “Fui capturado!” por 1 segundo e esconda."
    ],
    scripts:[{name:"Pokebola · lançamento e balanço",blocks:[["event","quando a bandeira verde for clicada"],["look","mostre"],["motion","vá para x: -140 y: -20"],["motion","deslize por 1 seg. até x: 100 y: -20"],["control","repita (3) vezes",[["motion","adicione (8) a x"],["control","espere (0.2) seg"],["motion","adicione (-8) a x"],["control","espere (0.2) seg"]]],["event","transmita [capturado]"]]},{name:"Pokemon · dois conjuntos separados",blocks:[["event","quando a bandeira verde for clicada"],["look","mostre"],["motion","vá para x: 100 y: -20"],["break",""],["event","quando eu receber [capturado]"],["look","diga [Fui capturado!] por 1 segundo"],["look","esconda"]]}],
    checks:["Lancei a Pokébola uma única vez.","Coloquei apenas o balanço dentro do repita 3 vezes.","Criei a mensagem capturado e o recebimento no Pokémon.","O Pokémon reaparece quando reinicio pela bandeira."],
    expected:"A Pokébola sai da esquerda, chega à direita, balança três vezes e envia a mensagem. O Pokémon fala e desaparece.",
    tests:["Troque 3 por 1: deve acontecer um balanço completo.","Troque 3 por 5: devem acontecer cinco balanços, mas só um lançamento.","Reinicie: o Pokémon precisa aparecer novamente."],
    question:"Por que precisamos somar 8 e depois -8 à posição x?",answer:"O +8 desloca para a direita. O -8 devolve à posição anterior. Os dois movimentos juntos formam um balanço e evitam que a Pokébola fuja do lugar.",
    extension:"Dê um nome à sua animação e escreva seus passos em português. Explique a um colega qual parte é a repetição."
  },
  {
    id:"vetor",number:"02",label:"Organize sua equipe",topic:"Vetor / lista",symbol:"[ ]",time:"25–30 min",
    title:"Uma equipe. Vários Pokémon. Uma lista.",summary:"Guarde nomes e percorra a equipe pela posição de cada item.",
    lead:"Imagine escolher o primeiro, o segundo ou o terceiro Pokémon da sua equipe. Para isso, precisamos guardar os nomes em ordem e consultar cada posição.",
    concept:`<p>Um <strong>vetor</strong> organiza vários valores em uma sequência. Cada valor tem uma posição, chamada <strong>índice</strong>. Vamos usar uma <strong>lista do Scratch</strong> para representar essa ideia.</p><p>Na lista <code>equipe</code>, vamos guardar <strong>Pikachu, Charmander e Squirtle</strong>. No Scratch, o primeiro item tem índice <strong>1</strong>. O índice 2 aponta para Charmander; o índice 3, para Squirtle.</p><div class="analogy-grid"><div><h3>Variável</h3><p><code>posição = 2</code><br>Guarda um valor de cada vez. Aqui, guarda qual posição queremos consultar.</p></div><div><h3>Lista</h3><p><code>equipe = Pikachu, Charmander, Squirtle</code><br>Guarda vários itens em ordem.</p></div></div><div class="key-idea"><strong>Índice é o endereço. Item é o conteúdo.</strong> Na posição 2, o conteúdo é Charmander.</div><p>Uma lista do Scratch pode aumentar de tamanho. Aqui ela nos ajuda a praticar o acesso por índice, conceito usado em vetores de outras linguagens.</p>`,
    demo:"vector",demoTitle:"Toque em uma posição da equipe",
    tasks:[
      "Selecione o ator Pokemon. Em <strong>Variáveis → Criar uma Lista</strong>, crie <code>equipe</code>. Crie também a variável <code>posição</code>.",
      "Na bandeira, use <code>apague todos os itens de [equipe]</code>. Depois, adicione Pikachu, Charmander e Squirtle, nessa ordem. Assim a equipe não duplica ao reiniciar.",
      "Em seguida, mude a variável <code>posição</code> para 1. Use <code>diga (item (posição) de [equipe])</code>. Arraste o bloco laranja da variável para o espaço do índice.",
      "Em outro conjunto, use o evento <code>quando a tecla [seta para direita] for pressionada</code>. Adicione 1 a posição.",
      "Depois, use uma condição: <strong>se posição for maior que o tamanho da equipe, mude posição para 1</strong>. Isso faz a seleção voltar ao começo.",
      "Abaixo da condição, use novamente <code>diga (item (posição) de [equipe])</code>. Teste apertando a seta quatro vezes."
    ],
    scripts:[{name:"Pokemon · preparar a lista",blocks:[["event","quando a bandeira verde for clicada"],["data","apague todos os itens de [equipe]"],["data","adicione [Pikachu] a [equipe]"],["data","adicione [Charmander] a [equipe]"],["data","adicione [Squirtle] a [equipe]"],["data","mude [posição] para (1)"],["look","diga (item (posição) de [equipe])"]]},{name:"Pokemon · escolher o próximo",blocks:[["event","quando a tecla [seta para direita] for pressionada"],["data","adicione (1) a [posição]"],["control","se (posição > tamanho de [equipe]) então",[["data","mude [posição] para (1)"]]],["look","diga (item (posição) de [equipe])"]]}],
    checks:["Criei equipe como lista e posição como variável.","A lista tem os três nomes na ordem combinada.","Usei a variável posição dentro do bloco item de equipe.","Após o último item, a seleção volta à posição 1."],
    expected:"O Pokémon diz Pikachu no início. Ao apertar a seta direita, diz Charmander, depois Squirtle e, por fim, Pikachu novamente.",
    tests:["Reinicie duas vezes: a lista deve continuar com três itens.","Adicione Eevee como quarto item. O programa deve incluí-lo sem alterar o limite da condição."],
    question:"Se eu colocar Eevee antes de Pikachu, Pikachu continua no índice 1?",answer:"Não. Os índices indicam posições. Se Eevee ocupar a primeira, Pikachu passa para a segunda.",
    extension:"Programe a seta esquerda para escolher o Pokémon anterior. Ao passar de 1 para 0, volte ao tamanho da lista."
  },
  {
    id:"matriz",number:"03",label:"Explore a região",topic:"Matriz / linhas e colunas",symbol:"▦",time:"30–40 min",
    title:"Seu mapa tem linhas e colunas.",summary:"Leia um mapa 3 × 3 e encontre o que existe em cada célula.",
    lead:"Uma lista é como uma fila. Um mapa precisa de duas direções: linha e coluna. Vamos começar consultando o mapa, antes de programar um personagem andando nele.",
    concept:`<p>Uma <strong>matriz</strong> organiza dados em linhas e colunas. Cada encontro de uma linha com uma coluna forma uma <strong>célula</strong>.</p><p>Neste mapa, as linhas são contadas de cima para baixo; as colunas, da esquerda para a direita. O endereço <strong>linha 2, coluna 3</strong> aponta para uma célula específica.</p><div class="key-idea"><strong>Vetor: uma posição.</strong> Matriz: linha e coluna. Sempre diga primeiro a linha e depois a coluna.</div><p>Vamos usar <strong>0 = caminho</strong>, <strong>1 = árvore</strong> e <strong>2 = ginásio</strong>. O Scratch não oferece uma matriz pronta como tabela de listas. Por isso, vamos guardar as nove células em <strong>uma lista</strong>, lendo uma linha inteira antes de passar para a próxima.</p><p>Para uma grade com <strong>3 colunas</strong>, o índice na lista é:</p><div class="formula">índice = ((linha − 1) × 3) + coluna</div><p style="margin-top:16px">Exemplo: linha 2, coluna 3 → pulamos os 3 itens da primeira linha e avançamos mais 3. O índice é <strong>6</strong>. O −1 aparece porque, na primeira linha, ainda não pulamos nenhuma linha.</p>`,
    demo:"matrix",demoTitle:"Clique no mapa e veja o endereço na lista",
    tasks:[
      "Em um projeto de treino, selecione Pokemon. Crie a lista <code>mapa</code> e as variáveis <code>linha</code>, <code>coluna</code>, <code>índice</code> e <code>terreno</code>.",
      "Preencha a lista manualmente, usando o botão +: <strong>0, 1, 0, 0, 1, 0, 0, 0, 2</strong>. São exatamente nove itens. Não digite a linha inteira em um item só.",
      "Na bandeira, pergunte “Qual linha? Digite 1, 2 ou 3”. Mude <code>linha</code> para <code>resposta</code>. Faça outra pergunta para coluna e guarde em <code>coluna</code>.",
      "Monte os operadores verdes para calcular <code>((linha - 1) * 3) + coluna</code> e guarde em <code>índice</code>. Comece pela subtração, encaixe na multiplicação e, por último, na soma.",
      "Mude <code>terreno</code> para <code>item (índice) de [mapa]</code>. Use três blocos “se”: se terreno = 0, diga Caminho livre; se = 1, diga Há uma árvore; se = 2, diga Encontrei o ginásio.",
      "Teste primeiro com números inteiros de 1 a 3. Nesta versão, a lista já está preenchida: não a apague na bandeira. Desenhar a grade no cenário é uma etapa extra."
    ],
    scripts:[{name:"Pokemon · ler o endereço",blocks:[["event","quando a bandeira verde for clicada"],["sense","pergunte [Qual linha? 1, 2 ou 3] e espere"],["data","mude [linha] para (resposta)"],["sense","pergunte [Qual coluna? 1, 2 ou 3] e espere"],["data","mude [coluna] para (resposta)"],["data","mude [índice] para (((linha - 1) * 3) + coluna)"]]},{name:"Mesmo conjunto · consultar e decidir",blocks:[["data","mude [terreno] para (item (índice) de [mapa])"],["control","se (terreno = 0) então",[["look","diga [Caminho livre]"]]],["control","se (terreno = 1) então",[["look","diga [Há uma árvore]"]]],["control","se (terreno = 2) então",[["look","diga [Encontrei o ginásio]"]]]]}],
    checks:["Preenchi nove itens separados na lista mapa.","Guardei a linha e a coluna em variáveis diferentes.","Calculei o índice e consultei o item da lista.","Usei condições para diferenciar os três tipos de terreno."],
    expected:"O personagem informa o terreno da célula consultada. Linha 1, coluna 2 retorna árvore; linha 3, coluna 3 retorna ginásio.",
    tests:["Linha 1, coluna 1 → índice 1 → caminho.","Linha 2, coluna 2 → índice 5 → árvore.","Linha 3, coluna 3 → índice 9 → ginásio."],
    question:"Por que não podemos usar só a coluna para encontrar uma célula?",answer:"Porque a mesma coluna aparece em várias linhas. A coluna 2 pode ser a célula de cima, do meio ou de baixo. Precisamos das duas informações.",
    extension:"Antes de consultar a lista, verifique se linha e coluna são inteiros de 1 a 3. Se não forem, mostre “Endereço inválido”. Depois, desenhe a grade no cenário."
  },
  {
    id:"procedimento",number:"04",label:"Crie seu próprio bloco",topic:"Procedimento e parâmetro",symbol:"{ }",time:"20–30 min",
    title:"Dê um nome a uma ação completa.",summary:"Transforme o balanço da Pokébola em um bloco reutilizável.",
    lead:"Você já sabe balançar a Pokébola. Agora vai guardar essa sequência dentro de um bloco chamado balançar. Assim, poderá usar a mesma ação várias vezes.",
    concept:`<p>Um <strong>procedimento</strong> reúne instruções para executar uma tarefa. Em vez de remontar quatro comandos, você chama o bloco que já contém essa tarefa.</p><p>O procedimento <code>balançar (vezes)</code> faz a Pokébola ir para o lado e voltar. O valor <code>vezes</code> é um <strong>parâmetro</strong>: uma informação que você entrega ao chamar o bloco.</p><div class="analogy-grid"><div><h3>Definir</h3><p><code>defina balançar (vezes)</code><br>Aqui você ensina o que o bloco faz. Os comandos ficam embaixo dessa definição.</p></div><div><h3>Chamar</h3><p><code>balançar (3)</code><br>Aqui você pede a execução. O número 3 entra no parâmetro vezes.</p></div></div><div class="key-idea"><strong>Procedimento = uma tarefa com nome.</strong> Parâmetro = o detalhe que você pode mudar a cada chamada.</div><p>No Scratch, os blocos criados em <strong>Meus blocos</strong> pertencem ao ator em que foram definidos. Crie e chame <code>balançar</code> no ator <strong>Pokebola</strong>.</p>`,
    demo:"procedure",demoTitle:"A mesma ação, com quantidades diferentes",
    tasks:[
      "Abra sua animação de captura e selecione <strong>Pokebola</strong>. Entre em <strong>Meus blocos → Criar um bloco</strong>.",
      "Digite <code>balançar</code>. Adicione uma entrada do tipo <strong>número ou texto</strong> e chame-a de <code>vezes</code>. Confirme. Deixe desmarcada a opção de executar sem atualizar a tela.",
      "Abaixo de <code>defina balançar (vezes)</code>, encaixe um repita. Arraste o oval <code>vezes</code> da definição para o espaço numérico do repita.",
      "Dentro da repetição, coloque os quatro comandos do balanço: +8 a x, esperar 0.2 segundo, -8 a x, esperar 0.2 segundo.",
      "No programa da bandeira, substitua o antigo repita pelo novo bloco <code>balançar (3)</code>. Deixe o lançamento antes dele e a mensagem de captura depois.",
      "Teste com 1, 3 e 5. Mude apenas o número da chamada. A definição do procedimento continua igual."
    ],
    scripts:[{name:"Pokebola · definição do procedimento",blocks:[["custom","defina balançar (vezes)"],["control","repita (vezes) vezes",[["motion","adicione (8) a x"],["control","espere (0.2) seg"],["motion","adicione (-8) a x"],["control","espere (0.2) seg"]]]]},{name:"Pokebola · programa principal",blocks:[["event","quando a bandeira verde for clicada"],["look","mostre"],["motion","vá para x: -140 y: -20"],["motion","deslize por 1 seg. até x: 100 y: -20"],["custom","balançar (3)"],["event","transmita [capturado]"]]}],
    checks:["Criei balançar no ator Pokebola.","Adicionei o parâmetro vezes ao bloco.","Usei esse parâmetro no repita da definição.","Chamei balançar (3) no programa principal."],
    expected:"O programa continua fazendo a captura. Agora o balanço é executado por um bloco personalizado. Alterar o número muda a quantidade de balanços.",
    tests:["balançar (1) → um balanço completo.","balançar (5) → cinco balanços completos.","A posição x ao final deve ser a mesma de antes do balanço."],
    question:"Basta criar a definição para a Pokébola balançar?",answer:"Não. A definição ensina a tarefa, mas é preciso chamar balançar no programa para executá-la.",
    extension:"Crie o procedimento comemorar, com uma fala e uma troca de fantasia. Chame-o ao receber a mensagem de captura no ator Pokemon."
  },
  {
    id:"funcao",number:"05",label:"Calcule a experiência",topic:"Função: entrada e resultado",symbol:"ƒ",time:"20–30 min",
    title:"Entregue um número. Receba um resultado.",summary:"Calcule a experiência da equipe e entenda a ideia de função.",
    lead:"Nesta atividade, cada captura vale 10 pontos de experiência. Essa é uma regra criada para o nosso jogo. Quantos pontos uma equipe ganha com três capturas?",
    concept:`<p>Uma <strong>função</strong> recebe informações, realiza uma operação e produz um resultado. Na nossa regra: <strong>XP = quantidade de capturas × 10</strong>.</p><p>Se a entrada é 3, a conta é 3 × 10 e o resultado é 30. Se a entrada muda para 5, a mesma regra produz 50.</p><div class="key-idea"><strong>Entrada → cálculo → resultado.</strong> Primeiro calcule. Depois use o resultado em uma fala, variável ou decisão.</div><div class="callout"><strong>Como isso funciona no Scratch:</strong> “Meus blocos” cria procedimentos, sem um retorno personalizado em formato oval. Vamos <strong>simular uma função</strong> guardando o cálculo na variável <code>XP calculado</code>. O nosso bloco continua sendo um procedimento do Scratch, usado para estudar a ideia de função.</div><p>Um exemplo de bloco que já entrega um valor no Scratch é <code>tamanho de [equipe]</code>: ele informa a quantidade de itens da lista. Você consegue encaixar esse valor dentro de outro bloco.</p><table class="compare-table"><thead><tr><th>Ideia</th><th>O que acontece</th></tr></thead><tbody><tr><td>Procedimento <code>balançar (3)</code></td><td>Executa uma animação.</td></tr><tr><td>Função <code>calcular XP (3)</code>, em conceito</td><td>Produz o valor 30.</td></tr><tr><td>Nossa simulação no Scratch</td><td>O bloco faz a conta e a variável XP calculado guarda 30.</td></tr></tbody></table>`,
    demo:"function",demoTitle:"Mude a entrada e preveja o resultado",
    tasks:[
      "Selecione Pokemon. Crie a variável <code>XP calculado</code>. Ela vai guardar a saída do cálculo.",
      "Em <strong>Meus blocos</strong>, crie <code>calcular XP (capturas)</code>, com uma entrada número ou texto chamada <code>capturas</code>.",
      "Na definição, use <code>mude [XP calculado] para ((capturas) * 10)</code>. Arraste o parâmetro da definição para o operador de multiplicação.",
      "No programa principal, ao clicar na bandeira, mude XP calculado para 0 e pergunte “Quantas capturas? Digite um inteiro de 0 a 6”.",
      "Chame <code>calcular XP (resposta)</code>. Abaixo, use <code>diga (junte [XP da equipe: ] com (XP calculado))</code>. Leia a variável depois da chamada.",
      "Teste com 0, 2 e 5. Antes de executar cada valor, diga ao colega qual resultado você espera."
    ],
    scripts:[{name:"Pokemon · simulação do cálculo",blocks:[["custom","defina calcular XP (capturas)"],["data","mude [XP calculado] para ((capturas) * 10)"]]},{name:"Pokemon · usar o resultado",blocks:[["event","quando a bandeira verde for clicada"],["data","mude [XP calculado] para (0)"],["sense","pergunte [Quantas capturas? De 0 a 6] e espere"],["custom","calcular XP (resposta)"],["look","diga (junte [XP da equipe: ] com (XP calculado))"]]}],
    checks:["Criei o parâmetro capturas e a variável XP calculado.","O cálculo multiplica a entrada por 10.","Chamei o bloco antes de usar a variável de resultado.","Expliquei por que estamos simulando uma função no Scratch."],
    expected:"Ao digitar 3, o personagem diz “XP da equipe: 30”. O mesmo bloco funciona com outras quantidades, sem mudar a conta na definição.",
    tests:["0 capturas → 0 XP.","2 capturas → 20 XP.","5 capturas → 50 XP."],
    question:"Mostrar “Você ganhou XP!” é a mesma coisa que calcular o XP?",answer:"Não. A frase sozinha não calcula nada. Precisamos receber a quantidade, multiplicar por 10 e disponibilizar o valor calculado.",
    extension:"Troque a regra para 15 XP por captura. Depois crie um segundo parâmetro, valor por captura, para mudar a regra sem editar a definição."
  },
  {
    id:"projeto",number:"06",label:"Conquiste sua insígnia",topic:"Projeto e próximos algoritmos",symbol:"★",time:"1 aula ou mais",
    title:"Agora conecte as quatro ideias.",summary:"Crie uma expedição que usa equipe, mapa, animação e cálculo.",
    lead:"Você já treinou cada conceito. Agora sua dupla vai montar uma pequena expedição Pokémon e explicar o algoritmo que conecta todas as partes.",
    concept:`<p>A missão é construir uma <strong>expedição de consulta</strong>: escolher um Pokémon da equipe, consultar uma célula do mapa e reagir ao terreno encontrado.</p><div class="analogy-grid"><div><h3>Dados do jogo</h3><p><strong>Vetor:</strong> nomes na lista equipe.<br><strong>Matriz:</strong> região na lista mapa.</p></div><div><h3>Ações e resultados</h3><p><strong>Procedimento:</strong> animação balançar.<br><strong>Função simulada:</strong> cálculo do XP.</p></div></div><div class="key-idea"><strong>Não precisa criar um jogo enorme.</strong> Uma expedição simples, com os quatro conceitos funcionando e bem explicados, cumpre a missão.</div><p>Primeiro, escolha os nomes e consulte o mapa por perguntas. Depois que isso funcionar, você pode desenhar a grade, adicionar movimento por teclas ou novas regras de captura.</p>`,
    demo:"final",demoTitle:"Qual conceito resolve cada parte?",
    tasks:[
      "Escolham um projeto como base e salvem uma cópia com o nome <code>Expedição Pokémon - nomes da dupla</code>.",
      "Na bandeira, preparem a lista equipe, o mapa de nove itens e as variáveis necessárias. Para a lista mapa, escolham preencher manualmente ou por blocos: se usarem blocos, apaguem os itens antes de adicioná-los.",
      "No ator Pokemon, perguntem o índice da equipe e mostrem o nome escolhido. Depois, perguntem linha e coluna e consultem o terreno pela fórmula da matriz.",
      "Usem condições: caminho → mensagem de exploração; árvore → passagem bloqueada; ginásio → transmitam <code>iniciar captura</code>.",
      "No ator Pokebola, usem <code>quando eu receber [iniciar captura]</code> para lançar, chamar <code>balançar (3)</code> e transmitir <code>capturado</code>.",
      "No ator Pokemon, ao receber capturado, adicionem 1 à variável <code>capturas</code> e chamem <code>calcular XP (capturas)</code>. Mostrem o XP. Deixem os blocos personalizados no ator em que são chamados.",
      "Façam uma dupla vizinha testar. Guardem o arquivo .sb3 e registrem: o que entrou, quais passos aconteceram e qual resultado apareceu."
    ],
    scripts:[{name:"Plano em português · transforme em blocos",blocks:[["event","INÍCIO: preparar listas e capturas = 0"],["sense","ENTRADA: escolher posição da equipe"],["data","VETOR: consultar o nome pelo índice"],["sense","ENTRADA: perguntar linha e coluna"],["data","MATRIZ: calcular índice e ler terreno"],["control","DECISÃO: se terreno = ginásio",[["event","pedir a captura à Pokebola"],["custom","na Pokebola: chamar balançar (3)"],["event","enviar capturado para Pokemon"],["custom","no Pokemon: calcular XP (capturas)"]]],["look","SAÍDA: mostrar o resultado da expedição"]]}],
    scriptNote:"Este quadro final é um plano do algoritmo em português, não uma lista de blocos prontos. Use as montagens das missões anteriores para implementá-lo.",
    checks:["Consultei a equipe pelo índice: vetor.","Consultei o mapa por linha e coluna: matriz.","Reutilizei o procedimento balançar.","Calculei e mostrei o XP: função simulada.","Usei condições e mensagens entre os atores.","Outra dupla testou os três terrenos e salvamos o projeto."],
    expected:"A expedição escolhe um Pokémon, consulta o mapa e reage ao terreno. Ao encontrar o ginásio, executa a animação e atualiza a experiência da equipe.",
    tests:["Linha 1, coluna 1: mostra caminho e não inicia captura.","Linha 1, coluna 2: informa árvore e não inicia captura.","Linha 3, coluna 3: anima captura e a primeira captura rende 10 XP.","Reinicie: capturas e XP devem voltar a zero."],
    question:"Como explicar seu algoritmo sem mostrar os blocos?",answer:"Descreva a entrada, a ordem das ações, a condição de cada caminho e a saída. Exemplo: escolho uma posição, encontro o Pokémon, consulto uma célula e decido o que fazer com o terreno.",
    extension:"Na próxima aula, transforme essa explicação em pseudocódigo. Sublinhe variáveis, circule decisões e marque repetições. Depois, acrescente validação das entradas e novas regras ao jogo."
  }
];
