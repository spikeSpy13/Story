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
A navegação entre capítulos, seções e conceitos fica no índice lateral,
acessível pelo botão “Índice” no celular. No rodapé das páginas de leitura,
anterior/próximo permitem percorrer as seções ou subseções do mesmo grupo.
O trecho separado do Triângulo conecta 2.2, 2.2.1 e 2.3 nos dois sentidos.
As páginas não repetem listas de seções nem breadcrumbs. Links do PDF e
das notas continuam disponíveis. A página inicial mantém o catálogo de capítulos.
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

A página 2.2, “O Triângulo da Estória”, contém somente seus sete parágrafos
de abertura e o laboratório “Trama: escolhas no tempo”, após o último parágrafo.
As três experiências comparam prosa interior, exposição e comportamento visível;
exploram inclusão, omissão e ordem num esquema de montagem; e distinguem o
equívoco crítico da definição de trama como seleção e composição no tempo.
As falas, encenações e alterações de montagem são exemplos didáticos identificados,
inspirados no arco de Mac Sledge. Os diagnósticos propõem efeitos possíveis,
sem pontuações numéricas de qualidade. O laboratório carrega sob demanda,
acompanha tema e fonte e fica oculto no filtro de destaques.
A subseção 2.2.1, “Arquitrama, Minitrama, Antitrama”, mantém seus nove parágrafos,
o diagrama interativo e a imagem original. As notas continuam nas seções
correspondentes da fonte. O índice lateral e o rodapé
permitem navegar pelas duas páginas sem repetir o conteúdo da introdução.

Na figura 01 da seção 2.2.1, “Explorar vértices” apresenta uma versão vetorial
interativa do triângulo. Os vértices respondem a clique, teclado e mouse;
os princípios abrem comparações entre os três modelos, com definições retiradas
do capítulo e referências às seções correspondentes. Características ausentes
de um vértice do diagrama são indicadas como não especificadas.
“Exemplos no cinema” reúne todos os 64 filmes da seção, filtrados pelo vértice,
preservando títulos, países e anos da fonte. O leitor pode alternar para
“Diagrama original” e ampliar o JPEG preservado. O componente acompanha o tema
e o tamanho de fonte; em áreas estreitas, os controles ficam em blocos legíveis.
Os parágrafos originais, incluindo as listas de filmes, permanecem integrais.

“O GRANDE ROUBO DE TREM (EUA/1904)” abre um dossiê tanto pelo primeiro item
do catálogo de Arquitrama quanto pela citação no parágrafo 67. O botão no texto
conserva exatamente a redação da fonte, inclusive o ano; o dossiê distingue
essa citação da data histórica de 1903. O conteúdo complementar, adaptado do
material enviado, carrega somente ao abrir a janela e tem quatro abas:
decupagem das 14 cenas, seis eixos de leitura da Arquitrama, atrações e narrativa,
e legado. As cenas têm molduras reservadas para os fotogramas futuros; os
filtros limitam também anterior/próximo às cenas do bloco selecionado.
As abas respondem às setas, Home e End, e preservam a cena e o período do
legado selecionados. Atalhos da análise levam às cenas correspondentes.
A janela usa diálogo nativo em portal, acompanha tema e fonte, contém o foco,
bloqueia a rolagem do fundo e fecha por botão, Esc ou clique fora. Ao fechar,
restaura o foco ao botão de origem e a posição da leitura. O botão na citação
continua disponível no filtro de destaques.

Na seção 2.1.1, a definição de estrutura aparece em destaque. Após o último
parágrafo, o “Laboratório de estrutura” reúne três experimentos: seleção e
ordenação de momentos, camadas do evento e estratégia dupla. O leitor pode
incluir e excluir os quatro momentos, reordená-los pelos botões “Antes”/“Depois”,
inverter a descoberta da carta e o brinde e restaurar a sequência inicial.
As leituras de emoção e ponto de vista são possibilidades didáticas, e não
trechos atribuídos ao livro. As abas aceitam setas, Home e End e preservam as
escolhas enquanto o leitor troca de experimento. O laboratório acompanha tema
e fonte, empilha seus painéis em espaços estreitos e fica oculto no filtro de
destaques. A transcrição dos quatro parágrafos continua intacta.

Após o exemplo de “Lágrimas do Céu” na seção 2.1.2, o laboratório de anatomia
do evento permite comparar os quatro estágios da chuva, inverter os 12 pares
de valores citados no trecho e selecionar as quatro camadas de conflito do
fazedor de chuvas. As três definições da seção aparecem em destaque. Os
medidores contam critérios presentes e camadas selecionadas, sem inventar
uma nota de significância dramática. A matriz atualiza o diagnóstico do quarto
estágio: uma seleção parcial mantém conflito; sem camadas selecionadas, o
exercício isola a chuva como coincidência. As quatro camadas recompõem o
exemplo completo, sem serem apresentadas como exigência universal. Os cenários
resumidos ficam identificados como exercício; os nove parágrafos do livro
permanecem integrais. O laboratório acompanha tema, fonte e filtro de destaques.

