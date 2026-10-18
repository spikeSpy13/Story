import React, { useId, useLayoutEffect, useState } from 'react';
import './life-told-lab.css';

const h = React.createElement;
const levels = [
  { id: 'internal', number: 1, title: 'Vida interna', radius: 40,
    excerpt: 'Pensamentos e sensações, acordado ou sonhando.', question: 'Que pensamento ou sensação põe o protagonista em conflito consigo mesmo?' },
  { id: 'personal', number: 2, title: 'Relações pessoais', radius: 76,
    excerpt: 'Conflitos entre protagonista e família, amigos, amantes.', question: 'Como os desejos do protagonista encontram os desejos das pessoas próximas?' },
  { id: 'social', number: 3, title: 'Instituições sociais', radius: 112,
    excerpt: 'Dificuldades na escola, carreira profissional, igreja, sistema judiciário.', question: 'Que regras ou interesses de uma instituição se opõem ao personagem?' },
  { id: 'physical', number: 4, title: 'Ambiente físico', radius: 148,
    excerpt: 'Ruas perigosas da cidade, doenças letais, o carro que não liga, o tempo acabando.', question: 'Que obstáculo material, biológico ou temporal pressiona o personagem?' },
];
const phases = [
  { id: 'farm', title: 'Infância na fazenda', kind: 'past', life: 'Filho de um meeiro, Mac trabalha pesado com a família sob o sol quente.',
    told: 'Essa infância pertence ao passado que o período escolhido permite apreender. O relato do amigo a coloca antes da manhã que abre o filme.' },
  { id: 'music', title: 'Escola, guitarra e estrada', kind: 'past', life: 'O trabalho na terra prejudica sua vida escolar. Ele ganha uma guitarra, aprende a tocar e compor e foge, tocando por comida.',
    told: 'A formação e os primeiros passos na música fazem parte da vida anterior de Mac, conhecida dentro e entre as cenas do ano contado.' },
  { id: 'fame', title: 'Amor e estrelato', kind: 'past', life: 'Mac conhece uma mulher de bela voz. Os dois se apaixonam e alcançam o estrelato, mas os holofotes estão sobre ela.',
    told: 'O relacionamento e a carreira fazem parte do passado que o público reconstrói, embora o filme comece muito depois dessa trajetória.' },
  { id: 'fall', title: 'Bebida e separação', kind: 'past', life: 'Vivendo à sombra dela, ele começa a beber. Ela o dispensa, e ele volta à estrada até o fundo do poço.',
    told: 'O filme parte do resultado dessa queda. O que veio antes é compreendido a partir da vida de Mac no período selecionado.' },
  { id: 'motel', title: 'Motel e o próximo ano', kind: 'present', life: 'O relato chega a Mac acordando em um motel barato, sem dinheiro, amigos ou perspectiva.',
    told: 'A Força do Carinho começa na manhã em que Mac acorda no fundo do poço. As próximas duas horas cobrem o próximo ano de sua vida.' },
  { id: 'future', title: 'Futuro sugerido', kind: 'future', life: 'A vida do personagem pode se estender além do período escolhido para o filme.',
    told: 'Segundo o trecho, a última imagem oferece uma visão de seu futuro. A implicação amplia a experiência para além do FADE OUT.' },
];
const phaseStatus = phase => phase.kind === 'present' ? 'Período dramatizado' : phase.kind === 'future' ? 'Sugerido pela imagem final' : 'Passado por implicação';
const cuts = [
  { id: 'birth', title: 'Nascimento na fazenda', label: 'Hipótese de exercício',
    text: 'Esse início daria centralidade à formação de Mac, ao trabalho na terra e ao caminho até a música. Exigiria uma seleção de acontecimentos voltada para essa proposta.' },
  { id: 'fame', title: 'Auge da carreira', label: 'Hipótese de exercício',
    text: 'Essa entrada poderia concentrar o filme no estrelato, na relação do casal e na queda do personagem. O período e a seleção de acontecimentos serviriam a outro foco narrativo.' },
  { id: 'motel', title: 'Manhã no motel', label: 'Abertura descrita no capítulo',
    text: 'Horton Foote começa no fundo do poço e dramatiza o próximo ano. Dentro e entre as cenas, conhecemos o passado significativo de Mac; a imagem final sugere seu futuro.' },
];

