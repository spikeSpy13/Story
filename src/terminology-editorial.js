import React from 'react';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-700.css';
import '@fontsource/cormorant-garamond/latin-600-italic.css';
import '@fontsource/eb-garamond/latin-400.css';
import '@fontsource/eb-garamond/latin-500.css';
import '@fontsource/eb-garamond/latin-700.css';
import '@fontsource/eb-garamond/latin-400-italic.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-800.css';
import mariposaMotel from './assets/mariposa-motel-2-1.svg?raw';
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
    layout: 'wide', svg: mariposaMotel,
    caption: h(React.Fragment, null, 'O ', h('em', null, 'Mariposa Motel'), ' em ', h('em', null, 'A Força do Carinho'), ' (1983): o ponto zero onde o passado implícito de Mac Sledge encontra o presente.'),
  },
};

export function TerminologyMedia({ placement }) {
  const media = placements[placement];
  return h('figure', { className: `terminology-media terminology-media--${media.layout}` },
    media.svg ? h('div', { className: 'terminology-vector', dangerouslySetInnerHTML: { __html: media.svg } }) : h('img', {
      className: 'terminology-image', src: media.src, alt: media.alt,
      width: media.width, height: media.height, fetchpriority: 'high', decoding: 'async',
    }),
    h('figcaption', null, media.caption));
}
