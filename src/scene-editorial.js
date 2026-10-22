import React from 'react';
import './concept-editorial.css';
import './scene-editorial.css';

const h = React.createElement;
const placements = {
  value: {
    layout: 'float-left', ratio: '4 / 5',
    label: 'Espaço de Imagem 01 — Vertical (4:5)',
    suggestion: h(React.Fragment, null, 'Ilustração de bolso (spot illustration) em bico de pena estilo ', h('em', null, 'The New Yorker'), ': duas folhas de roteiro lado a lado. A primeira página mostra um arco de “[+]” no topo para “[−]” no rodapé, aprovada por uma caneta-tinteiro; a segunda página marca “[+]” no topo e “[+]” no rodapé (um não evento), sendo arremessada amassada em uma cesta de lixo de arame.'),
    caption: 'O teste de rigor do roteirista: se a carga de valor não se altera entre o início e o fim, a cena é um não evento.',
  },
  genres: {
    layout: 'wide', ratio: '16 / 9',
    label: 'Espaço de Imagem 02 — Horizontal (16:9)',
    suggestion: h(React.Fragment, null, 'Ilustração editorial em díptico (dividida ao meio) em traço de nanquim. Na metade esquerda, a silhueta vertiginosa de um herói de ação saltando de um edifício em chamas (', h('em', null, 'Duro de Matar'), '); na metade direita, um mordomo inglês impecável segurando uma bandeja de prata num salão silencioso (', h('em', null, 'Vestígios do Dia'), '). Abaixo de ambos, o mesmo mecanismo de gangorra/pêndulo vira de [+] para [−], mostrando que a lei da virada dramática é idêntica nos dois extremos.'),
    caption: 'Valores públicos vs. valores interiores: da explosão física ao silêncio de um salão inglês, toda cena verdadeira exige uma virada.',
  },
  locations: {
    layout: 'wide', ratio: '21 / 9',
    label: 'Espaço de Imagem 03 — Panorâmica Cinematográfica (21:9)',
    suggestion: 'Friso panorâmico contínuo (estilo Saul Steinberg) mostrando um corte arquitetônico horizontal com quatro ambientes conectados por uma única linha de tensão: (1) uma cama desfeita no quarto, (2) um bule de café fumegante na cozinha, (3) a porta aberta da garagem e (4) um carro parado no acostamento da rodovia à direita, onde a porta bate e uma silhueta caminha sozinha, rompendo a linha de [+] para [−].',
    caption: 'Quatro posições de câmera, mas uma única Cena: a atividade atravessa o quarto, a cozinha e a garagem, mas só se torna ação no Ponto de Virada na estrada.',
  },
};

export function SceneMedia({ placement }) {
  const media = placements[placement];
  return h('figure', { className: `scene-media scene-media--${media.layout}`, 'data-scene-media': placement },
    h('div', { className: 'scene-image-placeholder', style: { aspectRatio: media.ratio } },
      h('span', { className: 'scene-placeholder-tag' }, media.label),
      h('p', null, h('strong', null, 'Sugestão visual: '), media.suggestion)),
    h('figcaption', null, media.caption));
}

export function formatSceneDefinitionSegment(text) {
  return text.split(/(CENA|EVENTO DA ESTÓRIA)/g).map((part, i) => {
    const className = part === 'CENA' ? 'scene-definition-term' : part === 'EVENTO DA ESTÓRIA' ? 'scene-key-emphasis' : null;
    return className ? h('span', { key: i, className }, part) : part;
  });
}
