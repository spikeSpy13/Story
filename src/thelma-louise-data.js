export const thelmaLouiseSource = '/content/dossiers/thelma-e-louise.pdf';

// Sínteses do PDF enviado. As divisões dramáticas são a leitura desse material.
export const milestones = [
  { num: 1, act: 'I', title: 'Exposição e partida', pages: [10, 11],
    action: 'Thelma deixa a rotina doméstica e parte com Louise para um fim de semana. A arma levada na bagagem e a fotografia da dupla estabelecem motivos que retornarão.',
    value: 'Submissão cotidiana → liberdade provisória.',
    function: 'Apresenta a relação, os desejos e os preparativos. O passeio cria uma expectativa de descanso que o incidente seguinte romperá.' },
  { num: 2, act: 'I', title: 'Incidente incitante e ruptura', pages: [4, 10],
    action: 'Harlan agride Thelma. Louise intervém com a arma e, depois de afastar a ameaça imediata, atira nele. As duas fogem e precisam decidir como enfrentar as consequências.',
    value: 'Liberdade provisória → perigo e fuga.',
    function: 'A análise reúne o incidente incitante e o clímax do primeiro ato neste bloco: o passeio se transforma em uma trajetória sem retorno simples.' },
  { num: 3, act: 'II', title: 'Complicações e perda dos recursos', pages: [6, 10, 11],
    action: 'Louise evita atravessar o Texas e tenta viabilizar a fuga com suas economias. Jimmy oferece compromisso, mas chega tarde para o projeto de vida anterior. J.D. seduz Thelma e rouba o dinheiro.',
    value: 'Esperança de escapar → ruína financeira.',
    function: 'O percurso, o passado de Louise e a perda dos recursos restringem as opções. O encontro com J.D. também prepara uma habilidade que Thelma utilizará depois.' },
  { num: 4, act: 'II', title: 'Ponto médio: a inversão de liderança', pages: [4, 5, 10, 11],
    action: 'Thelma assalta uma loja usando a técnica demonstrada por J.D. Quando Louise perde a capacidade de agir, Thelma assume a iniciativa e consegue dinheiro.',
    value: 'Paralisia e dependência → ação e autonomia, com maior exposição ao risco.',
    function: 'A inversão de papéis desenvolve o protagonismo plural: muda quem conduz, mas permanecem o desejo compartilhado e as consequências para ambas.' },
  { num: 5, act: 'II', title: 'Escalada e recusa do retorno', pages: [9, 10, 11],
    action: 'Uma abordagem na estrada ameaça encerrar a fuga. Thelma domina o policial, prende-o no porta-malas e inutiliza o rádio. O contato com Hal explicita a perseguição e o peso do passado de Louise.',
    value: 'Possibilidade de recuo → recusa de voltar à vida anterior.',
    function: 'O PDF agrupa essas passagens como o clímax do segundo ato. A saída tática aumenta os riscos e torna explícita uma transformação que não é apenas geográfica.' },
  { num: 6, act: 'III', title: 'Confronto e ascensão simbólica', pages: [11, 12],
    action: 'No reencontro com o caminhoneiro que as assedia, as duas exigem que ele reconheça sua conduta. Diante da recusa, atiram no caminhão-tanque e provocam a explosão.',
    value: 'Indignação acumulada → confronto aberto.',
    function: 'A repetição do caminhoneiro recebe um desfecho. Na leitura do PDF, o deserto e a explosão ampliam a escala simbólica da transformação da dupla.' },
  { num: 7, act: 'III', title: 'Crise e clímax no desfiladeiro', pages: [8, 11, 12, 13],
    action: 'Cercadas, Thelma e Louise encaram a rendição e o salto. Depois da pausa, do beijo e das mãos unidas, aceleram. A versão lançada congela a imagem do carro antes de mostrar a queda.',
    value: 'Captura ou morte física; na leitura simbólica, preservação da autonomia conquistada.',
    function: 'A escolha encerra a fuga de modo irreversível. O congelamento suspende a imagem, enquanto a decisão e sua consequência física sustentam a leitura de final fechado.' },
];

