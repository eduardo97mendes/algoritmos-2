# PokéCode — aula visual guiada

Material de aula com tema Pokémon para praticar coordenadas, algoritmos, vetor, matriz, procedimento e função simulada no Scratch.

## Como o aluno acompanha

Cada missão mostra uma etapa por vez: **Olhe → Experimente → Monte → Teste**. A montagem tem passos numerados, com o ator, o caminho até os comandos, um modelo e o resultado a conferir. As dicas e a montagem completa ficam em painéis expansíveis. Os botões avançam no ritmo do aluno; os computadores não ficam sincronizados automaticamente.

A missão de coordenadas inclui um palco interativo com X/Y e uma comparação de três eixos: Minecraft (Y é altura), impressora cartesiana (Z é altura) e CAD (observe a orientação configurada). A matriz distingue linha/coluna das coordenadas do palco. Diagramas em HTML/CSS/SVG dispensam novas imagens.

A página pública reúne as missões e atividades dos alunos. Siga a sequência: preparação, coordenadas, captura e os próximos conceitos.

## Quantidade de arquivos

O site inteiro tem 75 arquivos e 7 subpastas: 82 itens ao todo, abaixo de 100, incluindo as imagens, atores e pacotes para download.

Cada um dos 16 Pokémon tem somente uma imagem de frente e uma de costas: 32 PNGs. Foram removidos os GIFs, os quadros intermediários e os atores antigos com oito fantasias.

## Estrutura

- `index.html`: início e navegação das missões.
- `lessons.js`: conteúdo das atividades.
- `guide.js`: explicações visuais, coordenadas e passos curtos de montagem.
- `script.js`: interações e progresso das missões.
- `styles.css`: apresentação e responsividade.
- `imagens.html`: galeria de frente e costas, com downloads individuais.
- `movimentos.html` e `movimentos.js`: demonstrações e receitas de movimento.
- `img/pokemon/`: 16 imagens de frente e 16 de costas.
- `img/pokebolas/`: 4 tipos de Pokébola em PNG.
- `img/movimentos/atores/`: 16 atores .sprite3 com 2 fantasias cada e o ator de captura da Pokébola.
- `img/movimentos/pokebola/`: 6 estados diferentes da Pokébola para a captura.
- `img/movimentos/cenarios/`: rota, batalha e ginásio.

## Usar no Scratch

Na galeria, baixe um ator .sprite3 e importe por Escolher um Ator → Enviar Ator. Cada Pokémon contém somente as fantasias `frente` e `costas`, sem código pronto.

Também é possível baixar os PNGs separados: envie a frente como ator e, no mesmo ator, use Fantasias → Enviar Fantasia para adicionar as costas.

Andar, pular, atacar e recuar são programados com os blocos de Movimento. Trocar a pose usa `mude para a fantasia` ou `próxima fantasia`, que alterna entre as duas posições.

O ator Pokebola mantém seis estados visuais distintos: fechada, balanço à direita, balanço à esquerda, aberta, capturada e vazia. Os cenários são SVGs de 480 × 360.

## Publicar no GitHub

1. Extraia o ZIP da versão enxuta em uma pasta nova.
2. Envie todo o conteúdo extraído, incluindo a pasta `img`, ao lado de `index.html`.
3. Preserve os nomes das pastas e dos arquivos.
4. Se uma versão anterior com imagens extras já estiver no repositório, substitua a estrutura antiga pela nova; apenas adicionar arquivos não remove os antigos.

O ZIP deve ser extraído: enviar só o ZIP ao repositório não publica as imagens do site.

## Trilha e precisão dos conceitos

As oito missões cobrem: preparação dos atores; coordenadas; sequência de captura; equipe como vetor/lista; mapa 3 × 3 como matriz; procedimento com parâmetro; função simulada para calcular XP; projeto integrado.

No Scratch, a lista começa no índice 1. A matriz é representada em uma lista com `((linha - 1) * 3) + coluna`. Meus blocos cria procedimentos; o cálculo de função é simulado guardando a saída em uma variável.

O checklist é uma autoavaliação do aluno e fica neste navegador. Não analisa automaticamente os arquivos do Scratch. Os botões abrem o editor vazio para o aluno praticar.

## Créditos

As poses de Pokémon vieram do conjunto showdown de PokeAPI/sprites, atribuído à comunidade Smogon. Foi mantido apenas o primeiro quadro de frente e o primeiro de costas. Pokémon © The Pokémon Company. As Pokébolas didáticas e os cenários SVG foram desenhados para a aula.

Referências: [Variáveis e listas](https://www.scratchfoundation.org/learn/learning-library/variables-lists), [Meus blocos](https://www.scratchfoundation.org/learn/learning-library/my-blocks-custom-blocks) e [Criação de atores](https://www.scratchfoundation.org/learn/learning-library/sprite-creation).
