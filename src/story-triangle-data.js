import chapter from './content/chapter-02.json';

const paragraph = order => chapter.paragraphs.find(p => p.order === order);

// Labels follow figure 01. Definitions and film spellings come from the supplied
// chapter, including its countries and dates rather than external film metadata.
export const triangleAxes = [
  { id: 'causalidade', title: 'Motor narrativo', section: '2.3.6',
    labels: { arquitrama: 'Causalidade', antitrama: 'Coincidência' },
    orders: { arquitrama: 91, antitrama: 92 } },
  { id: 'final', title: 'Resolução', section: '2.3.1',
    labels: { arquitrama: 'Final fechado', minitrama: 'Final aberto' },
    orders: { arquitrama: 72, minitrama: 73 } },
  { id: 'tempo', title: 'Temporalidade', section: '2.3.5',
    labels: { arquitrama: 'Tempo linear', antitrama: 'Tempo não linear' },
    orders: { arquitrama: 86, antitrama: 87 } },
  { id: 'conflito', title: 'Nível de conflito', section: '2.3.2',
    labels: { arquitrama: 'Conflito externo', minitrama: 'Conflito interno' },
    orders: { arquitrama: 75, minitrama: 75 } },
  { id: 'foco', title: 'Foco dramático', section: '2.3.3',
    labels: { arquitrama: 'Protagonista único', minitrama: 'Multi-protagonista' },
    orders: { arquitrama: 77, minitrama: 77 } },
  { id: 'realidade', title: 'Regras do mundo', section: '2.3.7',
    labels: { arquitrama: 'Realidade consistente', antitrama: 'Realidades inconsistentes' },
    orders: { arquitrama: 96, antitrama: 98 } },
  { id: 'protagonista', title: 'Ação do protagonista', section: '2.3.4',
    labels: { arquitrama: 'Protagonista ativo', minitrama: 'Protagonista passivo' },
    orders: { arquitrama: 81, minitrama: 82 } },
];

const filmPattern = /([A-ZÁÀÂÃÉÊÍÓÔÕÚÜÇ0-9½][A-ZÁÀÂÃÉÊÍÓÔÕÚÜÇ0-9½\s,.’–-]*?) \(([^()]+\/\d{4})\)/gu;

export const triangleModels = [
  { id: 'arquitrama', title: 'Design Clássico', name: 'Arquitrama', filmOrder: 67,
    excerpt: paragraph(63).text },
  { id: 'minitrama', title: 'Minimalismo', name: 'Minitrama', filmOrder: 68,
    excerpt: paragraph(65).text.split('Como a palavra sugere, ')[1].split(' Eu chamo')[0] },
  { id: 'antitrama', title: 'Antiestrutura', name: 'Antitrama', filmOrder: 69,
    excerpt: paragraph(66).text.split(' Esse agrupamento')[1].split(' O criador')[0] },
].map(model => ({
  ...model,
  excerpt: model.id === 'minitrama' ? `Como a palavra sugere, ${model.excerpt}`
    : model.id === 'antitrama' ? `Esse agrupamento${model.excerpt}` : model.excerpt,
  axes: triangleAxes.filter(axis => axis.labels[model.id]),
  films: [...paragraph(model.filmOrder).text.matchAll(filmPattern)].map(match => ({ title: match[1].trim(), info: match[2] })),
}));

export function triangleDefinition(axis, modelId) {
  return paragraph(axis.orders[modelId]).text;
}
