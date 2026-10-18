import React, { useEffect, useId, useRef, useState } from 'react';
import './structure-lab.css';

const h = React.createElement;
const tabs = [
  { id: 'composition', label: '1. Composição' },
  { id: 'event', label: '2. Evento' },
  { id: 'strategy', label: '3. Estratégia' },
];
const events = [
  { id: 'coffee', title: 'Toma café e lê o jornal em silêncio', tag: 'Cotidiano neutro neste exemplo', incidental: true },
  { id: 'letter', title: 'Descobre a carta de traição do sócio', tag: 'Revelação privada' },
  { id: 'toast', title: 'Faz um brinde elogiando a lealdade do sócio no jantar', tag: 'Ação pública' },
  { id: 'traffic', title: 'Fica 40 minutos preso no engarrafamento', tag: 'Passagem de tempo neste exemplo', incidental: true },
];
const eventById = new Map(events.map(event => [event.id, event]));
const layers = [
  { id: 'people', cause: 'Afeta ou é causado por pessoas', effect: 'Delineia personagens',
    fragments: ['Personalidade', 'Atitude', 'Escolhas'],
    explanation: 'Observe quem provoca o acontecimento e como cada pessoa reage. O evento permite revelar o personagem através do que ele faz.' },
  { id: 'setting', cause: 'Está situado em um ambiente', effect: 'Gera imagem, ação e diálogo',
    fragments: ['Clima', 'Imagens', 'Conversas', 'Símbolos'],
    explanation: 'Imagem, ação e diálogo deixam de ser fragmentos soltos quando participam de um acontecimento situado em um ambiente.' },
  { id: 'conflict', cause: 'Retira sua energia de um conflito', effect: 'Produz emoção',
    fragments: ['Forças em oposição', 'Reações', 'Emoção no público'],
    explanation: 'O conflito dá energia ao evento, produzindo emoção nos personagens e também no público. Não basta mostrar uma atividade isolada.' },
];
const strategies = [
  { id: 'feelings', label: 'Apenas sentimentos', badge: 'Risco: autoindulgência', title: 'Expressar não basta: é preciso despertar emoção',
    text: 'A expressão dos sentimentos do escritor pode se tornar autoindulgência se a composição não despertar as emoções do público.' },
  { id: 'balanced', label: 'Estratégia dupla', badge: 'Emoção + ponto de vista', title: 'Envolver o público e tornar uma ideia compreensível',
    text: 'Escolha e ordene os eventos para estimular emoções específicas e expressar um ponto de vista específico. As duas propostas trabalham juntas.' },
  { id: 'ideas', label: 'Apenas ideias', badge: 'Risco: solipsismo', title: 'Expressar uma ideia exige que o público possa segui-la',
    text: 'A expressão das ideias do escritor corre o risco de solipsismo quando o público não consegue acompanhá-las através da estória.' },
];

function sequenceReading(sequence) {
  const letter = sequence.indexOf('letter'), toast = sequence.indexOf('toast');
  if (!sequence.length) return { emotion: 'A sequência está vazia', impact: 'Selecione momentos no fluxo da vida para começar.', idea: 'Sem uma seleção de acontecimentos, ainda não há uma proposta para comparar.' };
  if (letter < 0 || toast < 0) return { emotion: 'A comparação ainda está incompleta', impact: 'Inclua a descoberta da carta e o brinde para comparar o efeito de colocar um antes ou depois do outro.', idea: 'Um momento isolado não permite testar o contraste proposto neste exercício.' };
  return letter < toast
    ? { emotion: 'Suspense e tensão', impact: 'O público já sabe da traição quando ouve o elogio. O brinde pode ganhar um subtexto de dissimulação ou confronto contido.', idea: 'A lealdade pública pode ocultar uma ruptura privada.' }
    : { emotion: 'Surpresa e compaixão', impact: 'O elogio vem antes da revelação. A descoberta posterior pode transformar a confiança demonstrada no jantar em vulnerabilidade.', idea: 'A confiança pode tornar alguém vulnerável à traição.' };
}

