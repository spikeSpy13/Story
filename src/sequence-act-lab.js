import React, { useId, useLayoutEffect, useState } from 'react';
import './sequence-act-lab.css';

const h = React.createElement;
const scenes = [
  {
    title: 'Hotel no West Side', location: 'Quarto de hotel · o telefonema da mãe',
    values: [
      ['confidence', 'Autoconfiança / dúvida', '+ Autoconfiança', 'A dúvida inicial cede à confiança depois do telefonema.', 'positive'],
      ['life', 'Vida / morte', 'Ainda não está em jogo', 'O conflito desta cena é a preparação para a festa.', 'neutral'],
      ['social', 'Sucesso / desastre social', 'Ainda não testado', 'O encontro com as outras candidatas ainda está por vir.', 'neutral'],
    ],
    steps: [
      'Barbara se prepara, mas teme a humilhação diante das candidatas de Nova Iorque.',
      'Insatisfeita com as roupas e o cabelo, decide fazer as malas e voltar para casa.',
      'A mãe telefona, desejando sorte e queixando-se de solidão e abandono.',
      'Barbara percebe que precisa do trabalho, encontra uma combinação de roupas e encara o espelho confiante.',
    ],
    catalyst: 'Ao comparar a mãe ao “grande tubarão”, Barbara percebe que as “piranhas de Manhattan” não são páreo para ela. A conversa devolve sua confiança.',
  },
  {
    title: 'Marquise e Central Park', location: 'Tempestade · travessia do parque à noite',
    values: [
      ['confidence', 'Autoconfiança / dúvida', '+ Autoconfiança → − Derrota', 'No balanço do trecho, ela sobrevive, mas sua aparência provoca a derrota pessoal diante do espelho do lobby.', 'negative'],
      ['life', 'Vida / morte', '− Risco de morte → + Vida', 'Ela enfrenta a gangue com o que aprendeu no caratê e sai viva do parque.', 'positive'],
      ['social', 'Sucesso / desastre social', 'À beira do desastre social', 'O jornal no cabelo e o sangue nas roupas preparam o contraste com as outras candidatas.', 'negative'],
    ],
    steps: [
      'Sem táxi na tempestade, Barbara procura uma maneira de chegar à festa no East Side.',
      'Contornar o parque não a levaria à festa em tempo. Ela decide atravessá-lo à noite.',
      'Cercada por uma gangue, usa suas aulas de caratê para reagir e sobreviver.',
      'A sobrevivência tem um contraponto: na passagem ao lobby, sua imagem no espelho transforma autoconfiança em derrota.',
    ],
    catalyst: 'A travessia coloca a vida em risco; o caratê permite a sobrevivência. Na transição ao lobby, a aparência de Barbara derruba a confiança conquistada no hotel.',
  },
  {
    title: 'Lobby e cobertura', location: 'East Side · o clímax da sequência', climax: true,
    values: [
      ['confidence', 'Autoconfiança / dúvida', '− Derrota → + Triunfo pessoal', 'Ao achar que já perdeu, relaxa e assume sua personalidade com chutzpah.', 'positive'],
      ['life', 'Vida / morte', '+ Viva após a travessia', 'A batalha no parque torna-se o relato que ela conta na festa.', 'positive'],
      ['social', 'Sucesso / desastre social', '− Desastre → + Triunfo social', 'Seu humor e sua calma impressionam os executivos.', 'positive'],
    ],
    steps: [
      'No espelho do lobby, ela vê o jornal no cabelo e o sangue dos bandidos nas roupas.',
      'As outras candidatas chegam elegantes e lhe emprestam roupas que não combinam.',
      'Certa de que perdeu a vaga, relaxa e conta a luta no parque fazendo piadas.',
      'Os executivos reconhecem sua calma diante do terror: ela conquista o trabalho e termina em triunfo pessoal e social.',
    ],
    catalyst: 'O abandono da pose revela seu caráter. O triunfo social faz com que ela conquiste o trabalho: o valor maior se inverte no clímax da sequência.',
  },
];

const magnitudes = [
  { id: 'scene', title: 'Cena', degree: 'Mudança menor, significativa',
    example: 'No quarto do hotel', shift: 'Dúvida → Autoconfiança',
    scope: 'A cena altera o estado emocional de Barbara para enfrentar a noite. A conquista do trabalho ainda está em aberto.',
    depth: 'Uma mudança local verdadeira; a cena seguinte pode reverter esse valor.' },
  { id: 'sequence', title: 'Sequência', degree: 'Mudança moderada, de impacto maior',
    example: '“Conseguir o trabalho”', shift: 'Sem o novo trabalho → Conquista do trabalho',
    scope: 'Geralmente de duas a cinco cenas culminam num impacto maior do que o das cenas anteriores. Aqui, confiança, sobrevivência e sucesso social servem à conquista do cargo.',
    depth: 'O clímax resolve o valor maior que dá propósito às três cenas.' },
  { id: 'act', title: 'Ato', degree: 'Mudança maior, grande reversão',
    example: 'Uma série de sequências', shift: 'Grande reversão de valores',
    scope: 'As sequências culminam numa cena climática de impacto mais poderoso. A mudança pode atingir a vida interior, os relacionamentos pessoais, o mundo da personagem ou uma combinação desses planos.',
    depth: 'Um impacto maior não significa, por si só, irreversibilidade. Esta caracteriza o clímax final da estória.' },
];

