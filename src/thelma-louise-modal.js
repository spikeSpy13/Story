import React, { useId, useState } from 'react';
import FilmDossierDialog from './film-dossier-dialog.js';
import { thelmaLouiseSource as pdf, milestones, pillars, partnership, gaps, endings, finalStages, legacy } from './thelma-louise-data.js';
import './thelma-louise-modal.css';

const h = React.createElement;
const tabs = [['structure', '1. Estrutura'], ['pillars', '2. Arquitrama'], ['ending', '3. Brechas e final'], ['legacy', '4. Contexto e legado']];
const filters = [['all', 'Todos · 7'], ['I', 'Ato I · 1–2'], ['II', 'Ato II · 3–5'], ['III', 'Ato III · 6–7']];
const source = pages => h('a', { className: 'tl-source', href: `${pdf}#page=${pages[0]}`, target: '_blank', rel: 'noopener noreferrer' },
  `Consultar análise · ${pages.length === 1 ? 'p.' : 'pp.'} ${pages.join(', ')} ↗`);
const card = (title, text) => h('section', { key: title, className: 'tr-card' }, h('h4', null, title), h('p', null, text));

function Choices({ items, selected, onSelect, label, controls, prefix }) {
  return h('div', { className: 'tr-filters', role: 'group', 'aria-label': label }, items.map((item, i) => h('button', {
    key: item.title, type: 'button', 'aria-pressed': selected === i, 'aria-controls': controls,
    [`data-${prefix}`]: i, onClick: () => onSelect(i),
  }, item.title)));
}

