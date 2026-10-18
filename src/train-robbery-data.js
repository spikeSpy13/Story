// Supplementary dossier adapted from the material supplied for this film.
export const trainRobberyMeta = {
  title: 'The Great Train Robbery (O Grande Roubo de Trem)',
  director: 'Edwin S. Porter (Edison Manufacturing Company)',
  release: '1903 · citado como EUA/1904 em Story',
  duration: 'Cerca de 12 minutos; varia conforme a cópia e a projeção',
  budget: 'US$ 150 · estimativa citada no material enviado',
  structure: '14 quadros na decupagem do catálogo Edison'
};

export const trainRobberyPillars = [
  {
    num: '01',
    title: 'Causalidade',
    contrast: 'Opõe-se à Coincidência da Antitrama',
    analysis: 'O dossiê lê o núcleo narrativo como uma cadeia de causas e consequências: a coação do telegrafista (Cena 1) gera a parada na caixa d’água (Cena 2), que permite o assalto ao vagão-correio e o domínio da locomotiva (Cenas 3–4), o desengate e saque (Cenas 5–6), a fuga (Cenas 7–9) e a reação da posse (Cenas 10–13).'
  },
  {
    num: '02',
    title: 'Final Fechado (Closed Ending)',
    contrast: 'Opõe-se ao Final Aberto da Minitrama',
    analysis: 'A Cena 13 (The Battle to the Death) encerra a perseguição com a derrota dos assaltantes. Essa resolução sustenta a leitura de final fechado; o disparo da Cena 14 funciona como uma atração destacável do encadeamento narrativo.'
  },
  {
    num: '03',
    title: 'Progressão temporal e sobreposição',
    contrast: 'Opõe-se ao Tempo Não Linear / Fragmentado',
    analysis: 'O assalto, a fuga e a perseguição formam uma progressão reconhecível. A passagem das Cenas 9 a 10 retoma outro eixo de ação e admite uma leitura de sobreposição temporal. Essa nuance deve ser observada ao comparar o filme com o modelo clássico.'
  },
  {
    num: '04',
    title: 'Primazia do Conflito Externo',
    contrast: 'Opõe-se ao Conflito Interno da Minitrama',
    analysis: 'Sem diálogos falados nem intertítulos, toda a dramaturgia é cinética e física: duelos de pistola, explosão de cofre com dinamite, combate corpo a corpo com pá e carvão no trem em movimento, execução de passageiro em fuga e caçada a cavalo.'
  },
  {
    num: '05',
    title: 'Protagonismo Ativo (Coletivo e Bipolar)',
    contrast: 'Nuance Histórica no Modelo de McKee',
    analysis: 'Enquanto a arquitrama madura privilegia um protagonista único, o filme de 1903 opera com protagonismo coletivo e bipolar: das Cenas 1 a 9, o bando de quatro foras-da-lei conduz a ação ativa; das Cenas 10 a 13, o polo ativo transfere-se para o telegrafista e a patrulha.'
  },
  {
    num: '06',
    title: 'Realidade consistente',
    contrast: 'Coerência das regras do mundo ficcional',
    analysis: 'Locações, cenários e efeitos de composição servem ao mundo do assalto e da perseguição. Realidade consistente significa coerência interna: também uma fantasia pode obedecer a regras consistentes. O uso de truques, por si só, não constitui Antitrama.'
  }
];