function RouteDiagram({ route }) {
  return h('svg', { className: 'sa-route-map', viewBox: '0 0 400 250', role: 'img', 'aria-label': route === 'across'
    ? 'Esquema: o trajeto escolhido cruza o Central Park entre o hotel no oeste e a festa no leste.'
    : 'Esquema: o trajeto alternativo desce ao sul do Central Park e volta ao norte, no lado leste.' },
    h('rect', { x: 125, y: 25, width: 150, height: 165, rx: 14, className: 'sa-map-park' }),
    h('text', { x: 200, y: 82, textAnchor: 'middle' }, 'CENTRAL'),
    h('text', { x: 200, y: 103, textAnchor: 'middle' }, 'PARK'),
    h('path', { d: 'M 55 130 L 345 130', className: `sa-map-route${route === 'across' ? ' sa-map-active' : ''}` }),
    h('path', { d: 'M 55 130 L 90 130 L 90 217 L 310 217 L 310 130 L 345 130', className: `sa-map-route${route === 'around' ? ' sa-map-active' : ''}` }),
    [55, 345].map(x => h('circle', { key: x, cx: x, cy: 130, r: 6, fill: 'currentColor' })),
    h('text', { x: 55, y: 109, textAnchor: 'middle' }, 'Hotel'),
    h('text', { x: 345, y: 109, textAnchor: 'middle' }, 'Festa'),
    h('text', { x: 55, y: 158, textAnchor: 'middle' }, 'Oeste'),
    h('text', { x: 345, y: 158, textAnchor: 'middle' }, 'Leste'));
}

