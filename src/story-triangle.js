import React, { useId, useRef, useState } from 'react';
import { triangleAxes, triangleDefinition, triangleModels } from './story-triangle-data.js';
import { filmDossiers } from './film-dossiers.js';
import './story-triangle.css';

const h = React.createElement;

export function StoryTriangle({ image, onOpen, onOpenFilm }) {
  const uid = useId();
  const [vertex, setVertex] = useState('arquitrama');
  const [mode, setMode] = useState('interactive');
  const [axisId, setAxisId] = useState(null);
  const selectedFeature = useRef(null);
  const model = triangleModels.find(item => item.id === vertex);
  const axis = triangleAxes.find(item => item.id === axisId);
  const selectVertex = id => {
    if (id !== vertex) { setVertex(id); setAxisId(null); }
  };
  const vertexButton = item => h('button', {
    key: item.id, type: 'button', className: `story-vertex${vertex === item.id ? ' is-active' : ''}`,
    'aria-pressed': vertex === item.id, 'aria-label': `${item.title} — ${item.name}`,
    onClick: () => selectVertex(item.id),
    onPointerEnter: e => { if (e.pointerType === 'mouse') selectVertex(item.id); },
  }, h('span', { className: 'story-vertex-title' }, item.title), h('span', { className: 'story-vertex-name' }, item.name));
  const closeComparison = () => {
    setAxisId(null);
    selectedFeature.current?.focus({ preventScroll: true });
  };

  return h('figure', { className: 'section-illustration fig-diagram story-triangle', 'data-illustration': image.number, 'aria-label': 'Triângulo da estória interativo' },
    h('div', { className: 'story-triangle-toolbar' },
      h('span', { className: 'story-triangle-label' }, 'Figura do triângulo'),
      h('div', { className: 'story-triangle-modes', role: 'group', 'aria-label': 'Visualização do triângulo' },
        [['interactive', 'Explorar vértices'], ['original', 'Diagrama original']].map(([id, label]) => h('button', {
          key: id, type: 'button', 'aria-pressed': mode === id, onClick: () => setMode(id),
        }, label)))),
    mode === 'interactive' ? h(React.Fragment, null,
      h('div', { className: 'story-triangle-stage', role: 'group', 'aria-label': 'Vértices e princípios do triângulo' },
        vertexButton(triangleModels[0]),
        h('div', { className: 'story-triangle-canvas' },
          h('svg', { viewBox: '0 0 800 520', preserveAspectRatio: 'none', className: 'story-triangle-svg', 'aria-hidden': true },
            h('defs', null, triangleModels.map((item, i) => h('radialGradient', { key: item.id, id: `${uid}-${item.id}`, cx: ['50%', '5%', '95%'][i], cy: ['0%', '95%', '95%'][i], r: '85%' },
              h('stop', { offset: '0%', className: 'triangle-glow-start' }), h('stop', { offset: '100%', className: 'triangle-glow-end' })))),
            h('polygon', { points: '400,18 28,500 772,500', fill: `url(#${uid}-${vertex})`, className: 'story-triangle-polygon' }),
            [[400, 18], [28, 500], [772, 500]].map(([cx, cy], i) => h('circle', {
              key: i, cx, cy, r: vertex === triangleModels[i].id ? 7 : 4, className: `story-triangle-dot${vertex === triangleModels[i].id ? ' active' : ''}`,
            }))),
          h('div', { className: 'story-triangle-focus' },
            h('span', { className: 'story-triangle-badge' }, model.name),
            h('ul', { className: 'story-feature-list', 'aria-label': `Princípios de ${model.name}` }, model.axes.map(item => h('li', { key: item.id },
              h('button', { type: 'button', className: 'story-feature', 'aria-pressed': axisId === item.id, 'aria-controls': `${uid}-comparison`,
                onClick: e => { selectedFeature.current = e.currentTarget; setAxisId(item.id); } }, item.labels[vertex])))),
            h('span', { className: 'story-triangle-hint' }, 'Selecione um princípio para comparar os vértices.'))),
        h('div', { className: 'story-base-vertices' }, triangleModels.slice(1).map(vertexButton))),
      h('div', { className: 'story-triangle-inspector', id: `${uid}-comparison`, 'aria-live': 'polite' },
        axis ? h(React.Fragment, null,
          h('div', { className: 'story-inspector-heading' },
            h('div', null, h('span', { className: 'story-triangle-label' }, axis.title), h('h4', null, axis.labels[vertex])),
            h('button', { type: 'button', className: 'story-comparison-close', onClick: closeComparison }, 'Voltar ao vértice')),
          h('p', { className: 'story-source-excerpt' }, triangleDefinition(axis, vertex)),
          h('dl', { className: 'story-axis-comparison' }, triangleModels.map(item => h('div', { key: item.id, className: item.id === vertex ? 'is-active' : undefined },
            h('dt', null, item.name), h('dd', null, axis.labels[item.id] || 'Não indicado neste vértice')))),
          h('p', { className: 'story-source-reference' }, `Contraste desenvolvido na seção ${axis.section}.`))
          : h(React.Fragment, null,
            h('h4', null, `${model.title} — ${model.name}`),
            h('p', { className: 'story-source-excerpt' }, model.excerpt),
            h('span', { className: 'story-triangle-hint' }, 'Trecho da seção 2.2.1.'))),
      h('details', { className: 'story-film-catalog' },
        h('summary', null, `Exemplos no cinema — ${model.name} (${model.films.length})`),
        h('p', { className: 'story-triangle-hint' }, 'Filmes citados nesta seção. Selecione outro vértice para mudar a lista.'),
        h('ul', { className: 'story-film-list', 'aria-label': `Filmes de ${model.name}` }, model.films.map(film => h('li', { key: film.title },
          filmDossiers.some(item => item.title === film.title) && onOpenFilm
            ? h('button', { type: 'button', className: 'story-film-dossier', onClick: event => onOpenFilm(filmDossiers.find(item => item.title === film.title).id, event), 'aria-haspopup': 'dialog',
              'aria-label': `Abrir dossiê de ${film.title} (${film.info})` },
              h('strong', null, film.title), h('span', null, film.info), h('small', null, filmDossiers.find(item => item.title === film.title).label))
            : h(React.Fragment, null, h('strong', null, film.title), h('span', null, film.info)))))))
      : h('div', { className: 'story-original-diagram' },
        h('button', { type: 'button', className: 'fig-frame fig-zoom-trigger', style: { aspectRatio: `${image.width} / ${image.height}` }, onClick: () => onOpen(image), 'aria-label': 'Ampliar diagrama original' },
          h('img', { src: image.src, alt: image.alt, width: image.width, height: image.height, loading: 'lazy', decoding: 'async' }),
          h('span', { className: 'fig-zoom-badge mono', 'aria-hidden': true }, 'Ampliar'))),
    h('figcaption', { className: 'fig-caption story-triangle-caption' },
      h('span', { className: 'fig-num mono' }, `FIG. ${image.number}`), h('span', { className: 'fig-text' }, image.alt)));
}