export const trainRobberyScenes = [
  {
    num: 1,
    catalogTitle: 'Interior of Railroad Telegraph Office',
    phase: 'ato1',
    phaseLabel: 'Ato I · Incidente Incitante e Tomada do Trem',
    action: 'Dois bandidos mascarados rendem o telegrafista sob a mira de revólveres, forçam-no a acionar o sinal vermelho para parar o trem e a entregar uma ordem falsa ao condutor. Em seguida, golpeiam-no, amordaçam-no e amarram-no no chão.',
    archplotRole: 'Incidente Incitante: Rompe o equilíbrio inicial e instala a cadeia causal do crime.',
    technique: 'Plano geral fixo; composição por dupla exposição exibindo o trem real em movimento através da janela do estúdio.',
    imageSlot: 'Espaço reservado para Fotograma da Cena 01 (Escritório de Telégrafo)'
  },
  {
    num: 2,
    catalogTitle: 'At the Railroad Water Tank',
    phase: 'ato1',
    phaseLabel: 'Ato I · Incidente Incitante e Tomada do Trem',
    action: 'O trem para a fim de abastecer água devido à ordem falsa; quatro bandidos escondidos atrás do reservatório embarcam furtivamente entre o tender e o vagão expresso.',
    archplotRole: 'Progressão de Ação (Ato I): Efeito direto da coação estabelecida na Cena 1.',
    technique: 'Plano externo com o trem e o embarque dos assaltantes organizados dentro do quadro.',
    imageSlot: 'Espaço reservado para Fotograma da Cena 02 (Caixa d’Água)'
  },
  {
    num: 3,
    catalogTitle: 'Interior of Express Car',
    phase: 'ato1',
    phaseLabel: 'Ato I · Incidente Incitante e Tomada do Trem',
    action: 'Dois bandidos invadem o vagão-correio, matam o mensageiro em duelo de pistolas e, não achando a chave, explodem o cofre maciço com dinamite para roubar os valores.',
    archplotRole: 'Escalada do Conflito Externo: Superação do primeiro obstáculo físico e letal.',
    technique: 'Dupla exposição mostrando a paisagem em movimento pela porta lateral aberta; efeito pirotécnico denso de fumaça.',
    imageSlot: 'Espaço reservado para Fotograma da Cena 03 (Explosão no Vagão Expresso)'
  },
  {
    num: 4,
    catalogTitle: 'The Fight on the Tender',
    phase: 'ato1',
    phaseLabel: 'Ato I · Incidente Incitante e Tomada do Trem',
    action: 'Simultaneamente à Cena 3, um bandido luta com o foguista sobre o carvão, golpeia-o com uma pedra de carvão até desmaiá-lo e atira seu corpo para fora do trem com o trem em movimento, rendendo o maquinista.',
    archplotRole: 'Ação Simultânea e Domínio: Neutralização total da tripulação ferroviária.',
    technique: 'Câmera montada sobre o trem em movimento; corte de substituição imperceptível trocando o ator por um boneco (dummy) ao ser arremessado do trem.',
    imageSlot: 'Espaço reservado para Fotograma da Cena 04 (Luta no Tender de Carvão)'
  },
  {
    num: 5,
    catalogTitle: 'The Train Uncoupled',
    phase: 'ato2a',
    phaseLabel: 'Ato II (Eixo A) · O Saque e a Fuga',
    action: 'Sob a mira de armas, o maquinista é forçado a descer, desengatar a locomotiva dos vagões de passageiros e avançar cerca de 30 metros (100 pés).',
    archplotRole: 'Ponto de Virada Tático: Isolamento das vítimas para o saque principal.',
    technique: 'Plano geral lateral em locação externa real nos trilhos de Nova Jersey.',
    imageSlot: 'Espaço reservado para Fotograma da Cena 05 (Desengate da Locomotiva)'
  },
  {
    num: 6,
    catalogTitle: 'The Exterior of Passenger Coaches',
    phase: 'ato2a',
    phaseLabel: 'Ato II (Eixo A) · O Saque e a Fuga',
    action: 'Os passageiros são forçados a descer de mãos ao alto e são saqueados nos trilhos. Um passageiro (interpretado por G. M. "Broncho Billy" Anderson) tenta correr e é baleado pelas costas.',
    archplotRole: 'Ponto Médio / Clímax do Crime: Demonstração máxima da crueldade dos antagonistas.',
    technique: 'Encenação em profundidade diagonal ao longo dos vagões; coordenação dramática de múltiplos figurantes.',
    imageSlot: 'Espaço reservado para Fotograma da Cena 06 (Saque e Passageiro Baleado)'
  },
  {
    num: 7,
    catalogTitle: 'The Escape',
    phase: 'ato2a',
    phaseLabel: 'Ato II (Eixo A) · O Saque e a Fuga',
    action: 'Os bandidos embarcam na locomotiva com os sacos de valores e obrigam o maquinista a partir em alta velocidade para a esquerda do quadro.',
    archplotRole: 'Início da Fuga (Ato II): Conquista temporária do objeto de desejo pelos criminosos.',
    technique: 'Continuidade direcional de movimento entre planos consecutivos.',
    imageSlot: 'Espaço reservado para Fotograma da Cena 07 (Fuga na Locomotiva)'
  },
  {
    num: 8,
    catalogTitle: 'Off to the Mountains',
    phase: 'ato2a',
    phaseLabel: 'Ato II (Eixo A) · O Saque e a Fuga',
    action: 'A locomotiva para na mata; os assaltantes descem carregando o butim e correm em direção às montanhas.',
    archplotRole: 'Transição Espacial: Abandono do eixo ferroviário para o terreno selvagem.',
    technique: 'Filmagem em locação florestal; movimento em direção ao fundo do quadro.',
    imageSlot: 'Espaço reservado para Fotograma da Cena 08 (Rumo às Montanhas)'
  },
  {
    num: 9,
    catalogTitle: 'A Beautiful Scene in a Valley',
    phase: 'ato2a',
    phaseLabel: 'Ato II (Eixo A) · O Saque e a Fuga',
    action: 'Os bandidos atravessam um riacho em um vale íngreme e montam em seus cavalos ocultos na floresta.',
    archplotRole: 'Suspensão do Eixo A: Conclusão da rota de fuga imediata do bando antes do recuo temporal.',
    technique: 'Movimento de panorâmica (pan) e inclinação (tilt) acompanhando os bandidos até os cavalos.',
    imageSlot: 'Espaço reservado para Fotograma da Cena 09 (Travessia do Vale e Cavalos)'
  },
  {
    num: 10,
    catalogTitle: 'Interior of Telegraph Office',
    phase: 'ato2b',
    phaseLabel: 'Ato II (Eixo B) · Sobreposição Temporal e Mobilização',
    action: 'Retorno ao escritório: o telegrafista amarrado tenta se erguer, cai exausto, mas sua filha pequena chega, corta as cordas e o reanima jogando-lhe um copo d’água no rosto.',
    archplotRole: 'Virada de Eixo (Proto-Paralelismo / Overlapping Action): Retomada da vítima da Cena 1 para acionar a retaliação e transferir o protagonismo ativo para as forças da lei.',
    technique: 'Transição não-física inovadora: corte entre grupos distintos de personagens separados no espaço com recuo a um ponto anterior no tempo.',
    imageSlot: 'Espaço reservado para Fotograma da Cena 10 (Resgate do Telegrafista pela Filha)'
  },
  {
    num: 11,
    catalogTitle: 'Interior of a Dance Hall',
    phase: 'ato2b',
    phaseLabel: 'Ato II (Eixo B) · Sobreposição Temporal e Mobilização',
    action: 'Moradores dançam uma quadrilha e forçam um forasteiro (tenderfoot, G. M. Anderson) a sapatear atirando aos seus pés; o telegrafista entra cambaleando, dá o alarme e os homens pegam seus rifles.',
    archplotRole: 'Complicação e Mobilização: Conversão do alívio cômico em força de perseguição ativa (posse).',
    technique: 'Integração de uma "mini-atração" de vaudeville (a dança e os tiros) à cadeia causal da arquitrama.',
    imageSlot: 'Espaço reservado para Fotograma da Cena 11 (Salão de Baile e Alarme)'
  },
  {
    num: 12,
    catalogTitle: 'The Posse in Pursuit',
    phase: 'ato3',
    phaseLabel: 'Ato III · Perseguição e Clímax Fechado',
    action: 'Os bandidos fogem a cavalo pela mata perseguidos de perto pela patrulha armada do xerife, trocando tiros em pleno galope.',
    archplotRole: 'Escalada para o Clímax (Ato III): Convergência física dos dois eixos narrativos (Eixo A + Eixo B).',
    technique: 'Dinamismo de ação; perseguição equestre em direção à câmera (sintaxe do chase film).',
    imageSlot: 'Espaço reservado para Fotograma da Cena 12 (Perseguição Equestre)'
  },
  {
    num: 13,
    catalogTitle: 'The Battle to the Death',
    phase: 'ato3',
    phaseLabel: 'Ato III · Perseguição e Clímax Fechado',
    action: 'Os bandidos examinam o butim julgando-se salvos, mas são emboscados pela patrulha; todos os criminosos são mortos a tiros.',
    archplotRole: 'Clímax e Final Fechado: Resolução absoluta e irreversível, punição do crime e restauração da ordem.',
    technique: 'Encenação em camadas com fumaça de pólvora e quedas dramáticas no primeiro plano.',
    imageSlot: 'Espaço reservado para Fotograma da Cena 13 (Batalha até a Morte)'
  },
  {
    num: 14,
    catalogTitle: 'Realism',
    phase: 'epilogo',
    phaseLabel: 'Cena 14 · Atração Autônoma Extradiegética',
    action: 'Plano médio aproximado (medium close-up) do líder dos bandidos (Justus D. Barnes) contra fundo neutro, encarando a lente e disparando seu revólver diretamente contra a plateia.',
    archplotRole: 'Epílogo / Prólogo Emblema: Quebra da quarta parede e agressão sensorial direta ao espectador (fora da cadeia causal já encerrada na Cena 13).',
    technique: 'Plano frontal emblemático; apresentado no catálogo da Edison como quadro intercambiável (podendo abrir ou fechar a projeção).',
    imageSlot: 'Espaço reservado para Fotograma da Cena 14 (Justus D. Barnes Disparando contra a Lente)'
  }
];

