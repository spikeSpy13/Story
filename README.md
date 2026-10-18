# Story

Versão web do livro na interface “Mapa de Story” fornecida pelo usuário.
Os capítulos 1 e 2 estão disponíveis integralmente; os capítulos 3–19 aguardam os arquivos.

## Desenvolvimento

Instale Git e Node.js 24. Python 3 também é necessário para compilar o projeto,
regenerar o conteúdo e executar os testes de fidelidade.

```sh
git clone https://github.com/spikeSpy13/Story.git
cd Story
npm ci
npm run dev
```

No ambiente na nuvem, use o checkout existente em `/workspace/Story` e instale
as dependências com `npm ci --cache /workspace/.cache/npm`.

`npm run build` gera o conteúdo e o site em `dist/`. `npm run preview` serve a versão compilada.
React e fontes são instalados localmente; a leitura não depende de CDNs, APIs ou credenciais.

## Conteúdo e fidelidade

As fontes do capítulo estão em `content/sources/chapter-01/`. O PDF é uma cópia
inalterada do documento enviado, com 18 páginas. `pages_raw.jsonl.gz` contém o
arquivo de extração original, comprimido sem mudanças no conteúdo.

`npm run content` gera os arquivos `src/content/chapter-XX.json` a partir de cada
pasta em `content/sources/chapter-XX/`. Para o capítulo 1, são usados:

- `paragraphs.jsonl`: os 72 parágrafos em ordem, usando `text_clean`;
- `structure.json`: seis seções e uma subseção com seus vínculos hierárquicos;
- `elements.jsonl`: quatro citações, seis notas e suas chamadas;
- `pages_raw.jsonl.gz`: itálicos e demais estilos tipográficos da fonte, conectados
  ao texto pelos mapas de normalização.

O texto usa as normalizações de quebras de linha do corpus recebido. A correção
editorial de “pré-requisi-tos” para “pré-requisitos” foi revertida na exibição:
a página 16 do PDF imprime “pré-” no fim da linha e “requisi-tos” na seguinte.
Essa diferença está registrada em `sourceOverrides` no JSON gerado. Não há
resumos nem reescrita. A sequência e a hierarquia do
capítulo prevalecem sobre o mapa temático do HTML de referência. A abertura do
capítulo apresenta o resumo fornecido pelo usuário em `src/content/chapter-01-overview.json`.
O cabeçalho editorial reúne título e introdução à esquerda e a imagem à direita
quando há espaço ao lado do índice. Em telas menores, os blocos são empilhados.
O recorte da imagem é feito por CSS, com foco nos quadros iluminados à direita;
o PNG original permanece intacto em `public/images/do-fragmento-a-narrativa.png`.
Newsreader é usada na leitura e Plus Jakarta Sans na interface, com fontes locais.
O restante do resumo aparece em coluna única, com capitular e citação de destaque.
O texto do livro fica nas páginas das seções, sem ser repetido na abertura.
Na abertura, a navegação para as seções fica apenas no índice lateral, acessível
pelo botão “Índice” no celular.
Notas permitem ir e voltar ao trecho correspondente.
O PDF permanece acessível durante a leitura para conferência.

O capítulo 2, “O espectro da estrutura”, usa o mesmo leitor, com 141 parágrafos,
quatro seções e 19 subseções do PDF de 35 páginas. As fontes estão em
`content/sources/chapter-02/`, e o pacote completo permanece em
`content/archives/capitulo-02.zip`, incluindo os recursos de busca para uso futuro.
Os três diagramas são os JPEGs originais extraídos do PDF, sem redesenho ou
recorte dos arquivos, em `public/images/chapter-02/`. Seus vínculos com os parágrafos,
páginas de origem e hashes estão em `src/content/chapter-02-illustrations.json`.
Há cinco chamadas de nota numeradas e uma nota independente com asterisco,
mantida no fim da última seção sem chamada ou link de retorno inventados.
A abertura apresenta o título, os dados de leitura, o PDF e o resumo fornecido
pelo usuário em `src/content/chapter-02-overview.json`, com seus itálicos.
O texto integral fica nas seções do índice.

