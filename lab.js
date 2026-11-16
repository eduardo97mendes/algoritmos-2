"use strict";
/*
  PokéCode · Laboratório no site
  ------------------------------------------------------------------
  Um mini-Scratch dentro da página:
    - editor de blocos (Blockly) com blocos em português, iguais aos do Scratch
    - palco com Pokémon, Pokébola e cenário
    - interpretador próprio (bandeira, teclas, mensagens, variáveis, listas, blocos criados)
    - modo "Assistir explicação": roda a resposta devagar, destacando cada bloco
    - checagem automática das metas de cada missão
  O projeto do aluno é salvo no navegador (localStorage) e continua de uma missão para a outra.
*/
(() => {
  const C = {event: "#FFBF00", motion: "#4C97FF", look: "#9966FF", control: "#FFAB19", sense: "#5CB1D6", op: "#59C059", data: "#FF8C1A", list: "#FF661A", custom: "#FF6680", label: "#8a9a92"};
  const VARS = ["posição", "linha", "coluna", "índice", "terreno", "capturas", "XP"];
  const LISTS = ["equipe", "mapa"];
  const KEYS = ["seta para direita", "seta para esquerda", "seta para cima", "seta para baixo", "espaço", "c", "e", "m", "x"];
  const KEY_OF_EVENT = {ArrowRight: "seta para direita", ArrowLeft: "seta para esquerda", ArrowUp: "seta para cima", ArrowDown: "seta para baixo", " ": "espaço", c: "c", e: "e", m: "m", x: "x", C: "c", E: "e", M: "m", X: "x"};
  const KEY_LABEL = {"seta para direita": "→", "seta para esquerda": "←", "seta para cima": "↑", "seta para baixo": "↓", "espaço": "espaço"};
  const MSGS = ["capturado", "lançar"];
  const COSTUMES = ["frente", "costas", "fechada", "balanco-direita", "balanco-esquerda", "capturada"];
  const BACKDROPS = ["rota", "ginasio", "batalha", "branco"];
  const SPRITES = ["Pokemon", "Pokebola", "Palco"];
  const POKEMON = ["pikachu", "bulbasaur", "charmander", "charizard", "squirtle", "jigglypuff", "meowth", "psyduck", "gengar", "eevee", "snorlax", "dragonite", "mewtwo", "mew", "chikorita", "cyndaquil"];
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const opts = list => list.map(v => [v, v]);
  const STORE = "pokecode-lab-v1";

  /* ───────────── 1. Definição dos blocos ───────────── */
  let blocksReady = false;
  function defineBlocks() {
    if (blocksReady || !window.Blockly) return;
    blocksReady = true;
    Blockly.Extensions.register("pk_hat", function () { this.hat = "cap"; });
    const stmt = (type, colour, message0, args = [], extra = {}) => ({type, colour, message0, args0: args, previousStatement: null, nextStatement: null, inputsInline: true, ...extra});
    const hat = (type, colour, message0, args = []) => ({type, colour, message0, args0: args, nextStatement: null, extensions: ["pk_hat"]});
    const rep = (type, colour, message0, args = [], bool = false) => ({type, colour, message0, args0: args, output: bool ? "Boolean" : null, inputsInline: true});
    const v = name => ({type: "input_value", name});
    const dd = (name, list) => ({type: "field_dropdown", name, options: opts(list)});
    Blockly.defineBlocksWithJsonArray([
      {type: "num", colour: "#ffffff", message0: "%1", args0: [{type: "field_number", name: "NUM", value: 0}], output: null},
      {type: "txt", colour: "#ffffff", message0: "%1", args0: [{type: "field_input", name: "TXT", text: ""}], output: null},
      {type: "lbl", colour: C.label, message0: "%1", args0: [{type: "field_label_serializable", name: "T", text: ""}]},
      hat("ev_flag", C.event, "quando ⚑ for clicado"),
      hat("ev_key", C.event, "quando a tecla %1 for pressionada", [dd("KEY", KEYS)]),
      hat("ev_receive", C.event, "quando eu receber %1", [dd("MSG", MSGS)]),
      stmt("ev_broadcast", C.event, "transmita %1", [dd("MSG", MSGS)]),
      stmt("mo_goto", C.motion, "vá para x: %1 y: %2", [v("X"), v("Y")]),
      stmt("mo_changex", C.motion, "adicione %1 a x", [v("D")]),
      stmt("mo_changey", C.motion, "adicione %1 a y", [v("D")]),
      stmt("mo_glide", C.motion, "deslize por %1 segs. até %2", [v("S"), dd("TARGET", ["Pokemon", "posição aleatória"])]),
      stmt("lo_say", C.look, "diga %1 por %2 segundos", [v("MSG"), v("S")]),
      stmt("lo_show", C.look, "mostre"),
      stmt("lo_hide", C.look, "esconda"),
      stmt("lo_costume", C.look, "mude para a fantasia %1", [dd("C", COSTUMES)]),
      stmt("lo_backdrop", C.look, "mude para o cenário %1", [dd("B", BACKDROPS)]),
      stmt("ct_wait", C.control, "espere %1 seg", [v("S")]),
      {type: "ct_repeat", colour: C.control, message0: "repita %1 vezes", args0: [v("N")], message1: "%1", args1: [{type: "input_statement", name: "DO"}], previousStatement: null, nextStatement: null, inputsInline: true},
      {type: "ct_if", colour: C.control, message0: "se %1 então", args0: [{type: "input_value", name: "COND", check: "Boolean"}], message1: "%1", args1: [{type: "input_statement", name: "DO"}], previousStatement: null, nextStatement: null, inputsInline: true},
      stmt("se_ask", C.sense, "pergunte %1 e espere", [v("Q")]),
      rep("se_answer", C.sense, "resposta"),
      rep("op_add", C.op, "%1 + %2", [v("A"), v("B")]),
      rep("op_sub", C.op, "%1 − %2", [v("A"), v("B")]),
      rep("op_mul", C.op, "%1 × %2", [v("A"), v("B")]),
      rep("op_eq", C.op, "%1 = %2", [v("A"), v("B")], true),
      rep("op_gt", C.op, "%1 > %2", [v("A"), v("B")], true),
      rep("op_lt", C.op, "%1 < %2", [v("A"), v("B")], true),
      rep("op_random", C.op, "número aleatório entre %1 e %2", [v("A"), v("B")]),
      rep("op_join", C.op, "junte %1 com %2", [v("A"), v("B")]),
      rep("va_get", C.data, "%1", [dd("VAR", VARS)]),
      stmt("va_set", C.data, "mude %1 para %2", [dd("VAR", VARS), v("V")]),
      stmt("va_change", C.data, "adicione %1 a %2", [v("V"), dd("VAR", VARS)]),
      stmt("li_clear", C.list, "apague todos os itens de %1", [dd("L", LISTS)]),
      stmt("li_add", C.list, "adicione %1 a %2", [v("ITEM"), dd("L", LISTS)]),
      rep("li_item", C.list, "item %1 de %2", [v("I"), dd("L", LISTS)]),
      rep("li_len", C.list, "tamanho de %1", [dd("L", LISTS)]),
      hat("cu_def_bal", C.custom, "defina balançar ( vezes )"),
      rep("cu_arg_vezes", C.custom, "vezes"),
      stmt("cu_call_bal", C.custom, "balançar %1", [v("N")]),
      hat("cu_def_xp", C.custom, "defina calcular XP ( qtd )"),
      rep("cu_arg_qtd", C.custom, "qtd"),
      stmt("cu_call_xp", C.custom, "calcular XP %1", [v("N")])
    ]);
  }

  /* ───────────── 2. Construtor de código (para respostas e paleta) ───────────── */
  const N = x => typeof x === "object" ? {shadow: {type: "num", fields: {NUM: 0}}, block: x} : {shadow: {type: "num", fields: {NUM: x}}};
  const T = x => typeof x === "object" ? {shadow: {type: "txt", fields: {TXT: ""}}, block: x} : {shadow: {type: "txt", fields: {TXT: String(x)}}};
  const chain = list => { const items = list.flat().filter(Boolean); items.forEach((b, i) => { if (items[i + 1]) b.next = {block: items[i + 1]}; }); return items[0]; };
  const hatOf = (type, fields, body) => { const h = {type, fields}; if (body.length) h.next = {block: chain(body)}; return h; };
  const B = {
    flag: (...b) => hatOf("ev_flag", {}, b),
    key: (k, ...b) => hatOf("ev_key", {KEY: k}, b),
    recv: (m, ...b) => hatOf("ev_receive", {MSG: m}, b),
    defBal: (...b) => hatOf("cu_def_bal", {}, b),
    defXp: (...b) => hatOf("cu_def_xp", {}, b),
    bcast: m => ({type: "ev_broadcast", fields: {MSG: m}}),
    goto: (x, y) => ({type: "mo_goto", inputs: {X: N(x), Y: N(y)}}),
    cx: d => ({type: "mo_changex", inputs: {D: N(d)}}),
    cy: d => ({type: "mo_changey", inputs: {D: N(d)}}),
    glide: (s, t) => ({type: "mo_glide", fields: {TARGET: t}, inputs: {S: N(s)}}),
    say: (m, s) => ({type: "lo_say", inputs: {MSG: T(m), S: N(s)}}),
    show: () => ({type: "lo_show"}),
    hide: () => ({type: "lo_hide"}),
    costume: c => ({type: "lo_costume", fields: {C: c}}),
    backdrop: b => ({type: "lo_backdrop", fields: {B: b}}),
    wait: s => ({type: "ct_wait", inputs: {S: N(s)}}),
    repeat: (n, ...b) => ({type: "ct_repeat", inputs: {N: N(n), ...(b.length ? {DO: {block: chain(b)}} : {})}}),
    iff: (cond, ...b) => ({type: "ct_if", inputs: {...(cond ? {COND: {block: cond}} : {}), ...(b.length ? {DO: {block: chain(b)}} : {})}}),
    ask: q => ({type: "se_ask", inputs: {Q: T(q)}}),
    answer: () => ({type: "se_answer"}),
    op: (type, a, b) => ({type, inputs: {A: (type === "op_join" || type === "op_eq") && typeof a !== "object" ? T(a) : N(a), B: (type === "op_join" || type === "op_eq") && typeof b !== "object" ? T(b) : N(b)}}),
    get: name => ({type: "va_get", fields: {VAR: name}}),
    set: (name, val) => ({type: "va_set", fields: {VAR: name}, inputs: {V: T(val)}}),
    change: (name, val) => ({type: "va_change", fields: {VAR: name}, inputs: {V: N(val)}}),
    clear: l => ({type: "li_clear", fields: {L: l}}),
    ladd: (item, l) => ({type: "li_add", fields: {L: l}, inputs: {ITEM: T(item)}}),
    item: (i, l) => ({type: "li_item", fields: {L: l}, inputs: {I: N(i)}}),
    len: l => ({type: "li_len", fields: {L: l}}),
    argVezes: () => ({type: "cu_arg_vezes"}),
    argQtd: () => ({type: "cu_arg_qtd"}),
    bal: n => ({type: "cu_call_bal", inputs: {N: N(n)}}),
    xp: n => ({type: "cu_call_xp", inputs: {N: N(n)}})
  };

  /* Resposta acumulada até a missão `level` (0 = missão 1) */
  function solution(level, pokemon = "pikachu") {
    const L = level, name = cap(pokemon);
    const P = [], PB = [], ST = [];
    if (L < 0) return {Pokemon: P, Pokebola: PB, Palco: ST};
    const sway = [B.cx(8), B.wait(0.2), B.cx(-8), B.wait(0.2)];
    P.push(B.flag(
      L >= 1 && B.costume("frente"), B.show(), B.goto(100, -20), B.say("Um Pokémon selvagem apareceu!", 2),
      L >= 3 && [B.clear("equipe"), B.ladd("Pikachu", "equipe"), B.ladd("Charmander", "equipe"), B.ladd("Squirtle", "equipe"), B.set("posição", 0)],
      L >= 4 && [B.clear("mapa"), ...[0, 1, 0, 0, 1, 0, 0, 0, 2].map(n => B.ladd(n, "mapa"))],
      L >= 6 && [B.set("capturas", 0), B.set("XP", 0)]
    ));
    PB.push(B.flag(B.show(), B.goto(-140, -20)));
    if (L >= 1) {
      P.push(B.key("seta para direita", B.cx(10)), B.key("seta para esquerda", B.cx(-10)), B.key("seta para cima", B.cy(10), B.costume("costas")), B.key("seta para baixo", B.cy(-10), B.costume("frente")));
    }
    if (L >= 2) {
      const body = [B.show(), B.goto(-140, -20), B.glide(1, "Pokemon"), L >= 5 ? B.bal(3) : B.repeat(3, ...sway), B.bcast("capturado"), B.wait(1), B.hide()];
      PB.push(L >= 7 ? B.recv("lançar", ...body) : B.key("c", ...body));
      P.push(B.recv("capturado", B.say("Fui capturado!", 1),
        L >= 3 && B.ladd(name, "equipe"),
        L >= 6 && [B.change("capturas", 1), B.xp(B.get("capturas")), B.say(B.op("op_join", "XP da equipe: ", B.get("XP")), 1)],
        B.hide(), B.wait(1), B.goto(B.op("op_random", -200, 200), -20), B.show()));
    }
    if (L >= 3) {
      P.push(B.key("e", B.change("posição", 1), B.iff(B.op("op_gt", B.get("posição"), B.len("equipe")), B.set("posição", 1)), B.say(B.item(B.get("posição"), "equipe"), 1)));
    }
    if (L >= 4) {
      const gym = [B.say("Encontrei o ginásio!", 2), L >= 7 && B.bcast("lançar")];
      P.push(B.key("m",
        B.ask("Qual linha? (1, 2 ou 3)"), B.set("linha", B.answer()),
        B.ask("Qual coluna? (1, 2 ou 3)"), B.set("coluna", B.answer()),
        B.set("índice", B.op("op_add", B.op("op_mul", B.op("op_sub", B.get("linha"), 1), 3), B.get("coluna"))),
        B.set("terreno", B.item(B.get("índice"), "mapa")),
        B.iff(B.op("op_eq", B.get("terreno"), 0), B.say("Caminho livre!", 2)),
        B.iff(B.op("op_eq", B.get("terreno"), 1), B.say("Uma árvore bloqueia o caminho.", 2)),
        B.iff(B.op("op_eq", B.get("terreno"), 2), ...gym.filter(Boolean))));
    }
    if (L >= 5) PB.push(B.defBal(B.repeat(B.argVezes(), ...sway)));
    if (L >= 6) {
      P.push(B.defXp(B.set("XP", B.op("op_mul", B.argQtd(), 10))));
      P.push(B.key("x", B.ask("Quantas capturas?"), B.xp(B.answer()), B.say(B.op("op_join", "XP: ", B.get("XP")), 2)));
    }
    if (L >= 7) ST.push(B.flag(B.backdrop("rota")), B.recv("lançar", B.backdrop("ginasio")));
    return {Pokemon: P, Pokebola: PB, Palco: ST};
  }

  /* Paleta: blocos liberados aos poucos, missão a missão */
  function toolbox(level) {
    const at = (min, block) => level >= min ? block : null;
    const cat = (name, colour, list) => { const contents = list.filter(Boolean).map(b => ({kind: "block", ...b})); return contents.length ? {kind: "category", name, colour, contents} : null; };
    return {kind: "categoryToolbox", contents: [
      cat("Movimento", C.motion, [B.goto(0, 0), at(1, B.cx(10)), at(1, B.cy(10)), at(2, B.glide(1, "Pokemon"))]),
      cat("Aparência", C.look, [B.say("Olá!", 2), B.show(), B.hide(), B.costume("frente"), at(7, B.backdrop("rota"))]),
      cat("Eventos", C.event, [B.flag(), at(1, B.key("seta para direita")), at(2, B.bcast("capturado")), at(2, B.recv("capturado"))]),
      cat("Controle", C.control, [at(2, B.wait(1)), at(2, B.repeat(3)), at(3, B.iff(null))]),
      cat("Sensores", C.sense, [at(4, B.ask("Qual linha?")), at(4, B.answer())]),
      cat("Operadores", C.op, [at(4, B.op("op_add", "", "")), at(4, B.op("op_sub", "", "")), at(4, B.op("op_mul", "", "")), at(2, B.op("op_random", 1, 10)), at(3, B.op("op_gt", "", 50)), at(3, B.op("op_lt", "", 50)), at(4, B.op("op_eq", "", 50)), at(6, B.op("op_join", "XP: ", ""))]),
      cat("Variáveis", C.data, [at(3, B.get("posição")), at(3, B.set("posição", 0)), at(3, B.change("posição", 1)), at(3, B.clear("equipe")), at(3, B.ladd("coisa", "equipe")), at(3, B.item(1, "equipe")), at(3, B.len("equipe"))]),
      cat("Meus Blocos", C.custom, [at(5, B.defBal()), at(5, B.argVezes()), at(5, B.bal(3)), at(6, B.defXp()), at(6, B.argQtd()), at(6, B.xp(1))])
    ].filter(Boolean)};
  }

  /* ───────────── 3. Leitura do código (metas automáticas) ───────────── */
  const kids = b => { const out = []; if (!b) return out; Object.values(b.inputs || {}).forEach(inp => { if (inp.block) out.push(inp.block); }); return out; };
  function desc(b) { const out = []; let cur = b; while (cur) { out.push(cur); kids(cur).forEach(k => out.push(...desc(k))); cur = cur.next && cur.next.block; } return out; }
  const numIn = inp => inp && !inp.block && inp.shadow ? Number(inp.shadow.fields.NUM ?? inp.shadow.fields.TXT) : NaN;
  const txtIn = inp => inp && !inp.block && inp.shadow ? String(inp.shadow.fields.TXT ?? inp.shadow.fields.NUM) : null;
  const hats = (P, s, type, field) => (P[s] || []).filter(b => b.type === type && (!field || Object.values(b.fields || {}).includes(field)));
  const inAny = (list, pred) => list.some(h => desc(h).some(pred));
  const is = (type, extra = () => true) => b => b.type === type && extra(b);
  const captureScript = P => [...hats(P, "Pokebola", "ev_key", "c"), ...hats(P, "Pokebola", "ev_receive", "lançar")];

  const GOALS = [
    [["Pokemon: na bandeira, vá para x: 100 y: −20", P => inAny(hats(P, "Pokemon", "ev_flag"), is("mo_goto", b => numIn(b.inputs.X) === 100 && numIn(b.inputs.Y) === -20))],
     ["Pokemon: na bandeira, diga uma frase", P => inAny(hats(P, "Pokemon", "ev_flag"), is("lo_say"))],
     ["Pokebola: na bandeira, vá para x: −140 y: −20", P => inAny(hats(P, "Pokebola", "ev_flag"), is("mo_goto", b => numIn(b.inputs.X) === -140 && numIn(b.inputs.Y) === -20))]],
    [["Seta → soma 10 ao x", P => inAny(hats(P, "Pokemon", "ev_key", "seta para direita"), is("mo_changex", b => numIn(b.inputs.D) > 0))],
     ["Seta ← tira 10 do x", P => inAny(hats(P, "Pokemon", "ev_key", "seta para esquerda"), is("mo_changex", b => numIn(b.inputs.D) < 0))],
     ["Seta ↑ soma ao y e vira de costas", P => inAny(hats(P, "Pokemon", "ev_key", "seta para cima"), is("mo_changey", b => numIn(b.inputs.D) > 0)) && inAny(hats(P, "Pokemon", "ev_key", "seta para cima"), is("lo_costume", b => b.fields.C === "costas"))],
     ["Seta ↓ tira do y e volta de frente", P => inAny(hats(P, "Pokemon", "ev_key", "seta para baixo"), is("mo_changey", b => numIn(b.inputs.D) < 0)) && inAny(hats(P, "Pokemon", "ev_key", "seta para baixo"), is("lo_costume", b => b.fields.C === "frente"))],
     ["Bandeira: o Pokémon começa de frente", P => inAny(hats(P, "Pokemon", "ev_flag"), is("lo_costume", b => b.fields.C === "frente"))]],
    [["Pokebola: tecla C vai ao ponto de partida e desliza até o Pokemon", P => inAny(captureScript(P), is("mo_goto", b => numIn(b.inputs.X) === -140)) && inAny(captureScript(P), is("mo_glide", b => b.fields.TARGET === "Pokemon"))],
     ["Repita 3 vezes com o balanço +8 / −8 dentro", P => inAny([...captureScript(P), ...hats(P, "Pokebola", "cu_def_bal")], is("ct_repeat", b => b.inputs.DO && desc(b.inputs.DO.block).some(is("mo_changex", c => numIn(c.inputs.D) > 0)) && desc(b.inputs.DO.block).some(is("mo_changex", c => numIn(c.inputs.D) < 0))))],
     ["O deslize fica FORA do repita", P => captureScript(P).length > 0 && !inAny(captureScript(P), is("ct_repeat", b => b.inputs.DO && desc(b.inputs.DO.block).some(is("mo_glide"))))],
     ["Tecla C transmite capturado", P => inAny(captureScript(P), is("ev_broadcast", b => b.fields.MSG === "capturado"))],
     ["Pokemon: ao receber capturado, fala, some e reaparece", P => { const h = hats(P, "Pokemon", "ev_receive", "capturado"); return inAny(h, is("lo_say")) && inAny(h, is("lo_hide")) && inAny(h, is("lo_show")); }]],
    [["Bandeira: apaga a equipe e adiciona 3 nomes", P => { const h = hats(P, "Pokemon", "ev_flag"); return inAny(h, is("li_clear", b => b.fields.L === "equipe")) && h.some(x => desc(x).filter(is("li_add", b => b.fields.L === "equipe")).length >= 3); }],
     ["Tecla E soma 1 à posição", P => inAny(hats(P, "Pokemon", "ev_key", "e"), is("va_change", b => b.fields.VAR === "posição"))],
     ["Se passar do tamanho da equipe, volta para 1", P => inAny(hats(P, "Pokemon", "ev_key", "e"), is("ct_if", b => b.inputs.DO && desc(b.inputs.DO.block).some(is("va_set", c => c.fields.VAR === "posição"))))],
     ["Diz o item (posição) da equipe", P => inAny(hats(P, "Pokemon", "ev_key", "e"), is("lo_say", b => b.inputs.MSG && b.inputs.MSG.block && b.inputs.MSG.block.type === "li_item"))],
     ["Cada captura adiciona um nome à equipe", P => inAny(hats(P, "Pokemon", "ev_receive", "capturado"), is("li_add", b => b.fields.L === "equipe"))]],
    [["Bandeira: o mapa recebe 0, 1, 0, 0, 1, 0, 0, 0, 2", P => hats(P, "Pokemon", "ev_flag").some(h => { const d = desc(h); return d.some(is("li_clear", b => b.fields.L === "mapa")) && d.filter(is("li_add", b => b.fields.L === "mapa")).map(b => txtIn(b.inputs.ITEM)).join(",") === "0,1,0,0,1,0,0,0,2"; })],
     ["Tecla M pergunta e guarda linha e coluna", P => { const h = hats(P, "Pokemon", "ev_key", "m"); return h.some(x => desc(x).filter(is("se_ask")).length >= 2) && inAny(h, is("va_set", b => b.fields.VAR === "linha")) && inAny(h, is("va_set", b => b.fields.VAR === "coluna")); }],
     ["índice = (linha − 1) × 3 + coluna", P => inAny(hats(P, "Pokemon", "ev_key", "m"), is("va_set", b => b.fields.VAR === "índice" && b.inputs.V.block && b.inputs.V.block.type === "op_add" && desc(b.inputs.V.block).some(is("op_mul"))))],
     ["terreno = item (índice) de mapa", P => inAny(hats(P, "Pokemon", "ev_key", "m"), is("va_set", b => b.fields.VAR === "terreno" && b.inputs.V.block && b.inputs.V.block.type === "li_item"))],
     ["Três “se”: caminho, árvore e ginásio", P => hats(P, "Pokemon", "ev_key", "m").some(h => desc(h).filter(is("ct_if")).length >= 3)]],
    [["Pokebola: defina balançar usa o oval vezes no repita", P => inAny(hats(P, "Pokebola", "cu_def_bal"), is("ct_repeat", b => b.inputs.N && b.inputs.N.block && b.inputs.N.block.type === "cu_arg_vezes"))],
     ["A tecla C chama balançar (3)", P => inAny(captureScript(P), is("cu_call_bal"))],
     ["O repita saiu da tecla C", P => captureScript(P).length > 0 && !inAny(captureScript(P), is("ct_repeat"))]],
    [["defina calcular XP: XP = qtd × 10", P => inAny(hats(P, "Pokemon", "cu_def_xp"), is("va_set", b => b.fields.VAR === "XP" && b.inputs.V.block && desc(b.inputs.V.block).some(is("op_mul")) && desc(b.inputs.V.block).some(is("cu_arg_qtd"))))],
     ["Tecla X pergunta e chama calcular XP", P => { const h = hats(P, "Pokemon", "ev_key", "x"); return inAny(h, is("se_ask")) && inAny(h, is("cu_call_xp")); }],
     ["Bandeira zera capturas e XP", P => { const h = hats(P, "Pokemon", "ev_flag"); return inAny(h, is("va_set", b => b.fields.VAR === "capturas")) && inAny(h, is("va_set", b => b.fields.VAR === "XP")); }],
     ["Captura: soma 1 em capturas e calcula o XP", P => { const h = hats(P, "Pokemon", "ev_receive", "capturado"); return inAny(h, is("va_change", b => b.fields.VAR === "capturas")) && inAny(h, is("cu_call_xp")); }]],
    [["Pokebola: começa com quando eu receber lançar", P => inAny(hats(P, "Pokebola", "ev_receive", "lançar"), is("mo_glide"))],
     ["Ginásio no mapa transmite lançar", P => inAny(hats(P, "Pokemon", "ev_key", "m"), is("ct_if", b => b.inputs.DO && desc(b.inputs.DO.block).some(is("ev_broadcast", c => c.fields.MSG === "lançar"))))],
     ["Palco: bandeira → rota; lançar → ginásio", P => inAny(hats(P, "Palco", "ev_flag"), is("lo_backdrop", b => b.fields.B === "rota")) && inAny(hats(P, "Palco", "ev_receive", "lançar"), is("lo_backdrop", b => b.fields.B === "ginasio"))]]
  ];

  /* Roteiro da explicação animada: o que "o professor" faz, em ordem */
  const k = (key, cap, times = 1) => ({act: "key", key, cap, times});
  const DEMOS = [
    [{act: "flag", cap: "Clique na bandeira verde. Cada conjunto que começa com “quando ⚑ for clicado” roda, um em cada ator, de cima para baixo."}],
    [{act: "flag", cap: "Bandeira: o Pokémon volta para (100, −20) e fica de frente."}, k("seta para direita", "Seta → três vezes. Cada toque soma 10 ao x: ele vai para a direita.", 3), k("seta para cima", "Seta ↑ duas vezes. Soma 10 ao y (sobe) e vira de costas.", 2), k("seta para baixo", "Seta ↓: tira 10 do y (desce) e volta a ficar de frente.")],
    [{act: "flag", cap: "Bandeira: cada ator vai para o seu lugar."}, k("seta para esquerda", "O Pokémon anda um pouco para a esquerda.", 3), k("c", "Tecla C. Siga o destaque: ir para o início e deslizar acontecem UMA vez. Só o balanço fica dentro do repita 3 vezes. No fim, a mensagem capturado chega no Pokémon.")],
    [{act: "flag", cap: "Bandeira: a lista equipe é esvaziada e recebe 3 nomes. Veja a lista embaixo do palco."}, k("e", "Tecla E, três vezes. A posição vai 1, 2, 3 e o Pokémon diz o item daquela posição.", 3), k("c", "Captura! O nome do Pokémon entra no fim da lista: posição 4."), k("e", "E de novo: posição 4 → o novo membro da equipe."), k("e", "Mais um E: 5 é maior que o tamanho da lista (4), então volta para 1.")],
    [{act: "flag", cap: "Bandeira: o mapa é guardado linha por linha em uma lista de 9 itens."}, {act: "key", key: "m", answers: ["1", "2"], cap: "Tecla M, linha 1 e coluna 2. índice = (1 − 1) × 3 + 2 = 2. O item 2 do mapa é 1: árvore."}, {act: "key", key: "m", answers: ["3", "3"], cap: "Tecla M, linha 3 e coluna 3. índice = (3 − 1) × 3 + 3 = 9. O item 9 é 2: ginásio!"}],
    [{act: "flag", cap: "Bandeira: tudo no lugar."}, k("c", "Tecla C chama balançar (3). Veja o destaque pular para o “defina balançar”, repetir 3 vezes e voltar para a tecla C.")],
    [{act: "flag", cap: "Bandeira: capturas = 0 e XP = 0."}, {act: "key", key: "x", answers: ["3"], cap: "Tecla X testa a função sozinha: entra 3, a regra × 10 produz XP = 30."}, k("c", "Primeira captura: capturas vira 1 e calcular XP (capturas) dá 10."), k("c", "Segunda captura: capturas = 2, XP = 20.")],
    [{act: "flag", cap: "Bandeira: o palco começa no cenário rota."}, {act: "key", key: "m", answers: ["1", "1"], cap: "Mapa (1, 1): caminho livre. Nenhuma captura."}, {act: "key", key: "m", answers: ["3", "3"], cap: "Mapa (3, 3): ginásio! O Pokémon transmite lançar → o cenário muda e a Pokébola captura → capturado → equipe + XP."}]
  ];

  /* ───────────── 4. Interpretador ───────────── */
  const STOP = Symbol("stop");
  const toNum = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
  const fmt = v => typeof v === "number" ? String(Math.round(v * 1000) / 1000) : String(v);

  class Runtime {
    constructor(view) {
      this.view = view; // {render(), ask(question, sprite) -> Promise<string>, onBlock(block, spriteName, text), onIdle()}
      this.scripts = {Pokemon: [], Pokebola: [], Palco: []};
      this.threads = new Map();
      this.slow = 0;
      this.reset();
    }
    reset() {
      this.stopAll();
      this.state = {
        Pokemon: {x: 100, y: -20, visible: true, costume: "frente", say: ""},
        Pokebola: {x: -140, y: -20, visible: true, costume: "fechada", say: ""},
        Palco: {backdrop: "branco"}
      };
      this.vars = {};
      this.lists = {};
      this.answer = "";
    }
    setScripts(scripts) { this.scripts = scripts; }
    busy() { return this.threads.size > 0; }
    stopAll() {
      if (this.threads) this.threads.forEach(t => { t.stopped = true; });
      if (this.threads) this.threads.clear();
      if (this.state) { this.state.Pokemon.say = ""; this.state.Pokebola.say = ""; }
      if (this.view && this.view.cancelAsk) this.view.cancelAsk();
      if (this.view && this.view.onIdle) this.view.onIdle();
    }
    sleep(ms, th) {
      return new Promise((resolve, reject) => {
        const end = performance.now() + ms;
        const tick = () => { if (th.stopped) return reject(STOP); if (performance.now() >= end) return resolve(); setTimeout(tick, Math.min(30, Math.max(0, end - performance.now()))); };
        tick();
      });
    }
    start(sprite, hat, restart) {
      const id = hat.id || hat.type + JSON.stringify(hat.fields || {});
      const key = sprite + ":" + id;
      if (this.threads.has(key)) { if (!restart) return; this.threads.get(key).stopped = true; }
      const th = {stopped: false};
      this.threads.set(key, th);
      (async () => {
        try {
          if (this.view.onBlock) this.view.onBlock(hat, sprite, this.explain(hat, sprite, {}));
          if (this.slow) await this.sleep(this.slow, th);
          await this.runChain(hat.next && hat.next.block, sprite, th, {});
        } catch (e) { if (e !== STOP) console.error(e); }
        finally {
          if (this.threads.get(key) === th) this.threads.delete(key);
          if (this.view.onBlockDone) this.view.onBlockDone(hat);
          if (!this.threads.size && this.view.onIdle) this.view.onIdle();
        }
      })();
    }
    flag() { this.stopAll(); SPRITES.forEach(s => (this.scripts[s] || []).filter(b => b.type === "ev_flag").forEach(h => this.start(s, h, true))); }
    key(name) { SPRITES.forEach(s => (this.scripts[s] || []).filter(b => b.type === "ev_key" && b.fields.KEY === name).forEach(h => this.start(s, h, false))); }
    broadcast(msg) { SPRITES.forEach(s => (this.scripts[s] || []).filter(b => b.type === "ev_receive" && b.fields.MSG === msg).forEach(h => this.start(s, h, true))); }
    async runChain(b, sp, th, fr) { while (b) { await this.exec(b, sp, th, fr); b = b.next && b.next.block; } }
    val(inp, sp, fr) { if (!inp) return ""; return this.ev(inp.block || inp.shadow, sp, fr); }
    ev(b, sp, fr) {
      if (!b) return "";
      const A = () => this.val(b.inputs && b.inputs.A, sp, fr), Bv = () => this.val(b.inputs && b.inputs.B, sp, fr);
      switch (b.type) {
        case "num": return toNum(b.fields.NUM);
        case "txt": return b.fields.TXT;
        case "se_answer": return this.answer;
        case "op_add": return toNum(A()) + toNum(Bv());
        case "op_sub": return toNum(A()) - toNum(Bv());
        case "op_mul": return toNum(A()) * toNum(Bv());
        case "op_eq": { const a = A(), c = Bv(); const na = Number(a), nc = Number(c); return (String(a).trim() !== "" && String(c).trim() !== "" && !isNaN(na) && !isNaN(nc)) ? na === nc : String(a).toLowerCase() === String(c).toLowerCase(); }
        case "op_gt": return toNum(A()) > toNum(Bv());
        case "op_lt": return toNum(A()) < toNum(Bv());
        case "op_random": { const lo = toNum(A()), hi = toNum(Bv()); const [mn, mx] = lo < hi ? [lo, hi] : [hi, lo]; return Number.isInteger(mn) && Number.isInteger(mx) ? mn + Math.floor(Math.random() * (mx - mn + 1)) : mn + Math.random() * (mx - mn); }
        case "op_join": return fmt(A()) + fmt(Bv());
        case "va_get": return this.vars[b.fields.VAR] ?? 0;
        case "li_item": { const list = this.lists[b.fields.L] || []; const i = Math.round(toNum(this.val(b.inputs.I, sp, fr))); return list[i - 1] ?? ""; }
        case "li_len": return (this.lists[b.fields.L] || []).length;
        case "cu_arg_vezes": return fr.vezes ?? 0;
        case "cu_arg_qtd": return fr.qtd ?? 0;
        default: return "";
      }
    }
    /* Texto que descreve uma expressão com os valores atuais: "terreno (0) = 2" */
    describe(inp, sp, fr) {
      if (!inp) return "";
      const b = inp.block || inp.shadow;
      if (!b) return "";
      const d = name => this.describe(b.inputs && b.inputs[name], sp, fr);
      const sym = {op_add: "+", op_sub: "−", op_mul: "×", op_eq: "=", op_gt: ">", op_lt: "<"}[b.type];
      if (sym) return `${d("A")} ${sym} ${d("B")}`;
      switch (b.type) {
        case "num": return fmt(b.fields.NUM);
        case "txt": return `“${b.fields.TXT}”`;
        case "va_get": return `${b.fields.VAR} (${fmt(this.ev(b, sp, fr))})`;
        case "se_answer": return `resposta (${fmt(this.answer)})`;
        case "li_item": return `item ${d("I")} de ${b.fields.L} (${fmt(this.ev(b, sp, fr))})`;
        case "li_len": return `tamanho de ${b.fields.L} (${this.ev(b, sp, fr)})`;
        case "cu_arg_vezes": return `vezes (${fmt(fr.vezes ?? 0)})`;
        case "cu_arg_qtd": return `qtd (${fmt(fr.qtd ?? 0)})`;
        case "op_random": return `número aleatório entre ${d("A")} e ${d("B")}`;
        case "op_join": return `junte ${d("A")} com ${d("B")}`;
        default: return "";
      }
    }
    explain(b, sp, fr) {
      const v = n => this.val(b.inputs && b.inputs[n], sp, fr);
      const who = sp === "Palco" ? "O palco" : sp === "Pokebola" ? "A Pokébola" : "O Pokémon";
      const s = this.state[sp] || {};
      switch (b.type) {
        case "ev_flag": return "A bandeira foi clicada: este conjunto começa a rodar.";
        case "ev_key": return `A tecla ${KEY_LABEL[b.fields.KEY] || b.fields.KEY.toUpperCase()} foi pressionada: este conjunto começa.`;
        case "ev_receive": return `Chegou a mensagem “${b.fields.MSG}”: este conjunto começa.`;
        case "ev_broadcast": return `Envia a mensagem “${b.fields.MSG}”. Todo “quando eu receber ${b.fields.MSG}” começa agora.`;
        case "mo_goto": return `${who} vai direto para x ${fmt(v("X"))}, y ${fmt(v("Y"))}.`;
        case "mo_changex": { const d = toNum(v("D")); return `x ${d >= 0 ? "+" : "−"} ${Math.abs(d)}: anda para a ${d >= 0 ? "direita" : "esquerda"}. x passa de ${fmt(s.x)} para ${fmt(s.x + d)}.`; }
        case "mo_changey": { const d = toNum(v("D")); return `y ${d >= 0 ? "+" : "−"} ${Math.abs(d)}: ${d >= 0 ? "sobe" : "desce"}. y passa de ${fmt(s.y)} para ${fmt(s.y + d)}.`; }
        case "mo_glide": return `${who} desliza por ${fmt(v("S"))} s até ${b.fields.TARGET === "Pokemon" ? "o Pokémon, onde ele estiver" : "um ponto aleatório"}.`;
        case "lo_say": return `${who} diz “${fmt(v("MSG"))}”.`;
        case "lo_show": return `${who} aparece.`;
        case "lo_hide": return `${who} some (fica escondido).`;
        case "lo_costume": return `${who} troca de fantasia: “${b.fields.C}”.`;
        case "lo_backdrop": return `O palco troca para o cenário “${b.fields.B}”.`;
        case "ct_wait": return `Espera ${fmt(v("S"))} s antes do próximo bloco.`;
        case "ct_repeat": return `Repete ${fmt(v("N"))} vezes só os blocos de dentro.`;
        case "ct_if": { const ok = !!v("COND"); return `Pergunta: ${this.describe(b.inputs && b.inputs.COND, sp, fr)}? ${ok ? "SIM → executa o que está dentro." : "NÃO → pula o que está dentro."}`; }
        case "se_ask": return `Pergunta “${fmt(v("Q"))}” e espera a resposta.`;
        case "va_set": return `${b.fields.VAR} recebe ${this.describe(b.inputs.V, sp, fr)} → vale ${fmt(v("V"))}.`;
        case "va_change": { const old = toNum(this.vars[b.fields.VAR] ?? 0); const d = toNum(v("V")); return `${b.fields.VAR} soma ${fmt(d)}: de ${fmt(old)} para ${fmt(old + d)}.`; }
        case "li_clear": return `Esvazia a lista ${b.fields.L}.`;
        case "li_add": return `Coloca ${fmt(v("ITEM")) === "" ? "um item" : `“${fmt(v("ITEM"))}”`} no fim da lista ${b.fields.L}: posição ${(this.lists[b.fields.L] || []).length + 1}.`;
        case "cu_call_bal": return `Chama o bloco balançar com vezes = ${fmt(v("N"))}.`;
        case "cu_call_xp": return `Chama o bloco calcular XP com qtd = ${fmt(v("N"))}.`;
        case "cu_def_bal": return `Entrou na definição de balançar, com vezes = ${fmt(fr.vezes)}.`;
        case "cu_def_xp": return `Entrou na definição de calcular XP, com qtd = ${fmt(fr.qtd)}.`;
        default: return "";
      }
    }
    async exec(b, sp, th, fr) {
      if (th.stopped) throw STOP;
      if (this.view.onBlock) this.view.onBlock(b, sp, this.explain(b, sp, fr));
      if (this.slow) await this.sleep(this.slow, th);
      const s = this.state[sp];
      const v = n => this.val(b.inputs && b.inputs[n], sp, fr);
      const clamp = () => { s.x = Math.max(-240, Math.min(240, s.x)); s.y = Math.max(-180, Math.min(180, s.y)); };
      switch (b.type) {
        case "ev_broadcast": this.broadcast(b.fields.MSG); break;
        case "mo_goto": if (sp !== "Palco") { s.x = toNum(v("X")); s.y = toNum(v("Y")); clamp(); } break;
        case "mo_changex": if (sp !== "Palco") { s.x += toNum(v("D")); clamp(); } break;
        case "mo_changey": if (sp !== "Palco") { s.y += toNum(v("D")); clamp(); } break;
        case "mo_glide": {
          if (sp === "Palco") break;
          const secs = Math.max(0, toNum(v("S")));
          const tgt = b.fields.TARGET === "Pokemon" && sp !== "Pokemon" ? {x: this.state.Pokemon.x, y: this.state.Pokemon.y} : {x: Math.round(Math.random() * 400 - 200), y: Math.round(Math.random() * 300 - 150)};
          const x0 = s.x, y0 = s.y, t0 = performance.now(), dur = secs * 1000;
          while (true) {
            const p = dur ? Math.min(1, (performance.now() - t0) / dur) : 1;
            s.x = x0 + (tgt.x - x0) * p; s.y = y0 + (tgt.y - y0) * p; this.view.render();
            if (p >= 1) break;
            await this.sleep(16, th);
          }
          break;
        }
        case "lo_say": {
          if (sp === "Palco") break;
          const text = fmt(v("MSG")), secs = toNum(v("S"));
          const token = {}; s.say = text; s.sayToken = token; this.view.render();
          try { await this.sleep(secs * 1000, th); } finally { if (s.sayToken === token) { s.say = ""; this.view.render(); } }
          break;
        }
        case "lo_show": if (sp !== "Palco") s.visible = true; break;
        case "lo_hide": if (sp !== "Palco") s.visible = false; break;
        case "lo_costume": if (sp === "Pokemon" && ["frente", "costas"].includes(b.fields.C)) s.costume = b.fields.C; else if (sp === "Pokebola" && !["frente", "costas"].includes(b.fields.C)) s.costume = b.fields.C; break;
        case "lo_backdrop": this.state.Palco.backdrop = b.fields.B; break;
        case "ct_wait": await this.sleep(Math.max(0, toNum(v("S"))) * 1000, th); break;
        case "ct_repeat": {
          const n = Math.round(toNum(v("N")));
          for (let i = 0; i < n; i++) { await this.runChain(b.inputs.DO && b.inputs.DO.block, sp, th, fr); await this.sleep(0, th); }
          break;
        }
        case "ct_if": if (v("COND") === true) await this.runChain(b.inputs.DO && b.inputs.DO.block, sp, th, fr); break;
        case "se_ask": {
          const q = fmt(v("Q"));
          const showBubble = sp !== "Palco" && s.visible;
          if (showBubble) { s.say = q; this.view.render(); }
          const ans = await Promise.race([this.view.ask(showBubble ? "" : q, sp), new Promise((_, rej) => { const t = setInterval(() => { if (th.stopped) { clearInterval(t); rej(STOP); } }, 60); })]);
          if (showBubble) s.say = "";
          this.answer = ans;
          break;
        }
        case "va_set": this.vars[b.fields.VAR] = (() => { const x = v("V"); return typeof x === "number" ? x : (x !== "" && !isNaN(Number(x)) ? Number(x) : x); })(); break;
        case "va_change": this.vars[b.fields.VAR] = toNum(this.vars[b.fields.VAR] ?? 0) + toNum(v("V")); break;
        case "li_clear": this.lists[b.fields.L] = []; break;
        case "li_add": (this.lists[b.fields.L] = this.lists[b.fields.L] || []).push(fmt(v("ITEM"))); break;
        case "cu_call_bal": case "cu_call_xp": {
          const defType = b.type === "cu_call_bal" ? "cu_def_bal" : "cu_def_xp";
          const def = (this.scripts[sp] || []).find(x => x.type === defType);
          if (!def) break;
          const frame = b.type === "cu_call_bal" ? {vezes: toNum(v("N"))} : {qtd: toNum(v("N"))};
          if (this.view.onBlock) this.view.onBlock(def, sp, this.explain(def, sp, frame));
          if (this.slow) await this.sleep(this.slow, th);
          await this.runChain(def.next && def.next.block, sp, th, frame);
          break;
        }
        default: break;
      }
      this.view.render();
      if (this.view.onBlockDone) this.view.onBlockDone(b);
    }
  }

  /* ───────────── 5. Palco (desenho) ───────────── */
  function stageMarkup() {
    return `<div class="lab-stage-box"><div class="lab-stage" data-stage><div class="lab-backdrop" data-backdrop></div><div class="lab-sprite" data-sprite="Pokebola"><img alt="Pokébola"><span class="lab-bubble" hidden></span></div><div class="lab-sprite" data-sprite="Pokemon"><img alt="Pokémon"><span class="lab-bubble" hidden></span></div><form class="lab-ask" data-ask hidden><span data-ask-q></span><input type="text" aria-label="Resposta" autocomplete="off"><button type="submit" aria-label="Responder">✓</button></form><span class="lab-coords" data-coords></span></div></div>`;
  }

  function makeView(root, getPokemon) {
    const stage = root.querySelector("[data-stage]");
    const sizes = {};
    let askResolve = null;
    const view = {
      runtime: null,
      render() {
        const rt = view.runtime; if (!rt) return;
        const scale = stage.clientWidth / 480;
        stage.style.setProperty("--k", scale);
        const bd = rt.state.Palco.backdrop;
        stage.querySelector("[data-backdrop]").style.backgroundImage = bd === "branco" ? "none" : `url(img/movimentos/cenarios/${bd}.svg)`;
        ["Pokemon", "Pokebola"].forEach(name => {
          const s = rt.state[name], el = stage.querySelector(`[data-sprite="${name}"]`), img = el.querySelector("img");
          const src = name === "Pokemon" ? `img/pokemon/${getPokemon()}${s.costume === "costas" ? "-costas" : ""}.png` : `img/movimentos/pokebola/${s.costume}.svg`;
          if (img.getAttribute("src") !== src) {
            img.setAttribute("src", src);
            img.onload = () => { sizes[src] = [img.naturalWidth, img.naturalHeight]; view.render(); };
          }
          const nat = sizes[src] || (img.naturalWidth ? [img.naturalWidth, img.naturalHeight] : [60, 60]);
          const target = name === "Pokemon" ? 74 : 40;
          const f = target / Math.max(nat[0], nat[1]);
          img.style.width = `${nat[0] * f * scale}px`; img.style.height = `${nat[1] * f * scale}px`;
          el.style.left = `${(240 + s.x) * scale}px`; el.style.top = `${(180 - s.y) * scale}px`;
          el.hidden = !s.visible;
          const bubble = el.querySelector(".lab-bubble");
          bubble.hidden = !s.say; bubble.textContent = s.say;
          bubble.style.bottom = `${(nat[1] * f / 2 + 6) * scale}px`;
        });
        const p = rt.state.Pokemon;
        root.querySelector("[data-coords]").textContent = `Pokémon: x ${Math.round(p.x)} · y ${Math.round(p.y)}`;
        const mon = root.querySelector("[data-monitors]");
        if (mon) {
          const vars = Object.entries(rt.vars), lists = Object.entries(rt.lists);
          mon.innerHTML = !vars.length && !lists.length ? '<p class="lab-empty">As variáveis e listas aparecem aqui quando o código usar.</p>' :
            vars.map(([n, val]) => `<div class="lab-var"><span>${n}</span><b>${fmt(val)}</b></div>`).join("") +
            lists.map(([n, items]) => `<div class="lab-list"><span>${n}</span><ol>${items.map(i => `<li><small></small>${i === "" ? "&nbsp;" : i}</li>`).join("") || "<li class=empty>(vazia)</li>"}</ol><em>tamanho ${items.length}</em></div>`).join("");
        }
      },
      ask(question) {
        const form = stage.querySelector("[data-ask]"), input = form.querySelector("input");
        form.querySelector("[data-ask-q]").textContent = question;
        form.hidden = false; input.value = "";
        if (!view.autoAnswers) input.focus({preventScroll: true});
        return new Promise(resolve => {
          askResolve = value => { form.hidden = true; askResolve = null; resolve(value); };
          if (view.autoAnswers && view.autoAnswers.length) {
            const ans = view.autoAnswers.shift();
            setTimeout(() => { input.value = ans; setTimeout(() => askResolve && askResolve(ans), 700); }, 700);
          }
        });
      },
      cancelAsk() { const form = stage.querySelector("[data-ask]"); if (form) form.hidden = true; askResolve = null; }
    };
    stage.querySelector("[data-ask]").addEventListener("submit", e => { e.preventDefault(); if (askResolve) askResolve(e.target.querySelector("input").value); });
    return view;
  }

  /* ───────────── 6. Laboratório ───────────── */
  const loadStore = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } };
  const saveStore = data => { try { localStorage.setItem(STORE, JSON.stringify(data)); } catch (e) { /* sem armazenamento */ } };
  let themeCache = null;
  const theme = () => themeCache || (themeCache = Blockly.Theme.defineTheme("pokecode", {base: Blockly.Themes.Classic, componentStyles: {workspaceBackgroundColour: "#f9fbf8", toolboxBackgroundColour: "#ffffff", toolboxForegroundColour: "#24343a", flyoutBackgroundColour: "#eef3ee", flyoutOpacity: 0.97, scrollbarColour: "#c6d3c8", insertionMarkerColour: "#000", insertionMarkerOpacity: 0.2}, fontStyle: {family: "Inter, system-ui, sans-serif", weight: "600", size: 11}}));

  let active = null;
  function unmount() {
    if (!active) return;
    active.rt.stopAll();
    if (active.ws) active.ws.dispose();
    document.removeEventListener("keydown", active.onKey);
    window.removeEventListener("resize", active.onResize);
    if (active.timer) clearTimeout(active.timer);
    if (active.ro) active.ro.disconnect();
    active.cancelled = true;
    active = null;
  }

  function topLevel(project) { const out = {}; SPRITES.forEach(s => { out[s] = (project[s] && project[s].blocks && project[s].blocks.blocks) || []; }); return out; }
  function asWorkspace(blocks) { return {layout: true, blocks: {languageVersion: 0, blocks: blocks.map((b, i) => ({...b, x: 20, y: 20 + i * 140}))}}; }
  function projectFromSolution(level, pokemon) { const sol = solution(level, pokemon); const p = {}; SPRITES.forEach(s => { p[s] = asWorkspace(sol[s]); }); return p; }

  function mount(container, {level, mode = "build", lesson}) {
    unmount();
    defineBlocks();
    if (!window.Blockly) { container.innerHTML = '<p class="lab-empty">Não foi possível carregar o editor de blocos. Verifique a internet e recarregue a página.</p>'; return; }
    const store = loadStore();
    if (!store.pokemon) store.pokemon = "pikachu";
    const watch = mode === "watch";
    let notice = "";
    if (!watch && !store.project) {
      store.project = level > 0 ? projectFromSolution(level - 1, store.pokemon) : projectFromSolution(-1);
      notice = level > 0 ? `Começamos com o jogo pronto até a missão ${String(level).padStart(2, "0")}. Agora acrescente a peça desta missão.` : "";
      saveStore(store);
    }
    const getPokemon = () => loadStore().pokemon || "pikachu";
    const goals = GOALS[level] || [];
    container.innerHTML = `<div class="lab ${watch ? "is-watch" : ""}" data-lab tabindex="-1">
      <div class="lab-bar">
        ${watch ? `<div class="lab-title"><b>▶ Explicação animada</b><small>O código pronto da missão roda devagar. Siga o bloco destacado.</small></div>` : `<div class="lab-tabs" role="tablist" aria-label="Escolha o ator para programar">${SPRITES.map(s => `<button type="button" role="tab" data-tab="${s}"><img src="${s === "Pokemon" ? `img/pokemon/${getPokemon()}.png` : s === "Pokebola" ? "img/movimentos/pokebola/fechada.svg" : "img/movimentos/cenarios/rota.svg"}" alt=""><span>${s}</span></button>`).join("")}</div>`}
        <div class="lab-run">${watch ? `<label class="lab-speed">Velocidade <select data-speed><option value="900">Bem devagar</option><option value="450" selected>Devagar</option><option value="150">Normal</option></select></label><button type="button" class="lab-btn go" data-play>▶ Começar</button>` : `<button type="button" class="lab-flag" data-flag aria-label="Bandeira verde">⚑</button><button type="button" class="lab-stop" data-stop aria-label="Parar">■</button>`}</div>
      </div>
      ${notice ? `<p class="lab-notice">${notice}</p>` : ""}
      <div class="lab-main">
        <div class="lab-ws-wrap">${watch ? "" : '<p class="lab-hint" data-hint></p>'}<div class="lab-ws" data-ws></div></div>
        <div class="lab-side">
          ${stageMarkup()}
          <div class="lab-keys" aria-label="Teclas do jogo">${watch ? "" : '<span>Teclas:</span>' + ["seta para esquerda", "seta para cima", "seta para baixo", "seta para direita", "c", "e", "m", "x"].map(key => `<button type="button" data-key="${key}">${KEY_LABEL[key] || key.toUpperCase()}</button>`).join("")}</div>
          <p class="lab-now" data-now aria-live="polite">${watch ? "Clique em ▶ Começar." : "Clique na bandeira ⚑ para rodar o seu código."}</p>
          ${watch ? '<ol class="lab-steps" data-steps></ol>' : ""}
          <div class="lab-monitors" data-monitors></div>
          ${watch ? "" : `<div class="lab-goals"><h4>Metas desta missão <small>(conferidas automaticamente)</small></h4><ul data-goals></ul></div>`}
        </div>
      </div>
      ${watch ? "" : `<div class="lab-foot"><span>💾 Seu jogo fica salvo neste navegador e continua na próxima missão.</span><label>Seu Pokémon <select data-poke>${POKEMON.map(p => `<option value="${p}" ${p === getPokemon() ? "selected" : ""}>${cap(p)}</option>`).join("")}</select></label><button type="button" class="lab-btn" data-load-prev>${level > 0 ? "Carregar jogo pronto até a missão anterior" : "Começar do zero"}</button><button type="button" class="lab-btn" data-load-sol>Ver a resposta desta missão</button></div>`}
    </div>`;
    const root = container.querySelector("[data-lab]");
    const view = makeView(root, getPokemon);
    const rt = new Runtime(view);
    view.runtime = rt;
    const state = {rt, ws: null, sprite: "Pokemon", highlighted: new Set(), cancelled: false};
    active = state;

    const ws = Blockly.inject(root.querySelector("[data-ws]"), {
      toolbox: watch ? undefined : toolbox(level), renderer: "zelos", theme: theme(), readOnly: watch,
      zoom: {controls: true, wheel: false, startScale: watch ? 0.62 : 0.75, maxScale: 1.4, minScale: 0.35, scaleSpeed: 1.15},
      media: "vendor/media/", trashcan: !watch, move: {scrollbars: true, drag: true, wheel: true}, sounds: false
    });
    state.ws = ws;

    const highlight = (id, on) => { try { ws.highlightBlock(id, on); } catch (e) { /* bloco não visível */ } };
    const clearHighlights = () => { state.highlighted.forEach(id => highlight(id, false)); state.highlighted.clear(); };
    const nowEl = root.querySelector("[data-now]");
    view.onBlock = (b, sp, text) => {
      if (text) nowEl.innerHTML = `<b>${sp === "Palco" ? "Palco" : sp}:</b> ${text}`;
      const visible = watch || sp === state.sprite;
      if (visible && b.id && ws.getBlockById(b.id)) {
        highlight(b.id, true); state.highlighted.add(b.id);
        if (watch) {
          const blk = ws.getBlockById(b.id);
          const view_ = ws.getMetricsManager().getViewMetrics(true), r = blk.getBoundingRectangle();
          if (r.top < view_.top || r.top + 40 > view_.top + view_.height || r.left < view_.left || r.left + 60 > view_.left + view_.width) ws.centerOnBlock(b.id);
        }
      }
    };
    view.onBlockDone = b => { if (b.id && state.highlighted.has(b.id)) { highlight(b.id, false); state.highlighted.delete(b.id); } };
    view.onIdle = () => { clearHighlights(); };

    const syncScripts = () => {
      if (watch) {
        const all = Blockly.serialization.workspaces.save(ws).blocks?.blocks || [];
        const scripts = {Pokemon: [], Pokebola: [], Palco: []};
        all.forEach(b => { if (b.data && scripts[b.data]) scripts[b.data].push(b); });
        rt.setScripts(scripts);
      } else {
        const st = loadStore();
        st.project = st.project || {};
        st.project[state.sprite] = Blockly.serialization.workspaces.save(ws);
        saveStore(st);
        rt.setScripts(topLevel(st.project));
        renderGoals(st.project);
      }
    };

    function renderGoals(project) {
      const list = root.querySelector("[data-goals]"); if (!list) return;
      const P = topLevel(project);
      const results = goals.map(([text, fn]) => { let ok = false; try { ok = !!fn(P); } catch (e) { ok = false; } return [text, ok]; });
      const done = results.filter(r => r[1]).length;
      list.innerHTML = results.map(([text, ok]) => `<li class="${ok ? "ok" : ""}"><span aria-hidden="true">${ok ? "✓" : "○"}</span>${text}</li>`).join("") + `<li class="goal-total ${done === results.length ? "ok" : ""}">${done === results.length ? "🎉 Todas as metas cumpridas! Rode o jogo e depois vá para a etapa Teste." : `${done} de ${results.length} metas`}</li>`;
    }


    function loadSprite(name) {
      state.sprite = name;
      Blockly.Events.disable();
      try {
        ws.clear();
        const st = loadStore();
        const data = st.project && st.project[name];
        if (data) Blockly.serialization.workspaces.load(data, ws);
        if (data && data.layout) ws.cleanUp();
      } finally { Blockly.Events.enable(); }
      root.querySelectorAll("[data-tab]").forEach(btn => btn.setAttribute("aria-selected", String(btn.dataset.tab === name)));
      const hint = root.querySelector("[data-hint]");
      if (hint) hint.innerHTML = `Você está programando: <b>${name === "Palco" ? "o Palco (cenário)" : name === "Pokebola" ? "a Pokébola" : "o Pokémon"}</b>. Arraste blocos da paleta à esquerda e encaixe um embaixo do outro.`;
      ws.scrollCenter();
      syncScripts();
    }

    function replaceProject(project) {
      rt.stopAll();
      const st = loadStore(); st.project = project; saveStore(st);
      loadSprite(state.sprite);
    }

    if (watch) {
      // Todos os atores em um só quadro, um em cada coluna
      const sol = solution(level, getPokemon());
      const tops = [];
      SPRITES.forEach(s => { if (sol[s].length) { tops.push({type: "lbl", data: s, fields: {T: s === "Palco" ? "🖼  Código do PALCO" : s === "Pokebola" ? "🔴  Código da POKEBOLA" : "⭐  Código do POKEMON"}}); sol[s].forEach(b => tops.push({...b, data: s})); } });
      Blockly.Events.disable();
      Blockly.serialization.workspaces.load({blocks: {languageVersion: 0, blocks: tops}}, ws);
      Blockly.Events.enable();
      let colX = 0;
      SPRITES.forEach(s => {
        const blocks = ws.getTopBlocks(false).filter(b => b.data === s);
        if (!blocks.length) return;
        let y = 0, w = 0;
        blocks.forEach(b => { b.moveTo(new Blockly.utils.Coordinate(colX, y)); const hw = b.getHeightWidth(); y += hw.height + 34; w = Math.max(w, hw.width); });
        colX += w + 70;
      });
      ws.scrollCenter();
      syncScripts();
      const steps = DEMOS[level] || [];
      const stepsEl = root.querySelector("[data-steps]");
      stepsEl.innerHTML = steps.map(s => `<li>${s.cap}</li>`).join("");
      const playBtn = root.querySelector("[data-play]");
      const speed = root.querySelector("[data-speed]");
      speed.addEventListener("change", () => { rt.slow = Number(speed.value); });
      rt.slow = Number(speed.value);
      let running = false;
      const waitIdle = () => new Promise(resolve => { const t = setInterval(() => { if (state.cancelled || !rt.busy()) { clearInterval(t); resolve(); } }, 80); });
      const pause = ms => new Promise(r => setTimeout(r, ms));
      playBtn.addEventListener("click", async () => {
        if (running) { running = false; rt.stopAll(); playBtn.textContent = "▶ Recomeçar"; return; }
        running = true; playBtn.textContent = "■ Parar";
        rt.reset(); view.render();
        const items = [...stepsEl.children];
        for (let i = 0; i < steps.length && running && !state.cancelled; i++) {
          items.forEach((li, j) => li.className = j < i ? "done" : j === i ? "now" : "");
          const step = steps[i];
          view.autoAnswers = step.answers ? [...step.answers] : null;
          for (let t = 0; t < (step.times || 1) && running; t++) {
            if (step.act === "flag") rt.flag(); else rt.key(step.key);
            await pause(60); await waitIdle(); await pause(500);
          }
        }
        items.forEach(li => li.className = running ? "done" : li.className);
        if (running) nowEl.innerHTML = "<b>Fim da explicação.</b> Agora é a sua vez: escolha “Montar aqui no site”.";
        running = false; playBtn.textContent = "▶ Assistir de novo"; view.autoAnswers = null;
      });
    } else {
      loadSprite("Pokemon");
      ws.addChangeListener(e => {
        if (e.isUiEvent || state.cancelled) return;
        if (state.timer) clearTimeout(state.timer);
        state.timer = setTimeout(syncScripts, 250);
      });
      root.querySelectorAll("[data-tab]").forEach(btn => btn.addEventListener("click", () => { syncScripts(); loadSprite(btn.dataset.tab); }));
      root.querySelector("[data-flag]").addEventListener("click", () => { syncScripts(); rt.flag(); root.focus({preventScroll: true}); });
      root.querySelector("[data-stop]").addEventListener("click", () => rt.stopAll());
      root.querySelectorAll("[data-key]").forEach(btn => btn.addEventListener("click", () => rt.key(btn.dataset.key)));
      root.querySelector("[data-poke]").addEventListener("change", e => {
        const st = loadStore(); st.pokemon = e.target.value; saveStore(st);
        root.querySelector('[data-tab="Pokemon"] img').src = `img/pokemon/${e.target.value}.png`;
        view.render();
      });
      root.querySelector("[data-load-prev]").addEventListener("click", () => {
        if (!confirm(level > 0 ? "Trocar o seu código pelo jogo pronto até a missão anterior? O que você montou será substituído." : "Apagar todo o código e começar do zero?")) return;
        replaceProject(projectFromSolution(level - 1, getPokemon()));
      });
      root.querySelector("[data-load-sol]").addEventListener("click", () => {
        if (!confirm("Carregar a resposta pronta desta missão? O seu código será substituído. Dica: tente primeiro, use a resposta só para comparar.")) return;
        replaceProject(projectFromSolution(level, getPokemon()));
      });
      state.onKey = e => {
        if (!root.isConnected || root.closest("[hidden]")) return;
        const tag = (e.target.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) return;
        if (!root.contains(document.activeElement) && document.activeElement !== document.body) return;
        const key = KEY_OF_EVENT[e.key];
        if (!key) return;
        if (e.key.startsWith("Arrow") || e.key === " ") e.preventDefault();
        if (!e.repeat || e.key.startsWith("Arrow")) rt.key(key);
      };
      document.addEventListener("keydown", state.onKey);
    }
    state.onResize = () => { Blockly.svgResize(ws); view.render(); };
    window.addEventListener("resize", state.onResize);
    if (window.ResizeObserver) { state.ro = new ResizeObserver(() => { if (!state.cancelled) { Blockly.svgResize(ws); view.render(); } }); state.ro.observe(root.querySelector("[data-ws]")); state.ro.observe(root.querySelector("[data-stage]")); }
    root.querySelector("[data-stage]").addEventListener("pointerdown", () => root.focus({preventScroll: true}));
    rt.reset();
    requestAnimationFrame(() => { Blockly.svgResize(ws); view.render(); if (!watch) ws.scrollCenter(); });
  }

  window.PokeLab = {mount, unmount, solution, GOALS, DEMOS, topLevel, projectFromSolution, setPokemon(name) { const st = loadStore(); st.pokemon = name; saveStore(st); }};
})();
