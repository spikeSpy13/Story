import React from 'react';
import './concept-editorial.css';
import './event-editorial.css';

const h = React.createElement;
const placements = {
  polarity: {
    layout: 'float-right',
    src: '/images/chapter-02/polaridade-valores-evento.jpeg',
    width: 1856, height: 2304,
    alt: 'Carta ilustrada dividida diagonalmente: uma pessoa de braços erguidos e um pássaro livre no polo positivo; uma figura invertida atrás de grades no polo negativo.',
    caption: 'Cargas binárias da experiência: a reversão constante entre o polo positivo e o negativo.',
  },
  monsoon: {
    layout: 'wide',
    src: '/images/chapter-02/seca-chuva-evento.jpeg',
    width: 2752, height: 1536,
    alt: 'Uma janela mostra solo rachado e árvore seca à esquerda, chuva, vegetação e animais à direita. Dois dados no peitoril representam o acaso.',
    caption: 'Da morte à vida pela janela: mesmo carregada de valor, uma mudança causada apenas pelo acaso ainda não constitui um Evento da Estória.',
  },
  rainmaker: {
    layout: 'wide',
    src: '/images/chapter-02/fazedor-de-chuvas-evento.jpeg',
    width: 3168, height: 1344,
    alt: 'Ilustração panorâmica de um homem de chapéu com os braços erguidos e uma vara, diante de nuvens de chuva sobre a terra seca; uma fazenda e um moinho aparecem ao fundo.',
    caption: h(React.Fragment, null, 'Bill Starbuck (Burt Lancaster) em ', h('em', null, 'Lágrimas do Céu'), ' (', h('em', null, 'The Rainmaker'), ', 1956): a chuva arrancada através do embate entre fé, dúvida, sociedade e natureza.'),
  },
};

export function EventMedia({ placement }) {
  const media = placements[placement];
  return h('figure', { className: `event-media event-media--${media.layout}`, 'data-event-media': placement },
    h('img', { className: 'event-editorial-image', src: media.src, alt: media.alt,
      width: media.width, height: media.height, loading: 'lazy', decoding: 'async' }),
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
