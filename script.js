"use strict";

const lessons = window.POKECODE_LESSONS;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const storageKey = "pokecode-v5-progress";
const gameKeys = window.POKECODE_GAME_KEYS || [];
const pokemonList = ["pikachu","bulbasaur","charmander","charizard","squirtle","jigglypuff","meowth","psyduck","gengar","eevee","snorlax","dragonite","mewtwo","mew","chikorita","cyndaquil"];
const cap = name => name[0].toUpperCase() + name.slice(1);
let stored = {};
try { stored = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch { stored = {}; }
if (!stored || typeof stored !== "object" || Array.isArray(stored)) stored = {};
let currentId = "inicio";
let viewVersion = 0;
let flowStep = 0;
let buildStep = 0;

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(stored)); } catch { /* Modo privado: a sessão continua funcionando. */ }
}

function isComplete(lesson) {
  return lesson.checks.every((_, index) => stored[`${lesson.id}-${index}`] === true);
}

function renderNavigation() {
  const done = lessons.filter(isComplete).length;
  $("#missionNav").innerHTML = `<a class="nav-item ${currentId === "inicio" ? "active" : ""}" href="#inicio" ${currentId === "inicio" ? 'aria-current="page"' : ""}><span class="nav-index">⌂</span><span>Comece aqui<small>Como funciona a trilha</small></span></a><span class="nav-group">SEU JOGO, MISSÃO A MISSÃO</span>` + lessons.map(lesson => `<a class="nav-item ${lesson.id === currentId ? "active" : ""} ${isComplete(lesson) ? "complete" : ""}" href="#${lesson.id}" ${lesson.id === currentId ? 'aria-current="page"' : ""}><span class="nav-index"><span>${lesson.number}</span></span><span>${lesson.label}<small>${lesson.topic}</small></span></a>`).join("") + '<span class="nav-group">MATERIAIS DE APOIO</span><a class="nav-item" href="imagens.html"><span class="nav-index" aria-hidden="true">↓</span><span>Imagens<small>PNG dos Pokémon e Pokébolas</small></span></a><a class="nav-item" href="movimentos.html"><span class="nav-index" aria-hidden="true">↻</span><span>Oficina de movimentos<small>Atores, cenários e extras</small></span></a>';
  $("#progressText").textContent = `${done} de ${lessons.length} missões`;
  $("#courseProgress").max = lessons.length;
  $("#courseProgress").value = done;
  $("#courseProgress").textContent = `${done} de ${lessons.length}`;
}

function keyChips(adds, current = false) {
  return adds.map(item => `<span class="game-key ${current ? "new" : ""}"><kbd>${item.key}</kbd>${item.text}</span>`).join("");
}

function gameSoFar(index) {
  const before = lessons.slice(0, index).flatMap(lesson => lesson.adds);
  return `<div class="game-strip"><span class="eyebrow">SEU JOGO ATÉ AGORA</span><div class="game-keys">${before.length ? keyChips(before) : '<span class="game-empty">Ainda vazio: esta é a primeira peça.</span>'}${keyChips(lessons[index].adds, true)}</div></div>`;
}

$("#missionCards").innerHTML = lessons.map(lesson => `<a class="mission-card" href="#${lesson.id}"><span class="card-num">${lesson.number}</span><div><span class="eyebrow green">${lesson.topic}</span><h3>${lesson.label}</h3><p>${lesson.summary}</p><div class="card-keys">${lesson.adds.map(item => `<kbd>${item.key}</kbd>`).join("")}<small>${lesson.time}</small></div></div><span class="card-arrow" aria-hidden="true">→</span></a>`).join("");
$("#fileChain").innerHTML = lessons.map((lesson, i) => `<a href="#${lesson.id}"><b>${lesson.file.save}</b><small>missão ${lesson.number}</small></a>${i < lessons.length - 1 ? '<span aria-hidden="true">→</span>' : ""}`).join("");
$("#finalKeys").innerHTML = gameKeys.map(item => `<div><kbd>${item.key}</kbd><span>${item.text}</span></div>`).join("");

function blockMarkup(blocks) {
  return blocks.map(([kind, text, inner]) => kind === "break" ? '<div style="height:20px" aria-hidden="true"></div>' : `<div class="sb ${kind} ${inner ? "loop" : ""}">${text}${inner ? `<div class="sb-inside">${blockMarkup(inner)}</div>` : ""}</div>`).join("");
}

