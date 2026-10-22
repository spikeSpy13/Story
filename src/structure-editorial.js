import React from 'react';
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
    layout: 'float-left', ratio: '4 / 5',
    label: 'Espaço de Imagem 02 — Vertical (4:5)',
    suggestion: 'Gravura minimalista (spot illustration) de uma balança de precisão antiga ou um diapasão duplo equilibrando um coração humano estilizado (emoção) e um labirinto geométrico/olho (ideia/ponto de vista).',
    caption: 'A estratégia dupla: evitar tanto a autoindulgência emocional quanto o solipsismo intelectual.',
  },
};

export function StructureMedia({ placement }) {
  const media = placements[placement];
  return h('figure', { className: `structure-media structure-media--${media.layout}` },
    media.src ? h('img', {
      className: 'structure-editorial-image', src: media.src, alt: media.alt,
      width: media.width, height: media.height, loading: 'lazy', decoding: 'async',
    }) : h('div', { className: 'structure-image-placeholder', style: { aspectRatio: media.ratio } },
      h('span', { className: 'structure-placeholder-tag' }, media.label),
      h('p', null, h('strong', null, 'Sugestão visual: '), media.suggestion)),
    h('figcaption', null, media.caption));
}
