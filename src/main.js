import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/newsreader/latin-400.css';
import '@fontsource/newsreader/latin-600.css';
import '@fontsource/newsreader/latin-400-italic.css';
import '@fontsource/plus-jakarta-sans/latin-400.css';
import '@fontsource/plus-jakarta-sans/latin-500.css';
import '@fontsource/plus-jakarta-sans/latin-600.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import './style.css';
import { outline } from './outline.js';
import chapterOne from './content/chapter-01.json';
import chapterTwo from './content/chapter-02.json';
import overview from './content/chapter-01-overview.json';
import chapterTwoOverview from './content/chapter-02-overview.json';
import illustrations from './content/chapter-01-illustrations.json';
import chapterTwoIllustrations from './content/chapter-02-illustrations.json';
import { Lightbox, ReadingProgress, useReaderPreferences } from './reader-interactions.js';
import { filmDossiers, filmCitationPattern } from './film-dossiers.js';
import { StoryTriangle } from './story-triangle.js';
import { StructureLab } from './structure-lab.js';
import { EventLab } from './event-lab.js';
import { SceneLab } from './scene-lab.js';
import { TerminologyMedia } from './terminology-editorial.js';
const BeatSequenceLab = React.lazy(() => import('./beat-sequence-lab.js'));
const SequenceToActLab = React.lazy(() => import('./sequence-act-lab.js'));
const ActReversalLab = React.lazy(() => import('./act-reversal-lab.js'));
const StoryClimaxLab = React.lazy(() => import('./story-climax-lab.js'));
const PlotDesignLab = React.lazy(() => import('./plot-design-lab.js'));
const filmModals = {
  'train-robbery': React.lazy(() => import('./train-robbery-modal.js')),
  'thelma-louise': React.lazy(() => import('./thelma-louise-modal.js')),
};
const LifeToToldStoryLab = React.lazy(() => import('./life-told-lab.js'));

const h = React.createElement;
const BOOK = { title: 'Story', subtitle: 'Substância, Estrutura, Estilo e os Princípios da Escrita de Roteiro', author: 'Robert McKee' };
const chapters = new Map([chapterOne, chapterTwo].map(chapter => [chapter.id, chapter]));
const standaloneSections = new Set(['2.1', '2.2']);
const allIllustrations = [...illustrations.placements, ...chapterTwoIllustrations.placements];
const illustrationsBefore = new Map(allIllustrations.filter(image => image.beforeParagraph).map(image => [image.beforeParagraph, image]));
const illustrationsAfter = new Map(allIllustrations.filter(image => image.afterParagraph).map(image => [image.afterParagraph, image]));
const paragraphIds = new Set([...chapters.values()].flatMap(chapter => chapter.paragraphs.map(p => p.id)));
const definitionKinds = new Map([
  ['para_623a47582d0186c0041853f2', 'structure'],
  ['para_fed4cec1614a2e62c7485c2e', 'event'],
  ['para_4717144eeb7835968f90abca', 'event'],
  ['para_bb47c23774f57ec677db6828', 'event'],
  ['para_15b395fb28a72d10dd8ed13c', 'scene'],
  ['para_06bc5c449360ff7b2e1ebc1e', 'beat'],
  ['para_fbb41c4d0e279214141d7a29', 'sequence'],
  ['para_cb4004c37f2df97f3c306374', 'act'],
  ['para_23f2b6be9eaf6ecff8f37c89', 'story'],
  ['para_ca8c57e7515c96c558907aff', 'plot'],
]);
const nodes = { '': { id: '', title: BOOK.title, level: 0, parent: null, children: [], available: true } };
outline.forEach(([title], i) => {
  const id = String(i + 1);
  nodes[id] = { id, title: chapters.get(id)?.title || title, level: 1, parent: nodes[''], children: [], available: chapters.has(id) };
  nodes[''].children.push(nodes[id]);
});
[...chapters.values()].flatMap(chapter => chapter.sections).forEach(section => {
  const n = { ...section, parent: nodes[section.parent], children: [], available: true };
  nodes[n.id] = n;
  n.parent.children.push(n);
});

