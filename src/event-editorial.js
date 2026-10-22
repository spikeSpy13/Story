import React from 'react';
import './concept-editorial.css';
import './event-editorial.css';

const h = React.createElement;
const placements = {
  polarity: {
    layout: 'float-right', ratio: '4 / 5',
    label: 'Espaço de Imagem 01 — Vertical (4:5)',
    suggestion: h(React.Fragment, null, 'Ilustração de bolso (spot illustration) em bico de pena estilo ', h('em', null, 'The New Yorker'), ': uma carta de baralho clássica ou ampulheta reversível dividida diagonalmente. No topo (+), uma figura humana em luz/liberdade (pássaro voando); na base (−), a mesma figura invertida em sombra/aprisionamento (gaiola), ilustrando a reversão binária da experiência humana.'),
    caption: 'Cargas binárias da experiência: a reversão constante entre o polo positivo e o negativo.',
  },
  monsoon: {
    layout: 'wide', ratio: '16 / 9',
    label: 'Espaço de Imagem 02 — Horizontal (16:9)',
    suggestion: 'Ilustração editorial em nanquim de uma janela emoldurando a paisagem da África Oriental. A vista através da vidraça é dividida ao meio: na metade esquerda, solo rachado, árvores secas e sol inclemente (−); na metade direita, uma monção repentina fazendo brotar vegetação e animais (+). No peitoril da janela, um dado jogado simboliza que a chuva caiu por mero acaso (coincidência).',
    caption: 'Da morte à vida pela janela: mesmo carregada de valor, uma mudança causada apenas pelo acaso ainda não constitui um Evento da Estória.',
  },
  rainmaker: {
    layout: 'wide', ratio: '21 / 9',
    label: 'Espaço de Imagem 03 — Panorâmica Cinematográfica (21:9)',
    suggestion: h(React.Fragment, null, 'Fotografia still adaptada em bico de pena do filme ', h('em', null, 'Lágrimas do Céu'), ' (', h('em', null, 'The Rainmaker'), ', 1956), mostrando Bill Starbuck (Burt Lancaster) de braços erguidos com sua vareta/baqueta diante de um céu imenso e árido do Meio-Oeste, ou na fazenda da família Curry (Katharine Hepburn), enfrentando o vento quente antes da tempestade.'),
    caption: h(React.Fragment, null, 'Bill Starbuck (Burt Lancaster) em ', h('em', null, 'Lágrimas do Céu'), ' (', h('em', null, 'The Rainmaker'), ', 1956): a chuva arrancada através do embate entre fé, dúvida, sociedade e natureza.'),
  },
};

export function EventMedia({ placement }) {
  const media = placements[placement];
  return h('figure', { className: `event-media event-media--${media.layout}`, 'data-event-media': placement },
    h('div', { className: 'event-image-placeholder', style: { aspectRatio: media.ratio } },
      h('span', { className: 'event-placeholder-tag' }, media.label),
      h('p', null, h('strong', null, 'Sugestão visual: '), media.suggestion)),
    h('figcaption', null, media.caption));
}

// Decorate the source segments without changing their text or style metadata.
export function formatEventDefinitionSegment(paragraph, text, index) {
  const term = paragraph.text.startsWith('VALORES DA ESTÓRIA') ? 'VALORES DA ESTÓRIA'
    : paragraph.text.startsWith('UM EVENTO DA ESTÓRIA') ? 'UM EVENTO DA ESTÓRIA' : 'Um Evento da Estória';
  const ranges = [{ start: 0, end: term.length, className: 'event-definition-term' }];
  const emphasis = paragraph.order === 12 ? 'VALOR' : paragraph.order === 18 ? 'ALCANÇADA ATRAVÉS DO CONFLITO' : null;
  if (emphasis) {
    const start = paragraph.text.indexOf(emphasis);
    if (start >= 0) ranges.push({ start, end: start + emphasis.length, className: 'event-key-emphasis' });
  }
  const offset = paragraph.segments.slice(0, index).reduce((sum, segment) => sum + segment.text.length, 0);
  const boundaries = new Set([0, text.length]);
  for (const range of ranges) {
    for (const point of [range.start, range.end]) {
      if (point > offset && point < offset + text.length) boundaries.add(point - offset);
    }
  }
  const cuts = [...boundaries].sort((a, b) => a - b);
  return cuts.slice(0, -1).map((start, i) => {
    const content = text.slice(start, cuts[i + 1]);
    const range = ranges.find(range => offset + start >= range.start && offset + start < range.end);
    return range ? h('span', { key: i, className: range.className }, content) : content;
  });
}
