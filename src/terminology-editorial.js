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
    layout: 'wide', ratio: '16 / 9',
    label: 'Espaço de Imagem 01 — Abertura (Horizontal / 16:9)',
    suggestion: 'Ilustração editorial minimalista em bico de pena (estilo clássico da New Yorker). Um escritor ou observador olhando através de uma lente que filtra o caos de uma vida inteira em um único feixe focado.',
    caption: 'A arte da estrutura: selecionar apenas alguns momentos para entregar uma vida inteira.',
  },
  conflict: {
    layout: 'float', ratio: '4 / 5',
    label: 'Espaço de Imagem 02 — Vertical (4:5)',
    suggestion: 'Gravura ou diagrama conceitual mostrando círculos concêntricos de conflito: do nível interno (mente) até o ambiente externo (cidade/tempo).',
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
    h('div', { className: 'terminology-placeholder', style: { aspectRatio: media.ratio } },
      h('span', { className: 'terminology-placeholder-tag' }, media.label),
      h('p', null, h('strong', null, 'Sugestão visual: '), media.suggestion)),
    h('figcaption', null, media.caption));
}
