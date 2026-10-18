import React, { useId, useState } from 'react';
import './scene-lab.css';

const h = React.createElement;
const axes = [
  { id: 'action', title: 'Gênero de Ação', scope: 'Valores públicos', positive: 'Liberdade', negative: 'Escravidão',
    examples: 'DURO DE MATAR · O FUGITIVO · SOB O DOMÍNIO DO MEDO', note: 'O texto cita liberdade/escravidão e justiça/injustiça como exemplos de valores públicos.' },
  { id: 'education', title: 'Trama de Educação', scope: 'Valores interiores', positive: 'Autoconhecimento', negative: 'Autodecepção',
    examples: 'VESTÍGIOS DO DIA · O TURISTA ACIDENTAL', note: 'O texto cita autoconhecimento/autodecepção e a vida como significativa/insignificante.' },
  { id: 'relationship', title: 'Chris e Andy', scope: 'Valor relacional', positive: 'Juntos / se amam', negative: 'Separados / se odeiam',
    examples: 'Exemplo do capítulo', note: 'O relacionamento passa de juntos, apaixonados, para separados: um único Evento da Estória.' },
];
const moments = [
  { id: 'bedroom', location: 'Quarto', stage: 'Início', activity: 'Chris e Andy acordam e começam a brigar.',
    note: 'Há conflito, mas ainda estão juntos. A mudança de cômodo, por si só, não encerra a cena.' },
  { id: 'kitchen', location: 'Cozinha', stage: 'Intensificação', activity: 'A discussão cresce enquanto se apressam para fazer o café.',
    note: 'O comportamento se intensifica, mas o casal continua junto e presumivelmente apaixonado.' },
  { id: 'garage', location: 'Garagem', stage: 'Escalada', activity: 'A briga piora enquanto entram no carro para irem juntos ao trabalho.',
    note: 'A hostilidade aumenta. Ainda assim, estão indo juntos ao trabalho; o valor em questão ainda não virou.' },
  { id: 'road', location: 'Estrada / acostamento', stage: 'Desfecho', activity: 'As palavras viram violência. Andy para o carro no acostamento, sai e encerra o relacionamento.',
    note: 'A porta batendo e o “acabou!” marcam o Ponto de Virada: de juntos para separados. A série se completa como uma única cena.', turned: true },
];
const media = [
  { id: 'theatre', name: 'Teatro', range: 'Raramente chega a 40', description: 'O dramaturgo tende a concentrar a ação. As limitações do palco frequentemente favorecem a unidade de tempo e lugar.' },
  { id: 'film', name: 'Cinema', range: '40–60 em um filme típico', description: 'O roteirista escolhe entre quarenta e sessenta Eventos da Estória para um filme típico, segundo a referência do trecho.' },
  { id: 'novel', name: 'Romance', range: 'Pode ultrapassar 60', description: 'O romancista pode querer mais de sessenta eventos e, como o roteirista, pode estender uma cena pelo tempo e espaço.' },
];
const poles = ['positive', 'mixed', 'negative'];
const poleLabel = (pole, axis) => pole === 'positive' ? `+ ${axis.positive}` : pole === 'negative' ? `− ${axis.negative}` : '± Ambos os polos';

