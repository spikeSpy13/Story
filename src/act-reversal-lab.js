import React, { useId, useLayoutEffect, useState } from 'react';
import './act-reversal-lab.css';

const h = React.createElement;
const degrees = [
  { id: 'scene', title: 'Cena básica', degree: 'Mudança menor, porém significante',
    unit: 'Beats de ação e reação constroem uma cena.',
    impact: 'Uma mudança significativa de valor na situação da personagem, considerada aqui em relação aos impactos maiores da sequência e do ato.',
    better: ['Exemplo do capítulo', 'Dúvida → Autoconfiança', 'No hotel, Barbara recupera a confiança depois do telefonema da mãe.'],
    worse: ['Exemplo do capítulo', 'Autoconfiança → Derrota', 'Depois da travessia, a imagem no espelho do lobby derruba a confiança de Barbara.'] },
  { id: 'sequence', title: 'Clímax de sequência', degree: 'Mudança moderada, mais impactante',
    unit: 'Uma série de cenas, geralmente de duas a cinco, culmina num impacto maior.',
    impact: 'O clímax transforma o valor maior que dá propósito à sequência. Em “Conseguir o trabalho”, a contratação reúne as mudanças das três cenas.',
    better: ['Exemplo do capítulo', 'Sem o novo trabalho → Contratada', 'O triunfo social na cobertura leva Barbara à conquista do cargo em Nova Iorque.'],
    worse: ['Hipótese de exercício', 'Oportunidade aberta → Vaga perdida', 'Em uma versão alternativa inventada, a seleção termina com a rejeição de Barbara.'] },
  { id: 'act', title: 'Clímax de ato', degree: 'Mudança maior, grande reversão',
    unit: 'Uma série de sequências culmina numa cena climática.',
    impact: 'A grande reversão de valores tem impacto mais poderoso do que qualquer cena ou sequência anterior, para melhor ou para pior.',
    better: ['Hipótese de exercício', 'Vulnerabilidade → Posição de poder', 'Uma série de conquistas culmina na ascensão da executiva à presidência da corporação.'],
    worse: ['Hipótese de exercício', 'Prestígio → Incriminação', 'No conselho, a executiva descobre que seu mentor usou sua assinatura para encobrir uma fraude.'] },
];

const chain = [
  { id: 'a', title: 'Conseguir o trabalho', count: 3, first: 1,
    kind: 'Retoma o exemplo do capítulo', shift: 'Sem o novo trabalho → Contratada em Nova Iorque',
    state: 'Conquista o cargo; ainda precisa provar seu valor',
    summary: 'Barbara supera a dúvida no hotel, sobrevive à travessia do parque e conquista o trabalho na festa. Esta sequência fornece o ponto de partida para a continuação inventada abaixo.',
    scope: 'A contratação resolve o valor maior da sequência. Neste exercício, outras sequências ainda preparam a grande reversão do ato.' },
  { id: 'b', title: 'Sobreviver à selva corporativa', count: 4, first: 4,
    kind: 'Continuação hipotética', shift: 'Isolamento profissional → Prestígio interno',
    state: 'Em ascensão, com um mentor e uma conta importante',
    summary: 'Nesta continuação inventada, Barbara enfrenta o boicote dos diretores, encontra um problema financeiro e ganha a confiança de um mentor. A sequência termina quando assume a operação central da empresa.',
    scope: 'Outra mudança moderada amplia a ascensão e estabelece a confiança no mentor. Esses ganhos serão postos em questão no clímax.' },
  { id: 'c', title: 'A reunião do conselho', count: 3, first: 8, climax: true,
    kind: 'Continuação hipotética', shift: 'Triunfo aparente → Incriminação',
    state: 'Grande reversão: de executiva prestigiada a incriminada',
    summary: 'Na cena 10 deste exercício, Barbara assina uma operação acreditando ter chegado ao topo. Então descobre que o mentor usou sua assinatura para encobrir um crime. A confiança e o prestígio conquistados dão lugar à traição e à ameaça à sua posição.',
    scope: 'A cena final é, ao mesmo tempo, clímax desta sequência e clímax do ato. A reversão atinge o que foi construído nas sequências anteriores, com impacto maior.' },
];