function chain(id) {
  const result = [];
  for (let n = nodes[id]; n; n = n.parent) result.unshift(n);
  return result;
}
function routeFromHash() {
  const [id, query] = location.hash.slice(1).split('?');
  const params = new URLSearchParams(query);
  const target = params.has('nota') ? `note-${params.get('nota')}` : params.has('chamada') ? `call-${params.get('chamada')}` : null;
  // Existing links into the former combined terminology page still lead to
  // the source note, now on its own concept page.
  if (id === '2.1' && target) {
    const number = params.get('nota') ?? params.get('chamada');
    const note = chapterTwo.notes.find(item => item.number === number);
    const paragraph = chapterTwo.paragraphs.find(p => note?.paragraphs.includes(p.id));
    if (paragraph?.section.startsWith('2.1.')) return { id: paragraph.section, target };
  }
  return { id: nodes[id] ? id : '', target };
}
function preserveFocusedHashTarget() {
  const { target } = routeFromHash();
  const element = target ? document.getElementById(target) : null;
  // A deferred exercise can change the height above a direct note link. Align
  // that focused target once at mount, without moving a reader who moved on.
  if (element && document.activeElement === element) element.scrollIntoView({ block: 'center' });
}
function expandAncestors(id) { return chain(id).filter(n => n.id && n.children.length).map(n => n.id); }
const chevron = h('svg', { width: 12, height: 12, viewBox: '0 0 12 12', 'aria-hidden': true }, h('path', { d: 'M4 2l4 4-4 4', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }));

function TreeItem({ n, id, open, toggle, close }) {
  const has = n.children.length > 0;
  return h('li', { className: `l${n.level}` },
    h('div', { className: `row${id === n.id ? ' on' : ''}` },
      has ? h('button', { className: 'chev', onClick: () => toggle(n.id), 'aria-expanded': open.has(n.id), 'aria-label': `${open.has(n.id) ? 'Recolher' : 'Expandir'} ${n.title}` }, chevron) : h('span', { className: 'chev spacer', 'aria-hidden': true }),
      h('a', { className: 'lab', href: `#${n.id}`, onClick: close, 'aria-current': id === n.id ? 'page' : undefined },
        h('span', { className: 'num' }, n.id), h('span', { className: 't' }, n.title))),
    has && open.has(n.id) ? h('ul', null, n.children.map(c => h(TreeItem, { key: c.id, n: c, id, open, toggle, close }))) : null);
}

function Card({ n }) {
  const count = n.children.length;
  return h('a', { className: `card lv${n.level}`, href: `#${n.id}` },
    h('span', { className: 'cn' }, h('i', { className: 'dot' }), n.id),
    h('span', { className: 'ct' }, n.title),
    h('span', { className: 'cm' }, !n.available ? 'Aguardando conteúdo' : count ? `${count} ${n.level === 1 ? 'seções' : 'subseção'}` : 'Ler →'));
}