export default function SequenceToActLab({ onReady }) {
  const uid = useId();
  const [sceneIndex, setSceneIndex] = useState(2);
  const [route, setRoute] = useState('across');
  const [design, setDesign] = useState('sequence');
  const [magnitudeIndex, setMagnitudeIndex] = useState(1);
  useLayoutEffect(() => { onReady?.(); }, [onReady]);
  const scene = scenes[sceneIndex], magnitude = magnitudes[magnitudeIndex];

  return h('aside', { className: 'sequence-act-lab', 'aria-labelledby': `${uid}-title`, 'data-interactive': 'sequence-act-lab' },
    h('header', { className: 'sa-header' },
      h('span', { className: 'sa-kicker' }, 'Laboratório · sequência → ato'),
      h('h3', { id: `${uid}-title` }, 'Valores locais, impacto maior'),
      h('p', null, 'Uma sequência reúne mudanças de cena em torno de um valor maior. Explore a conquista de Barbara e compare os graus de mudança na arquitetura da estória.'),
      h('p', { className: 'sa-helper' }, 'Exercício complementar aos conceitos de sequência e ato. O texto do livro permanece integral acima.')),

    h('section', { className: 'sa-panel', 'aria-labelledby': `${uid}-scenes-title` },
      h('span', { className: 'sa-kicker' }, '01 · Anatomia da sequência'),
      h('h4', { id: `${uid}-scenes-title` }, '“Conseguir o trabalho”'),
      h('p', { className: 'sa-helper' }, 'Barbara já tem uma carreira no Meio-Oeste. O valor em disputa é o novo trabalho em Nova Iorque, conquistado apenas na terceira cena.'),
      h('div', { className: 'sa-options sa-scenes', role: 'group', 'aria-label': 'Cenas da sequência de Barbara' }, scenes.map((item, i) => h('button', {
        key: i, type: 'button', 'data-scene': i + 1, 'aria-pressed': sceneIndex === i, 'aria-controls': `${uid}-values ${uid}-progress`, onClick: () => setSceneIndex(i),
      }, h('span', { className: 'sa-kicker' }, `Cena 0${i + 1}${item.climax ? ' · clímax' : ''}`), h('strong', null, item.title)))),

      h('div', { className: 'sa-values', id: `${uid}-values`, 'aria-live': 'polite', 'data-scene': sceneIndex + 1 },
        h('div', { className: 'sa-value sa-job', 'data-value': 'job', 'data-climax': Boolean(scene.climax) },
          h('span', { className: 'sa-kicker' }, 'Valor maior da sequência · o trabalho'),
          h('strong', { className: 'sa-value-state' }, scene.climax ? '++ Conquista o trabalho em Nova Iorque' : '− Ainda sem o novo trabalho'),
          h('p', null, scene.climax ? 'O triunfo social produz a contratação: desfecho duplamente positivo.' : 'Os valores locais mudam, mas a conquista do cargo permanece em aberto.')),
        scene.values.map(([id, label, state, note, polarity]) => h('div', { key: id, className: 'sa-value', 'data-value': id, 'data-polarity': polarity },
          h('span', { className: 'sa-kicker' }, label),
          h('strong', { className: 'sa-value-state' }, state), h('p', null, note)))),

      sceneIndex === 1 ? h('div', { className: 'sa-route-box' },
        h('h5', null, 'O dilema no mapa de Manhattan'),
        h('p', { className: 'sa-helper' }, 'Compare os caminhos. Esta escolha explica o dilema; o painel de valores continua mostrando a travessia narrada no livro.'),
        h('div', { className: 'sa-options', role: 'group', 'aria-label': 'Caminhos no dilema de Barbara' },
          [['around', 'Contornar o parque'], ['across', 'Atravessar à noite']].map(([id, label]) => h('button', { key: id, type: 'button', 'data-route': id,
            'aria-pressed': route === id, 'aria-controls': `${uid}-route`, onClick: () => setRoute(id) }, label))),
        h('div', { id: `${uid}-route`, 'data-route': route },
          h(RouteDiagram, { route }),
          h('p', { className: 'sa-map-caption' }, 'Esquema do dilema, sem escala.'),
          h('p', { className: 'sa-route-result', 'aria-live': 'polite' }, route === 'around'
            ? 'Alternativa considerada: descer pelo Central Park West, contornar ao sul e subir até o East Side. Segundo o trecho, ela não chegaria à festa em tempo por esse caminho.'
            : 'Caminho escolhido na narrativa: atravessar o Central Park à noite. Barbara arrisca a vida porque o trabalho tem tamanha magnitude para ela.'))): null,

      h('div', { className: 'sa-progress', id: `${uid}-progress`, 'aria-live': 'polite' },
        h('h5', null, scene.location),
        h('ol', { className: 'sa-steps' }, scene.steps.map((step, i) => h('li', { key: i }, step))),
        h('div', { className: 'sa-catalyst' }, h('span', { className: 'sa-kicker' }, 'O que provoca a virada'), h('p', null, scene.catalyst)))),

    h('section', { className: 'sa-panel', 'aria-labelledby': `${uid}-design-title` },
      h('span', { className: 'sa-kicker' }, '02 · Propósito narrativo'),
      h('h4', { id: `${uid}-design-title` }, 'Por que intitular a sequência?'),
      h('p', null, '“Conseguir o trabalho” mantém claro o propósito: passar da falta do novo cargo à sua conquista. O mesmo resultado pode pedir recortes diferentes.'),
      h('div', { className: 'sa-options', role: 'group', 'aria-label': 'Recortes da conquista do trabalho' },
        [['interview', 'Uma cena de entrevista'], ['sequence', 'Sequência de três cenas']].map(([id, label]) => h('button', { key: id, type: 'button', 'aria-pressed': design === id,
          'aria-controls': `${uid}-design`, onClick: () => setDesign(id) }, label))),
      h('div', { className: 'sa-design-result', id: `${uid}-design`, 'aria-live': 'polite', 'data-design': design },
        h('h5', null, design === 'interview' ? 'Uma transição em uma cena' : 'Uma conquista com várias camadas'),
        h('p', null, design === 'interview'
          ? 'McKee propõe que uma única entrevista poderia levá-la ao trabalho e mostrar que ela é qualificada. É uma possibilidade de recorte para esse exemplo.'
          : 'As três cenas também resolvem a contratação e, ao mesmo tempo, dramatizam o caráter interno de Barbara e sua relação com a mãe, com um panorama da cidade e da corporação.'),
        design === 'sequence' ? h('ul', { className: 'sa-gains' }, ['Caráter interno', 'Relação com a mãe', 'Panorama de Nova Iorque', 'Corporação'].map(item => h('li', { key: item }, item))) : null)),

    h('section', { className: 'sa-panel', 'aria-labelledby': `${uid}-magnitude-title` },
      h('span', { className: 'sa-kicker' }, '03 · Progressão de magnitude'),
      h('h4', { id: `${uid}-magnitude-title` }, 'Cena → Sequência → Ato'),
      h('p', { className: 'sa-helper' }, 'Compare graus de mudança. O esquema indica uma hierarquia qualitativa de impacto, sem uma escala numérica.'),
      h('div', { className: 'sa-options sa-magnitudes', role: 'group', 'aria-label': 'Graus de mudança narrativa' }, magnitudes.map((item, i) => h('button', {
        key: item.id, type: 'button', 'data-magnitude': item.id, 'aria-pressed': magnitudeIndex === i, 'aria-controls': `${uid}-magnitude`, onClick: () => setMagnitudeIndex(i),
      }, h('strong', null, item.title), h('span', { className: 'sa-degree' }, item.degree),
      h('span', { className: 'sa-impact-steps', 'aria-hidden': true }, [0, 1, 2].map(step => h('span', { key: step, 'data-filled': step <= i })))))),
      h('div', { className: 'sa-magnitude-result', id: `${uid}-magnitude`, 'aria-live': 'polite', 'data-magnitude': magnitude.id },
        h('span', { className: 'sa-kicker' }, magnitude.degree), h('h5', null, magnitude.example),
        h('p', { className: 'sa-magnitude-shift' }, magnitude.shift), h('p', null, magnitude.scope), h('p', { className: 'sa-helper' }, magnitude.depth))));
}