function coordinateMarkup() {
  return `<p class="demo-instruction">Use as setas para chegar a <strong>X = 100, Y = −20</strong>. Cada clique muda 20 unidades.</p><div class="coordinate-play"><div class="coordinate-stage" role="group" aria-label="Palco de coordenadas do Scratch"><svg viewBox="0 0 480 360" aria-hidden="true"><defs><pattern id="coordGrid" width="40" height="40" x="0" y="20" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#d5e3d9"/></pattern></defs><rect width="480" height="360" fill="#f2f7ef"/><rect width="480" height="360" fill="url(#coordGrid)"/><path d="M12 180H468 M457 174L468 180L457 186" fill="none" stroke="#b63632" stroke-width="2.5"/><path d="M240 348V12 M234 23L240 12L246 23" fill="none" stroke="#245ba4" stroke-width="2.5"/><g font-family="Segoe UI, sans-serif" font-size="14" font-weight="650"><text x="15" y="171" fill="#9e312d">−240</text><text x="430" y="171" fill="#9e312d">+240</text><text x="250" y="28" fill="#245ba4">+180</text><text x="250" y="343" fill="#245ba4">−180</text><text x="427" y="203" fill="#9e312d">X →</text><text x="209" y="27" fill="#245ba4">Y ↑</text><text x="250" y="204" fill="#476254">0, 0</text></g></svg><span class="coordinate-target" style="left:70.8333%;top:55.5556%" aria-label="Destino: X 100, Y menos 20">★</span><img id="coordinatePokemon" class="coordinate-sprite" src="img/pokemon/pikachu.png" alt="Pikachu na posição atual"></div><div class="coordinate-dashboard"><div class="coordinate-values"><span class="x-ink">X <b id="coordX">0</b></span><span class="y-ink">Y <b id="coordY">0</b></span></div><div class="coordinate-pad" aria-label="Mover Pikachu"><button class="button" data-move="0,20" aria-label="Subir: adicionar 20 a Y">↑<small>Y +20</small></button><button class="button" data-move="-20,0" aria-label="Esquerda: adicionar menos 20 a X">←<small>X −20</small></button><button class="button" data-move="0,-20" aria-label="Descer: adicionar menos 20 a Y">↓<small>Y −20</small></button><button class="button" data-move="20,0" aria-label="Direita: adicionar 20 a X">→<small>X +20</small></button></div><button class="button small" id="coordReset" type="button">Voltar ao centro (0, 0)</button><p id="coordinateFeedback" class="demo-readout" role="status">Comece pelo X: a estrela está à direita.</p><div class="scratch-stack"><div class="sb motion" id="coordinateBlock">vá para x: 0 y: 0</div></div></div></div><details class="space-comparison"><summary>E o Z? Compare com Minecraft e impressão 3D</summary><div class="details-body"><p><strong>Em 3D, precisamos de três eixos.</strong> A letra que indica altura depende do sistema.</p><div class="space-tabs" aria-label="Escolher exemplo 3D"><button class="button small" data-space="minecraft" aria-pressed="true">Minecraft</button><button class="button small" data-space="printer" aria-pressed="false">Impressão 3D</button><button class="button small" data-space="cad" aria-pressed="false">Fusion / AutoCAD</button></div><div class="space-layout"><svg class="space-diagram" viewBox="0 0 440 290" role="img" aria-label="Esquema em perspectiva dos três eixos"><path d="M70 235L210 150L370 205L230 280Z" fill="#e4efdc" stroke="#abc4a8"/><path d="M115 250L255 165 M160 265L300 180 M113 208L273 263 M160 179L320 234" fill="none" stroke="#c1d5bb"/><path d="M145 225H395 M385 219L395 225L385 231" stroke="#b63632" stroke-width="3" fill="none"/><path d="M145 225L55 280 M56 267L55 280L67 279" stroke="#388048" stroke-width="3" fill="none"/><path d="M145 225V28 M139 39L145 28L151 39" stroke="#245ba4" stroke-width="3" fill="none"/><g font-family="Segoe UI, sans-serif" font-size="20" font-weight="750"><text x="402" y="230" fill="#b63632">X</text><text id="spaceGroundAxis" x="31" y="282" fill="#388048">Z</text><text id="spaceHeightAxis" x="132" y="21" fill="#245ba4">Y</text></g><path d="M230 210V92" stroke="#a6b4a0" stroke-dasharray="5 5"/><g id="spaceObject"><path d="M205 166L230 151L255 166L230 181Z" fill="#92c26d" stroke="#527f42"/><path d="M205 166V196L230 211V181Z" fill="#a57b53" stroke="#785632"/><path d="M230 181L255 166V196L230 211Z" fill="#7c5f41" stroke="#785632"/></g></svg><div><h3 id="spaceTitle">Minecraft: Y é a altura</h3><p id="spaceExplanation">X e Z localizam no chão. Y indica a altura.</p><div class="space-values" id="spaceValues">X 20 · <strong>Y 64</strong> · Z 10</div><button type="button" class="button primary" id="spaceRise">Subir 10 em Y ↑</button><p id="spaceFeedback" class="one-note" role="status">Observe qual número muda ao subir.</p></div></div><p class="block-caption">Esquema sem escala. No Scratch, o palco usa X e Y; camadas de atores não são uma coordenada espacial Z.</p></div></details>`;
}

