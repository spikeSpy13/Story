import React, { useId, useState } from 'react';
import './event-lab.css';

const h = React.createElement;
const stages = [
  { id: 'street', title: 'A rua molhada', subtitle: 'Mudança física',
    scenario: 'As ruas estavam secas antes de uma soneca e agora estão molhadas. A chuva mudou a paisagem, mas ainda não acompanhamos alguém afetado por ela.',
    character: false, value: false, from: 'Seco', to: 'Molhado', shift: 'Mudança do tempo, sem valor dramático estabelecido.',
    verdict: 'Mudança física · ainda não é um Evento da Estória.' },
  { id: 'person', title: 'Alguém no aguaceiro', subtitle: 'A mudança ocorre a alguém',
    scenario: 'Uma pessoa está ensopada no aguaceiro. A mudança agora atinge alguém, mas o exemplo ainda não estabelece uma reversão significativa de valor ou uma luta.',
    character: true, value: false, from: 'Seco', to: 'Molhado', shift: 'A presença de uma pessoa aumenta o significado, mas não completa a definição.',
    verdict: 'Personagem presente · faltam valor significativo e conflito.' },
  { id: 'monsoon', title: 'Monção na África Oriental', subtitle: 'Valor transformado por coincidência',
    scenario: 'Na África Oriental dos anos 1980, a seca ameaça a sobrevivência. Uma monção torna a terra verde, devolve os animais às pastagens e as pessoas à sobrevivência. A mudança é profundamente significativa, mas a chuva caiu por acaso.',
    character: true, value: true, from: 'Morte (−)', to: 'Vida (+)', shift: 'O valor muda de negativo para positivo; falta a mudança alcançada através do conflito.',
    verdict: 'Mudança de valor · a coincidência ainda não basta.' },
  { id: 'rainmaker', title: 'Lágrimas do Céu', subtitle: 'Mudança de valor alcançada através do conflito',
    scenario: 'Em um mundo de seca, o fazedor de chuvas enfrenta sua própria dúvida, o descrédito da mulher amada, a hostilidade da cidade e o mundo físico. A chuva arrancada desse confronto ganha significado dramático.',
    character: true, value: true, from: 'Morte / desespero (−)', to: 'Vida / esperança (+)', shift: 'Explore abaixo as forças que fazem da chuva uma mudança motivada pelo conflito.' },
];

// All pairs are present in the supplied section, including its moral and
// ethical examples. The cards illustrate polarity rather than rewrite the book.
const values = [
  { id: 'life', positive: 'Vivo', negative: 'Morto' },
  { id: 'love', positive: 'Amor', negative: 'Ódio' },
  { id: 'freedom', positive: 'Liberdade', negative: 'Escravidão' },
  { id: 'truth', positive: 'Verdade', negative: 'Mentira' },
  { id: 'courage', positive: 'Coragem', negative: 'Covardia' },
  { id: 'loyalty', positive: 'Lealdade', negative: 'Traição' },
  { id: 'wisdom', positive: 'Sabedoria', negative: 'Estupidez' },
  { id: 'strength', positive: 'Força', negative: 'Fraqueza' },
  { id: 'excitement', positive: 'Excitamento', negative: 'Tédio' },
  { id: 'good', positive: 'Bom', negative: 'Mau' },
  { id: 'right', positive: 'Certo', negative: 'Errado' },
  { id: 'hope', positive: 'Esperança', negative: 'Desespero' },
];
const conflicts = [
  { id: 'internal', title: 'Conflito interno', target: 'Eu × eu mesmo',
    description: 'A crença apaixonada de que pode trazer a chuva enfrenta o medo de ser um tolo ou um lunático.' },
  { id: 'personal', title: 'Conflito pessoal', target: 'Eu × a mulher amada',
    description: 'Ele se apaixona, mas sofre quando a mulher se convence de que ele é um charlatão ou algo pior.' },
  { id: 'social', title: 'Conflito social', target: 'Eu × a cidade',
    description: 'Alguns o seguem como um messias; outros querem apedrejá-lo e expulsá-lo da cidade.' },
  { id: 'physical', title: 'Conflito físico', target: 'Eu × a natureza',
    description: 'Os ventos quentes, os céus vazios e a terra ressecada se opõem ao fazedor de chuvas.' },
];

