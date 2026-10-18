import React, { useId, useLayoutEffect, useState } from 'react';
import './story-climax-lab.css';

const h = React.createElement;
const reversals = [
  { id: 'scene', level: 'Cena', title: 'Chris e Andy', degree: 'Mudança menor',
    turn: '+ Juntos → − Separados', reversible: true,
    outcome: 'Possibilidade: os amantes voltam a viver juntos.',
    explanation: 'McKee lembra que as pessoas podem se apaixonar, perder a paixão e voltar a se apaixonar pela mesma pessoa. A separação de uma cena pode ser revertida.' },
  { id: 'sequence', level: 'Sequência', title: 'O novo trabalho em Nova Iorque', degree: 'Mudança moderada',
    turn: 'Ainda sem o novo trabalho → Contratada', reversible: true,
    outcome: 'Possibilidade: ela descobre que odeia o chefe e deseja voltar para Terre Haute.',
    explanation: 'A conquista da sequência pode perder seu sentido ou sofrer reversão. O desejo de voltar não equivale, por si só, a já ter deixado o cargo.' },
  { id: 'act', level: 'Ato intermediário', title: 'E.T. — O Extraterrestre', degree: 'Mudança maior',
    turn: '+ Vivo → − Morto', reversible: true,
    outcome: 'Possibilidade: E.T. ressuscita em seguida.',
    explanation: 'O trecho usa a morte no clímax do Segundo Ato de E.T. para mostrar que até uma mudança maior pode ser revertida antes do clímax final.' },
  { id: 'story', level: 'Clímax da estória', title: 'O desfecho da executiva', degree: 'Mudança absoluta e irreversível',
    turn: 'Jovem otimista e honesta → Veterana corrupta, cínica e cruel', reversible: false,
    outcome: 'Reversão bloqueada neste modelo: o clímax da estória encerra o arco com uma mudança absoluta e irreversível.',
    explanation: 'A série de atos é construída em função do último clímax. A comparação entre a abertura e o final revela o evento chefe: a transformação que conclui a estória.' },
];

const arc = [
  { id: 'opening', label: 'Abertura', title: 'Conseguir o trabalho',
    career: 'Ainda sem o novo cargo → Contratada em Nova Iorque',
    character: 'Jovem profissional trabalhadora, otimista e honesta.',
    summary: 'Da dúvida à autoconfiança, do perigo à sobrevivência e do desastre social ao sucesso: as três cenas compõem a sequência que lhe dá o trabalho.',
    status: 'A conquista da sequência ainda pode ser revertida.' },
  { id: 'act-one', label: 'Ato I', title: 'A ascensão à presidência',
    career: 'Contratada → Presidente da corporação',
    character: 'O arco acompanha sua ascensão; o trecho não fixa uma nova condição moral neste ponto.',
    summary: 'Na hipótese proposta por McKee, a sequência de abertura estabelece outras sequências que a levam à presidência no clímax do Primeiro Ato.',
    status: 'Uma mudança maior que prepara o ato seguinte e ainda pode ser revertida.' },
  { id: 'act-two', label: 'Ato II', title: 'Traição e demissão',
    career: 'Presidente → Demitida pelo conselho',
    character: 'Amigos e associados se voltam contra ela durante as guerras corporativas.',
    summary: 'As guerras corporativas levam seus amigos e associados à traição. No clímax do Segundo Ato, o conselho a demite e ela vai para a rua.',
    status: 'Esta enorme reversão impulsiona o próximo ato; ainda não é o desfecho absoluto.' },
  { id: 'act-three', label: 'Ato III · final', title: 'Vingança na corporação rival', final: true,
    career: 'Demitida → Topo da rival e destruição dos antigos patrões',
    character: 'Veterana de guerras corporativas corrupta, cínica e cruel.',
    summary: 'Ela entra numa corporação rival e usa os segredos empresariais reunidos enquanto era presidente para chegar ao topo e destruir seus antigos patrões. A vitória profissional conclui um arco de corrupção do caráter.',
    status: 'Clímax da estória: a transformação entre a abertura e o final é absoluta e irreversível.' },
];