export function SceneLab() {
  const uid = useId();
  const [axisId, setAxisId] = useState('action');
  const [start, setStart] = useState('positive');
  const [end, setEnd] = useState('negative');
  const [momentId, setMomentId] = useState('bedroom');
  const [mode, setMode] = useState('cinema');
  const axis = axes.find(item => item.id === axisId);
  const moment = moments.find(item => item.id === momentId);
  const index = moments.indexOf(moment);
  const changed = start !== end;
  const poleGroup = (title, value, setter) => h('fieldset', { className: 'scene-pole-group' },
    h('legend', null, title), poles.map(pole => h('button', {
      key: pole, type: 'button', 'aria-pressed': value === pole, 'aria-controls': `${uid}-audit`,
      'data-pole': pole, onClick: () => setter(pole),
    }, poleLabel(pole, axis))));

  return h('aside', { className: 'scene-lab', 'aria-labelledby': `${uid}-title`, 'data-interactive': 'scene-lab' },
    h('header', { className: 'scene-lab-header' },
      h('span', { className: 'scene-kicker mono' }, 'Laboratório · auditoria e unidade de cena · 2.1.3'),
      h('h3', { id: `${uid}-title` }, 'O teste da virada e a unidade da cena'),
      h('p', null, 'Compare a carga de valor no início e no fim. Depois acompanhe Chris e Andy: quatro posições de câmera podem compor um único Evento da Estória.'),
      h('p', { className: 'scene-helper' }, 'Exercício complementar com sínteses dos exemplos do capítulo.')),
    h('section', { className: 'scene-panel', 'aria-labelledby': `${uid}-audit-title` },
      h('span', { className: 'scene-kicker' }, 'Experimento I'),
      h('h4', { id: `${uid}-audit-title` }, 'Anotar o início e o fim'),
      h('p', { className: 'scene-helper' }, 'Escolha o valor em questão e compare suas anotações. O teste procura uma transformação perceptível na vida do personagem.'),
      h('div', { className: 'scene-axis-options', role: 'group', 'aria-label': 'Eixos de valor da cena' }, axes.map(item => h('button', {
        key: item.id, type: 'button', 'aria-pressed': axisId === item.id, onClick: () => setAxisId(item.id), 'data-axis': item.id,
      }, h('span', { className: 'scene-kicker' }, item.scope), h('strong', null, item.title), h('small', null, item.examples)))),
      h('p', { className: 'scene-axis-note scene-helper' }, axis.note),
      h('div', { className: 'scene-audit-bench' },
        poleGroup('Carga inicial', start, setStart),
        h('span', { className: 'scene-audit-arrow', 'aria-hidden': true }, '→'),
        poleGroup('Carga final', end, setEnd)),
      h('div', { className: 'scene-audit-result', id: `${uid}-audit`, 'aria-live': 'polite', 'data-outcome': changed ? 'changed' : 'same' },
        h('h5', null, changed ? 'Virada indicada pelas anotações' : 'Anotações iguais · investigue a função da cena'),
        h('p', { className: 'scene-audit-transition' }, `${poleLabel(start, axis)} → ${poleLabel(end, axis)}`),
        h('p', null, changed ? 'O registro indica uma mudança de carga. Confira se ela é significativa para o personagem e alcançada através do conflito, como pede a definição de cena.'
          : 'Se nada significativo muda no valor em questão, há um não evento. Se a exposição é a única justificativa para a cena, McKee propõe cortá-la e transportar a informação para outro momento.'))),
    h('section', { className: 'scene-panel', 'aria-labelledby': `${uid}-unity-title` },
      h('span', { className: 'scene-kicker' }, 'Experimento II'),
      h('h4', { id: `${uid}-unity-title` }, 'Chris e Andy: quatro lugares, uma cena'),
      h('div', { className: 'scene-unity-modes', role: 'group', 'aria-label': 'Encenação do exemplo' },
        [['cinema', 'Roteirista · quatro locações'], ['theatre', 'Teste de palco · um lugar']].map(([id, title]) => h('button', {
          key: id, type: 'button', 'aria-pressed': mode === id, onClick: () => setMode(id),
        }, title))),
      h('p', { className: 'scene-helper scene-unity-explanation' }, mode === 'cinema'
        ? 'Percorra a manhã do casal. A briga cresce através dos lugares; a virada do relacionamento acontece no acostamento.'
        : 'No teste proposto no texto, a discussão inteira poderia ocorrer no mesmo quarto. Os quatro momentos abaixo são uma hipótese de encenação desse único evento.'),
      h('div', { className: 'scene-camera-track', role: 'group', 'aria-label': 'Momentos de Chris e Andy' }, moments.map((item, i) => h('button', {
        key: item.id, type: 'button', 'aria-pressed': momentId === item.id, 'aria-controls': `${uid}-moment`, 'data-moment': item.id, onClick: () => setMomentId(item.id),
      }, h('span', { className: 'scene-kicker' }, `${mode === 'cinema' ? 'Locação' : 'Momento'} 0${i + 1}`),
      h('strong', null, mode === 'cinema' ? item.location : `Mesmo quarto · ${item.stage}`),
      h('span', { className: 'scene-camera-pole' }, item.turned ? 'Virada (−)' : 'Juntos (+)')))),
      h('div', { className: 'scene-moment-monitor', id: `${uid}-moment`, 'aria-live': 'polite', 'data-turned': Boolean(moment.turned), 'data-mode': mode },
        h('div', null,
          h('span', { className: 'scene-kicker' }, mode === 'cinema' ? `Posição de câmera 0${index + 1}` : `Mesmo quarto · ${moment.stage}`),
          h('p', { className: 'scene-moment-activity' }, mode === 'theatre' && moment.turned ? 'A discussão termina no quarto: Andy põe fim ao relacionamento.' : mode === 'theatre'
            ? ['A discussão começa no quarto.', 'A discussão cresce no mesmo quarto.', 'A briga se intensifica no mesmo quarto; o casal ainda está junto.'][index] : moment.activity),
          h('p', { className: 'scene-helper' }, mode === 'cinema' ? moment.note
            : moment.turned ? 'Nessa hipótese de encenação, o mesmo conflito chega à mesma reversão de valor em um só lugar.'
            : 'O conflito se intensifica no mesmo quarto. A virada do relacionamento ainda está por acontecer.')),
        h('div', { className: 'scene-value-state' },
          h('span', { className: 'scene-kicker' }, 'Valor do relacionamento'),
          h('strong', null, moment.turned ? '− Separados / se odeiam' : '+ Juntos / se amam'),
          h('p', null, moment.turned ? 'O Ponto de Virada completa a cena.' : 'O conflito se intensifica; a virada ainda não aconteceu.'))),
      h('p', { className: 'scene-unity-conclusion' }, mode === 'cinema'
        ? 'Quatro posições de câmera · uma única cena: os “amantes desmanchando o relacionamento”.'
        : 'Um lugar e um tempo · o mesmo evento dos “amantes desmanchando o relacionamento”.')),
    h('section', { className: 'scene-panel', 'aria-labelledby': `${uid}-media-title` },
      h('span', { className: 'scene-kicker' }, 'Experimento III'),
      h('h4', { id: `${uid}-media-title` }, 'Eventos da Estória por mídia'),
      h('p', { className: 'scene-helper' }, 'Referências de quantidade apresentadas no trecho. São possibilidades e tendências, e não limites obrigatórios.'),
      h('div', { className: 'scene-media-list' }, media.map(item => h('article', { key: item.id, className: 'scene-media-card', 'data-medium': item.id },
        h('div', { className: 'scene-media-heading' }, h('h5', null, item.name), h('span', null, item.range)),
        h('div', { className: 'scene-media-scale', 'aria-hidden': true }, h('span', null, '0'), h('span', null, '40'), h('span', null, '60')),
        h('div', { className: `scene-media-track ${item.id}`, 'aria-hidden': true }, h('span', null)),
        h('p', null, item.description))))));
}
