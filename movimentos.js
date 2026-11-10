"use strict";
const motionQuery = selector => document.querySelector(selector);
const motionNames = {pikachu:"Pikachu",bulbasaur:"Bulbasaur",charmander:"Charmander",charizard:"Charizard",squirtle:"Squirtle",jigglypuff:"Jigglypuff",meowth:"Meowth",psyduck:"Psyduck",gengar:"Gengar",eevee:"Eevee",snorlax:"Snorlax",dragonite:"Dragonite",mewtwo:"Mewtwo",mew:"Mew",chikorita:"Chikorita",cyndaquil:"Cyndaquil"};
const motionRecipes = {
  virar:{label:"Frente / costas",symbol:"↻",concept:"EVENTO + FANTASIA",title:"Troque entre duas posições diferentes.",explanation:"O ator tem somente duas fantasias: frente e costas. A tecla v troca para a próxima. Para escolher uma posição específica, use mude para a fantasia [frente] ou [costas].",blocks:[["event","quando a tecla [v] for pressionada"],["look","próxima fantasia"]],expected:"Cada execução alterna entre frente e costas, mantendo o Pokémon no mesmo lugar."},
  andar:{label:"Andar uma casa",symbol:"→",concept:"MATRIZ + PROCEDIMENTO",title:"Uma casa do mapa vale 80 passos.",explanation:"Faça oito pequenos deslocamentos de 10 passos. Antes de avançar no projeto final, consulte a célula da matriz: a árvore deve bloquear a passagem.",blocks:[],expected:"O Pokémon avança 80 passos na direção escolhida. Uma chamada do procedimento pode representar uma casa de 80 pixels no seu mapa."},
  pular:{label:"Pular",symbol:"↑",concept:"REPETIÇÃO + POSIÇÃO Y",title:"Subir e voltar ao ponto de partida.",explanation:"Somar a y sobe. Subtrair de y desce. A quantidade da subida e da descida precisa combinar para o ator voltar ao chão.",blocks:[["event","quando a tecla [espaço] for pressionada"],["control","repita (10) vezes",[["motion","adicione (4) a y"],["control","espere (0.02) seg"]]],["control","repita (10) vezes",[["motion","adicione (-4) a y"],["control","espere (0.02) seg"]]]],expected:"O Pokémon sobe 40 passos e desce 40. Ao terminar, o y é o mesmo do início."},
  atacar:{label:"Avançar e atacar",symbol:"ϟ",concept:"PROCEDIMENTO",title:"Um avanço curto que pode ser reutilizado.",explanation:"Crie um procedimento chamado atacar. Primeiro avance 40 passos; depois recue os mesmos 40. A animação pode ser chamada durante uma cena de batalha.",blocks:[["custom","defina atacar"],["control","repita (5) vezes",[["motion","adicione (8) a x"],["control","espere (0.05) seg"]]],["control","repita (5) vezes",[["motion","adicione (-8) a x"],["control","espere (0.05) seg"]]],["break",""],["event","quando a tecla [a] for pressionada"],["custom","atacar"]],expected:"O Pokémon avança, simula um golpe e retorna à posição inicial. Aqui o golpe é uma animação; o cálculo de dano pode ser acrescentado depois."},
  recuar:{label:"Recuar",symbol:"←",concept:"SEQUÊNCIA + EFEITO VISUAL",title:"Reagir a um encontro e retornar.",explanation:"O Pokémon fica semitransparente, recua 20 passos e volta. Ao terminar, retire os efeitos gráficos para ele reaparecer normalmente.",blocks:[["event","quando a tecla [r] for pressionada"],["look","defina o efeito [fantasma] como (50)"],["control","repita (4) vezes",[["motion","adicione (-5) a x"],["control","espere (0.08) seg"]]],["control","repita (4) vezes",[["motion","adicione (5) a x"],["control","espere (0.08) seg"]]],["look","remova os efeitos gráficos"]],expected:"O Pokémon recua e retorna, sem continuar transparente. A posição x final é igual à inicial."},
  captura:{label:"Capturar",symbol:"◉",concept:"FANTASIAS + PROCEDIMENTO + MENSAGENS",title:"A captura agora tem seis poses disponíveis.",explanation:"Use o ator Pokebola do pacote. Lance uma vez, abra para receber o Pokémon, feche e balance três vezes. Termine na fantasia capturada. No ator Pokemon, use quando eu receber [entrar] → esconda. Na bandeira, mostre-o em x: 100 y: -20.",blocks:[["event","quando a bandeira verde for clicada"],["look","mostre"],["look","mude para a fantasia [fechada]"],["motion","vá para x: -140 y: -20"],["motion","deslize por (1) seg. até x: 100 y: -20"],["look","mude para a fantasia [aberta]"],["event","transmita [entrar]"],["control","espere (0.2) seg"],["look","mude para a fantasia [fechada]"],["control","repita (3) vezes",[["look","mude para a fantasia [balanco-direita]"],["control","espere (0.15) seg"],["look","mude para a fantasia [balanco-esquerda]"],["control","espere (0.15) seg"]]],["look","mude para a fantasia [capturada]"],["event","transmita [capturado]"]],expected:"A Pokébola abre, o Pokémon entra, acontecem três balanços e surgem estrelas. Depois da mensagem capturado, chame o cálculo de XP da missão de função."},
  cena:{label:"Próxima cena",symbol:"▧",concept:"EVENTOS + MENSAGENS",title:"Uma mensagem conecta as cenas.",explanation:"Envie os três cenários e renomeie para rota, batalha e ginasio. Monte esta sequência no Palco. O Pokémon reage à mensagem encontro; depois, a cena pode continuar com uma captura.",blocks:[["event","quando a bandeira verde for clicada"],["look","mude para o cenário [rota]"],["control","espere (1) seg"],["look","mude para o cenário [batalha]"],["event","transmita [encontro]"],["control","espere (1) seg"],["look","mude para o cenário [ginasio]"]],expected:"O palco passa pela rota, pela batalha e pelo ginásio. No jogo completo, use condições e mensagens para escolher quando cada troca acontece."}
};
let selectedMotion = Object.hasOwn(motionRecipes, location.hash.slice(1)) ? location.hash.slice(1) : "virar";
let motionDirection = "direita";
let motionX = -120, motionY = -40, motionFacing = 1;
let animationToken = 0;
let motionBusy = false;
const motionDelay = ms => new Promise(resolve => setTimeout(resolve, ms));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function costumePath() {
  const name = motionQuery('#pokemonChoice').value;
  const pose = motionQuery('#poseChoice').value;
  return `img/pokemon/${name}${pose === 'costas' ? '-costas' : ''}.png`;
}
function drawMotionActor() {
  const actor = motionQuery('#movingPokemon');
  actor.src = costumePath();
  actor.style.left = `${(motionX + 240) / 4.8}%`;
  actor.style.top = `${(180 - motionY) / 3.6}%`;
  actor.style.transform = `translate(-50%, -50%) scaleX(${motionFacing})`;
  actor.alt = `${motionNames[motionQuery('#pokemonChoice').value]} de ${motionQuery('#poseChoice').value}`;
  motionQuery('#positionLabel').textContent = `x: ${Math.round(motionX)} · y: ${Math.round(motionY)}`;
}
function placeMotionBall(x, y = -20) {
  motionQuery('#movingBall').style.left = `${(x + 240) / 4.8}%`;
  motionQuery('#movingBall').style.top = `${(180 - y) / 3.6}%`;
}
function setMotionScene(scene) {
  motionQuery('#sceneChoice').value = scene;
  motionQuery('#motionStage').style.backgroundImage = `url("img/movimentos/cenarios/${scene}.svg")`;
  motionQuery('#sceneCaption').textContent = {rota:"ROTA DE EXPLORAÇÃO",batalha:"CENA DE BATALHA",ginasio:"GINÁSIO"}[scene];
}
function motionBlocks(blocks) {
  return blocks.map(([kind,text,inner]) => kind === 'break' ? '<div class="motion-code-gap"></div>' : `<div class="sb ${kind} ${inner?'loop':''}">${text}${inner?`<div class="sb-inside">${motionBlocks(inner)}</div>`:''}</div>`).join('');
}
function walkBlocks() {
  const axis = ['direita','esquerda'].includes(motionDirection) ? 'x' : 'y';
  const delta = ['esquerda','baixo'].includes(motionDirection) ? -10 : 10;
  const key = {direita:'seta para direita',esquerda:'seta para esquerda',cima:'seta para cima',baixo:'seta para baixo'}[motionDirection];
  const facing = axis === 'x' ? [['motion',`aponte para a direção (${delta > 0 ? 90 : -90})`]] : [];
  return [['event',`quando a tecla [${key}] for pressionada`],['motion','defina o estilo de rotação para [esquerda-direita]'],...facing,['control','repita (8) vezes',[['motion',`adicione (${delta}) a ${axis}`],['control','espere (0.08) seg']]]];
}
function setMotionBusy(busy) {
  motionBusy = busy;
  document.querySelectorAll('#actionButtons button, .motion-controls select, #playMotion, [data-dir]').forEach(control => {control.disabled = busy;});
}
function resetMotion(announce = true) {
  animationToken += 1;
  setMotionBusy(false);
  motionX = selectedMotion === 'captura' ? 100 : -120;
  motionY = selectedMotion === 'captura' ? -20 : -40;
  motionFacing = 1;
  motionQuery('#movingPokemon').hidden = false;
  motionQuery('#movingPokemon').style.opacity = '1';
  motionQuery('#movingBall').hidden = selectedMotion !== 'captura';
  motionQuery('#movingBall').src = 'img/movimentos/pokebola/fechada.svg';
  placeMotionBall(-140); drawMotionActor();
  if (announce) motionQuery('#motionStatus').textContent = 'Cena pronta. Clique em Executar para observar a ação.';
}
function refreshMotionRecipe() {
  const recipe = motionRecipes[selectedMotion];
  motionQuery('#actionButtons').innerHTML = Object.entries(motionRecipes).map(([id,item])=>`<button class="motion-action" type="button" data-action="${id}" aria-pressed="${selectedMotion===id}"><span aria-hidden="true">${item.symbol}</span>${item.label}</button>`).join('');
  document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
    selectedMotion = button.dataset.action;
    history.replaceState(null,'',`#${selectedMotion}`);
    resetMotion(); refreshMotionRecipe();
  }));
  motionQuery('#actionConcept').textContent = recipe.concept;
  motionQuery('#actionTitle').textContent = recipe.title;
  motionQuery('#actionExplanation').textContent = recipe.explanation;
  motionQuery('#actionExpected').textContent = recipe.expected;
  motionQuery('#actionBlocks').innerHTML = motionBlocks(selectedMotion === 'andar' ? walkBlocks() : recipe.blocks);
  motionQuery('#directionButtons').hidden = selectedMotion !== 'andar';
  const slug = motionQuery('#pokemonChoice').value;
  motionQuery('#downloadActor').href = `img/movimentos/atores/${slug}.sprite3`;
  motionQuery('#downloadActor').textContent = `Baixar ${motionNames[slug]} com 2 fantasias (.sprite3) ↓`;
}
async function runMotion() {
  if (motionBusy) return;
  resetMotion(false);
  setMotionBusy(true);
  const token = animationToken;
  const actor = motionQuery('#movingPokemon'), ball = motionQuery('#movingBall');
  motionQuery('#motionStatus').textContent = `Executando: ${motionRecipes[selectedMotion].label.toLowerCase()}. Observe a ordem dos passos.`;
  const step = async (dx,dy,delay=80) => {
    if (token !== animationToken) return false;
    motionX += dx; motionY += dy; drawMotionActor();
    await motionDelay(reduceMotion ? 0 : delay);
    return token === animationToken;
  };
  if (selectedMotion === 'virar') {
    const pose = motionQuery('#poseChoice');
    pose.value = pose.value === 'frente' ? 'costas' : 'frente';
    drawMotionActor();
  } else if (selectedMotion === 'andar') {
    const dx = motionDirection==='direita'?10:motionDirection==='esquerda'?-10:0;
    const dy = motionDirection==='cima'?10:motionDirection==='baixo'?-10:0;
    motionFacing = dx<0?-1:1;
    for(let i=0;i<8;i++) if(!await step(dx,dy)) return;
  } else if (selectedMotion === 'pular') {
    for(let i=0;i<10;i++) if(!await step(0,4,20)) return;
    for(let i=0;i<10;i++) if(!await step(0,-4,20)) return;
  } else if (selectedMotion === 'atacar') {
    for(let i=0;i<5;i++) if(!await step(8,0,50)) return;
    for(let i=0;i<5;i++) if(!await step(-8,0,50)) return;
  } else if (selectedMotion === 'recuar') {
    actor.style.opacity='0.5';
    for(let i=0;i<4;i++) if(!await step(-5,0)) return;
    for(let i=0;i<4;i++) if(!await step(5,0)) return;
    actor.style.opacity='1';
  } else if (selectedMotion === 'captura') {
    ball.hidden=false;
    for(let i=1;i<=10;i++) {
      if(token!==animationToken)return;
      placeMotionBall(-140+24*i);
      await motionDelay(reduceMotion?0:100);
    }
    ball.src='img/movimentos/pokebola/aberta.svg';
    actor.hidden=true;
    await motionDelay(reduceMotion?0:200);
    if(token!==animationToken)return;
    ball.src='img/movimentos/pokebola/fechada.svg';
    for(let i=0;i<3;i++) {
      if(token!==animationToken)return;
      ball.src='img/movimentos/pokebola/balanco-direita.svg';
      await motionDelay(reduceMotion?0:150);
      if(token!==animationToken)return;
      ball.src='img/movimentos/pokebola/balanco-esquerda.svg';
      await motionDelay(reduceMotion?0:150);
    }
    if(token!==animationToken)return;
    ball.src='img/movimentos/pokebola/capturada.svg';
  } else if (selectedMotion === 'cena') {
    setMotionScene('rota');
    await motionDelay(reduceMotion?0:1000);
    if(token!==animationToken)return;
    setMotionScene('batalha'); drawMotionActor();
    await motionDelay(reduceMotion?0:1000);
    if(token!==animationToken)return;
    setMotionScene('ginasio');
  }
  if(token!==animationToken)return;
  setMotionBusy(false);
  const result = selectedMotion==='captura'?'captura concluída após três balanços. Use a mensagem capturado para calcular XP.':selectedMotion==='cena'?'rota → batalha → ginásio.':selectedMotion==='virar'?`o Pokémon agora está de ${motionQuery('#poseChoice').value}.`:'compare a posição final com a inicial e teste outro movimento.';
  motionQuery('#motionStatus').textContent = `Ação concluída: ${result}`;
}
motionQuery('#playMotion').addEventListener('click', runMotion);
motionQuery('#resetMotion').addEventListener('click',()=>resetMotion());
['#pokemonChoice','#poseChoice'].forEach(selector=>motionQuery(selector).addEventListener('change',()=>{resetMotion();refreshMotionRecipe();}));
motionQuery('#sceneChoice').addEventListener('change',event=>setMotionScene(event.target.value));
document.querySelectorAll('[data-dir]').forEach(button=>button.addEventListener('click',()=>{
  motionDirection=button.dataset.dir;
  document.querySelectorAll('[data-dir]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  refreshMotionRecipe();
}));
setMotionScene('rota');resetMotion();refreshMotionRecipe();