const links = [
  { id: 'line', title: 'Frase ou descrição', destination: 'Comportamento, ação e condições para a mudança',
    working: 'Uma frase de diálogo ou linha de descrição muda o comportamento e a ação, ou estabelece condições para a mudança.',
    broken: 'Uma possível falha é acrescentar uma fala ou descrição que não altera a ação nem prepara condições para a mudança.' },
  { id: 'beat', title: 'Beat', destination: 'Constrói a cena',
    working: 'Ação e reação transformam o comportamento, beat a beat, e moldam o ponto de virada da cena.',
    broken: 'Sem progressão do comportamento, as trocas podem se repetir sem construir a virada da cena.' },
  { id: 'scene', title: 'Cena', destination: 'Constrói a sequência',
    working: 'As cenas mudam valores locais e se encadeiam até um impacto maior: confiança, sobrevivência e sucesso social servem à conquista do trabalho.',
    broken: 'As mudanças de cenas podem ficar isoladas, sem se encadear em torno do propósito maior da sequência.' },
  { id: 'sequence', title: 'Sequência', destination: 'Constrói o ato',
    working: 'Séries de sequências preparam uma grande reversão. No arco da executiva, a contratação abre o caminho até a presidência no clímax do Primeiro Ato.',
    broken: 'Sem uma construção pelas sequências, a grande reversão do ato pode parecer pouco preparada.' },
  { id: 'act', title: 'Série de atos', destination: 'Conduz ao clímax da estória',
    working: 'Os atos conduzem ao último clímax. A jovem honesta da abertura e a veterana corrupta do final revelam o grande fluxo de mudança.',
    broken: 'Se os atos não conduzem a uma transformação final absoluta e irreversível, o arco não cumpre o princípio de clímax apresentado neste trecho.' },
];