Na figura 01 da seção 2.2.1, “Explorar vértices” apresenta uma versão vetorial
interativa do triângulo. Os vértices respondem a clique, teclado e mouse;
os princípios abrem comparações entre os três modelos, com definições retiradas
do capítulo e links para as seções correspondentes. Características ausentes
de um vértice do diagrama são indicadas como não especificadas.
“Exemplos no cinema” reúne todos os 64 filmes da seção, filtrados pelo vértice,
preservando títulos, países e anos da fonte. O leitor pode alternar para
“Diagrama original” e ampliar o JPEG preservado. O componente acompanha o tema
e o tamanho de fonte; em áreas estreitas, os controles ficam em blocos legíveis.
Os parágrafos originais, incluindo as listas de filmes, permanecem integrais.

Em “O Declínio da Estória”, a imagem 01 abre a seção ao lado do título em telas
largas. As imagens 02, 03, 05, 06 e 07 permanecem antes dos parágrafos 2, 3, 9, 11
e 13. As imagens 02, 03 e 06 flutuam ao lado do texto quando há largura suficiente;
04, 05 e 07 usam quadros panorâmicos de 21:9. Todas têm legendas numeradas.
A imagem 04 aparece logo depois do parágrafo 6, que termina com “é nossa melhor
tentativa para descobrir algum sentido na anarquia da existência”.
O vínculo com os IDs dos parágrafos está em `src/content/chapter-01-illustrations.json`.
Os PNGs são preservados integralmente em `public/images/declinio/`; os recortes
são feitos apenas na apresentação por CSS. A leitura usa uma coluna de até
660px, capitular e cartão de notas. Nas margens de telas largas, “PDF” indica as
páginas do PDF do capítulo, e não a paginação impressa do livro. O texto com as marcações
está guardado em `content/references/declinio/posicionamento.txt`.

## Leitura e estudo

- As chamadas de nota abrem o texto junto ao parágrafo, sem mudar a posição de
  leitura. O link no cartão permite consultar a nota no rodapé; os links diretos
  com `?nota=` e o retorno ao parágrafo continuam disponíveis.
- Os botões nas ilustrações abrem a imagem original em um ampliador. Use as setas
  do teclado ou os botões para navegar, e Escape, “Fechar” ou o fundo para sair.
  O foco e a posição da leitura são restaurados ao fechar.
- A estrela ao lado do parágrafo, ou um duplo clique no texto, alterna o destaque.
  O filtro “Destaques” mostra somente os parágrafos destacados daquela seção.
- Os controles “Modo Papel”/“Modo Cinema” e A−/A+ alteram o tema e o tamanho da
  fonte (16–26px). Uma barra superior acompanha o progresso da seção.

Destaques, tema e fonte são salvos em `localStorage` neste navegador e endereço,
sem envio ao servidor. Se o armazenamento estiver indisponível, os controles
continuam funcionando e a interface informa que as preferências são temporárias.

`src/outline.js` preserva o mapa fornecido para os capítulos ainda não enviados;
somente seus títulos são exibidos enquanto aguardam conteúdo. O pacote original
com os arquivos de busca, decisões e históricos está preservado em
`content/archives/capitulo-01.zip` para uso futuro. A interface original está em
`content/references/mapa-de-story.html`. Esses arquivos não são publicados no site.

## Verificação

```sh
npm test
npm run build
npm run test:browser
```

O teste de navegador usa `/usr/bin/chromium` quando disponível no ambiente.
Em outras máquinas, instale-o com `npx playwright install chromium`.

Os testes de conteúdo comparam os parágrafos, títulos, hierarquia, citações,
notas, posições das chamadas e a identidade do PDF com as fontes recebidas.
Os testes de navegador verificam o texto renderizado, navegação, histórico,
links das notas e índice em celular, em duas dimensões de tela.
