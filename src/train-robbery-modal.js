import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { trainRobberyMeta as meta, trainRobberyScenes as scenes, trainRobberyPillars as pillars, trainRobberyLegacy as legacy } from './train-robbery-data.js';
import { triangleModels } from './story-triangle-data.js';
import './train-robbery-modal.css';

const h = React.createElement;
const tabs = [['scenes', '1. Decupagem'], ['pillars', '2. Arquitrama'], ['paradox', '3. Atrações e narrativa'], ['legacy', '4. Legado']];
const filters = [['all', 'Todas · 14'], ['ato1', 'Assalto · 1–4'], ['ato2a', 'Saque e fuga · 5–9'], ['ato2b', 'Resgate e baile · 10–11'], ['ato3', 'Clímax · 12–13'], ['epilogo', 'Realism · 14']];
const paradoxes = [
  { title: 'Cenas 9–10 · sobreposição temporal', scene: 10,
    text: 'O corte da fuga no vale para o escritório retoma outro grupo de personagens. O dossiê aproxima essa organização da leitura de Charles Musser sobre sobreposição temporal: o resgate e a mobilização se articulam ao roubo e convergem na perseguição. Isso difere da alternância rápida e recorrente entre ações simultâneas associada à montagem paralela posterior.' },
  { title: 'Cena 11 · a atração dentro da narrativa', scene: 11,
    text: 'A dança e os disparos aos pés do forasteiro oferecem um pequeno espetáculo de vaudeville. A chegada do telegrafista converte os participantes em perseguidores. A leitura proposta pelo material relaciona essa atração, na perspectiva de Tom Gunning, à sua integração na cadeia narrativa discutida por Musser.' },
  { title: 'Cena 14 · Realism e o espectador', scene: 14,
    text: 'O homem que dispara contra a lente interpela diretamente a plateia. O quadro era apresentado como destacável, podendo abrir ou encerrar a projeção. O núcleo narrativo já pode ser lido como concluído na Cena 13; esse gesto emblemático abre outra relação com o espectador.' },
];