function demoMarkup(id) {
  if (id === "coordinates") return coordinateMarkup();
  if (id === "upload") return `<p class="demo-instruction"><strong>1.</strong> Clique no Pokémon que você quer. <strong>2.</strong> Baixe o ator dele e a Pokébola. Os dois arquivos <code>.sprite3</code> já vêm prontos, com fundo transparente e as fantasias certas.</p><div class="pokemon-picker" role="group" aria-label="Escolher Pokémon">${pokemonList.map((name, i) => `<button type="button" data-pick="${name}" aria-pressed="${i === 0}"><img src="img/pokemon/${name}.png" alt=""><span>${cap(name)}</span></button>`).join("")}</div><div class="pick-result"><div class="pick-preview"><img id="pickFront" src="img/pokemon/pikachu.png" alt="Frente"><img id="pickBack" src="img/pokemon/pikachu-costas.png" alt="Costas"><img src="img/movimentos/pokebola/fechada.svg" alt="Pokébola"></div><div class="demo-controls"><a class="button primary" id="pickDownload" href="img/movimentos/atores/pikachu.sprite3" download>① Baixar Pikachu (.sprite3) ↓</a><a class="button primary" href="img/movimentos/atores/pokebola-captura.sprite3" download>② Baixar Pokébola (.sprite3) ↓</a></div><p class="block-caption">Os arquivos vão para a pasta <strong>Downloads</strong>. Não precisa abrir: na etapa Monte você envia cada um pelo Scratch. Prefere PNG? Use a <a href="imagens.html">galeria de imagens</a>.</p></div>`;
  if (id === "sequence") return `<div class="two-columns"><div><p class="demo-instruction">As etapas estão embaralhadas. Use ↑ e ↓ para colocar na ordem certa e clique em Conferir. Depois, veja a captura acontecer.</p><ol class="order-list" id="orderList"></ol><button class="button small" id="checkOrder" type="button">Conferir sequência</button><p class="demo-readout" id="orderResult" aria-live="polite">Cinco etapas. Qual deve acontecer primeiro?</p></div><div><div class="demo-stage" id="captureStage"><span class="stage-name">SIMULAÇÃO DA CAPTURA</span><span class="pokeball capture-ball" id="captureBall" aria-hidden="true"></span><div class="wild-pokemon" id="wildPokemon"><span class="creature" aria-hidden="true">ϟ</span><small>Seu Pokémon</small></div><span class="stage-message" id="captureMessage" aria-live="polite">Pronto para lançar.</span></div><div class="demo-controls"><button class="button primary" id="playCapture" type="button">Ver a captura</button></div><p class="block-caption">Observe: 1 lançamento e 3 balanços. No Scratch, você cria essa animação com dois atores.</p></div></div>`;
  if (id === "vector") return `<p class="demo-instruction">Cada nome ocupa uma posição. Clique em um item e compare o índice com o conteúdo.</p><div class="vector-demo" id="vectorDemo"></div><p class="demo-readout" id="vectorResult" aria-live="polite">Posição 1 → Pikachu. O índice começa em 1 no Scratch.</p><div class="demo-controls"><button class="button small" id="nextPokemon" type="button">Tecla E · próximo →</button><button class="button small" id="addPokemon" type="button">Capturar Eevee (entra na lista)</button></div>`;
  if (id === "matrix") return `<p class="demo-instruction">Clique em uma célula. O mapa e a lista mostram os mesmos dados, organizados de formas diferentes.</p><div class="matrix-explorer"><div><div class="matrix-board" id="matrixBoard"></div><div class="map-legend"><span>0 · caminho</span><span>1 · árvore</span><span>2 · ginásio</span></div></div><div class="matrix-detail"><h3 id="matrixAddress">Linha 1 · coluna 1</h3><div class="formula" id="matrixFormula">((1 − 1) × 3) + 1 = 1</div><div class="flat-list" id="flatList" aria-label="Mapa guardado em uma lista"></div><p id="matrixResult" class="demo-readout" aria-live="polite">Índice 1 → valor 0 → caminho livre.</p></div></div>`;
  if (id === "procedure") return `<p class="demo-instruction">Escolha o valor do parâmetro. O procedimento executa a mesma sequência; só a quantidade muda.</p><div class="demo-stage"><span class="stage-name">PROCEDIMENTO BALANÇAR</span><span class="pokeball capture-ball" id="procedureBall" style="left:48%" aria-hidden="true"></span><span class="stage-message" id="procedureMessage" aria-live="polite">Defina o parâmetro e execute.</span></div><div class="demo-controls"><label class="field" for="shakeCount">Parâmetro vezes<select id="shakeCount"><option>1</option><option selected>3</option><option>5</option></select></label><button class="button primary" id="runProcedure" type="button">Chamar balançar (3)</button></div>`;
  if (id === "function") return `<p class="demo-instruction">Antes de alterar o número, tente prever: quantas capturas resultam em 40 XP?</p><div class="function-flow"><div class="flow-part"><small>ENTRADA · CAPTURAS</small><strong id="flowInput">3</strong></div><span class="flow-arrow" aria-hidden="true">→</span><div class="flow-part"><small>REGRA DO NOSSO JOGO</small><strong>× 10</strong></div><span class="flow-arrow" aria-hidden="true">→</span><div class="flow-part flow-result"><small>RESULTADO · XP</small><strong id="flowOutput">30</strong></div></div><div class="demo-controls"><label class="field" for="captureCount">Quantidade de capturas (0 a 6)<input id="captureCount" type="number" min="0" max="6" step="1" value="3"></label></div><p class="demo-readout" id="functionResult" aria-live="polite">3 capturas × 10 = 30 XP. No Scratch, guardaremos 30 em XP calculado.</p>`;
  const options = '<option value="">Escolha…</option><option value="vetor">Vetor / lista</option><option value="matriz">Matriz</option><option value="procedimento">Procedimento</option><option value="funcao">Função</option>';
  return `<p class="demo-instruction">Para cada parte do jogo, escolha o conceito que resolve. Use o que você aprendeu nas missões.</p><div class="final-quiz">${[["equipe", "Guardar os nomes da equipe em ordem (tecla E)", "vetor"], ["mapa", "Saber o que existe na linha 3, coluna 3 (tecla M)", "matriz"], ["balanco", "Repetir a animação de balançar com um bloco só", "procedimento"], ["xp", "Receber as capturas e produzir o XP", "funcao"]].map(([key, text, answer]) => `<label class="field quiz-row" for="q-${key}"><span>${text}</span><select id="q-${key}" data-answer="${answer}">${options}</select><output id="r-${key}" aria-live="polite"></output></label>`).join("")}</div><p class="demo-readout" id="finalResult" aria-live="polite">0 de 4 certas.</p>`;
}