export const trainRobberyLegacy = [
  {
    year: '1903–1908',
    work: 'Revolução dos Nickelodeons',
    creator: 'Indústria Exibidora dos EUA',
    axis: 'Infraestrutura Industrial',
    impact: 'O filme pertence ao contexto de expansão dos filmes narrativos e da exibição comercial que antecede e acompanha os nickelodeons. Seu lugar nesse processo é um contexto industrial, não uma causa única da expansão das salas.'
  },
  {
    year: '1911',
    work: 'The Lonedale Operator',
    creator: 'D. W. Griffith',
    axis: 'Evolução da Montagem Paralela',
    impact: 'Retoma o motivo do assalto ligado à ferrovia e ao pedido de socorro. O dossiê compara a alternância mais rápida de Griffith ao modo como Porter articula fuga e resgate.'
  },
  {
    year: '1924',
    work: 'The Iron Horse (O Cavalo de Ferro)',
    creator: 'John Ford',
    axis: 'Codificação do Western',
    impact: 'Incorpora a iconografia ferroviária do Oeste, o embate entre cavalos e locomotivas a vapor e a encenação de ataques a trens em movimento com câmera embarcada.'
  },
  {
    year: '1962+',
    work: 'Franquia 007 (Sequência Gunbarrel)',
    creator: 'Maurice Binder / Terence Young',
    axis: 'Comparação iconográfica com a Cena 14',
    impact: 'O agente que dispara na direção da câmera permite uma comparação visual com a Cena 14. A semelhança de motivo não demonstra, por si só, uma influência direta na criação da sequência de abertura.'
  },
  {
    year: '1969',
    work: 'The Wild Bunch (Meu Ódio Será Sua Herança)',
    creator: 'Sam Peckinpah',
    axis: 'Reelaboração do western e do assalto ferroviário',
    impact: 'O bando ficcional de Peckinpah reelabora o assalto ferroviário, a violência coletiva e o massacre no western. O parentesco de motivos permite comparação; esse grupo de personagens não é a gangue histórica de Butch Cassidy.'
  },
  {
    year: '1990',
    work: 'Goodfellas (Os Bons Companheiros)',
    creator: 'Martin Scorsese',
    axis: 'Citação visual e comparação estrutural',
    impact: 'O disparo de Tommy DeVito (Joe Pesci) em direção à câmera, perto do final, retoma o motivo emblemático de Porter. O dossiê também propõe comparar crime, ganho e queda nos dois filmes; a comparação não torna idênticas suas estruturas.'
  },
  {
    year: '1993 / 2007',
    work: 'Tombstone & American Gangster',
    creator: 'G. P. Cosmatos / Ridley Scott',
    axis: 'Iconografia de Ação e Crime',
    impact: 'Associações visuais e temáticas propostas pelo material enviado: o gesto de disparar, a violência do crime e a perseguição. São aproximações para análise, sem atribuir automaticamente uma citação direta aos realizadores.'
  },
  {
    year: '2012',
    work: 'Breaking Bad — Ep. "Dead Freight" (T5E05)',
    creator: 'Vince Gilligan / George Mastras',
    axis: 'Transposição Tática Contemporânea',
    impact: 'O dossiê aproxima o episódio das Cenas 1 a 6 de Porter pelo motivo do assalto ferroviário: parada forçada do trem em zona rural isolada, extração cronometrada da carga sem alertar o maquinista e o assassinato repentino de uma testemunha inocente ao final da operação.'
  }
];
