import React, { useId, useLayoutEffect, useState } from 'react';
import './plot-design-lab.css';

const h = React.createElement;
const phases = [
  { id: 'despair', title: 'Desalento', inner: 'Sledge não acredita na família, no trabalho, no mundo ou no futuro. O álcool acompanha seu abandono da vida.',
    prose: 'Mac pensava que nada à sua volta ainda valia o esforço de levantar da cama. Cada gole adiava o encontro com o dia.',
    exposition: 'MAC (V.O.): “Bebo porque não acredito mais em nada. Perdi o sentido da minha vida.”',
    cinema: 'Ele procura trocados sobre a mesa e encontra apenas uma garrafa vazia. Fica sentado por um instante. Do lado de fora, alguém começa o trabalho do dia.' },
  { id: 'threads', title: 'Fios de uma vida', inner: 'Delicados fios de amor, música e espiritualidade permitem construir uma vida simples e significativa.',
    prose: 'O cuidado cotidiano e a música devolviam, pouco a pouco, uma sensação de pertencimento que Mac julgava perdida.',
    exposition: 'MAC: “O amor, a música e a fé estão me transformando. Finalmente sinto que pertenço a algum lugar.”',
    cinema: 'Mac interrompe o trabalho para ouvir o menino. Mais tarde, pega o instrumento e ensaia uma canção com outras pessoas, sem buscar os aplausos de um grande palco.' },
  { id: 'trial', title: 'Provação · hipótese', inner: 'Hipótese de exercício: uma perda coloca à prova os vínculos que o personagem vinha construindo.',
    prose: 'A notícia da perda quase o lançou de volta ao isolamento. Desta vez, porém, Mac percebeu que não estava inteiramente só.',
    exposition: 'MAC: “Estou sofrendo, mas meus novos vínculos me dão forças para continuar sem fugir da realidade.”',
    cinema: 'Depois de receber uma notícia difícil, Mac se afasta do grupo. Para à porta, escuta uma voz conhecida e volta para ajudar a terminar uma tarefa.' },
  { id: 'change', title: 'Vida digna de viver', inner: 'A transformação silenciosa modifica profundamente sua atitude perante a vida e perante si próprio.',
    prose: 'A paz já não dependia de voltar a ser famoso. Para Mac, estar presente naquela vida simples começava a bastar.',
    exposition: 'LETREIRO: “Mac encontrou o sentido da vida e se transformou para sempre.”',
    cinema: 'No espaço aberto diante do motel, ele aceita a brincadeira do menino. Lança a bola, espera a devolução e permanece ali, atento ao encontro.' },
];

const moments = {
  opening: { id: 'opening', text: 'Fundo do poço: o abandono da vida.' },
  work: { id: 'work', text: 'Trabalho cotidiano e construção de vínculos.' },
  threads: { id: 'threads', text: 'Fios de amor, música e espiritualidade.' },
  trial: { id: 'trial', text: 'Uma perda testa os vínculos · hipótese do exercício.' },
  ending: { id: 'ending', text: 'Transformação silenciosa: uma vida digna de viver.' },
};
const patterns = [
  { id: 'reference', label: 'Composição de referência', operation: 'Inclusão, exclusão e ordem articuladas',
    items: [moments.opening, moments.work, moments.threads, moments.trial, moments.ending],
    diagnosis: 'Este esquema prepara o teste dos vínculos antes da transformação final. A leitura combina o arco descrito por McKee com uma situação de provação criada para o exercício.' },
  { id: 'exclude', label: 'Omitir um elo', operation: 'O que incluir?',
    items: [moments.opening, moments.work, { id: 'threads', text: 'Vínculos de música e espiritualidade omitidos.', change: 'Omissão' }, moments.trial, moments.ending],
    diagnosis: 'Hipótese de montagem: ao retirar a construção desses vínculos, a resposta à provação pode parecer menos preparada. Que outros acontecimentos poderiam sustentar a transformação?' },
  { id: 'include', label: 'Acrescentar um clichê', operation: 'O que excluir?',
    items: [moments.opening, moments.work, moments.threads, { id: 'show', text: 'Retorno triunfal à fama em um estádio lotado · cena inventada.', change: 'Inclusão' }, moments.trial, moments.ending],
    diagnosis: 'Hipótese de montagem: o triunfo espetacular pode deslocar o centro da trama para a revanche profissional, em vez da vida simples costurada por amor, música e espiritualidade.' },
  { id: 'reorder', label: 'Antecipar a provação', operation: 'Antes e depois do quê?',
    items: [moments.opening, { ...moments.trial, change: 'Antecipação' }, moments.work, moments.threads, moments.ending],
    diagnosis: 'Hipótese de montagem: antecipar a perda muda o que o público conhece no momento da provação. Neste desenho, ela deixa de testar vínculos já estabelecidos e passa a anteceder sua construção.' },
];
const lenses = [['prose', 'Prosa interior'], ['exposition', 'Exposição explicativa'], ['cinema', 'Comportamento visível']];