Na seção 2.1.3, a definição de cena aparece em destaque. Depois do exemplo de
Chris e Andy, o laboratório de cena compara as cargas inicial e final em três
eixos de valor, acompanha os quatro lugares da manhã do casal e permite testar
a hipótese de encenar o mesmo evento em um só quarto. O diagnóstico identifica
o que as anotações indicam e pede conferir a significância e o conflito; uma
mudança de botão não aprova automaticamente uma cena. O comparativo por mídia
preserva as referências do trecho: o dramaturgo raramente chega a quarenta,
um filme típico tem quarenta a sessenta eventos, e o romancista pode querer
mais de sessenta. Os onze parágrafos, incluindo a citação de Chris e Andy,
permanecem integrais. O laboratório acompanha os controles de leitura.

Ao final de “Beat” (2.1.4), o laboratório completo “Beat → Cena → Sequência”
reúne os seis beats de Chris e Andy, as três cenas de Barbara e o comparador
entre entrevista e sequência. A distinção entre beat estrutural e `[beat]`
como pausa no diálogo permanece disponível no primeiro experimento.

Ao final de “Sequência” (2.1.5), um laboratório próprio reúne três experiências:
o painel de quatro valores de Barbara, o propósito da sequência intitulada
“Conseguir o trabalho” e a progressão qualitativa de magnitude entre cena,
sequência e ato. O painel distingue a sobrevivência da perda de autoconfiança
na passagem ao lobby. Na segunda cena, um mapa esquemático compara contornar
o parque com a travessia noturna narrada; explorar a alternativa não muda
o painel da narrativa. O novo trabalho é conquistado apenas no clímax.
O exercício de magnitude permanece inteiro em 2.1.5.
Os dois laboratórios carregam sob demanda, acompanham tema
e tamanho de texto, preservam a posição das notas acessadas diretamente e
ficam ocultos no filtro de destaques. Parágrafos e notas continuam integrais.

A página 2.1 apresenta somente seus seis parágrafos e o laboratório
“Da estória de vida à estória contada”. As sete subseções são páginas próprias,
acessadas pelo índice lateral. Links antigos de notas ou chamadas da antiga
leitura combinada de 2.1 continuam abrindo o conceito correspondente.
Os anéis do laboratório
de conflito permitem alternar, isolar e combinar as quatro camadas descritas
no trecho, com controles equivalentes no diagrama e nos botões. A linha do
tempo de Mac Sledge alterna o relato do amigo e o recorte de Horton Foote,
distinguindo o passado por implicação, o ano dramatizado e o futuro sugerido
pela imagem final. Os pontos de entrada na infância e no estrelato são
hipóteses de estudo; a manhã no motel é a abertura descrita no capítulo.
As referências temporais e os detalhes do exemplo seguem esse trecho do PDF.
O componente é carregado sob demanda. As subseções continuam com seus próprios exercícios.

A página 2.1.6, “Ato”, mantém os dois parágrafos originais e destaca a definição.
Somente essa página recebe o laboratório “Sequências rumo à grande reversão”,
com três experiências: grau de mudança e direção da virada; uma cadeia de
sequências até a cena climática; seleção e combinação dos três domínios de impacto.
Os exemplos do capítulo são distinguidos das hipóteses de exercício, incluindo
a continuação corporativa inventada de Barbara. A magnitude é qualitativa;
o número de esferas selecionadas não funciona como pontuação de qualidade.
O clímax de ato pode ser revertido, conforme a distinção do livro em relação
ao clímax final da estória. O componente carrega sob demanda e acompanha as
preferências de leitura e o filtro de destaques.

A página 2.1.7, “Estória”, mantém os cinco parágrafos e recebe, após o exemplo
final da executiva, o laboratório “O evento chefe e o clímax da estória”.
O teste de reversibilidade distingue cena, sequência, ato intermediário e
clímax final: a tentativa muda o resultado do painel, e o último nível bloqueia
a reversão conforme o princípio do trecho. A escolha de nível reinicia o teste.
O arco da executiva apresenta a abertura e os três atos da hipótese de McKee,
compara as condições morais inicial e final e separa carreira de caráter e
relações. O inspetor de cinco elos vai da frase à série de atos, alternando
a função de cada elemento e uma possível falha de construção. O componente
é exclusivo de 2.1.7, carrega sob demanda e acompanha tema, fonte e destaques.

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