export const pillars = [
  { title: 'Protagonismo plural', pages: [4, 5], text: 'Thelma e Louise partilham o desejo de escapar e sofrem juntas as consequências das escolhas. A liderança muda sem separar a trajetória central em duas estórias independentes.' },
  { title: 'Protagonistas ativas', pages: [5], text: 'Sob pressão, as duas escolhem rotas, assumem riscos e provocam os acontecimentos. As decisões revelam caráter e alteram as possibilidades seguintes.' },
  { title: 'Conflito externo como motor', pages: [5, 6], text: 'A perseguição organiza a ação visível. Os conflitos íntimos e pessoais dão densidade a ela: o trauma de Louise, a insegurança de Thelma e seus vínculos afetivos. Hal é um interlocutor empático dentro de uma estrutura que continua perseguindo a dupla.' },
  { title: 'Causalidade', pages: [6, 7], text: 'A arma preparada torna possível a intervenção; o disparo provoca a fuga; o roubo das economias exige novos meios; a técnica de J.D. prepara o assalto de Thelma. Cada solução pode gerar o problema seguinte.' },
  { title: 'Tempo linear', pages: [7], text: 'A fuga se desenvolve em sequência cronológica. O passado no Texas pesa nas decisões presentes de Louise e emerge nos diálogos, sem precisar ser encenado como um retorno visual ao passado.' },
  { title: 'Realidade consistente', pages: [7, 8], text: 'A perseguição e os riscos seguem a lógica social e institucional estabelecida pelo filme. A desconfiança das personagens em serem acreditadas fundamenta suas escolhas; coerência ficcional não exige que cada decisão seja a única resposta possível fora da obra.' },
  { title: 'Final fechado', pages: [8, 9], text: 'A opção pelo salto resolve o dilema e encerra a fuga. Não mostrar o impacto mantém a imagem suspensa, mas não reabre a decisão tomada. O PDF contrapõe a derrota física à liberdade simbólica para ler a ironia do desfecho.' },
];

export const partnership = [
  { title: 'Partida', pages: [4, 5], thelma: 'Inexperiente, submissa na relação doméstica e dependente da iniciativa da amiga.', louise: 'Organizada e protetora, assume a condução prática e reage à agressão contra Thelma.', meaning: 'A assimetria inicial estabelece a mentoria, sem eliminar o desejo compartilhado.' },
  { title: 'Ponto médio', pages: [4, 5, 11], thelma: 'Transforma a técnica aprendida com J.D. em ação e assalta a loja para obter recursos.', louise: 'Abalada pela perda das economias, precisa receber o apoio que antes oferecia.', meaning: 'A liderança se inverte. A parceria se sustenta porque as consequências continuam comuns.' },
  { title: 'Desfecho', pages: [8, 12, 13], thelma: 'Propõe continuar e participa conscientemente da decisão final.', louise: 'Confirma a escolha com Thelma e conduz o carro; as mãos unidas exprimem o pacto.', meaning: 'A dupla chega à decisão em condição de reciprocidade: duas personagens formam um mesmo centro dramático.' },
];

export const gaps = [
  { title: 'O passeio', pages: [9], expectation: 'Um fim de semana longe da rotina oferece descanso e diversão.', result: 'A agressão de Harlan e o disparo de Louise destroem o plano inicial.', risk: 'A fuga substitui o passeio; a dupla passa a agir sob risco de prisão.' },
  { title: 'As economias', pages: [9], expectation: 'O dinheiro permite uma saída relativamente discreta e planejada.', result: 'J.D. rouba as economias de Louise.', risk: 'Sem recursos, precisam de uma nova estratégia; Thelma assume um risco maior para obter dinheiro.' },
  { title: 'O assalto', pages: [9], expectation: 'O roubo resolve a falta imediata de recursos.', result: 'A obtenção do dinheiro também aumenta a gravidade dos crimes e a resposta policial.', risk: 'A solução financeira intensifica a perseguição institucional.' },
  { title: 'A abordagem', pages: [9, 10], expectation: 'Uma parada de trânsito parece uma ocorrência que pode ser administrada.', result: 'O reconhecimento e a ameaça de captura levam Thelma a dominar e confinar o policial.', risk: 'A liberdade momentânea depende de uma nova transgressão que agrava a perseguição.' },
];