function showLesson(id, scroll = true) {
  const lesson = lessons.find(item => item.id === id);
  currentId = lesson ? id : "inicio";
  viewVersion += 1;
  $("#homeView").hidden = Boolean(lesson);
  $("#lessonView").hidden = !lesson;
  if (lesson) {
    const index = lessons.indexOf(lesson);
    flowStep = 0;
    buildStep = 0;
    document.title = `${lesson.topic} | PokéCode`;
    const next = lessons[index + 1];
    $("#lessonView").innerHTML = `<header class="lesson-top guided-top"><div class="breadcrumb"><a href="#inicio">Início</a><span aria-hidden="true">/</span><span>Missão ${lesson.number} de ${lessons.length}</span><span class="mission-time">⏱ ${lesson.time}</span></div><div class="lesson-heading"><div><span class="eyebrow green">MISSÃO ${lesson.number} · ${lesson.topic.toUpperCase()}</span><h1>${lesson.title}</h1></div><span class="lesson-badge" aria-hidden="true">${lesson.symbol}</span></div><p class="lesson-lede">${lesson.lead}</p>
      <div class="mission-prep"><div><small>1 · ABRA</small><b>${lesson.file.open}</b></div><span aria-hidden="true">→</span><div class="prep-add"><small>2 · ACRESCENTE</small><b>${lesson.adds.map(item => `<kbd>${item.key}</kbd> ${item.text}`).join("<br>")}</b></div><span aria-hidden="true">→</span><div><small>3 · SALVE COMO</small><b><code>${lesson.file.save}</code></b></div></div>
      ${gameSoFar(index)}</header>
      <div class="lesson-flow" id="lessonFlow">
        <nav class="flow-nav" aria-label="Etapas desta missão">${[["Olhe", "a ideia"], ["Experimente", "aqui na página"], ["Monte", "no Scratch"], ["Teste", "e confira"]].map(([label, hint], i) => `<button type="button" data-flow="${i}" aria-current="${i === 0 ? "step" : "false"}"><span>${i + 1}</span><em>${label}<small>${hint}</small></em></button>`).join("")}</nav>
        <section class="focus-panel" data-panel="0" aria-labelledby="lookTitle"><div class="focus-heading"><span class="eyebrow green">1 · OLHE: ENTENDA A IDEIA ANTES DE MEXER</span><h2 id="lookTitle" tabindex="-1">${lesson.topic}</h2></div>${lesson.concept}</section>
        <section class="focus-panel" data-panel="1" aria-labelledby="tryTitle" hidden><div class="focus-heading"><span class="eyebrow green">2 · EXPERIMENTE: BRINQUE AQUI NA PÁGINA</span><h2 id="tryTitle" tabindex="-1">${lesson.demoTitle}</h2></div><div class="focused-demo">${demoMarkup(lesson.demo)}</div><p class="demo-boundary">Isto é só uma simulação. Na próxima etapa, você monta de verdade no Scratch.</p></section>
        <section class="focus-panel" data-panel="2" aria-labelledby="buildTitle" hidden><div class="build-heading"><div><span class="eyebrow green">3 · MONTE: SIGA UM PASSO DE CADA VEZ</span><h2 id="buildTitle" tabindex="-1">Faça cada passo e confira antes de avançar.</h2></div><a class="button scratch-link" href="https://scratch.mit.edu/projects/editor/" target="_blank" rel="noopener noreferrer">Abrir Scratch ↗</a></div><div class="block-legend" aria-label="Cores das categorias de blocos"><span class="sb event">Eventos</span><span class="sb motion">Movimento</span><span class="sb look">Aparência</span><span class="sb control">Controle</span><span class="sb sense">Sensores</span><span class="sb op">Operadores</span><span class="sb data">Variáveis</span><span class="sb custom">Meus Blocos</span><small>A cor do bloco mostra em qual categoria procurar.</small></div><div class="task-track" id="taskTrack" aria-label="Passos de montagem"></div><div id="taskCard"></div><details class="help-box"><summary>🆘 Travou? Veja os erros mais comuns desta missão</summary><div class="details-body"><dl class="error-list">${lesson.errors.map(([problem, fix]) => `<div><dt>${problem}</dt><dd>${fix}</dd></div>`).join("")}</dl><p class="one-note">Ainda não deu? Compare com a montagem completa abaixo ou chame o colega de dupla antes do professor.</p></div></details><details class="full-code"><summary>Ver a montagem completa desta missão</summary><div class="details-body"><div class="script-columns">${lesson.scripts.map(group => `<div class="script-group"><h4>${group.name}</h4><div class="scratch-stack">${blockMarkup(group.blocks)}</div></div>`).join("")}</div><p class="block-caption">${lesson.scriptNote || "Os blocos desenhados são um guia. ( ) é um espaço para número ou oval; [ ▾ ] é um menu para escolher; &lt; &gt; é uma condição. Confira sempre qual ator está selecionado."}</p></div></details></section>
        <section class="focus-panel" data-panel="3" aria-labelledby="testTitle" hidden><div class="focus-heading"><span class="eyebrow green">4 · TESTE: COMPARE COM O SEU PROJETO</span><h2 id="testTitle" tabindex="-1">Funcionou como você imaginou?</h2></div><div class="expected target-result"><h3>O resultado deve ser</h3><p>${lesson.expected}</p></div><div class="verify-grid"><div class="checklist"><h3>Marque o que já funciona:</h3>${lesson.checks.map((check, i) => `<label><input type="checkbox" data-check="${lesson.id}-${i}" ${stored[`${lesson.id}-${i}`] === true ? "checked" : ""}><span>${check}</span></label>`).join("")}<p class="check-counter" id="checkCounter" role="status"></p></div><div class="trainer-tests"><h3>Mude e teste de novo</h3><ol>${lesson.tests.map(test => `<li>${test}</li>`).join("")}</ol><p class="one-note">Diga o que vai acontecer <strong>antes</strong> de executar.</p></div></div><details class="think-question"><summary>💬 Pergunta para explicar ao colega</summary><div class="details-body"><p><strong>${lesson.question}</strong></p><details><summary>Conferir a explicação</summary><div class="details-body">${lesson.answer}</div></details></div></details><details><summary>⭐ Terminei antes. Quero um desafio extra.</summary><div class="details-body">${lesson.extension}</div></details>${next ? `<div class="next-preview"><span class="eyebrow">NA PRÓXIMA MISSÃO</span><p><b>${next.label}:</b> ${next.summary} Você vai abrir o <code>${lesson.file.save}</code> e continuar dele.</p></div>` : '<div class="next-preview done"><span class="eyebrow">TRILHA COMPLETA</span><p><b>Parabéns!</b> Seu jogo usa algoritmo, repetição, vetor, matriz, procedimento e função.</p></div>'}</section>
        <div class="flow-footer"><button class="button" id="flowBack" type="button">← Voltar</button><span id="flowPosition" role="status"></span><button class="button primary" id="flowNext" type="button">Experimentar →</button><a class="button primary" id="nextMission" href="#${next ? next.id : "inicio"}" hidden>${next ? `Ir para a missão ${next.number} →` : "Voltar ao início"}</a></div>
      </div>`;
    renderTask(lesson);
    $$('[data-flow]').forEach(button => button.addEventListener("click", () => setFlow(Number(button.dataset.flow), lesson)));
    $("#flowBack").addEventListener("click", () => {
      if (flowStep === 2 && buildStep > 0) { buildStep -= 1; renderTask(lesson); focusTask(); }
      else setFlow(flowStep - 1, lesson);
    });
    $("#flowNext").addEventListener("click", () => {
      if (flowStep === 2 && buildStep < lesson.plan.length - 1) { buildStep += 1; renderTask(lesson); focusTask(); }
      else setFlow(flowStep + 1, lesson);
    });
    updateFlow(lesson);
    setupDemo(lesson.demo, viewVersion);
    $$("[data-check]").forEach(input => input.addEventListener("change", () => {
      stored[input.dataset.check] = input.checked;
      save();
      updateCounter(lesson);
      renderNavigation();
    }));
    updateCounter(lesson);
  } else {
    document.title = "PokéCode — Laboratório de algoritmos";
    $("#lessonView").innerHTML = "";
  }
  renderNavigation();
  if (scroll) {
    if (lesson) scrollToFlow($("#lessonFlow"));
    else window.scrollTo({top: 0, behavior: "instant"});
    $("#conteudo").focus({preventScroll:true});
  }
  if (lesson && !scroll) scrollToFlow($("#lessonFlow"));
}

