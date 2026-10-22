import React from 'react';
import './structure-editorial.css';

const h = React.createElement;
const placements = {
  composition: {
    layout: 'wide', ratio: '16 / 9',
    label: 'Espaço de Imagem 01 — Horizontal (16:9)',
    suggestion: h(React.Fragment, null, 'Ilustração em bico de pena estilo ', h('em', null, 'The New Yorker'), ' onde uma pauta de partitura musical se transforma gradualmente em uma tira de película cinematográfica. Mãos de um compositor/montador selecionam certos quadros/notas com uma tesoura ou compasso, descartando o excesso no chão.'),
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
    h('div', { className: 'structure-image-placeholder', style: { aspectRatio: media.ratio } },
      h('span', { className: 'structure-placeholder-tag' }, media.label),
      h('p', null, h('strong', null, 'Sugestão visual: '), media.suggestion)),
    h('figcaption', null, media.caption));
}