function LabMeter({ id, title, value, max }) {
  return h('div', { className: 'event-lab-meter' },
    h('div', { className: 'event-meter-heading', id }, h('span', null, title), h('strong', null, `${value} de ${max}`)),
    h('div', { className: 'event-meter-track', role: 'meter', 'aria-labelledby': id, 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-valuenow': value, 'aria-valuetext': `${value} de ${max}` },
      h('span', { style: { width: `${value / max * 100}%` } })));
}

export function EventLab() {
  const uid = useId();
  const [stageId, setStageId] = useState('street');
  const [polarities, setPolarities] = useState(() => Object.fromEntries(values.map(value => [value.id, true])));
  const [activeConflicts, setActiveConflicts] = useState(() => new Set(conflicts.map(conflict => conflict.id)));
  const stage = stages.find(item => item.id === stageId);
  const isRainmaker = stageId === 'rainmaker';
  const hasConflict = isRainmaker && activeConflicts.size > 0;
  const checks = [
    { id: 'character', title: 'Personagem', active: stage.character, detail: stage.character ? 'A mudança ocorre a alguém.' : 'Só a paisagem mudou.' },
    { id: 'value', title: 'Valor significativo', active: stage.value, detail: stage.value ? 'Há uma mudança na carga de valor.' : 'A reversão de valor ainda não foi estabelecida.' },
    { id: 'conflict', title: 'Conflito', active: hasConflict, detail: hasConflict ? 'A mudança é motivada por uma luta.' : 'A mudança não foi alcançada por uma luta neste recorte.' },
  ];
  const count = checks.filter(check => check.active).length;
  const verdict = !isRainmaker ? stage.verdict : hasConflict
    ? 'Evento da Estória · mudança significativa de valor alcançada através do conflito.'
    : 'Sem conflito selecionado · neste recorte, a chuva volta a ser uma mudança por acaso.';
  const togglePolarity = id => setPolarities(current => ({ ...current, [id]: !current[id] }));
  const invertAll = () => setPolarities(current => Object.fromEntries(values.map(value => [value.id, !current[value.id]])));
  const toggleConflict = id => {
    setStageId('rainmaker');
    setActiveConflicts(current => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return h('aside', { className: 'event-lab', 'aria-labelledby': `${uid}-title`, 'data-interactive': 'event-lab' },
    h('header', { className: 'event-lab-header' },
      h('span', { className: 'event-lab-kicker mono' }, 'Laboratório · anatomia do evento · 2.1.2'),
      h('h3', { id: `${uid}-title` }, 'Da mudança física ao evento dramático'),
      h('p', null, 'Explore a progressão da chuva no texto: uma mudança precisa ocorrer a um personagem, ser significativa em termos de valor e ser alcançada através do conflito.'),
      h('p', { className: 'event-lab-helper' }, 'Exercício de leitura. Os cenários resumem os exemplos do capítulo; os medidores contam critérios e camadas, sem atribuir notas à qualidade de uma estória.')),
    h('section', { className: 'event-lab-panel', 'aria-labelledby': `${uid}-stages-title` },
      h('span', { className: 'event-lab-kicker mono' }, 'Experimento I'),
      h('h4', { id: `${uid}-stages-title` }, 'Os quatro estágios da chuva'),
      h('div', { className: 'event-stage-options', role: 'group', 'aria-label': 'Estágios da chuva' }, stages.map((item, index) => h('button', {
        key: item.id, type: 'button', 'aria-pressed': stageId === item.id, 'aria-controls': `${uid}-diagnosis`, 'data-stage': item.id,
        onClick: () => setStageId(item.id),
      }, h('span', { className: 'event-stage-code mono' }, `0${index + 1}`), h('strong', null, item.title)))),
      h('div', { className: 'event-stage-monitor', id: `${uid}-diagnosis`, 'aria-live': 'polite', 'data-stage': stage.id },
        h('div', { className: 'event-scenario' },
          h('span', { className: 'event-lab-kicker' }, stage.subtitle),
          h('p', null, stage.scenario),
          h('div', { className: 'event-charge-shift', 'aria-label': 'Transição da mudança' },
            h('span', null, stage.from), h('span', { 'aria-hidden': true }, '→'), h('span', null, stage.to)),
          h('p', { className: 'event-lab-helper' }, stage.shift)),
        h('div', { className: 'event-criteria' },
          h('ul', { 'aria-label': 'Critérios do Evento da Estória' }, checks.map(check => h('li', { key: check.id, 'data-criterion': check.id, 'data-active': check.active },
            h('span', { className: 'event-criterion-led', 'aria-hidden': true }),
            h('div', null, h('strong', null, check.title), h('span', { className: 'event-criterion-status' }, check.active ? 'Presente' : 'Não estabelecido'), h('p', null, check.detail))))),
          h(LabMeter, { id: `${uid}-criteria-meter`, title: 'Critérios presentes', value: count, max: checks.length })),
        h('p', { className: `event-verdict${count === checks.length ? ' complete' : ''}` }, verdict))),
    h('section', { className: 'event-lab-panel', 'aria-labelledby': `${uid}-values-title` },
      h('div', { className: 'event-panel-heading' },
        h('div', null, h('span', { className: 'event-lab-kicker mono' }, 'Experimento II'), h('h4', { id: `${uid}-values-title` }, 'Inverter a carga dos valores')),
        h('button', { type: 'button', className: 'event-invert-all', onClick: invertAll }, '⇄ Inverter todas as cargas')),
      h('p', { className: 'event-lab-helper' }, 'Os 12 pares aparecem no trecho, incluindo os exemplos morais e éticos. Alterne os polos para visualizar a reversão de carga; ela é parte da definição, e precisa acontecer na vida de alguém através do conflito.'),
      h('div', { className: 'event-values-grid', role: 'group', 'aria-label': 'Valores binários da estória' }, values.map(value => {
        const positive = polarities[value.id];
        return h('button', { key: value.id, type: 'button', className: 'event-value-card', 'data-value': value.id, 'aria-pressed': positive,
          'aria-label': `Alternar ${value.positive} e ${value.negative}. Atual: ${positive ? value.positive : value.negative} (${positive ? 'positivo' : 'negativo'})`, onClick: () => togglePolarity(value.id) },
        h('span', { className: 'event-value-pole mono' }, positive ? '+ Positivo' : '− Negativo'),
        h('span', { className: 'event-value-pair' }, h('span', { className: positive ? 'active' : undefined }, value.positive),
          h('span', { 'aria-hidden': true }, '⇄'), h('span', { className: !positive ? 'active' : undefined }, value.negative)));
      }))),
    h('section', { className: 'event-lab-panel', 'aria-labelledby': `${uid}-conflicts-title` },
      h('span', { className: 'event-lab-kicker mono' }, 'Experimento III'),
      h('h4', { id: `${uid}-conflicts-title` }, 'As forças em Lágrimas do Céu'),
      h('p', { className: 'event-lab-helper' }, 'Ative ou retire camadas do exemplo. Cada escolha abre o estágio 4 e atualiza o diagnóstico acima. As quatro camadas recompõem o exemplo completo; um Evento da Estória pode ter conflito significativo sem reunir todas elas.'),
      h('div', { className: 'event-conflicts-grid', role: 'group', 'aria-label': 'Camadas de conflito em Lágrimas do Céu' }, conflicts.map(conflict => h('button', {
        key: conflict.id, type: 'button', className: 'event-conflict-card', 'data-conflict': conflict.id, 'aria-pressed': activeConflicts.has(conflict.id), onClick: () => toggleConflict(conflict.id),
      }, h('span', { className: 'event-conflict-heading' }, h('strong', null, conflict.title), h('span', null, activeConflicts.has(conflict.id) ? 'Ativo ●' : 'Inativo ○')),
      h('span', { className: 'event-conflict-target' }, conflict.target), h('span', { className: 'event-conflict-description' }, conflict.description)))),
      h('div', { className: 'event-conflict-feedback', 'aria-live': 'polite' },
        h(LabMeter, { id: `${uid}-conflict-meter`, title: 'Camadas selecionadas', value: activeConflicts.size, max: conflicts.length }),
        h('p', null, activeConflicts.size === conflicts.length ? 'As quatro forças descritas no exemplo estão presentes.'
          : activeConflicts.size ? `${activeConflicts.size} de 4 camadas ativas. O exemplo está reduzido, mas a luta permanece.`
          : 'Nenhuma camada de conflito selecionada. O exercício agora isola a chuva como coincidência.'))));
}