function focusTask() {
  $("#taskTitle").focus({preventScroll:true});
  scrollToFlow($("#taskTrack"));
}

function scrollToFlow(element) {
  const top = window.scrollY + element.getBoundingClientRect().top - $(".topbar").offsetHeight - 12;
  window.scrollTo({top, behavior:"instant"});
}

const taskVisuals = {
  upload: `<div class="editor-map" role="img" aria-label="Esquema do editor: código à esquerda, palco à direita e botão de enviar ator abaixo do palco"><span class="editor-map-label">ESQUEMA DO EDITOR</span><div class="editor-code"><b>Código</b><span class="sb event">quando ⚑ for clicado</span><span class="sb look">diga Olá!</span></div><div class="editor-stage"><img src="img/pokemon/pikachu.png" alt=""></div><div class="editor-upload"><b>Escolher um Ator</b><span>↑ Enviar Ator</span></div></div>`,
  costume: `<div class="costume-visual"><div><img src="img/pokemon/pikachu.png" alt=""><b>frente</b></div><span aria-hidden="true">↔</span><div><img src="img/pokemon/pikachu-costas.png" alt=""><b>costas</b></div><p>Duas fantasias do mesmo ator</p></div>`
};

function renderTask(lesson) {
  const task = lesson.plan[buildStep];
  const visual = taskVisuals[task.visual] || task.visual;
  $("#taskTrack").innerHTML = lesson.plan.map((item, i) => `<button type="button" data-task="${i}" aria-label="Passo ${i + 1}: ${item.title}" aria-current="${i === buildStep ? "step" : "false"}">${i + 1}</button>`).join("");
  $("#taskCard").innerHTML = `<article class="task-card"><div class="task-address"><span><small>SELECIONE</small><b>${task.actor}</b></span><span><small>PROCURE EM</small><b>${task.where}</b></span></div><div class="task-body ${task.blocks.length || visual ? "has-blocks" : ""}"><div class="task-instruction"><span class="task-count">PASSO ${buildStep + 1} DE ${lesson.plan.length}</span><h3 id="taskTitle" tabindex="-1">${task.title}</h3><p>${task.instruction}</p>${task.tip ? `<details><summary>Preciso de uma dica</summary><div class="details-body">${task.tip}</div></details>` : ""}</div>${task.blocks.length ? `<div class="task-blocks"><span class="eyebrow">MONTE ASSIM</span><div class="scratch-stack">${blockMarkup(task.blocks)}</div></div>` : visual ? `<div class="task-visual">${visual}</div>` : ""}</div><div class="task-success"><span aria-hidden="true">✓</span><div><b>Funcionou? Então avance.</b><p>${task.success}</p></div></div></article>`;
  $$('[data-task]').forEach(button => button.addEventListener("click", () => {buildStep = Number(button.dataset.task); renderTask(lesson); focusTask();}));
  updateFlow(lesson);
}

