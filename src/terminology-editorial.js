import React from 'react';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-700.css';
import '@fontsource/eb-garamond/latin-400.css';
import '@fontsource/eb-garamond/latin-500.css';
import '@fontsource/eb-garamond/latin-700.css';
import '@fontsource/eb-garamond/latin-400-italic.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import './terminology-editorial.css';

const h = React.createElement;
const placements = {
  opening: {
    layout: 'wide',
    src: '/images/chapter-02/abertura-2-1.jpeg',
    width: 2752, height: 1536,
    alt: 'Ilustração em traços pretos: um observador usa uma lente para transformar um emaranhado de lembranças, casas, estrelas e um violão em linhas que convergem para um quadro.',
    caption: 'A arte da estrutura: selecionar apenas alguns momentos para entregar uma vida inteira.',
  },
  conflict: {
    layout: 'float',
    src: '/images/chapter-02/niveis-de-conflito-2-1.jpeg',
    width: 1856, height: 2304,
    alt: 'Círculos concêntricos representam os níveis de conflito: uma mente no centro, relações entre pessoas, instituições e forças do ambiente, com uma cidade, um raio e um relógio.',
    caption: 'Os níveis de conflito: do intracraniano às forças do ambiente.',
  },
  motel: {
    layout: 'wide', ratio: '21 / 9',
    label: 'Espaço de Imagem 03 — Panorâmica Cinematográfica (21:9)',
    suggestion: 'Fotografia still do filme A Força do Carinho (1983) em preto e branco ou tons desbotados, mostrando Mac Sledge (Robert Duvall) no motel isolado do Texas, ou uma ilustração de um motel solitário numa estrada vazia.',
    caption: 'Robert Duvall como Mac Sledge em A Força do Carinho (1983): o passado inteiro sugerido nas entrelinhas do presente.',
  },
};

export function TerminologyMedia({ placement }) {
  const media = placements[placement];
  return h('figure', { className: `terminology-media terminology-media--${media.layout}` },
    media.src ? h('img', {
      className: 'terminology-image', src: media.src, alt: media.alt,
      width: media.width, height: media.height, fetchpriority: 'high', decoding: 'async',
    }) : h('div', { className: 'terminology-placeholder', style: { aspectRatio: media.ratio } },
      h('span', { className: 'terminology-placeholder-tag' }, media.label),
      h('p', null, h('strong', null, 'Sugestão visual: '), media.suggestion)),
    h('figcaption', null, media.caption));
}