export default function ThelmaLouiseModal({ onClose, returnFocus, fontSize }) {
  const uid = useId();
  const [activeTab, setActiveTab] = useState('structure');
  const [filter, setFilter] = useState('all'), [milestone, setMilestone] = useState(1);
  const [role, setRole] = useState(0), [gap, setGap] = useState(0), [ending, setEnding] = useState(2);
  const [stage, setStage] = useState(0), [legacyIndex, setLegacyIndex] = useState(3);
  const filtered = filter === 'all' ? milestones : milestones.filter(item => item.act === filter);
  const index = filtered.findIndex(item => item.num === milestone);
  const current = filtered[index] || filtered[0];
  const roles = partnership[role], breach = gaps[gap], variant = endings[ending], finalStage = finalStages[stage], influence = legacy[legacyIndex];
  const chooseFilter = value => {
    setFilter(value);
    setMilestone((value === 'all' ? milestones : milestones.filter(item => item.act === value))[0].num);
  };

  return h(FilmDossierDialog, {
    title: 'Thelma e Louise', eyebrow: 'Dossiê complementar · Ridley Scott · Callie Khouri',
    tabs, activeTab, onTabChange: setActiveTab, onClose, returnFocus, fontSize,
    provenance: 'Thelma & Louise · EUA/1991. Síntese da análise enviada, em 19 páginas. As divisões dramáticas e as interpretações pertencem ao material de estudo; o texto de Story permanece preservado.',
    source: { href: pdf, label: 'Consultar o PDF original · 19 páginas ↗' },
  },
  activeTab === 'structure' ? h(React.Fragment, null,
    h('h3', null, 'Sete marcos de uma fuga'),
    h('p', { className: 'tr-meta' }, 'Uma leitura por blocos dramáticos, do passeio ao desfiladeiro. Os marcos reúnem passagens do filme; não correspondem a uma lista completa de cenas.'),
    h('div', { className: 'tr-filters', role: 'group', 'aria-label': 'Atos da análise' }, filters.map(([id, label]) => h('button', {
      key: id, type: 'button', 'data-act': id, 'aria-pressed': filter === id, 'aria-controls': `${uid}-milestones ${uid}-milestone`, onClick: () => chooseFilter(id),
    }, label))),
    h('div', { className: 'tr-scene-strip tl-milestones', id: `${uid}-milestones`, role: 'group', 'aria-label': 'Marcos disponíveis no ato' }, filtered.map(item => h('button', {
      key: item.num, type: 'button', 'data-milestone': item.num, 'aria-label': `Marco ${item.num}: ${item.title}`,
      'aria-pressed': current.num === item.num, 'aria-controls': `${uid}-milestone`, onClick: () => setMilestone(item.num),
    }, String(item.num).padStart(2, '0')))),
    h('div', { className: 'tr-scene-nav', role: 'group', 'aria-label': 'Navegação pelos marcos filtrados' },
      h('button', { type: 'button', disabled: index <= 0, onClick: () => setMilestone(filtered[index - 1].num) }, '← Marco anterior'),
      h('span', null, `${index + 1} / ${filtered.length}`),
      h('button', { type: 'button', disabled: index >= filtered.length - 1, onClick: () => setMilestone(filtered[index + 1].num) }, 'Próximo marco →')),
    h('article', { id: `${uid}-milestone`, className: 'tl-milestone', 'data-milestone': current.num, 'aria-live': 'polite' },
      h('div', { className: 'tl-milestone-heading' }, h('span', { className: 'tl-number', 'aria-hidden': true }, String(current.num).padStart(2, '0')),
        h('div', null, h('span', { className: 'tr-kicker' }, `Ato ${current.act}`), h('h3', null, current.title))),
      h('div', { className: 'tl-stack' }, card('O que acontece', current.action), card('Mudança de valor', current.value), card('Função estrutural', current.function)),
      source(current.pages))) : null,

  activeTab === 'pillars' ? h(React.Fragment, null,
    h('h3', null, 'A forma clássica da subversão'),
    h('p', { className: 'tr-meta' }, 'O filme usa a progressão causal da Arquitrama para transformar quem ocupa o centro da aventura. Sete pilares organizam a leitura proposta pelo PDF.'),
    h('div', { className: 'tr-grid' }, pillars.map((item, i) => h('section', { key: item.title, className: 'tr-card', 'data-pillar': i + 1 },
      h('span', { className: 'tr-kicker' }, `Pilar ${i + 1}`), h('h4', null, item.title), h('p', null, item.text), source(item.pages)))),
    h('h3', null, 'Duas personagens, um centro dramático'),
    h(Choices, { items: partnership, selected: role, onSelect: setRole, label: 'Etapas da parceria', controls: `${uid}-partnership`, prefix: 'role' }),
    h('section', { id: `${uid}-partnership`, className: 'tl-partnership', 'data-role': role, 'aria-live': 'polite' },
      h('div', { className: 'tr-grid' }, card('Thelma', roles.thelma), card('Louise', roles.louise)),
      h('p', { className: 'tl-insight' }, roles.meaning), source(roles.pages))) : null,

  activeTab === 'ending' ? h(React.Fragment, null,
    h('h3', null, 'A brecha entre expectativa e resultado'),
    h('p', { className: 'tr-meta' }, 'Uma ação enfrenta uma resposta que muda o campo de possibilidades. A nova escolha tenta resolver o problema e pode elevar seu custo.'),
    h(Choices, { items: gaps, selected: gap, onSelect: setGap, label: 'Brechas dramáticas', controls: `${uid}-gap`, prefix: 'gap' }),
    h('section', { id: `${uid}-gap`, className: 'tl-gap', 'data-gap': gap, 'aria-live': 'polite' },
      h('div', { className: 'tl-three' }, card('Expectativa', breach.expectation), card('Resultado', breach.result), card('Novo risco', breach.risk)), source(breach.pages)),
    h('h3', null, 'Decidir, respirar, agir'),
    h(Choices, { items: finalStages, selected: stage, onSelect: setStage, label: 'Momentos do desfecho', controls: `${uid}-final-stage`, prefix: 'stage' }),
    h('section', { id: `${uid}-final-stage`, className: 'tr-card tl-final-stage', 'data-stage': stage, 'aria-live': 'polite' },
      h('h4', null, finalStage.title), h('p', null, finalStage.text), source(finalStage.pages)),
    h('h3', null, 'Três finais, três estatutos diferentes'),
    h(Choices, { items: endings, selected: ending, onSelect: setEnding, label: 'Versões do final', controls: `${uid}-ending`, prefix: 'ending' }),
    h('section', { id: `${uid}-ending`, className: 'tr-card tl-ending', 'data-ending': ending, 'aria-live': 'polite' },
      h('span', { className: 'tr-kicker' }, variant.status), h('h4', null, variant.title), h('p', null, variant.text), source(variant.pages))) : null,

  activeTab === 'legacy' ? h(React.Fragment, null,
    h('h3', null, 'Tradições e desdobramentos'),
    h('p', { className: 'tr-meta' }, 'Antecedentes e comparações discutidos na análise. Motivos semelhantes permitem comparar obras; não estabelecem, por si, uma influência direta.'),
    h('div', { className: 'tr-legacy-options', role: 'group', 'aria-label': 'Obras no contexto e legado' }, legacy.map((item, i) => h('button', {
      key: item.title, type: 'button', 'data-legacy': i, 'aria-pressed': legacyIndex === i, 'aria-controls': `${uid}-legacy`, onClick: () => setLegacyIndex(i),
    }, h('span', null, item.year), h('strong', null, item.title)))),
    h('section', { className: 'tr-card tr-legacy-result', id: `${uid}-legacy`, 'data-legacy': legacyIndex, 'aria-live': 'polite' },
      h('span', { className: 'tr-kicker' }, `${influence.year} · ${influence.relation}`), h('h4', null, influence.title), h('p', null, influence.text), source(influence.pages)),
    h('h3', null, 'Ironia, paisagem e memória cultural'),
    h('div', { className: 'tl-stack' },
      card('O compromisso chega tarde', 'A proposta de Jimmy oferece a Louise algo que poderia ter desejado antes. A mudança de circunstâncias torna o antigo objetivo incompatível com a situação presente: a satisfação esperada já não resolve o conflito.'),
      card('O deserto como arena', 'Na leitura do PDF, a estrada deixa de ser apenas deslocamento. O horizonte, o caminhoneiro recorrente e o desfiladeiro ampliam a dimensão simbólica das escolhas, sem mudar as regras do mundo ficcional.'),
      card('Recepção e permanência', 'A análise recorda a capa da Time de 24 de junho de 1991, o Oscar de roteiro original recebido por Callie Khouri em 1992 e associações posteriores com Tori Amos, a crítica de Marita Sturken e debates sobre violência e autonomia das mulheres.')),
    source([11, 12, 14, 15]),
    h('p', { className: 'tl-insight' }, 'A forma clássica pode sustentar uma perspectiva subversiva. O protagonismo plural concentra a ação; um final fechado pode negar o triunfo físico convencional.'),
    source([15, 16]),
    h('details', { className: 'tr-production' }, h('summary', null, 'Fonte e bibliografia'),
      h('p', null, 'Este dossiê sintetiza o PDF enviado. As referências reunidas pelo documento estão disponíveis no original, a partir da página 16.'), source([16, 17, 18, 19]))) : null);
}