function setFlow(step, lesson) {
  flowStep = Math.max(0, Math.min(3, step));
  updateFlow(lesson);
  $(`[data-panel="${flowStep}"] h2`).focus({preventScroll:true});
  scrollToFlow($("#lessonFlow"));
}

function updateFlow(lesson) {
  $$('[data-panel]').forEach(panel => { panel.hidden = Number(panel.dataset.panel) !== flowStep; });
  $$('[data-flow]').forEach(button => button.setAttribute("aria-current", Number(button.dataset.flow) === flowStep ? "step" : "false"));
  $("#flowBack").hidden = flowStep === 0;
  $("#flowNext").hidden = flowStep === 3;
  $("#nextMission").hidden = flowStep !== 3;
  $("#flowPosition").textContent = flowStep === 2 ? `Montagem · ${buildStep + 1}/${lesson.plan.length}` : `Etapa ${flowStep + 1} de 4`;
  $("#flowNext").textContent = ["Entendi. Quero experimentar →", "Agora vou montar no Scratch →", buildStep === lesson.plan.length - 1 ? "Montei tudo. Vou testar →" : `Fiz o passo ${buildStep + 1}. Próximo →`][flowStep] || "";
}

function updateCounter(lesson) {
  const count = lesson.checks.filter((_, i) => stored[`${lesson.id}-${i}`] === true).length;
  $("#checkCounter").textContent = `${count} de ${lesson.checks.length} itens conferidos no Scratch${count === lesson.checks.length ? " · Missão concluída!" : "."}`;
}

const pause = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
async function shake(ball, count, message, token) {
  for (let index = 1; index <= count; index += 1) {
    if (viewVersion !== token) return;
    message.textContent = `Balanço ${index} de ${count}`;
    ball.style.transform = "translateX(8px)";
    await pause(200);
    if (viewVersion !== token) return;
    ball.style.transform = "translateX(0)";
    await pause(200);
  }
}