export function StructureLab() {
  const uid = useId();
  const tabRefs = useRef([]);
  const labRef = useRef(null);
  const [verticalTabs, setVerticalTabs] = useState(false);
  const [activeTab, setActiveTab] = useState('composition');
  const [sequence, setSequence] = useState(['letter', 'toast']);
  const [layerId, setLayerId] = useState('people');
  const [strategyId, setStrategyId] = useState('balanced');
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setVerticalTabs(entry.contentRect.width <= 560));
    observer.observe(labRef.current);
    return () => observer.disconnect();
  }, []);
  const layer = layers.find(item => item.id === layerId);
  const strategy = strategies.find(item => item.id === strategyId);
  const reading = sequenceReading(sequence);
  const incidental = sequence.filter(id => eventById.get(id).incidental);
  const canInvert = sequence.includes('letter') && sequence.includes('toast');
  const toggleEvent = id => setSequence(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const moveEvent = (id, delta) => setSequence(current => {
    const next = [...current], from = next.indexOf(id), to = from + delta;
    if (from < 0 || to < 0 || to >= next.length) return current;
    [next[from], next[to]] = [next[to], next[from]];
    return next;
  });
  const invertOrder = () => setSequence(current => {
    const next = [...current], letter = next.indexOf('letter'), toast = next.indexOf('toast');
    if (letter < 0 || toast < 0) return current;
    [next[letter], next[toast]] = [next[toast], next[letter]];
    return next;
  });
  const tabKeys = (event, index) => {
    let next;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % tabs.length;
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActiveTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  };
  const panel = (id, ...children) => h('div', {
    id: `${uid}-panel-${id}`, role: 'tabpanel', 'aria-labelledby': `${uid}-tab-${id}`,
    hidden: activeTab !== id, tabIndex: 0, className: 'structure-lab-panel',
  }, ...children);

  return h('aside', { ref: labRef, className: 'structure-lab', 'aria-labelledby': `${uid}-title`, 'data-interactive': 'structure-lab' },
    h('header', { className: 'structure-lab-header' },
      h('span', { className: 'structure-lab-kicker' }, 'Conceito interativo · seção 2.1.1'),
      h('h3', { id: `${uid}-title` }, 'Laboratório de estrutura'),
      h('div', { className: 'structure-lab-tabs', role: 'tablist', 'aria-orientation': verticalTabs ? 'vertical' : 'horizontal', 'aria-label': 'Experimentos de estrutura' }, tabs.map((tab, i) => h('button', {
        key: tab.id, ref: element => { tabRefs.current[i] = element; }, id: `${uid}-tab-${tab.id}`, type: 'button', role: 'tab',
        'aria-selected': activeTab === tab.id, 'aria-controls': `${uid}-panel-${tab.id}`, tabIndex: activeTab === tab.id ? 0 : -1,
        onClick: () => setActiveTab(tab.id), onKeyDown: event => tabKeys(event, i),
      }, tab.label))),
      h('p', { className: 'structure-lab-note' }, 'Exercício complementar. Os momentos e as interpretações abaixo são exemplos didáticos.')),
    panel('composition',
      h('div', { className: 'structure-lab-intro' },
        h('h4', null, 'O que incluir? O que excluir? Colocar antes e depois do quê?'),
        h('p', null, 'Selecione momentos do fluxo da vida e mude a ordem para explorar como a mesma seleção pode sugerir emoções e pontos de vista diferentes.')),
      h('section', { className: 'structure-life-stream', 'aria-label': 'Fluxo da vida do personagem' },
        h('h5', { className: 'structure-label' }, 'Fluxo da vida · incluir ou excluir'),
        h('div', { className: 'structure-event-grid' }, events.map(event => {
          const included = sequence.includes(event.id);
          return h('button', { key: event.id, type: 'button', className: 'structure-event-choice', 'aria-pressed': included,
            'aria-label': `${included ? 'Excluir' : 'Incluir'}: ${event.title}`, onClick: () => toggleEvent(event.id) },
          h('span', { className: 'structure-event-status' }, included ? '✓ Incluído' : '+ Incluir'),
          h('strong', null, event.title), h('small', null, event.tag));
        })),
        h('div', { className: 'structure-selection-feedback', role: 'status' },
          h('p', null, `${sequence.length} de ${events.length} momentos incluídos.`),
          incidental.length ? h('p', { className: 'structure-context-note' }, 'Neste exemplo, o café e o trânsito foram descritos sem conflito ou mudança significativa. O que sua inclusão acrescenta? Em outro contexto, esses mesmos momentos poderiam ganhar uma função dramática.') : null)),
      h('section', { className: 'structure-sequencer', 'aria-label': 'Composição da sequência' },
        h('h5', { className: 'structure-label' }, 'Sua sequência · antes e depois'),
        sequence.length ? h('ol', { className: 'structure-sequence', 'aria-label': 'Sequência composta' }, sequence.map((id, index) => h('li', { key: id, 'data-event': id },
          h('span', { className: 'structure-label' }, `Momento ${index + 1}`),
          h('p', null, eventById.get(id).title),
          h('div', { className: 'structure-move-controls' },
            h('button', { type: 'button', disabled: index === 0, onClick: () => moveEvent(id, -1), 'aria-label': `Mover antes: ${eventById.get(id).title}` }, '↑ Antes'),
            h('button', { type: 'button', disabled: index === sequence.length - 1, onClick: () => moveEvent(id, 1), 'aria-label': `Mover depois: ${eventById.get(id).title}` }, '↓ Depois')))))
          : h('p', { className: 'structure-lab-note' }, 'Nenhum momento selecionado.'),
        h('div', { className: 'structure-sequence-actions' },
          h('button', { type: 'button', className: 'structure-primary-action', disabled: !canInvert, onClick: invertOrder }, '⇄ Inverter ordem dos eventos'),
          h('button', { type: 'button', className: 'structure-reset', onClick: () => setSequence(['letter', 'toast']) }, 'Restaurar sequência'))),
      h('div', { className: 'structure-composition-result', 'aria-live': 'polite' },
        h('div', null, h('span', { className: 'structure-label' }, 'Emoção possível'), h('h5', null, reading.emotion), h('p', null, reading.impact)),
        h('div', null, h('span', { className: 'structure-label' }, 'Ponto de vista possível'), h('h5', null, 'Ideia da sequência'), h('p', null, reading.idea)))),
    panel('event',
      h('div', { className: 'structure-lab-intro' },
        h('h4', null, 'Por que procurar eventos, e não elementos isolados?'),
        h('p', null, 'Explore as três dimensões descritas no texto. Um evento reúne personagens, ambiente, ação, diálogo, conflito e emoção.')),
      h('div', { className: 'structure-atom' },
        h('div', { className: 'structure-atom-choices', role: 'group', 'aria-label': 'Camadas do evento' }, layers.map(item => h('button', {
          key: item.id, type: 'button', 'aria-pressed': item.id === layerId, 'aria-controls': `${uid}-layer`, onClick: () => setLayerId(item.id),
        }, h('span', null, item.cause), h('strong', null, `→ ${item.effect}`)))),
        h('div', { className: 'structure-atom-detail', id: `${uid}-layer`, 'aria-live': 'polite' },
          h('h5', null, layer.effect),
          h('ul', { className: 'structure-fragments' }, layer.fragments.map(fragment => h('li', { key: fragment }, fragment))),
          h('p', null, layer.explanation)))),
    panel('strategy',
      h('div', { className: 'structure-lab-intro' },
        h('h4', null, 'Eventos compostos para fazer o quê?'),
        h('p', null, 'Compare a expressão de sentimentos, a expressão de ideias e a estratégia dupla que procura envolver o público nas duas dimensões.')),
      h('div', { className: 'structure-strategies', role: 'group', 'aria-label': 'Propostas para o design dos eventos' }, strategies.map(item => h('button', {
        key: item.id, type: 'button', 'aria-pressed': item.id === strategyId, 'aria-controls': `${uid}-strategy`, onClick: () => setStrategyId(item.id),
      }, item.label))),
      h('div', { className: 'structure-strategy-feedback', id: `${uid}-strategy`, 'aria-live': 'polite', 'data-strategy': strategy.id },
        h('span', { className: 'structure-label' }, strategy.badge), h('h5', null, strategy.title), h('p', null, strategy.text))),
    h('footer', { className: 'structure-lab-footer' }, 'Exercício interativo · eventos, emoção e ponto de vista.'));
}
