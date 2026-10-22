import React from 'react';
import './concept-editorial.css';
import './structure-editorial.css';

const h = React.createElement;
const placements = {
  composition: {
    layout: 'wide',
    src: '/images/chapter-02/composicao-estrutura-2-1.svg',
    width: 1200, height: 675,
    alt: 'Uma pauta musical se transforma em película cinematográfica. Tesoura e compasso delimitam o recorte; notas e fotogramas descartados caem ao chão.',
    caption: 'Compor na arte da estória: escolher o que entra, o que sai e a ordem exata de cada movimento.',
  },
  strategy: {
    layout: 'float-left',
    src: '/images/chapter-02/estrategia-dupla-estrutura-2-1.svg',
    width: 800, height: 1000,
    alt: 'Uma balança com coluna em forma de diapasão equilibra um coração e um olho com íris de labirinto, representando emoção e ponto de vista.',
    caption: 'A estratégia dupla: evitar tanto a autoindulgência emocional quanto o solipsismo intelectual.',
  },
};

export function StructureMedia({ placement }) {
  const media = placements[placement];
  return h('figure', { className: `structure-media structure-media--${media.layout}` },
    h('img', {
      className: 'structure-editorial-image', src: media.src, alt: media.alt,
      width: media.width, height: media.height, loading: 'lazy', decoding: 'async',
    }),
    h('figcaption', null, media.caption));
}
