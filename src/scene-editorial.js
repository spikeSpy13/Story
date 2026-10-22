import React from 'react';
import './concept-editorial.css';
import './scene-editorial.css';

const h = React.createElement;
const placements = {
  value: {
    layout: 'float-left',
    src: '/images/chapter-02/teste-de-valor-cena.jpeg',
    width: 1856, height: 2304,
    alt: 'Duas folhas de roteiro: uma passa do positivo ao negativo ao lado de uma caneta; a outra mantém a carga positiva e é descartada em uma cesta de lixo.',
    caption: 'O teste de rigor do roteirista: se a carga de valor não se altera entre o início e o fim, a cena é um não evento.',
  },
  genres: {
    layout: 'wide',
    src: '/images/chapter-02/contraste-de-generos-cena.jpeg',
    width: 2752, height: 1536,
    alt: 'Díptico com um homem saltando de um edifício em chamas e um mordomo segurando uma bandeja em um salão. Sob ambos, uma gangorra indica a virada do positivo ao negativo.',
    caption: 'Valores públicos vs. valores interiores: da explosão física ao silêncio de um salão inglês, toda cena verdadeira exige uma virada.',
  },
  locations: {
    layout: 'wide',
    src: '/images/chapter-02/quatro-locacoes-cena.jpeg',
    width: 3168, height: 1344,
    alt: 'Quarto, cozinha, garagem e estrada conectados por uma linha que começa no positivo e termina no negativo, junto a um carro com a porta aberta e uma pessoa se afastando.',
    caption: 'Quatro posições de câmera, mas uma única Cena: a atividade atravessa o quarto, a cozinha e a garagem, mas só se torna ação no Ponto de Virada na estrada.',
  },
};

export function SceneMedia({ placement }) {
  const media = placements[placement];
  return h('figure', { className: `scene-media scene-media--${media.layout}`, 'data-scene-media': placement },
    h('img', { className: 'scene-editorial-image', src: media.src, alt: media.alt,
      width: media.width, height: media.height, loading: 'lazy', decoding: 'async' }),
    h('figcaption', null, media.caption));
}

export function formatSceneDefinitionSegment(text) {
  return text.split(/(CENA|EVENTO DA ESTÓRIA)/g).map((part, i) => {
    const className = part === 'CENA' ? 'scene-definition-term' : part === 'EVENTO DA ESTÓRIA' ? 'scene-key-emphasis' : null;
    return className ? h('span', { key: i, className }, part) : part;
  });
}
