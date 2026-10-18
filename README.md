# Story

Versão web do livro na interface “Mapa de Story” fornecida pelo usuário.
O capítulo 1 está disponível integralmente; os capítulos 2–19 aguardam os arquivos.

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

`npm run content` gera `src/content/chapter-01.json` a partir de:

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
