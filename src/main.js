import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/bricolage-grotesque/500.css';
import '@fontsource/bricolage-grotesque/600.css';
import '@fontsource/bricolage-grotesque/700.css';
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/500.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import './style.css';
import { outline } from './outline.js';
import chapter from './content/chapter-01.json';

const h = React.createElement;
const BOOK = { title: 'Story', subtitle: 'Substância, Estrutura, Estilo e os Princípios da Escrita de Roteiro', author: 'Robert McKee' };
const nodes = { '': { id: '', title: BOOK.title, level: 0, parent: null, children: [], available: true } };
outline.forEach(([title], i) => {
  const id = String(i + 1);
  nodes[id] = { id, title: i === 0 ? chapter.title : title, level: 1, parent: nodes[''], children: [], available: i === 0 };
  nodes[''].children.push(nodes[id]);
});
chapter.sections.forEach(section => {
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
  return { id: nodes[id] ? id : '', target };
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

function Paragraph({ p, id }) {
  return h(p.quote ? 'blockquote' : 'p', { className: 'book-paragraph', 'data-paragraph': p.id, 'data-pages': p.pages.join(','), 'data-order': p.order },
    p.segments.map((s, i) => {
      if (s.note) return h('sup', { key: i }, h('a', { id: `call-${s.note}`, href: `#${id}?nota=${s.note}`, 'aria-label': `Ler nota ${s.note}`, className: 'note-call', role: 'doc-noteref' }, s.text));
      let child = s.text;
      if (s.italic) child = h('em', null, child);
      if (s.bold) child = h('strong', null, child);
      return h(React.Fragment, { key: i }, child);
    }));
}

function Reading({ n }) {
  const sections = chapter.sections.filter(s => n.id === '1' || s.id === n.id || s.id.startsWith(`${n.id}.`));
  const paragraphs = chapter.paragraphs.filter(p => sections.some(s => s.id === p.section));
  const included = new Set(paragraphs.map(p => p.id));
  const notes = chapter.notes.filter(note => note.paragraphs.some(p => included.has(p)));
  return h(React.Fragment, null,
    h('div', { className: 'reading-tools' },
      h('span', null, n.id === '1' ? 'Capítulo completo' : 'Leitura da seção'),
      h('a', { href: chapter.source.pdf, target: '_blank', rel: 'noreferrer' }, 'Consultar PDF ↗')),
    h('article', { className: 'reading', 'aria-label': n.id === '1' ? 'Texto integral do capítulo 1' : n.title },
      sections.map(section => h('section', { key: section.id, 'data-section': section.id, 'aria-labelledby': `heading-${section.id}` },
        section.id !== n.id ? h(section.level === 3 ? 'h3' : 'h2', { id: `heading-${section.id}` }, section.title) : h('h2', { id: `heading-${section.id}`, className: 'visually-hidden' }, section.title),
        chapter.paragraphs.filter(p => p.section === section.id).map(p => h(Paragraph, { key: p.id, p, id: n.id }))))),
    notes.length ? h('section', { className: 'notes', 'aria-labelledby': 'notes-heading', role: 'doc-endnotes' },
      h('h2', { id: 'notes-heading' }, 'Notas'),
      h('ol', null, notes.map(note => h('li', { key: note.number, id: `note-${note.number}`, value: Number(note.number), tabIndex: -1 },
        h('p', { 'data-note': note.number }, note.text),
        h('a', { href: `#${n.id}?chamada=${note.number}`, 'aria-label': `Voltar à chamada da nota ${note.number}`, className: 'note-back', role: 'doc-backlink' }, 'Voltar ao texto ↑'))))) : null);
}

function Page({ n, headingRef }) {
  const siblings = n.parent?.children || [];
  const at = siblings.indexOf(n);
  const prev = siblings[at - 1], next = siblings[at + 1];
  return h('main', { className: 'main', id: 'main' },
    h('nav', { 'aria-label': 'Caminho' }, h('ul', { className: 'crumbs' }, chain(n.id).map((c, i, all) => h('li', { key: c.id },
      i === all.length - 1 ? h('span', { 'aria-current': 'page' }, c.id ? c.title : 'Início') : h('a', { href: `#${c.id}` }, c.id ? c.title : 'Início'))))),
    h('div', { className: `lv${n.level}` }, h('p', { className: 'idx' }, h('i', { className: 'dot' }), n.id ? `${n.level === 1 ? 'Capítulo' : 'Seção'} ${n.id}` : 'Início')),
    h('h1', { tabIndex: -1, ref: headingRef }, n.title),
    !n.id ? h(React.Fragment, null,
      h('p', { className: 'lead' }, BOOK.subtitle), h('p', { className: 'byline' }, BOOK.author),
      h('p', { className: 'stats' }, 'Capítulo 1 disponível para leitura. Os demais serão adicionados aos poucos.')) : null,
    n.children.length ? h('section', { className: 'sec', 'aria-labelledby': 'contents-heading' },
      h('h2', { id: 'contents-heading' }, !n.id ? 'Capítulos' : 'Nesta leitura'),
      h('div', { className: !n.id ? 'grid' : 'section-links' }, n.children.map(c => !n.id ? h(Card, { key: c.id, n: c }) : h('a', { key: c.id, href: `#${c.id}` }, h('span', { className: 'mono' }, c.id), ' ', c.title)))) : null,
    n.id && n.available ? h(Reading, { n }) : null,
    n.id && !n.available ? h('section', { className: 'slot' }, h('h2', null, 'Conteúdo em preparação'), h('p', null, 'Os arquivos deste capítulo ainda não foram enviados.')) : null,
    n.id && siblings.length > 1 ? h('nav', { className: 'pn', 'aria-label': n.level === 1 ? 'Entre capítulos' : 'Entre seções' },
      prev ? h('a', { href: `#${prev.id}` }, h('small', null, '← Anterior'), h('span', null, `${prev.id}  ${prev.title}`)) : h('div'),
      next ? h('a', { href: `#${next.id}`, className: 'nx' }, h('small', null, 'Próximo →'), h('span', null, `${next.id}  ${next.title}`)) : null) : null);
}

function App() {
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
    h('div', { className: 'app' },
      h('div', { className: 'bar' },
        h('button', { className: 'menu', ref: menuRef, onClick: () => setDrawer(true), 'aria-expanded': drawer, 'aria-controls': 'indice' }, '☰ Índice'),
        h('span', { className: 'cur' }, n.id ? `${n.id}  ${n.title}` : BOOK.title)),
      drawer ? h('div', { className: 'scrim', onClick: close, 'aria-hidden': true }) : null,
      h('aside', { className: `side${drawer ? ' open' : ''}`, id: 'indice', ref: sideRef, 'aria-label': 'Índice do livro', role: drawer ? 'dialog' : undefined, 'aria-modal': drawer ? true : undefined },
        h('button', { className: 'drawer-close', onClick: () => { close(); menuRef.current?.focus(); }, 'aria-label': 'Fechar índice' }, 'Fechar ×'),
        h('a', { className: `brand${!n.id ? ' on' : ''}`, href: '#', onClick: close }, h('b', null, BOOK.title), h('span', null, BOOK.author)),
        h('nav', { className: 'tree', 'aria-label': 'Árvore do livro' }, h('ul', null, nodes[''].children.map(c => h(TreeItem, { key: c.id, n: c, id: n.id, open, toggle, close }))))),
      h(Page, { n, headingRef })));
}

createRoot(document.getElementById('root')).render(h(App));