function setupDemo(type, token) {
  if (type === "coordinates") {
    let x = 0, y = 0;
    const render = () => {
      $("#coordinatePokemon").style.left = `${(x + 240) / 480 * 100}%`;
      $("#coordinatePokemon").style.top = `${(180 - y) / 360 * 100}%`;
      $("#coordinatePokemon").alt = `Pikachu em X ${x}, Y ${y}`;
      $("#coordX").textContent = x;
      $("#coordY").textContent = y;
      $("#coordinateBlock").textContent = `vá para x: ${x} y: ${y}`;
      $("#coordinateFeedback").textContent = x === 100 && y === -20 ? "Chegou! X levou para o lado; Y levou um pouco para baixo." : x !== 100 ? `Ajuste X até 100. ${x < 100 ? "Vá para a direita →" : "Vá para a esquerda ←"}` : "X está certo. Agora ajuste Y até −20: um pouco abaixo do centro.";
      $$("[data-move]").forEach(button => {
        const [dx,dy] = button.dataset.move.split(",").map(Number);
        button.disabled = Math.abs(x + dx) > 200 || Math.abs(y + dy) > 140;
      });
    };
    $$("[data-move]").forEach(button => button.addEventListener("click", () => {
      const [dx,dy] = button.dataset.move.split(",").map(Number);
      x += dx; y += dy; render();
    }));
    $("#coordReset").addEventListener("click", () => {x = 0; y = 0; render();});
    render();
    let mode = "minecraft", raised = false;
    const renderSpace = () => {
      const minecraft = mode === "minecraft", height = minecraft ? "Y" : "Z", level = raised ? 10 : 0;
      $("#spaceHeightAxis").textContent = height;
      $("#spaceGroundAxis").textContent = minecraft ? "Z" : "Y";
      $("#spaceTitle").textContent = minecraft ? "Minecraft: Y é a altura" : mode === "printer" ? "Impressora 3D: Z é a altura" : "Fusion / AutoCAD: confira os eixos";
      $("#spaceExplanation").textContent = minecraft ? "X e Z localizam no chão. Y indica a altura." : mode === "printer" ? "Neste modelo cartesiano, X e Y localizam na mesa. Z indica a altura da camada." : "Aqui, mostramos o plano XY com Z para cima. A orientação pode ser configurada: observe o indicador dos eixos.";
      $("#spaceValues").innerHTML = minecraft ? `X 20 · <strong>Y ${64 + level}</strong> · Z 10` : `X 20 · Y 10 · <strong>Z ${level}</strong>`;
      $("#spaceRise").textContent = raised ? `Voltar à altura inicial ↓` : `Subir 10 em ${height} ↑`;
      $("#spaceObject").setAttribute("transform", `translate(0 ${raised ? -65 : 0})`);
      $("#spaceFeedback").textContent = raised ? `Só ${height} mudou. X e ${minecraft ? "Z" : "Y"} ficaram iguais.` : "Observe qual número muda ao subir.";
      $$("[data-space]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.space === mode)));
    };
    $$("[data-space]").forEach(button => button.addEventListener("click", () => {mode = button.dataset.space; raised = false; renderSpace();}));
    $("#spaceRise").addEventListener("click", () => {raised = !raised; renderSpace();});
    renderSpace();
  }
  if (type === "sequence") {
    $("#wildPokemon .creature").outerHTML = '<img src="img/pokemon/pikachu.png" alt="Pikachu">';
    const correct = ["Pokébola vai para o ponto de partida", "Deslizar até o Pokémon (uma vez)", "Balançar 3 vezes", "Transmitir a mensagem capturado", "Pokémon diz “Fui capturado!” e reaparece"];
    const order = [3, 1, 4, 0, 2];
    const renderOrder = () => {
      $("#orderList").innerHTML = order.map((item, i) => `<li><span class="order-text">${correct[item]}</span><span class="order-arrows"><button type="button" data-index="${i}" data-shift="-1" aria-label="Mover etapa ${i + 1} para cima" ${i === 0 ? "disabled" : ""}>↑</button><button type="button" data-index="${i}" data-shift="1" aria-label="Mover etapa ${i + 1} para baixo" ${i === order.length - 1 ? "disabled" : ""}>↓</button></span></li>`).join("");
      $$("[data-shift]").forEach(button => button.addEventListener("click", () => {
        const from = Number(button.dataset.index);
        const to = from + Number(button.dataset.shift);
        [order[from], order[to]] = [order[to], order[from]];
        renderOrder();
        $("#orderResult").textContent = "Etapa movida. Confira se cada ação tem o que precisa para começar.";
        const nextButton = $(`#orderList [data-index="${to}"][data-shift="${button.dataset.shift}"]`);
        if (nextButton && !nextButton.disabled) nextButton.focus();
      }));
    };
    renderOrder();
    $("#checkOrder").addEventListener("click", () => {
      const error = order.findIndex((value, i) => value !== i);
      $("#orderResult").textContent = error === -1 ? "Sequência certa! Agora monte essa lógica no Scratch." : `Reveja a etapa ${error + 1}. Dica: ${correct[error].toLowerCase()} deve acontecer aqui.`;
    });
    $("#playCapture").addEventListener("click", async event => {
      const button = event.currentTarget;
      const ball = $("#captureBall");
      const pokemon = $("#wildPokemon");
      const message = $("#captureMessage");
      button.disabled = true;
      pokemon.style.opacity = "1";
      ball.style.left = "12%";
      ball.style.transform = "translateX(0)";
      message.textContent = "Preparar os atores.";
      await pause(650);
      if (viewVersion !== token) return;
      message.textContent = "Lançar uma vez.";
      ball.style.left = "73%";
      await pause(650);
      await shake(ball, 3, message, token);
      if (viewVersion !== token) return;
      message.textContent = "Mensagem capturado → “Fui capturado!”";
      pokemon.style.opacity = "0";
      button.disabled = false;
    });
  }
  if (type === "vector") {
    const team = [{name:"Pikachu",symbol:"ϟ",kind:""},{name:"Charmander",symbol:"♨",kind:"fire"},{name:"Squirtle",symbol:"≈",kind:"water"}];
    let selected = 0;
    const renderTeam = () => {
      $("#vectorDemo").innerHTML = team.map((item, i) => `<button type="button" class="vector-slot" data-slot="${i}" aria-pressed="${i === selected}"><img class="vector-pokemon" src="img/pokemon/${item.name.toLowerCase()}.png" alt=""><strong>${item.name}</strong><small>índice ${i + 1}</small></button>`).join("");
      $$("[data-slot]").forEach(button => button.addEventListener("click", () => {selected = Number(button.dataset.slot); renderTeam();}));
      $("#vectorResult").textContent = `item ${selected + 1} de equipe → ${team[selected].name}. A lista tem ${team.length} itens.`;
    };
    $("#nextPokemon").addEventListener("click", () => {selected = (selected + 1) % team.length; renderTeam();});
    $("#addPokemon").addEventListener("click", event => {
      team.push({name:"Eevee",symbol:"✦",kind:"leaf"}); selected = team.length - 1; renderTeam();
      event.currentTarget.disabled = true;
      event.currentTarget.textContent = "Eevee capturado · índice 4";
    });
    renderTeam();
  }
  if (type === "matrix") {
    const map = [0,1,0,0,1,0,0,0,2];
    const terrains = ["caminho livre", "árvore", "ginásio"];
    const symbols = ["·", "♠", "★"];
    let selected = 0;
    const renderMap = () => {
      let html = '<span class="axis" aria-hidden="true">L/C</span><span class="axis">1</span><span class="axis">2</span><span class="axis">3</span>';
      for (let row = 1; row <= 3; row += 1) {
        html += `<span class="axis">${row}</span>`;
        for (let column = 1; column <= 3; column += 1) {
          const index = (row - 1) * 3 + column - 1;
          const value = map[index];
          html += `<button class="matrix-cell ${value === 1 ? "wall" : value === 2 ? "goal" : ""}" type="button" data-cell="${index}" aria-pressed="${index === selected}" aria-label="Linha ${row}, coluna ${column}: ${terrains[value]}"><span aria-hidden="true">${symbols[value]}</span><small>valor ${value}</small></button>`;
        }
      }
      $("#matrixBoard").innerHTML = html;
      $("#flatList").innerHTML = map.map((value,i) => `<span class="${i === selected ? "selected" : ""}">${value}</span>`).join("");
      const row = Math.floor(selected / 3) + 1, col = selected % 3 + 1;
      $("#matrixAddress").textContent = `Linha ${row} · coluna ${col}`;
      $("#matrixFormula").textContent = `((${row} − 1) × 3) + ${col} = ${selected + 1}`;
      $("#matrixResult").textContent = `Índice ${selected + 1} → valor ${map[selected]} → ${terrains[map[selected]]}.`;
      $$("[data-cell]").forEach(button => button.addEventListener("click", () => {selected = Number(button.dataset.cell); renderMap(); $(`[data-cell="${selected}"]`).focus({preventScroll:true});}));
    };
    renderMap();
  }
  if (type === "procedure") {
    $("#shakeCount").addEventListener("change", event => {$("#runProcedure").textContent = `Chamar balançar (${event.target.value})`;});
    $("#runProcedure").addEventListener("click", async event => {
      const button = event.currentTarget, select = $("#shakeCount"), count = Number(select.value), message = $("#procedureMessage");
      button.disabled = true; select.disabled = true;
      await shake($("#procedureBall"), count, message, token);
      if (viewVersion !== token) return;
      message.textContent = `Procedimento concluído: ${count} balanço${count === 1 ? "" : "s"}. Voltou à posição inicial.`;
      button.disabled = false; select.disabled = false;
    });
  }
  if (type === "function") {
    $("#captureCount").addEventListener("input", event => {
      const value = Number(event.target.value);
      const valid = event.target.value !== "" && Number.isInteger(value) && value >= 0 && value <= 6;
      if (!valid) {
        $("#flowInput").textContent = "—"; $("#flowOutput").textContent = "—";
        $("#functionResult").textContent = "Digite um número inteiro de 0 a 6 para testar esta regra.";
        return;
      }
      $("#flowInput").textContent = value;
      $("#flowOutput").textContent = value * 10;
      $("#functionResult").textContent = `${value} captura${value === 1 ? "" : "s"} × 10 = ${value * 10} XP. No Scratch, a variável XP calculado guarda ${value * 10}.`;
    });
  }
  if (type === "final") {
    const selects = $$("[data-answer]");
    selects.forEach(select => select.addEventListener("change", () => {
      const out = select.parentElement.querySelector("output");
      out.textContent = !select.value ? "" : select.value === select.dataset.answer ? "✓ Isso!" : "✗ Tente outro";
      out.className = select.value === select.dataset.answer ? "ok" : "no";
      const right = selects.filter(item => item.value === item.dataset.answer).length;
      $("#finalResult").textContent = right === selects.length ? "4 de 4! Você sabe onde cada conceito vive no seu jogo. Agora monte a ligação final." : `${right} de 4 certas.`;
    }));
  }
  if (type === "upload") {
    $$("[data-pick]").forEach(button => button.addEventListener("click", () => {
      const name = button.dataset.pick;
      $$("[data-pick]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
      $("#pickFront").src = `img/pokemon/${name}.png`;
      $("#pickBack").src = `img/pokemon/${name}-costas.png`;
      $("#pickDownload").href = `img/movimentos/atores/${name}.sprite3`;
      $("#pickDownload").textContent = `① Baixar ${cap(name)} (.sprite3) ↓`;
    }));
  }
}

$("#projector").addEventListener("click", event => {
  const enabled = document.body.classList.toggle("projector");
  event.currentTarget.setAttribute("aria-pressed", String(enabled));
  event.currentTarget.textContent = enabled ? "Sair do projetor" : "Modo projetor";
  if (currentId !== "inicio") scrollToFlow($("#lessonFlow"));
});

function route(initial = false) {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = "inicio"; }
  if (id === "conteudo") {
    $("#conteudo").focus();
    return;
  }
  const legacy = {"coordenadas-x-y":"coordenadas",top:"inicio",ideia:"algoritmos",ordene:"algoritmos",scratch:"algoritmos",praticas:"vetor",dados:"matriz",blocos:"procedimento",missao:"projeto","pokemon-upload":"preparar"};
  showLesson(legacy[id] || id || "inicio", !initial);
}
window.addEventListener("hashchange", () => route());
route(true);