export default function TrainRobberyModal({ onClose, returnFocus, fontSize }) {
  const uid = useId();
  const dialogRef = useRef(null), closeRef = useRef(null), bodyRef = useRef(null), tabRefs = useRef([]);
  const [activeTab, setActiveTab] = useState('scenes');
  const [filter, setFilter] = useState('all');
  const [sceneNumber, setSceneNumber] = useState(1);
  const [legacyIndex, setLegacyIndex] = useState(0);
  const filtered = filter === 'all' ? scenes : scenes.filter(scene => scene.phase === filter);
  const sceneIndex = filtered.findIndex(scene => scene.num === sceneNumber);
  const scene = filtered[sceneIndex] || filtered[0];
  const influence = legacy[legacyIndex];

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = returnFocus || document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousScroll = { left: scrollX, top: scrollY };
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    closeRef.current.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      window.scrollTo(previousScroll);
    };
  }, [returnFocus]);
  useLayoutEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; }, [activeTab]);

  const selectFilter = id => {
    const matches = id === 'all' ? scenes : scenes.filter(item => item.phase === id);
    setFilter(id);
    setSceneNumber(matches[0].num);
  };
  const showScene = num => {
    setFilter('all');
    setSceneNumber(num);
    setActiveTab('scenes');
    tabRefs.current[0]?.focus();
  };
  const moveTab = (event, index) => {
    let target;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) target = (index + 1) % tabs.length;
    else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) target = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = tabs.length - 1;
    if (target === undefined) return;
    event.preventDefault();
    setActiveTab(tabs[target][0]);
    tabRefs.current[target]?.focus();
  };

  return createPortal(h('dialog', {
    ref: dialogRef, className: 'train-dossier', 'aria-labelledby': `${uid}-title`, style: { '--reading-font-size': `${fontSize}px` },
    onCancel: event => { event.preventDefault(); onClose(); },
    onClick: event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    },
    onKeyDown: event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialogRef.current.querySelectorAll('a[href],button:not(:disabled):not([tabindex="-1"])')];
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    },
  },
    h('header', { className: 'tr-header' },
      h('div', null, h('span', { className: 'tr-kicker' }, 'Dossiê complementar · Edwin S. Porter'), h('h2', { id: `${uid}-title` }, 'O Grande Roubo de Trem')),
      h('button', { ref: closeRef, type: 'button', className: 'tr-close', onClick: onClose, 'aria-label': 'Fechar dossiê do filme' }, 'Fechar ×')),
    h('div', { className: 'tr-tabs', role: 'tablist', 'aria-label': 'Seções do dossiê', 'aria-orientation': 'horizontal' }, tabs.map(([id, label], i) => h('button', {
      key: id, ref: el => { tabRefs.current[i] = el; }, id: `${uid}-tab-${id}`, type: 'button', role: 'tab', 'aria-selected': activeTab === id,
      'aria-controls': `${uid}-panel-${id}`, tabIndex: activeTab === id ? 0 : -1, onClick: () => setActiveTab(id), onKeyDown: event => moveTab(event, i),
    }, label))),
    h('div', { className: 'tr-body', ref: bodyRef },
      h('p', { className: 'tr-provenance' }, 'The Great Train Robbery · 1903. Story registra a citação como EUA/1904. Dossiê organizado a partir do material de estudo enviado; as funções de cena e comparações são leituras analíticas.'),
      h('section', { key: activeTab, className: 'tr-panel', role: 'tabpanel', id: `${uid}-panel-${activeTab}`, 'aria-labelledby': `${uid}-tab-${activeTab}` },
        activeTab === 'scenes' ? h(React.Fragment, null,
          h('p', { className: 'tr-meta' }, `${meta.director} · ${meta.duration}. ${meta.structure}.`),
          h('div', { className: 'tr-filters', role: 'group', 'aria-label': 'Blocos dramáticos' }, filters.map(([id, label]) => h('button', {
            key: id, type: 'button', 'data-filter': id, 'aria-pressed': filter === id, 'aria-controls': `${uid}-scenes ${uid}-scene`, onClick: () => selectFilter(id),
          }, label))),
          h('div', { className: 'tr-scene-strip', id: `${uid}-scenes`, role: 'group', 'aria-label': 'Cenas disponíveis no filtro' }, filtered.map(item => h('button', {
            key: item.num, type: 'button', 'data-scene': item.num, 'aria-label': `Cena ${item.num}: ${item.catalogTitle}`, title: item.catalogTitle,
            'aria-pressed': scene.num === item.num, 'aria-controls': `${uid}-scene`, onClick: () => setSceneNumber(item.num),
          }, String(item.num).padStart(2, '0')))),
          h('div', { className: 'tr-scene-nav', role: 'group', 'aria-label': 'Navegação pelas cenas filtradas' },
            h('button', { type: 'button', disabled: sceneIndex <= 0, onClick: () => setSceneNumber(filtered[sceneIndex - 1].num) }, '← Cena anterior'),
            h('span', null, `${sceneIndex + 1} / ${filtered.length}`),
            h('button', { type: 'button', disabled: sceneIndex >= filtered.length - 1, onClick: () => setSceneNumber(filtered[sceneIndex + 1].num) }, 'Próxima cena →')),
          h('div', { className: 'tr-scene-inspector', id: `${uid}-scene`, 'data-scene': scene.num, 'aria-live': 'polite' },
            h('div', { className: 'tr-image-placeholder' },
              h('span', { className: 'tr-kicker' }, `Quadro ${String(scene.num).padStart(2, '0')} · 4:3`),
              h('strong', null, scene.catalogTitle), h('p', null, scene.imageSlot)),
            h('div', { className: 'tr-scene-details' },
              h('span', { className: 'tr-kicker' }, scene.phaseLabel), h('h3', null, `Cena ${scene.num}: ${scene.catalogTitle}`),
              [['Ação dramática', scene.action], ['Leitura estrutural', scene.archplotRole], ['Recursos cinematográficos', scene.technique]].map(([title, text]) => h('section', { key: title, className: 'tr-card' }, h('h4', null, title), h('p', null, text)))))) : null,

        activeTab === 'pillars' ? h(React.Fragment, null,
          h('h3', null, 'Seis eixos de leitura da Arquitrama'),
          h('p', { className: 'tr-meta' }, 'Uma leitura do filme à luz do design clássico. O protagonismo coletivo e a organização temporal mostram nuances da aplicação do modelo a este filme de transição.'),
          h('details', { className: 'tr-production' }, h('summary', null, 'Dados de produção citados no material'),
            h('p', null, `${meta.release}. Orçamento: ${meta.budget}.`)),
          h('div', { className: 'tr-grid' }, pillars.map(item => h('section', { key: item.num, className: 'tr-card', 'data-pillar': item.num },
            h('span', { className: 'tr-kicker' }, `Eixo ${item.num}`), h('h4', null, item.title), h('p', null, item.analysis), h('p', { className: 'tr-meta' }, item.contrast)))),
          h('h3', null, 'Referência ao triângulo de McKee'),
          h('div', { className: 'tr-models' }, triangleModels.map(item => h('section', { key: item.id, className: 'tr-card' },
            h('h4', null, item.name), h('ul', null, item.axes.map(axis => h('li', { key: axis.id }, axis.labels[item.id])))))),
          h('h3', null, 'Antecedentes discutidos no material'),
          h('div', { className: 'tr-grid' },
            h('section', { className: 'tr-card' }, h('h4', null, 'Scott Marble · 1896'), h('p', null, 'O melodrama teatral homônimo fornece um antecedente de título e de situações do universo ferroviário discutido no dossiê.')),
            h('section', { className: 'tr-card' }, h('h4', null, 'Assaltos ferroviários · 1899–1900'), h('p', null, 'O material aproxima o filme dos crimes associados à gangue Wild Bunch de Butch Cassidy, em Wilcox e Tipton. A comparação ajuda a observar os motivos de sinais, cofres, locomotivas e fuga.')))) : null,

        activeTab === 'paradox' ? h(React.Fragment, null,
          h('h3', null, 'Cinema de atrações e integração narrativa'),
          h('p', null, 'O dossiê aproxima o debate de Tom Gunning e André Gaudreault sobre o cinema de atrações da leitura histórica de Charles Musser sobre a construção narrativa. As três passagens permitem explorar como espetáculo e causalidade convivem.'),
          h('div', { className: 'tr-paradoxes' }, paradoxes.map(item => h('section', { key: item.scene, className: 'tr-card', 'data-paradox-scene': item.scene },
            h('h4', null, item.title), h('p', null, item.text), h('button', { type: 'button', className: 'tr-scene-jump', onClick: () => showScene(item.scene) }, `Examinar cena ${item.scene}`))))) : null,

        activeTab === 'legacy' ? h(React.Fragment, null,
          h('h3', null, 'Legado: contextos, citações e comparações'),
          h('p', { className: 'tr-meta' }, 'Explore as relações propostas pelo material: contexto industrial, motivos recorrentes e citações visuais. A semelhança entre obras exige distinguir comparação formal de influência documentada.'),
          h('div', { className: 'tr-legacy-options', role: 'group', 'aria-label': 'Obras e períodos do legado' }, legacy.map((item, i) => h('button', {
            key: item.work, type: 'button', 'data-legacy': i, 'aria-pressed': legacyIndex === i, 'aria-controls': `${uid}-legacy`, onClick: () => setLegacyIndex(i),
          }, h('span', null, item.year), h('strong', null, item.work)))),
          h('section', { className: 'tr-card tr-legacy-result', id: `${uid}-legacy`, 'data-legacy': legacyIndex, 'aria-live': 'polite' },
            h('span', { className: 'tr-kicker' }, influence.axis), h('h4', null, `${influence.work} · ${influence.creator}`), h('p', null, influence.impact),
            h('button', { type: 'button', className: 'tr-scene-jump', onClick: () => showScene(14) }, 'Rever o disparo da cena 14'))) : null))), document.body);
}