export default function LifeToToldStoryLab({ mode = 'full', onReady }) {
  const uid = useId();
  const [selected, setSelected] = useState(() => new Set(levels.map(level => level.id)));
  const [phaseId, setPhaseId] = useState('motel');
  const [lens, setLens] = useState('told');
  const [cutId, setCutId] = useState('motel');
  useLayoutEffect(() => { onReady?.(); }, [onReady]);
  const phase = phases.find(item => item.id === phaseId);
  const cut = cuts.find(item => item.id === cutId);
  const toggleLevel = id => setSelected(current => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const visibleLevels = levels.filter(level => selected.has(level.id));

  return h('aside', { className: 'life-told-lab', 'aria-labelledby': `${uid}-title`, 'data-interactive': 'life-told-lab' },
    h('header', { className: 'life-lab-header' },
      h('span', { className: 'life-kicker mono' }, 'Laboratório · seleção narrativa · 2.1'),
      h('h3', { id: `${uid}-title` }, 'Da estória de vida à estória contada'),
      h('p', null, 'A marca de um mestre é selecionar alguns momentos e nos dar uma vida inteira. Explore os níveis de conflito e o recorte de A Força do Carinho descrito por McKee.'),
      h('div', { className: 'life-selection-equation', 'aria-label': 'Da vida à seleção narrativa' },
        h('div', null, h('strong', null, 'Estória de vida'), h('span', null, 'Centenas de milhares de horas')),
        h('span', { className: 'life-equation-arrow', 'aria-hidden': true }, '→'),
        h('div', null, h('strong', null, 'Estória contada'), h('span', null, 'Cerca de duas horas de filme'))),
      h('p', { className: 'life-helper' }, 'Exercício complementar com sínteses do trecho. As perguntas e alternativas de abertura são propostas para estudo.')),
    mode !== 'sledge-only' ? h('section', { className: 'life-panel', 'aria-labelledby': `${uid}-levels-title` },
      h('span', { className: 'life-kicker' }, 'Experimento I · níveis de conflito'),
      h('h4', { id: `${uid}-levels-title` }, 'Do mundo interno ao ambiente'),
      h('p', { className: 'life-helper' }, 'Isole um nível ou combine diferentes camadas. O trecho admite qualquer combinação desses níveis.'),
      h('div', { className: 'life-level-actions' },
        h('button', { type: 'button', onClick: () => setSelected(new Set(levels.map(level => level.id))) }, 'Combinar os quatro níveis'),
        h('button', { type: 'button', onClick: () => setSelected(new Set()) }, 'Limpar seleção')),
      h('div', { className: 'life-level-options', role: 'group', 'aria-label': 'Níveis de conflito' }, levels.map(level => h('button', {
        key: level.id, type: 'button', 'aria-pressed': selected.has(level.id), 'aria-controls': `${uid}-levels`, 'data-level': level.id, onClick: () => toggleLevel(level.id),
      }, `${level.number}. ${level.title}`))),
      h('div', { className: 'life-radar-layout' },
        h('svg', { viewBox: '0 0 320 320', className: 'life-radar', role: 'group', 'aria-label': 'Anéis dos níveis de conflito' },
          [...levels].reverse().map(level => h('g', { key: level.id, role: 'button', tabIndex: 0,
            'aria-label': `Alternar anel ${level.number}: ${level.title}`, 'aria-pressed': selected.has(level.id), 'data-ring': level.id,
            onClick: () => toggleLevel(level.id),
            onKeyDown: event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleLevel(level.id); } },
          }, h('circle', { cx: 160, cy: 160, r: level.radius }),
          h('text', { x: 160, y: level.number === 1 ? 166 : 160 - level.radius + 22, textAnchor: 'middle', 'aria-hidden': true }, String(level.number))))),
        h('div', { className: 'life-level-cards', id: `${uid}-levels`, 'aria-live': 'polite' },
          visibleLevels.length ? visibleLevels.map(level => h('article', { key: level.id, className: 'life-level-card', 'data-level-card': level.id },
            h('div', { className: 'life-level-card-heading' }, h('h5', null, `${level.number}. ${level.title}`),
              h('button', { type: 'button', 'aria-label': `Isolar ${level.title}`, onClick: () => setSelected(new Set([level.id])) }, 'Isolar')),
            h('p', null, level.excerpt), h('p', { className: 'life-helper' }, h('strong', null, 'Pergunta para leitura: '), level.question)))
            : h('p', { className: 'life-helper' }, 'Selecione um nível ou combine-os para explorar o mundo do personagem.')))) : null,
    mode !== 'levels-only' ? h(React.Fragment, null,
      h('section', { className: 'life-panel', 'aria-labelledby': `${uid}-sledge-title` },
        h('span', { className: 'life-kicker' }, 'Experimento II · seleção do período'),
        h('h4', { id: `${uid}-sledge-title` }, 'Mac Sledge · uma vida evocada por um ano'),
        h('div', { className: 'life-lens-options', role: 'group', 'aria-label': 'Lentes sobre a vida de Mac Sledge' },
          [['life', 'Relato do amigo'], ['told', 'Recorte de Horton Foote']].map(([id, label]) => h('button', {
            key: id, type: 'button', 'aria-pressed': lens === id, 'aria-controls': `${uid}-lens ${uid}-phase`, onClick: () => setLens(id),
          }, label))),
        h('div', { className: 'life-lens-banner', id: `${uid}-lens`, 'aria-live': 'polite', 'data-lens': lens },
          h('p', null, lens === 'life' ? 'O amigo conta a trajetória desde a infância na fazenda até a queda de Mac. Ao relembrar o filme, ele aproxima a estória contada de toda a estória de vida.'
            : 'O filme começa na manhã em que Mac acorda no fundo do poço. As duas horas seguintes cobrem cerca de um ano; dentro e entre as cenas, o público conhece seu passado significativo e vislumbra o futuro.')),
        h('div', { className: 'life-timeline', role: 'group', 'aria-label': 'Fases da vida de Mac Sledge', 'data-lens': lens }, phases.map((item, i) => h('button', {
          key: item.id, type: 'button', 'aria-pressed': phaseId === item.id, 'aria-controls': `${uid}-phase`, 'data-phase': item.id, 'data-kind': item.kind, onClick: () => setPhaseId(item.id),
        }, h('span', { className: 'life-kicker' }, `Fase 0${i + 1}`), h('strong', null, item.title), h('small', null, phaseStatus(item))))),
        h('div', { className: 'life-phase-monitor', id: `${uid}-phase`, 'aria-live': 'polite', 'data-phase': phase.id, 'data-kind': phase.kind },
          h('div', null, h('span', { className: 'life-kicker' }, lens === 'life' ? 'Na trajetória de vida'
            : phase.kind === 'present' ? 'O ponto de partida' : phase.kind === 'future' ? 'Além do período contado' : 'Antes do FADE IN'),
            h('p', { className: 'life-phase-history' }, phase.life)),
          h('div', null, h('span', { className: 'life-kicker' }, 'Relação com a estória contada'), h('p', { className: 'life-phase-told' }, phase.told)),
          h('p', { className: 'life-phase-status' }, phaseStatus(phase)))),
      h('section', { className: 'life-panel', 'aria-labelledby': `${uid}-entry-title` },
        h('span', { className: 'life-kicker' }, 'Experimento III · ponto de entrada'),
        h('h4', { id: `${uid}-entry-title` }, 'Onde começar a contar?'),
        h('div', { className: 'life-entry-options', role: 'group', 'aria-label': 'Pontos de entrada da estória' }, cuts.map(item => h('button', {
          key: item.id, type: 'button', 'aria-pressed': cutId === item.id, 'aria-controls': `${uid}-cut`, 'data-cut': item.id, onClick: () => setCutId(item.id),
        }, item.title))),
        h('div', { className: 'life-entry-result', id: `${uid}-cut`, 'data-cut': cut.id, 'aria-live': 'polite' },
          h('span', { className: 'life-kicker' }, cut.label), h('h5', null, cut.title), h('p', null, cut.text)))) : null);
}