const domains = [
  { id: 'inner', title: 'Vida interior', question: 'O que muda na percepção que a personagem tem de si?',
    better: 'Conquista de lucidez, autoestima ou paz interior.', worse: 'Perda de confiança, crise de consciência ou colapso da identidade.' },
  { id: 'personal', title: 'Relacionamentos pessoais', question: 'Como a virada transforma seus vínculos com outras pessoas?',
    better: 'Reconciliação ou fortalecimento de uma relação de confiança.', worse: 'Traição de alguém próximo, ruptura de uma aliança ou isolamento.' },
  { id: 'world', title: 'Destino do mundo', question: 'O que se altera na instituição, comunidade ou ambiente à sua volta?',
    better: 'Justiça restaurada ou proteção de uma comunidade.', worse: 'Corrupção fortalecida, crise institucional ou ameaça à comunidade.' },
];

export default function ActReversalLab({ onReady }) {
  const uid = useId();
  const [degreeIndex, setDegreeIndex] = useState(2);
  const [direction, setDirection] = useState('worse');
  const [sequenceIndex, setSequenceIndex] = useState(2);
  const [selectedDomains, setSelectedDomains] = useState(() => new Set(domains.map(d => d.id)));
  useLayoutEffect(() => { onReady?.(); }, [onReady]);
  const degree = degrees[degreeIndex], sequence = chain[sequenceIndex];
  const [exampleKind, shift, example] = degree[direction];
  const activeDomains = domains.filter(d => selectedDomains.has(d.id));
  const toggleDomain = id => setSelectedDomains(current => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return h('aside', { className: 'act-reversal-lab', 'aria-labelledby': `${uid}-title`, 'data-interactive': 'act-reversal-lab' },
    h('header', { className: 'ar-header' },
      h('span', { className: 'ar-kicker' }, 'Laboratório · conceito de ato'),
      h('h3', { id: `${uid}-title` }, 'Sequências rumo à grande reversão'),
      h('p', null, 'O clímax de um ato se distingue pelo grau de impacto da mudança. Compare sua magnitude, explore uma série de sequências e combine os domínios atingidos pela virada.'),
      h('p', { className: 'ar-helper' }, 'Exercício complementar. As hipóteses de estudo estão identificadas; os dois parágrafos do livro permanecem integrais acima.')),

    h('section', { className: 'ar-panel', 'aria-labelledby': `${uid}-degree-title` },
      h('span', { className: 'ar-kicker' }, '01 · Grau de mudança'),
      h('h4', { id: `${uid}-degree-title` }, 'Menor → Moderada → Maior'),
      h('p', { className: 'ar-helper' }, 'A comparação é qualitativa: o grau de impacto não tem uma porcentagem fixa.'),
      h('div', { className: 'ar-options ar-degrees', role: 'group', 'aria-label': 'Magnitude da mudança' }, degrees.map((item, i) => h('button', {
        key: item.id, type: 'button', 'data-degree': item.id, 'aria-pressed': degreeIndex === i, 'aria-controls': `${uid}-degree`, onClick: () => setDegreeIndex(i),
      }, h('strong', null, item.title), h('span', null, item.degree),
      h('span', { className: 'ar-impact-scale', 'aria-hidden': true }, [0, 1, 2].map(step => h('i', { key: step, 'data-filled': step <= i })))))),
      h('div', { className: 'ar-options', role: 'group', 'aria-label': 'Direção da virada' },
        [['better', 'Para melhor (+)'], ['worse', 'Para pior (−)']].map(([id, label]) => h('button', { key: id, type: 'button', 'data-direction': id,
          'aria-pressed': direction === id, 'aria-controls': `${uid}-degree`, onClick: () => setDirection(id) }, label))),
      h('div', { className: 'ar-degree-result', id: `${uid}-degree`, 'data-degree': degree.id, 'data-direction': direction, 'aria-live': 'polite' },
        h('span', { className: 'ar-kicker' }, degree.degree), h('h5', null, degree.unit), h('p', null, degree.impact),
        h('div', { className: 'ar-example' }, h('span', { className: 'ar-kicker ar-example-kind' }, exampleKind),
          h('strong', { className: 'ar-value-shift' }, shift), h('p', null, example))),
      h('p', { className: 'ar-helper' }, 'Uma grande reversão de ato ainda pode ser revertida. A mudança absoluta e irreversível pertence ao clímax final da estória.')),

    h('section', { className: 'ar-panel', 'aria-labelledby': `${uid}-chain-title` },
      h('span', { className: 'ar-kicker' }, '02 · Uma série de sequências'),
      h('h4', { id: `${uid}-chain-title` }, 'Como se constrói um ato?'),
      h('p', { className: 'ar-helper ar-hypothesis' }, 'Hipótese de exercício: a contratação de Barbara retoma o capítulo; a selva corporativa e a fraude são continuações inventadas. Três sequências e dez cenas são escolhas deste exemplo, não uma quantidade obrigatória.'),
      h('div', { className: 'ar-options ar-chain', role: 'group', 'aria-label': 'Sequências do ato hipotético' }, chain.map((item, i) => h('button', {
        key: item.id, type: 'button', 'data-sequence': item.id, 'aria-pressed': sequenceIndex === i, 'aria-controls': `${uid}-chain`, onClick: () => setSequenceIndex(i),
      }, h('span', { className: 'ar-kicker' }, `Sequência ${item.id.toUpperCase()}`), h('strong', null, item.title),
      h('small', null, `${item.count} cenas${item.climax ? ' · clímax do ato' : ''}`),
      h('span', { className: 'ar-scene-strip', 'aria-hidden': true }, Array.from({ length: item.count }, (_, j) => h('span', { key: j, 'data-climax': item.first + j === 10 }, String(item.first + j))))))),
      h('div', { className: 'ar-chain-result', id: `${uid}-chain`, 'aria-live': 'polite', 'data-sequence': sequence.id, 'data-climax': Boolean(sequence.climax) },
        h('div', { className: 'ar-act-state' }, h('span', { className: 'ar-kicker' }, 'Condição da personagem neste ato hipotético'), h('strong', null, sequence.state)),
        h('span', { className: 'ar-kicker ar-chain-kind' }, sequence.kind), h('h5', null, sequence.shift), h('p', { className: 'ar-chain-summary' }, sequence.summary),
        h('div', { className: 'ar-chain-impact' }, h('span', { className: 'ar-kicker' }, sequence.climax ? 'Grande reversão do ato' : 'Mudança da sequência'), h('p', null, sequence.scope)))),

    h('section', { className: 'ar-panel', 'aria-labelledby': `${uid}-domains-title` },
      h('span', { className: 'ar-kicker' }, '03 · Domínios do impacto'),
      h('h4', { id: `${uid}-domains-title` }, 'Onde a reversão repercute?'),
      h('p', { className: 'ar-helper' }, 'Selecione uma esfera ou combine várias. Os efeitos abaixo são possibilidades didáticas para explorar os três domínios citados por McKee.'),
      h('div', { className: 'ar-options', role: 'group', 'aria-label': 'Esferas de impacto do ato' }, domains.map(domain => h('button', {
        key: domain.id, type: 'button', 'data-domain': domain.id, 'aria-pressed': selectedDomains.has(domain.id), 'aria-controls': `${uid}-domains`, onClick: () => toggleDomain(domain.id),
      }, domain.title))),
      h('div', { className: 'ar-options ar-domain-actions' },
        h('button', { type: 'button', onClick: () => setSelectedDomains(new Set(domains.map(d => d.id))) }, 'Combinar as três esferas'),
        h('button', { type: 'button', onClick: () => setSelectedDomains(new Set()) }, 'Limpar seleção')),
      h('div', { className: 'ar-domain-results', id: `${uid}-domains`, 'aria-live': 'polite' },
        activeDomains.length ? activeDomains.map(domain => h('div', { key: domain.id, className: 'ar-domain-card', 'data-domain-card': domain.id },
          h('h5', null, domain.title), h('p', { className: 'ar-domain-question' }, domain.question),
          h('p', { className: 'ar-domain-better' }, h('strong', null, '+ Para melhor: '), domain.better),
          h('p', { className: 'ar-domain-worse' }, h('strong', null, '− Para pior: '), domain.worse)))
          : h('p', { className: 'ar-empty-domains' }, 'Selecione uma esfera para explorar os possíveis efeitos da virada.'),
        h('div', { className: 'ar-domain-synthesis' },
          h('strong', null, `${activeDomains.length} ${activeDomains.length === 1 ? 'esfera selecionada' : 'esferas selecionadas'}`),
          h('p', null, activeDomains.length ? 'A grande reversão pode atingir uma esfera ou uma combinação delas. A quantidade selecionada não determina a qualidade nem o poder dramático do ato.' : 'Os botões permitem comparar os domínios individualmente ou em conjunto.')))));
}
