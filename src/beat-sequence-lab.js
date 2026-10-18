import React, { useId, useLayoutEffect, useState } from 'react';
import './beat-sequence-lab.css';

const h = React.createElement;
const beats = [
  { number: 1, location: 'Quarto · despertador', behavior: 'Brincadeira', actionActor: 'Chris', action: 'Caçoa de Andy quando o despertador toca.', reactionActor: 'Andy', reaction: 'Responde na mesma moeda.' },
  { number: 2, location: 'Quarto · enquanto se vestem', behavior: 'Insultos', actionActor: 'Chris e Andy', action: 'A brincadeira vira sarcasmo.', reactionActor: 'Andy e Chris', reaction: 'Insultam-se mutuamente enquanto se vestem.' },
  { number: 3, location: 'Cozinha', behavior: 'Ameaças e desafios', actionActor: 'Chris', action: 'Ameaça que Andy seria miserável se ela o deixasse.', reactionActor: 'Andy', reaction: 'Entende o blefe e diz que adoraria essa miséria.' },
  { number: 4, location: 'Garagem', behavior: 'Súplicas e ridicularizações', actionActor: 'Chris', action: 'Com medo de perdê-lo, implora para que fique.', reactionActor: 'Andy', reaction: 'Ri e ridiculariza seu apelo.' },
  { number: 5, location: 'Carro em movimento', behavior: 'Violência', actionActor: 'Chris', action: 'Fecha o punho e soca a boca de Andy.', reactionActor: 'O casal', reaction: 'A troca vira briga, seguida pelo barulho de uma freada.' },
  { number: 6, location: 'Acostamento', behavior: 'Decisão e choque', actionActor: 'Andy', action: 'Sai com o nariz sangrando, bate a porta e grita “acabou!”.', reactionActor: 'Chris', reaction: 'Fica chocada, em perplexidade perturbada.', turned: true },
];
const scenes = [
  { number: 1, title: 'Hotel no West Side', scope: 'Autoconfiança / dúvida',
    shifts: ['− Dúvida → + Autoconfiança'], catalyst: 'O telefonema da mãe faz Barbara perceber que precisa desse trabalho e reencontrar sua confiança.',
    steps: ['Barbara se prepara para a festa, mas teme ser humilhada pelas candidatas de Nova Iorque.', 'Roupas e cabelo parecem impossíveis de acertar; ela decide fazer as malas.', 'A mãe telefona, desejando sorte e queixando-se de solidão e abandono.', 'Barbara encontra uma combinação de roupas e se vê confiante no espelho.'] },
  { number: 2, title: 'Marquise e Central Park', scope: 'Vida / morte · autoconfiança',
    shifts: ['− Risco de morte → + Sobrevivência', '+ Autoconfiança → − Derrota'], catalyst: 'Sem táxi e com risco de perder a festa, ela decide atravessar o parque e enfrenta a gangue.',
    steps: ['A tempestade e a falta de táxis ameaçam sua chegada à festa.', 'Barbara escolhe atravessar o Central Park à noite e é cercada por uma gangue.', 'Usa o que aprendeu no caratê e sai do parque viva.', 'No balanço do trecho, a sobrevivência vem acompanhada da perda de autoconfiança diante de seu estado.'] },
  { number: 3, title: 'Lobby e cobertura no East Side', scope: 'Fracasso / sucesso social',
    shifts: ['− Desastre social → + Triunfo social', '− Ainda sem o novo cargo → ++ Conquista o trabalho'], catalyst: 'Certa de que perdeu, Barbara relaxa, assume sua personalidade e conta a batalha no parque com humor.',
    steps: ['No espelho do lobby, ela vê o jornal no cabelo e o sangue dos bandidos nas roupas.', 'As outras candidatas chegam elegantes e a ajudam com roupas que não combinam.', 'Na cobertura, ela relaxa e conta sua aventura com um chutzpah que desconhecia.', 'Os executivos reconhecem sua calma diante do terror; ela consegue o trabalho e termina em triunfo pessoal e social.'], climax: true },
];