export const endings = [
  { title: 'Sacrifício de Louise', status: 'Ideia discutida', pages: [8, 9], text: 'O PDF relata a possibilidade de Louise empurrar Thelma para fora do carro e seguir sozinha para o desfiladeiro. Essa hipótese separaria os destinos e enfraqueceria a decisão compartilhada. Não é o final lançado nem deve ser confundida com a versão alternativa filmada.' },
  { title: 'Queda e reação policial', status: 'Versão alternativa filmada', pages: [8, 9], text: 'Na descrição do material, a montagem estendida acompanha a queda e a reação dos policiais, com música de B.B. King e retomada do motivo da estrada. O prolongamento desloca a ênfase para a perda e para quem observa o desfecho.' },
  { title: 'Imagem congelada', status: 'Versão lançada', pages: [8, 9, 13], text: 'O filme congela o carro no ar e dissolve para o branco sob a partitura de Hans Zimmer. As lembranças da dupla ficam para os créditos. O impacto fica fora de quadro: a leitura simbólica de autonomia convive com a consequência física fatal da escolha.' },
];

export const finalStages = [
  { title: 'Crise', text: 'O cerco põe as personagens diante de duas perdas: render-se e perder a liberdade conquistada ou seguir adiante e perder a vida. O PDF lê o momento como um dilema entre males.', pages: [12, 13] },
  { title: 'Pausa', text: 'Após a velocidade da perseguição, o diálogo, o beijo e as mãos unidas abrem um intervalo de deliberação. A pausa permite que a plateia acompanhe a escolha antes da ação definitiva.', pages: [12, 13] },
  { title: 'Clímax', text: 'A aceleração transforma a decisão em ação irreversível. O desfecho reúne a crise e sua resposta no mesmo espaço dramático; o congelamento determina como o gesto será visto.', pages: [12, 13] },
];

export const legacy = [
  { year: '1903', title: 'O Grande Roubo de Trem', relation: 'Antecedente formal', text: 'A análise aproxima a perseguição, o deslocamento e a ação coletiva de tradições do cinema narrativo. A obra de Porter é um antecedente do repertório de ação; Story a cita como EUA/1904.', pages: [13, 14] },
  { year: '1969', title: 'Butch Cassidy e Sundance Kid', relation: 'Western e dupla de fugitivos', text: 'A amizade, a perseguição e a imagem final suspensa oferecem pontos de comparação. Thelma e Louise desloca para duas mulheres convenções de companheirismo e fuga associadas ao western.', pages: [13, 14] },
  { year: '1990', title: 'Os Bons Companheiros', relation: 'Comparação com o design clássico', text: 'O PDF situa a força causal e a progressão de consequências entre exemplos do repertório clássico. A aproximação é estrutural e não implica identidade de tema, narrador ou desfecho.', pages: [13, 14] },
  { year: '1991', title: 'Thelma e Louise', relation: 'Convergência de gêneros', text: 'O roteiro de Callie Khouri, dirigido por Ridley Scott, combina road movie, western e buddy movie. A forma clássica conduz uma transformação de protagonismo e perspectiva política.', pages: [1, 13, 14] },
  { year: '1994', title: 'Quatro Mulheres e um Destino', relation: 'Bad Girls · Jonathan Kaplan', text: 'O material aproxima o western de mulheres fugitivas do repertório reconfigurado por Thelma e Louise. É uma relação de temas e convenções discutida na análise.', pages: [14] },
  { year: '1996', title: 'Até as Últimas Consequências', relation: 'Set It Off · F. Gary Gray', text: 'Quatro mulheres compartilham riscos, desejo de escapar e consequências de assaltos. A comparação amplia o estudo do protagonismo coletivo e de suas pressões sociais.', pages: [14] },
  { year: '2015', title: 'Mad Max: Estrada da Fúria', relation: 'George Miller', text: 'O deserto, a perseguição e a aliança de mulheres em fuga permitem contrastar a disputa pela autonomia em outra escala de espetáculo e em outro universo ficcional.', pages: [14, 15] },
  { year: '2019', title: 'Queen & Slim', relation: 'Melina Matsoukas', text: 'A dupla perseguida após um encontro fatal com um policial retoma motivos de estrada, afeto e fuga sob violência institucional. O contexto racial dá à comparação uma dimensão própria.', pages: [15] },
];