export default function StoryClimaxLab({ onReady }) {
  const uid = useId();
  const [reversalIndex, setReversalIndex] = useState(3);
  const [attempted, setAttempted] = useState(false);
  const [arcIndex, setArcIndex] = useState(3);
  const [linkIndex, setLinkIndex] = useState(0);
  const [integrity, setIntegrity] = useState('working');
  useLayoutEffect(() => { onReady?.(); }, [onReady]);
  const reversal = reversals[reversalIndex], phase = arc[arcIndex], link = links[linkIndex];
  const result = attempted ? (reversal.reversible ? 'reversible' : 'blocked') : 'untried';

  return h('aside', { className: 'story-climax-lab', 'aria-labelledby': `${uid}-title`, 'data-interactive': 'story-climax-lab' },
    h('header', { className: 'sc-header' },
      h('span', { className: 'sc-kicker' }, 'Laboratório · conceito de estória'),
      h('h3', { id: `${uid}-title` }, 'O evento chefe e o clímax da estória'),
      h('p', null, 'Compare o que muda entre a abertura e o final. Cenas, sequências e atos intermediários podem sofrer reversão; o último clímax conclui a estória com uma mudança absoluta e irreversível.'),
      h('p', { className: 'sc-helper' }, 'Exercício complementar aos cinco parágrafos do livro. Os painéis sintetizam os exemplos e o arco hipotético propostos por McKee.')),

    h('section', { className: 'sc-panel', 'aria-labelledby': `${uid}-reversal-title` },
      h('span', { className: 'sc-kicker' }, '01 · Teste de reversibilidade'),
      h('h4', { id: `${uid}-reversal-title` }, 'O que ainda pode ser revertido?'),
      h('div', { className: 'sc-options sc-reversal-options', role: 'group', 'aria-label': 'Níveis de reversibilidade' }, reversals.map((item, i) => h('button', {
        key: item.id, type: 'button', 'data-reversal': item.id, 'aria-pressed': reversalIndex === i, 'aria-controls': `${uid}-reversal`,
        onClick: () => { setReversalIndex(i); setAttempted(false); },
      }, h('span', { className: 'sc-kicker' }, item.level), h('strong', null, item.title), h('small', null, item.degree)))),
      h('div', { className: 'sc-reversal-result', id: `${uid}-reversal`, 'data-level': reversal.id, 'data-status': result, 'aria-live': 'polite' },
        h('div', { className: 'sc-original-turn' }, h('span', { className: 'sc-kicker' }, 'Mudança provocada pelo evento'), h('strong', null, reversal.turn)),
        h('div', { className: 'sc-attempt-result' },
          h('span', { className: 'sc-kicker' }, attempted ? 'Resultado da tentativa' : 'Antes do teste'),
          h('p', null, attempted ? reversal.outcome : 'Acione o teste para explorar uma possível reversão desta mudança.')),
        h('p', { className: 'sc-reversal-explanation' }, reversal.explanation)),
      h('button', { type: 'button', className: 'sc-test-button', 'aria-controls': `${uid}-reversal`, onClick: () => setAttempted(value => !value) }, attempted ? 'Reiniciar teste' : 'Tentar reverter esta mudança')),

    h('section', { className: 'sc-panel', 'aria-labelledby': `${uid}-arc-title` },
      h('span', { className: 'sc-kicker' }, '02 · O grande arco'),
      h('h4', { id: `${uid}-arc-title` }, 'A executiva de Terre Haute'),
      h('p', { className: 'sc-helper' }, 'Arco hipotético proposto por McKee. Os três atos pertencem a este exemplo; a comparação entre abertura e final mostra o evento chefe.'),
      h('div', { className: 'sc-master-event', 'aria-label': 'Comparação entre abertura e final do arco completo' },
        h('div', { className: 'sc-pole sc-pole-start' }, h('span', { className: 'sc-kicker' }, 'Abertura'), h('strong', null, 'Trabalhadora, otimista e honesta')),
        h('span', { className: 'sc-arc-arrow', 'aria-hidden': true }, '→'),
        h('div', { className: 'sc-pole sc-pole-end' }, h('span', { className: 'sc-kicker' }, 'Final'), h('strong', null, 'Corrupta, cínica e cruel'))),
      h('div', { className: 'sc-options sc-arc-options', role: 'group', 'aria-label': 'Marcos do arco da executiva' }, arc.map((item, i) => h('button', {
        key: item.id, type: 'button', 'data-arc': item.id, 'aria-pressed': arcIndex === i, 'aria-controls': `${uid}-arc`, onClick: () => setArcIndex(i),
      }, h('span', { className: 'sc-kicker' }, item.label), h('strong', null, item.title), h('small', null, item.final ? 'Clímax da estória · irreversível' : 'Mudança ainda reversível')))),
      h('div', { className: 'sc-arc-result', id: `${uid}-arc`, 'data-arc': phase.id, 'data-final': Boolean(phase.final), 'aria-live': 'polite' },
        h('h5', null, `${phase.label} · ${phase.title}`), h('p', { className: 'sc-arc-summary' }, phase.summary),
        h('dl', { className: 'sc-value-comparison' },
          h('div', null, h('dt', { className: 'sc-kicker' }, 'Carreira'), h('dd', { className: 'sc-career-state' }, phase.career)),
          h('div', null, h('dt', { className: 'sc-kicker' }, 'Caráter e relações'), h('dd', { className: 'sc-character-state' }, phase.character))),
        h('p', { className: 'sc-arc-status' }, phase.status))),

    h('section', { className: 'sc-panel', 'aria-labelledby': `${uid}-chain-title` },
      h('span', { className: 'sc-kicker' }, '03 · Do menor elemento ao clímax'),
      h('h4', { id: `${uid}-chain-title` }, 'Cada elo faz seu trabalho'),
      h('p', { className: 'sc-helper' }, 'Inspecione a função de cada elo e uma possível falha de construção. As observações são uma leitura didática da orientação do trecho.'),
      h('div', { className: 'sc-options sc-links', role: 'group', 'aria-label': 'Elos da construção narrativa' }, links.map((item, i) => h('button', {
        key: item.id, type: 'button', 'data-link': item.id, 'aria-pressed': linkIndex === i, 'aria-controls': `${uid}-chain`, onClick: () => setLinkIndex(i),
      }, h('span', { className: 'sc-link-number', 'aria-hidden': true }, String(i + 1)), item.title))),
      h('div', { className: 'sc-options', role: 'group', 'aria-label': 'Função e falha do elo selecionado' },
        [['working', 'Elo cumprindo sua função'], ['broken', 'Quando o elo falha']].map(([id, label]) => h('button', {
          key: id, type: 'button', 'data-integrity': id, 'aria-pressed': integrity === id, 'aria-controls': `${uid}-chain`, onClick: () => setIntegrity(id),
        }, label))),
      h('div', { className: 'sc-chain-result', id: `${uid}-chain`, 'data-link': link.id, 'data-integrity': integrity, 'aria-live': 'polite' },
        h('span', { className: 'sc-kicker' }, `${link.title} → ${link.destination}`),
        h('h5', null, integrity === 'working' ? 'Função na construção' : 'Possível falha'),
        h('p', null, link[integrity]))));
}