export default function BeatSequenceLab({ mode = 'full', onReady }) {
  const uid = useId();
  const [beatIndex, setBeatIndex] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [design, setDesign] = useState('sequence');
  useLayoutEffect(() => { onReady?.(); }, [onReady]);
  const showBeats = mode !== 'sequence-only';
  const showSequence = mode !== 'beat-only';
  const beat = beats[beatIndex], scene = scenes[sceneIndex];
  const title = mode === 'beat-only' ? 'Os seis beats de Chris e Andy' : mode === 'sequence-only' ? 'As três cenas de Barbara' : 'Do beat ao clímax da sequência';

  return h('aside', { className: 'beat-sequence-lab', 'aria-labelledby': `${uid}-title`, 'data-interactive': 'beat-sequence-lab', 'data-mode': mode },
    h('header', { className: 'bs-lab-header' },
      h('span', { className: 'bs-kicker mono' }, 'Laboratório · beat → cena → sequência'),
      h('h3', { id: `${uid}-title` }, title),
      h('p', null, 'Trocas de ação e reação moldam a virada de uma cena. Cenas constroem uma sequência cujo clímax produz um impacto maior.'),
      h('ol', { className: 'bs-hierarchy', 'aria-label': 'Hierarquia do design narrativo' },
        h('li', null, h('strong', null, 'Beat'), h('span', null, 'Ação e reação')),
        h('li', null, h('strong', null, 'Cena'), h('span', null, 'Mudança significativa de valor')),
        h('li', null, h('strong', null, 'Sequência'), h('span', null, 'Geralmente duas a cinco cenas · impacto maior'))),
      h('p', { className: 'bs-helper' }, 'Exercício complementar. Os painéis sintetizam os exemplos do capítulo.')),
    showBeats ? h('section', { className: 'bs-panel', 'aria-labelledby': `${uid}-beat-title` },
      h('span', { className: 'bs-kicker' }, 'Microestrutura'),
      h('h4', { id: `${uid}-beat-title` }, 'Ação e reação, beat a beat'),
      h('details', { className: 'bs-terminology' },
        h('summary', null, 'Beat estrutural e [beat] no diálogo'),
        h('div', { className: 'bs-terminology-grid' },
          h('div', null, h('h5', null, 'Beat da estória'), h('p', null, 'Uma mudança de comportamento que ocorre por ação e reação. É o menor elemento da estrutura dentro da cena.')),
          h('div', null, h('h5', null, '[beat] na coluna de diálogo'), h('p', null, 'Uma indicação de “pausa curta”. O trecho distingue essa rubrica do beat estrutural.')))),
      h('div', { className: 'bs-beat-options', role: 'group', 'aria-label': 'Seis beats de Chris e Andy' }, beats.map((item, i) => h('button', {
        key: item.number, type: 'button', 'data-beat': item.number, 'aria-pressed': beatIndex === i, 'aria-controls': `${uid}-exchange`, onClick: () => setBeatIndex(i),
      }, h('span', { className: 'bs-kicker' }, `Beat 0${item.number}`), h('strong', null, item.behavior), h('small', null, item.location)))),
      h('div', { className: 'bs-exchange-monitor', id: `${uid}-exchange`, 'aria-live': 'polite', 'data-turned': Boolean(beat.turned) },
        h('div', { className: 'bs-exchange' },
          h('div', null, h('span', { className: 'bs-kicker' }, `Ação · ${beat.actionActor}`), h('p', { className: 'bs-action' }, beat.action)),
          h('span', { className: 'bs-exchange-arrow', 'aria-hidden': true }, '⇄'),
          h('div', null, h('span', { className: 'bs-kicker' }, `Reação · ${beat.reactionActor}`), h('p', { className: 'bs-reaction' }, beat.reaction))),
        h('div', { className: 'bs-beat-status' },
          h('p', null, h('strong', null, 'Comportamento: '), beat.behavior),
          h('p', { className: 'bs-scene-charge' }, beat.turned ? '− Separados · Ponto de Virada da cena' : '+ Ainda juntos · a virada da cena está por acontecer'))),
      h('p', { className: 'bs-helper' }, 'Os seis beats moldam uma única cena. A decisão de Andy e a reação de Chris encerram o relacionamento.')) : null,
    showSequence ? h(React.Fragment, null,
      h('section', { className: 'bs-panel', 'aria-labelledby': `${uid}-sequence-title` },
        h('span', { className: 'bs-kicker' }, 'Macroestrutura'),
        h('h4', { id: `${uid}-sequence-title` }, '“Conseguir o trabalho” · Barbara em Nova Iorque'),
        h('p', { className: 'bs-helper' }, 'Barbara tem uma carreira no Meio-Oeste e disputa um novo cargo. Cada cena transforma valores locais; a terceira conclui a conquista do trabalho em Nova Iorque.'),
        h('div', { className: 'bs-macro-banner', 'aria-live': 'polite', 'data-climax': Boolean(scene.climax) },
          h('span', { className: 'bs-kicker' }, 'Valor maior da sequência · o trabalho'),
          h('strong', { className: 'bs-macro-state' }, scene.climax ? '++ Conquista o trabalho em Nova Iorque' : '− Ainda sem o trabalho em Nova Iorque')),
        h('div', { className: 'bs-scene-options', role: 'group', 'aria-label': 'Cenas da sequência de Barbara' }, scenes.map((item, i) => h('button', {
          key: item.number, type: 'button', 'data-scene': item.number, 'aria-pressed': sceneIndex === i, 'aria-controls': `${uid}-scene`, onClick: () => setSceneIndex(i),
        }, h('span', { className: 'bs-kicker' }, `Cena 0${item.number}${item.climax ? ' · clímax' : ''}`), h('strong', null, item.title), h('small', null, item.scope)))),
        h('div', { className: 'bs-sequence-monitor', id: `${uid}-scene`, 'aria-live': 'polite' },
          h('div', { className: 'bs-scene-outline' }, h('span', { className: 'bs-kicker' }, `Cena 0${scene.number} · acontecimentos`),
            h('ol', null, scene.steps.map((step, i) => h('li', { key: i }, step)))),
          h('div', { className: 'bs-scene-diagnosis' },
            h('div', null, h('h5', null, 'Mudança local da cena'), h('ul', { className: 'bs-local-shifts' }, scene.shifts.map(shift => h('li', { key: shift }, shift)))),
            h('div', null, h('h5', null, 'Catalisador'), h('p', { className: 'bs-catalyst' }, scene.catalyst)),
            h('div', null, h('h5', null, 'Impacto na sequência'), h('p', { className: 'bs-sequence-impact' }, scene.climax
              ? 'Clímax da sequência: o triunfo social faz com que ela conquiste o trabalho. O desfecho é pessoal e social, duplamente positivo.'
              : 'A cena prepara a conquista, mas o trabalho em Nova Iorque ainda não foi obtido.'))))),
      h('section', { className: 'bs-panel', 'aria-labelledby': `${uid}-design-title` },
        h('span', { className: 'bs-kicker' }, 'Decisão de design'),
        h('h4', { id: `${uid}-design-title` }, 'Uma entrevista ou uma sequência completa?'),
        h('div', { className: 'bs-design-options', role: 'group', 'aria-label': 'Escopo da contratação de Barbara' },
          [['interview', 'Uma cena de entrevista'], ['sequence', 'Sequência de três cenas']].map(([id, label]) => h('button', {
            key: id, type: 'button', 'aria-pressed': design === id, 'aria-controls': `${uid}-design`, onClick: () => setDesign(id),
          }, label))),
        h('div', { className: 'bs-design-result', id: `${uid}-design`, 'aria-live': 'polite', 'data-design': design },
          h('h5', null, design === 'interview' ? 'Resolver a contratação em uma cena' : 'Dramatizar a conquista em três cenas'),
          h('p', null, design === 'interview'
            ? 'O texto propõe que a passagem para o trabalho poderia ser alcançada com uma única entrevista. Esse recorte poderia mostrar que ela é qualificada para o cargo.'
            : 'A sequência também leva Barbara ao trabalho e, ao mesmo tempo, dramatiza seu caráter interno e sua relação com a mãe, com um panorama da cidade e da corporação.'),
          design === 'sequence' ? h('ul', { className: 'bs-design-gains' }, ['Caráter interno', 'Relação com a mãe', 'Panorama de Nova Iorque', 'Corporação'].map(item => h('li', { key: item }, item))) : null))) : null,
    mode !== 'full' ? h('footer', { className: 'bs-lab-footer' }, h('a', { href: mode === 'beat-only' ? '#2.1.5' : '#2.1.4' }, mode === 'beat-only' ? 'Continuar na sequência de Barbara →' : '← Retomar os seis beats de Chris e Andy')) : null);
}