export default function PlotDesignLab({ onReady }) {
  const uid = useId();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [lens, setLens] = useState('cinema');
  const [patternIndex, setPatternIndex] = useState(0);
  const [concept, setConcept] = useState('design');
  useLayoutEffect(() => { onReady?.(); }, [onReady]);
  const phase = phases[phaseIndex], pattern = patterns[patternIndex];

  return h('aside', { className: 'plot-design-lab', 'aria-labelledby': `${uid}-title`, 'data-interactive': 'plot-design-lab' },
    h('header', { className: 'pd-header' },
      h('span', { className: 'pd-kicker' }, 'Laboratório · o triângulo da estória'),
      h('h3', { id: `${uid}-title` }, 'Trama: escolhas no tempo'),
      h('p', null, 'Uma jornada interior também exige trama. Explore como o comportamento torna visível a mudança e como a seleção e a ordem dos eventos sustentam essa experiência.'),
      h('ol', { className: 'pd-questions', 'aria-label': 'As três perguntas de composição' },
        ['O que incluir?', 'O que excluir?', 'Antes e depois do quê?'].map(question => h('li', { key: question }, question))),
      h('p', { className: 'pd-helper' }, 'Exercício complementar aos sete parágrafos do livro. As propostas de escrita e montagem estão identificadas como exemplos didáticos.')),

    h('section', { className: 'pd-panel', 'aria-labelledby': `${uid}-translation-title` },
      h('span', { className: 'pd-kicker' }, '01 · Do mental ao físico'),
      h('h4', { id: `${uid}-translation-title` }, 'Como mostrar uma revolução interior?'),
      h('p', { className: 'pd-helper pd-exercise-label' }, 'Propostas de escrita criadas para este exercício, inspiradas no arco de Mac Sledge descrito por McKee. A provação é uma hipótese didática.'),
      h('div', { className: 'pd-options pd-phase-options', role: 'group', 'aria-label': 'Momentos do arco interior' }, phases.map((item, i) => h('button', {
        key: item.id, type: 'button', 'data-phase': item.id, 'aria-pressed': phaseIndex === i, 'aria-controls': `${uid}-translation`, onClick: () => setPhaseIndex(i),
      }, h('span', { className: 'pd-kicker' }, `Momento 0${i + 1}`), h('strong', null, item.title)))),
      h('div', { className: 'pd-options', role: 'group', 'aria-label': 'Lentes de escrita' }, lenses.map(([id, label]) => h('button', {
        key: id, type: 'button', 'data-lens': id, 'aria-pressed': lens === id, 'aria-controls': `${uid}-translation`, onClick: () => setLens(id),
      }, label))),
      h('div', { className: 'pd-translation-result', id: `${uid}-translation`, 'data-phase': phase.id, 'data-lens': lens, 'aria-live': 'polite' },
        h('div', { className: 'pd-inner-state' }, h('span', { className: 'pd-kicker' }, 'A mudança interna a dramatizar'), h('p', null, phase.inner)),
        h('div', { className: 'pd-writing-example' },
          h('span', { className: 'pd-kicker' }, `Exemplo didático · ${lenses.find(([id]) => id === lens)[1]}`), h('p', null, phase[lens])),
        h('p', { className: 'pd-lens-reading' }, lens === 'cinema'
          ? 'Ações, pausas e relações oferecem sinais para o público interpretar a vida interna.'
          : lens === 'prose'
            ? 'A prosa acessa diretamente o pensamento. Na encenação, o desafio é dar forma perceptível à transformação.'
            : 'Este exemplo explica a mudança em palavras. Observe o que poderia ser descoberto pelo comportamento, sem depender dessa explicação.')),
      h('p', { className: 'pd-carpenter' }, 'John Carpenter: “filmes são sobre transformar o mental em físico”.')),

    h('section', { className: 'pd-panel', 'aria-labelledby': `${uid}-pattern-title` },
      h('span', { className: 'pd-kicker' }, '02 · O castelo de cartas'),
      h('h4', { id: `${uid}-pattern-title` }, 'Seleção e ordem sustentam a jornada'),
      h('p', { className: 'pd-helper' }, 'Esquemas de montagem do exercício. Os incidentes e as alterações são hipóteses para explorar a fragilidade descrita por McKee.'),
      h('div', { className: 'pd-options pd-pattern-options', role: 'group', 'aria-label': 'Configurações de seleção e ordem' }, patterns.map((item, i) => h('button', {
        key: item.id, type: 'button', 'data-pattern': item.id, 'aria-pressed': patternIndex === i, 'aria-controls': `${uid}-pattern`, onClick: () => setPatternIndex(i),
      }, item.label))),
      h('div', { className: 'pd-pattern-result', id: `${uid}-pattern`, 'data-pattern': pattern.id, 'aria-live': 'polite' },
        h('span', { className: 'pd-kicker' }, pattern.operation),
        h('ol', { className: 'pd-event-list' }, pattern.items.map(item => h('li', { key: item.id, 'data-event': item.id, 'data-change': item.change || undefined },
          item.change ? h('span', { className: 'pd-change-label' }, item.change) : null, item.text))),
        h('div', { className: 'pd-diagnosis' }, h('h5', null, 'Leitura da composição'), h('p', null, pattern.diagnosis))),
      h('p', { className: 'pd-helper' }, 'A comparação propõe efeitos possíveis de cada escolha. O contexto e a execução determinam como uma mudança funciona na estória.')),

    h('section', { className: 'pd-panel', 'aria-labelledby': `${uid}-concept-title` },
      h('span', { className: 'pd-kicker' }, '03 · O conceito de trama'),
      h('h4', { id: `${uid}-concept-title` }, 'Uma estória “sem trama”?'),
      h('div', { className: 'pd-options', role: 'group', 'aria-label': 'Sentidos da palavra trama' },
        [['misconception', 'O equívoco crítico'], ['design', 'A definição de McKee']].map(([id, label]) => h('button', {
          key: id, type: 'button', 'data-concept': id, 'aria-pressed': concept === id, 'aria-controls': `${uid}-concept`, onClick: () => setConcept(id),
        }, label))),
      h('div', { className: 'pd-concept-result', id: `${uid}-concept`, 'data-concept': concept, 'aria-live': 'polite' },
        h('h5', null, concept === 'design' ? 'Toda estória tem uma trama' : 'Reduzir trama a reviravoltas'),
        h('p', null, concept === 'design'
          ? 'Trama é a escolha de eventos do escritor e sua colocação no tempo. A composição é necessária também quando a grande mudança acontece na atitude interior de um personagem.'
          : 'McKee discute a conotação depreciativa da palavra em certos círculos literários. Ao elogiar A Força do Carinho como um filme “sem trama”, alguns críticos deixam de reconhecer a precisão de sua composição.'),
        concept === 'design' ? h('ul', { className: 'pd-design-principles' }, ['Selecionar os eventos necessários', 'Excluir o que não serve à composição', 'Ordenar os acontecimentos no tempo'].map(item => h('li', { key: item }, item))) : null)));
}