function Paragraph({ p, id, isFirst = false, notesMap, isSaved, onToggleSave, definition = false, onOpenFilm }) {
  const [openNote, setOpenNote] = useState(null);
  const activeNote = notesMap.get(openNote);
  const closeNote = () => {
    setOpenNote(null);
    document.getElementById(`call-${openNote}`)?.focus({ preventScroll: true });
  };
  return h('div', {
    className: 'para-wrapper', 'data-paragraph-container': p.id, 'data-order': p.order,
    onKeyDown: e => { if (e.key === 'Escape' && openNote) { e.preventDefault(); e.stopPropagation(); closeNote(); } },
  },
    h('button', {
      type: 'button', className: `para-bookmark${isSaved ? ' on' : ''}`,
      onClick: () => onToggleSave(p.id), 'aria-pressed': isSaved,
      'aria-label': `${isSaved ? 'Remover destaque do' : 'Destacar'} parágrafo ${p.order}`,
      title: isSaved ? 'Remover destaque' : 'Destacar parágrafo para estudo',
    }, h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': true },
      h('path', { d: 'm12 3 2.8 5.7 6.3.9-4.5 4.4 1.1 6.2-5.7-3-5.7 3 1.1-6.2L3.2 9.6l6.3-.9Z', fill: isSaved ? 'currentColor' : 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round' }))),
    h(p.quote ? 'blockquote' : 'p', {
    className: `book-paragraph${isFirst && !p.quote ? ' drop-cap-paragraph' : ''}${isSaved ? ' is-highlighted' : ''}${definition ? ` ${definition}-definition` : ''}`,
    'data-paragraph': p.id, 'data-pages': p.pages.join(','), 'data-page-label': `PDF ${p.pages.join('–')}`, 'data-order': p.order,
    onDoubleClick: e => { if (!e.target.closest('a,button')) onToggleSave(p.id); },
  },
    p.segments.map((s, i) => {
      if (s.note) return h('sup', { key: i }, h('a', {
        id: `call-${s.note}`, href: `#${id}?nota=${s.note}`, 'aria-label': `Ler nota ${s.note}`,
        className: `note-call${openNote === s.note ? ' active' : ''}`, role: 'doc-noteref',
        'aria-expanded': openNote === s.note,
        'aria-controls': openNote === s.note ? `inline-note-${s.note}` : undefined,
        onClick: e => { e.preventDefault(); setOpenNote(value => value === s.note ? null : s.note); },
      }, s.text));
      let child = s.text;
      if (p.id === 'para_a29e9cc25a457f186bdd51a2' && onOpenFilm) {
        child = s.text.split(filmCitationPattern).map((part, j) => {
          const film = filmDossiers.find(item => item.citation === part);
          return film ? h('button', { key: j, type: 'button', className: 'film-dossier-inline', onClick: event => onOpenFilm(film.id, event),
            'aria-haspopup': 'dialog', 'aria-label': `Abrir dossiê de ${part}`, title: 'Abrir o dossiê complementar do filme' }, part) : part;
        });
      }
      if (s.italic) child = h('em', null, child);
      if (s.bold) child = h('strong', null, child);
      return h(React.Fragment, { key: i }, child);
    })),
    activeNote ? h('aside', { id: `inline-note-${activeNote.number}`, className: 'inline-note-popover', role: 'note', 'aria-label': `Nota ${activeNote.number}`, 'aria-live': 'polite' },
      h('div', { className: 'inline-note-header' },
        h('span', { className: 'inline-note-badge mono' }, `NOTA ${activeNote.number}`),
        h('button', { type: 'button', className: 'inline-note-close mono', onClick: closeNote, 'aria-label': `Fechar nota ${activeNote.number}` }, 'Fechar ×')),
      h('p', null, activeNote.text),
      h('a', { className: 'inline-note-footer-link', href: `#${id}?nota=${activeNote.number}` }, 'Ver nota no fim da seção')) : null);
}

function SectionIllustration({ image, variant = 'inline', onOpen, onOpenFilm }) {
  if (!image) return null;
  if (image.src === '/images/chapter-02/diagrama-01.jpeg') return h(StoryTriangle, { image, onOpen, onOpenFilm });
  const layout = image.kind === 'diagram' ? 'fig-diagram' : variant === 'hero' ? 'fig-hero'
    : ['02', '06'].includes(image.number) ? 'fig-float-right'
    : image.number === '03' ? 'fig-float-left' : 'fig-cinema';
  return h('figure', { className: `section-illustration ${layout}`, 'data-illustration': image.number },
    h('button', { type: 'button', className: 'fig-frame fig-zoom-trigger', style: image.kind === 'diagram' ? { aspectRatio: `${image.width} / ${image.height}` } : undefined, onClick: () => onOpen(image), 'aria-label': `Ampliar figura ${image.number}: ${image.alt}` },
      h('img', { src: image.src, alt: image.alt, width: image.width, height: image.height,
        loading: variant === 'hero' ? 'eager' : 'lazy', decoding: 'async' }),
      h('span', { className: 'fig-zoom-badge mono', 'aria-hidden': true }, 'Ampliar')),
    h('figcaption', { className: 'fig-caption' },
      h('span', { className: 'fig-num mono' }, `FIG. ${image.number}`),
      h('span', { className: 'fig-text' }, image.alt)));
}

function Reading({ n, headingRef, preferences }) {
  const chapter = chapters.get(n.id.split('.')[0]);
  const isTerminology = n.id === '2.1';
  const sectionRef = useRef(null);
  const [activeImg, setActiveImg] = useState(null);
  const [onlySaved, setOnlySaved] = useState(false);
  const [filmOpen, setFilmOpen] = useState(null);
  const filmTrigger = useRef(null);
  const openFilm = useCallback((id, event) => { filmTrigger.current = event.currentTarget; setFilmOpen(id); }, []);
  const closeFilm = useCallback(() => setFilmOpen(null), []);
  const FilmModal = filmModals[filmOpen];
  const sections = chapter.sections.filter(s => s.id === n.id || (!standaloneSections.has(n.id) && s.id.startsWith(`${n.id}.`)));
  const paragraphs = chapter.paragraphs.filter(p => sections.some(s => s.id === p.section));
  const included = new Set(paragraphs.map(p => p.id));
  const notes = chapter.notes.filter(note => note.paragraphs.some(p => included.has(p)) || sections.some(s => s.id === note.section));
  const notesMap = new Map(notes.map(note => [note.number, note]));
  const { savedParas, toggleSave, theme, toggleTheme, fontSize, changeFontSize, persistenceAvailable } = preferences;
  const savedCount = paragraphs.filter(p => savedParas.has(p.id)).length;
  const visibleParagraphs = paragraphs.filter(p => !onlySaved || savedParas.has(p.id));
  const visibleIds = new Set(visibleParagraphs.map(p => p.id));
  const shownNotes = notes.filter(note => note.paragraphs.some(id => visibleIds.has(id)) || (!onlySaved && !note.paragraphs.length));
  const sectionImages = paragraphs.flatMap(p => [illustrationsBefore.get(p.id), illustrationsAfter.get(p.id)].filter(Boolean));
  const imageIndex = sectionImages.findIndex(image => image.number === activeImg);
  const openImage = image => setActiveImg(image.number);
  const firstImage = paragraphs[0] ? illustrationsBefore.get(paragraphs[0].id) : null;
  const heroImage = firstImage?.kind === 'diagram' ? null : firstImage;
  const body = sections.map(section => {
    const sectionParagraphs = visibleParagraphs.filter(p => p.section === section.id);
    if (!sectionParagraphs.length) return null;
    return h('section', { key: section.id, className: 'reading-block', 'data-section': section.id, 'aria-labelledby': `heading-${section.id}` },
        section.id !== n.id ? h(section.level === 3 ? 'h3' : 'h2', { id: `heading-${section.id}` }, section.title) : h('h2', { id: `heading-${section.id}`, className: 'visually-hidden' }, section.title),
        isTerminology && !onlySaved ? h(TerminologyMedia, { placement: 'opening' }) : null,
        sectionParagraphs.map((p, index) => h(React.Fragment, { key: p.id },
          isTerminology && !onlySaved && p.order === 3 ? h(TerminologyMedia, { placement: 'conflict' }) : null,
          isTerminology && !onlySaved && p.order === 6 ? h(TerminologyMedia, { placement: 'motel' }) : null,
          !onlySaved ? h(SectionIllustration, { image: illustrationsBefore.get(p.id) === heroImage ? null : illustrationsBefore.get(p.id), onOpen: openImage }) : null,
          h(Paragraph, { p, id: n.id, isFirst: index === 0 && !onlySaved, notesMap, isSaved: savedParas.has(p.id), onToggleSave: toggleSave, definition: definitionKinds.get(p.id), onOpenFilm: openFilm }),
          !onlySaved ? h(SectionIllustration, { image: illustrationsAfter.get(p.id), onOpen: openImage, onOpenFilm: openFilm }) : null,
          !onlySaved && p.id === 'para_dc10e4aaf5ac14aa835ff55c' ? h(StructureLab) : null,
          !onlySaved && p.id === 'para_83cb2ca5f9973d4e3982ae64' ? h(EventLab) : null,
          !onlySaved && p.id === 'para_26bf5669bb5feab8843f4cdb' ? h(SceneLab) : null,
          !onlySaved && p.id === 'para_d30fbb2106367f7a1fac2627'
            ? h(React.Suspense, { fallback: h('p', { className: 'reader-status', role: 'status' }, 'Carregando exercício…') },
              h(BeatSequenceLab, { onReady: preserveFocusedHashTarget })) : null,
          !onlySaved && p.id === 'para_9034c91e043af1cd288aa23e'
            ? h(React.Suspense, { fallback: h('p', { className: 'reader-status', role: 'status' }, 'Carregando exercício…') },
              h(SequenceToActLab, { onReady: preserveFocusedHashTarget })) : null,
          !onlySaved && p.id === 'para_cb4004c37f2df97f3c306374'
            ? h(React.Suspense, { fallback: h('p', { className: 'reader-status', role: 'status' }, 'Carregando exercício…') },
              h(ActReversalLab, { onReady: preserveFocusedHashTarget })) : null,
          !onlySaved && p.id === 'para_632c35fcbae9985d1251ecef'
            ? h(React.Suspense, { fallback: h('p', { className: 'reader-status', role: 'status' }, 'Carregando exercício…') },
              h(StoryClimaxLab, { onReady: preserveFocusedHashTarget })) : null,
          !onlySaved && p.id === 'para_78e3f3ee0d84ecfd50b01af1'
            ? h(React.Suspense, { fallback: h('p', { className: 'reader-status', role: 'status' }, 'Carregando exercício…') },
              h(PlotDesignLab, { onReady: preserveFocusedHashTarget })) : null,
          !onlySaved && p.id === 'para_292a1886672327ac7faf8e56'
            ? h(React.Suspense, { fallback: h('p', { className: 'reader-status', role: 'status' }, 'Carregando exercício…') },
              h(LifeToToldStoryLab, { onReady: preserveFocusedHashTarget })) : null)));
  });
  return h('div', { className: `editorial-section${isTerminology ? ' terminology-editorial' : ''}`, ref: sectionRef, style: { '--reading-font-size': `${fontSize}px` } },
    FilmModal ? h(React.Suspense, { fallback: null }, h(FilmModal, { onClose: closeFilm, returnFocus: filmTrigger.current, fontSize })) : null,
    h(ReadingProgress, { sectionRef }),
    h(Lightbox, {
      image: sectionImages[imageIndex], index: imageIndex, count: sectionImages.length,
      onClose: () => setActiveImg(null),
      onPrev: imageIndex > 0 ? () => setActiveImg(sectionImages[imageIndex - 1].number) : null,
      onNext: imageIndex >= 0 && imageIndex < sectionImages.length - 1 ? () => setActiveImg(sectionImages[imageIndex + 1].number) : null,
    }),
    h('header', { className: `section-hero${heroImage ? ' section-hero--split' : ''}` },
      h('div', { className: 'section-hero-text' },
        isTerminology ? h(React.Fragment, null,
          h('p', { className: 'terminology-kicker' }, 'Capítulo 02'),
          h('p', { className: 'terminology-chapter-title' }, 'O Espectro da Estrutura'))
          : h('div', { className: `lv${n.level}` }, h('p', { className: 'idx' }, h('i', { className: 'dot' }), `Seção ${n.id}`)),
        h('h1', { className: 'section-main-title', tabIndex: -1, ref: headingRef }, n.title),
        h('div', { className: 'reading-tools', role: 'group', 'aria-label': 'Ferramentas de leitura' },
          h('span', { className: 'tools-badge mono' }, `LEITURA · ${paragraphs.length} PARÁGRAFOS`),
          h('button', { type: 'button', className: `tool-btn highlight-filter${onlySaved ? ' active' : ''}`, onClick: () => setOnlySaved(value => !value), 'aria-pressed': onlySaved, 'aria-label': onlySaved ? 'Mostrar texto completo' : 'Mostrar apenas meus destaques' }, `Destaques (${savedCount})`),
          h('button', { type: 'button', className: 'tool-btn theme-toggle', onClick: toggleTheme, 'aria-pressed': theme === 'dark', 'aria-label': theme === 'dark' ? 'Ativar modo papel' : 'Ativar modo cinema' }, theme === 'dark' ? 'Modo Papel' : 'Modo Cinema'),
          h('span', { className: 'font-size-tools', role: 'group', 'aria-label': 'Tamanho do texto' },
            h('button', { type: 'button', className: 'tool-btn', onClick: () => changeFontSize(-2), disabled: fontSize <= 16, 'aria-label': 'Diminuir tamanho do texto' }, 'A−'),
            h('output', { className: 'font-size-value mono', 'aria-live': 'polite' }, `${fontSize}px`),
            h('button', { type: 'button', className: 'tool-btn', onClick: () => changeFontSize(2), disabled: fontSize >= 26, 'aria-label': 'Aumentar tamanho do texto' }, 'A+')),
          h('a', { className: 'pdf-link', href: chapter.source.pdf, target: '_blank', rel: 'noreferrer' }, 'Consultar PDF original',
            h('svg', { width: 12, height: 12, viewBox: '0 0 16 16', 'aria-hidden': true },
              h('path', { d: 'M4 12 12 4M4 4h8v8', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }))))),
      heroImage ? h('div', { className: 'section-hero-media' }, h(SectionIllustration, { image: heroImage, variant: 'hero', onOpen: openImage })) : null),
    !persistenceAvailable ? h('p', { className: 'reader-status', role: 'status' }, 'O armazenamento está indisponível. Suas preferências ficarão disponíveis apenas nesta sessão.') : null,
    h('hr', { className: 'editorial-divider' }),
    h('article', { className: 'reading-canvas', 'aria-label': n.title },
      onlySaved && !visibleParagraphs.length ? h('div', { className: 'empty-saved', role: 'status' },
        h('p', null, 'Nenhum destaque nesta seção. Use a estrela ao lado de um parágrafo ou dê um duplo clique no texto para destacá-lo.'),
        h('button', { type: 'button', className: 'tool-btn', onClick: () => setOnlySaved(false) }, 'Voltar ao texto completo')) : body),
    shownNotes.length ? h('section', { className: 'notes notes-card', 'aria-labelledby': 'notes-heading', role: 'doc-endnotes' },
      h('h2', { id: 'notes-heading', className: 'notes-title mono' }, 'Notas da seção'),
      h('ol', { className: 'notes-list' }, shownNotes.map(note => h('li', { key: note.number, id: `note-${note.number}`, value: note.number === '*' ? undefined : Number(note.number), className: note.number === '*' ? 'unnumbered-note' : undefined, tabIndex: -1 },
        h('p', { 'data-note': note.number }, note.text),
        note.paragraphs.length ? h('a', { href: `#${n.id}?chamada=${note.number}`, 'aria-label': `Voltar à chamada da nota ${note.number}`, className: 'note-back mono', role: 'doc-backlink' }, '↩ Voltar ao parágrafo') : null)))) : null);
}

function ChapterIntroduction({ n, headingRef }) {
  const chapter = chapters.get(n.id);
  const sections = chapter.sections.filter(section => section.parent === n.id);
  return h('article', { className: 'chapter-overview', 'aria-labelledby': 'chapter-title' },
    h('header', null,
      h('p', { className: 'chapter-kicker' }, `Capítulo ${n.id}`),
      h('h1', { id: 'chapter-title', className: 'chapter-title', tabIndex: -1, ref: headingRef }, n.title)),
    h('hr', { className: 'editorial-divider' }),
    h('div', { className: 'chapter-body' },
      h('p', { className: 'stats' }, `${chapter.source.pages} páginas no PDF · ${sections.length} seções · ${chapter.sections.length - sections.length} subseções`),
      h('section', { className: 'chapter-summary', 'aria-labelledby': 'overview-heading' },
        h('h2', { id: 'overview-heading', className: 'overview-label' }, 'Visão geral'),
        chapterTwoOverview.paragraphs.map((text, i) => h('p', { key: i },
          text.split(/(\*[^*]+\*)/g).map((part, j) => part.startsWith('*')
            ? h('em', { key: j }, part.slice(1, -1)) : part)))),
      h('a', { className: 'pdf-link', href: chapter.source.pdf, target: '_blank', rel: 'noreferrer' }, 'Consultar PDF original')));
}

function ChapterOverview({ n, headingRef }) {
  const [opening, ...body] = overview.paragraphs;
  const [before, after] = opening.split('Story');
  return h('article', { className: 'chapter-overview', 'aria-labelledby': 'chapter-title' },
    h('header', { className: 'split-hero' },
      h('div', { className: 'hero-text-col' },
        h('p', { className: 'chapter-kicker' }, `Capítulo ${n.id}`),
        h('h1', { id: 'chapter-title', className: 'chapter-title', tabIndex: -1, ref: headingRef }, n.title),
        h('section', { className: 'overview-card', 'aria-labelledby': 'overview-heading' },
          h('h2', { id: 'overview-heading', className: 'overview-label' }, 'Visão geral'),
          h('p', { className: 'overview-opening' }, before, h('em', null, 'Story'), after))),
      overview.image ? h('div', { className: 'hero-media-col' },
        h('figure', { className: 'hero-figure' },
          h('img', { className: 'hero-image', src: overview.image.src, alt: overview.image.alt, width: 1672, height: 941, fetchpriority: 'high' }))) : null),
    h('hr', { className: 'editorial-divider' }),
    h('div', { className: 'chapter-body' },
      body.map((text, i) => i === body.length - 1
        ? h('blockquote', { key: i, className: 'closing-quote' },
            h('span', { className: 'quote-mark', 'aria-hidden': true }, '“'), h('p', null, text))
        : h('p', { key: i, className: i === 0 ? 'drop-cap-paragraph' : undefined }, text))));
}

function Page({ n, headingRef, preferences }) {
  const isOverview = n.level === 1 && n.available;
  const isReadingSection = Boolean(n.id && !isOverview && n.available);
  const siblings = n.parent?.children || [];
  const at = siblings.indexOf(n);
  let prev = siblings[at - 1], next = siblings[at + 1];
  // Keep the newly separated introduction and its sole subsection together
  // in both directions, before continuing to the next main section.
  if (n.id === '2.2') next = nodes['2.2.1'];
  if (n.id === '2.2.1') { prev = nodes['2.2']; next = nodes['2.3']; }
  if (n.id === '2.3') prev = nodes['2.2.1'];
  return h('main', { className: `main${isOverview ? ' main--overview' : ''}`, id: 'main' },
    !isOverview && !isReadingSection ? h(React.Fragment, null,
      h('div', { className: `lv${n.level}` }, h('p', { className: 'idx' }, h('i', { className: 'dot' }), n.id ? `${n.level === 1 ? 'Capítulo' : 'Seção'} ${n.id}` : 'Início')),
      h('h1', { tabIndex: -1, ref: headingRef }, n.title)) : null,
    !n.id ? h(React.Fragment, null,
      h('p', { className: 'lead' }, BOOK.subtitle), h('p', { className: 'byline' }, BOOK.author),
      h('p', { className: 'stats' }, 'Capítulos 1 e 2 disponíveis para leitura. Os demais serão adicionados aos poucos.')) : null,
    isOverview ? h(n.id === '1' ? ChapterOverview : ChapterIntroduction, { n, headingRef }) : null,
    !n.id ? h('section', { className: 'sec', 'aria-labelledby': 'contents-heading' },
      h('h2', { id: 'contents-heading' }, 'Capítulos'),
      h('div', { className: 'grid' }, n.children.map(c => h(Card, { key: c.id, n: c })))) : null,
    isReadingSection ? h(Reading, { key: n.id, n, headingRef, preferences }) : null,
    n.id && !n.available ? h('section', { className: 'slot' }, h('h2', null, 'Conteúdo em preparação'), h('p', null, 'Os arquivos deste capítulo ainda não foram enviados.')) : null,
    isReadingSection && (prev || next) ? h('nav', { className: 'pn', 'aria-label': 'Entre seções' },
      prev ? h('a', { href: `#${prev.id}` }, h('small', null, '← Anterior'), h('span', null, `${prev.id}  ${prev.title}`)) : h('div'),
      next ? h('a', { href: `#${next.id}`, className: 'nx' }, h('small', null, 'Próximo →'), h('span', null, `${next.id}  ${next.title}`)) : null) : null);
}

function App() {
  const preferences = useReaderPreferences(paragraphIds);
  const [route, setRoute] = useState(routeFromHash);
  const [open, setOpen] = useState(() => new Set(expandAncestors(route.id)));
  const [drawer, setDrawer] = useState(false);
  const headingRef = useRef(null), sideRef = useRef(null), menuRef = useRef(null);
  const n = nodes[route.id];
  useEffect(() => {
    const sync = () => {
      const current = routeFromHash();
      setRoute(current);
      setOpen(prev => new Set([...prev, ...expandAncestors(current.id)]));
      setDrawer(false);
    };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  useEffect(() => {
    document.title = `${n.id ? n.title : BOOK.title} — ${n.id ? 'Story' : BOOK.author}`;
    if (route.target) {
      const target = document.getElementById(route.target);
      if (target) { target.focus({ preventScroll: true }); target.scrollIntoView({ block: 'center' }); return; }
    }
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, [route, n]);
  useEffect(() => {
    if (!drawer) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sideRef.current?.querySelector('a,button')?.focus();
    function keydown(e) {
      if (e.key === 'Escape') { setDrawer(false); menuRef.current?.focus(); }
      if (e.key === 'Tab') {
        const focusable = [...sideRef.current.querySelectorAll('a,button')];
        const first = focusable[0], last = focusable.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    function resize() { if (window.innerWidth >= 900) setDrawer(false); }
    document.addEventListener('keydown', keydown);
    window.addEventListener('resize', resize);
    return () => { document.body.style.overflow = before; document.removeEventListener('keydown', keydown); window.removeEventListener('resize', resize); };
  }, [drawer]);
  const toggle = id => setOpen(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const close = () => setDrawer(false);
  return h(React.Fragment, null,
    h('a', { className: 'skip-link', href: '#main', onClick: e => { e.preventDefault(); headingRef.current?.focus(); document.getElementById('main').scrollIntoView(); } }, 'Ir para o conteúdo'),
    h('div', { className: `app${n.id === '2.1' ? ' app--terminology' : ''}` },
      h('div', { className: 'bar' },
        h('button', { className: 'menu', ref: menuRef, onClick: () => setDrawer(true), 'aria-expanded': drawer, 'aria-controls': 'indice' }, '☰ Índice'),
        h('span', { className: 'cur' }, n.id ? `${n.id}  ${n.title}` : BOOK.title)),
      drawer ? h('div', { className: 'scrim', onClick: close, 'aria-hidden': true }) : null,
      h('aside', { className: `side${drawer ? ' open' : ''}`, id: 'indice', ref: sideRef, 'aria-label': 'Índice do livro', role: drawer ? 'dialog' : undefined, 'aria-modal': drawer ? true : undefined },
        h('button', { className: 'drawer-close', onClick: () => { close(); menuRef.current?.focus(); }, 'aria-label': 'Fechar índice' }, 'Fechar ×'),
        h('a', { className: `brand${!n.id ? ' on' : ''}`, href: '#', onClick: close }, h('b', null, BOOK.title), h('span', null, BOOK.author)),
        h('nav', { className: 'tree', 'aria-label': 'Árvore do livro' }, h('ul', null, nodes[''].children.map(c => h(TreeItem, { key: c.id, n: c, id: n.id, open, toggle, close }))))),
      h(Page, { n, headingRef, preferences })));
}

createRoot(document.getElementById('root')).render(h(App));
