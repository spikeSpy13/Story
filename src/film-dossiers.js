export const filmDossiers = [
  { id: 'train-robbery', title: 'O GRANDE ROUBO DE TREM', citation: 'O GRANDE ROUBO DE TREM (EUA/1904)', label: 'Ver dossiê · 14 cenas ↗' },
  { id: 'thelma-louise', title: 'THELMA E LOUISE', citation: 'THELMA E LOUISE (EUA/1991)', label: 'Ver dossiê · análise ↗' },
];

const escapePattern = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const filmCitationPattern = new RegExp(`(${filmDossiers.map(film => escapePattern(film.citation)).join('|')})`);
