import React, { useId, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './film-dossier-dialog.css';

const h = React.createElement;

export default function FilmDossierDialog({ title, eyebrow, tabs, activeTab, onTabChange: setActiveTab, onClose, returnFocus, fontSize, provenance, source, tabRefs: suppliedTabRefs, children }) {
  const uid = useId();
  const dialogRef = useRef(null), closeRef = useRef(null), bodyRef = useRef(null), localTabRefs = useRef([]);
  const tabRefs = suppliedTabRefs || localTabRefs;
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = returnFocus || document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousScroll = { left: scrollX, top: scrollY };
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    closeRef.current.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      window.scrollTo(previousScroll);
    };
  }, [returnFocus]);
  useLayoutEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; }, [activeTab]);

  const moveTab = (event, index) => {
    let target;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) target = (index + 1) % tabs.length;
    else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) target = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = tabs.length - 1;
    if (target === undefined) return;
    event.preventDefault();
    setActiveTab(tabs[target][0]);
    tabRefs.current[target]?.focus();
  };

  return createPortal(h('dialog', {
    ref: dialogRef, className: 'film-dossier', 'aria-labelledby': `${uid}-title`, style: { '--reading-font-size': `${fontSize}px` },
    onCancel: event => { event.preventDefault(); onClose(); },
    onClick: event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    },
    onKeyDown: event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialogRef.current.querySelectorAll('a[href],summary,button:not(:disabled):not([tabindex="-1"])')].filter(control => control.checkVisibility());
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    },
  },
    h('header', { className: 'tr-header' },
      h('div', null, h('span', { className: 'tr-kicker' }, eyebrow), h('h2', { id: `${uid}-title` }, title)),
      h('button', { ref: closeRef, type: 'button', className: 'tr-close', onClick: onClose, 'aria-label': 'Fechar dossiê do filme' }, 'Fechar ×')),
    h('div', { className: 'tr-tabs', role: 'tablist', 'aria-label': 'Seções do dossiê', 'aria-orientation': 'horizontal' }, tabs.map(([id, label], i) => h('button', {
      key: id, ref: el => { tabRefs.current[i] = el; }, id: `${uid}-tab-${id}`, type: 'button', role: 'tab', 'aria-selected': activeTab === id,
      'aria-controls': `${uid}-panel-${id}`, tabIndex: activeTab === id ? 0 : -1, onClick: () => setActiveTab(id), onKeyDown: event => moveTab(event, i),
    }, label))),
    h('div', { className: 'tr-body', ref: bodyRef },
      h('div', { className: 'tr-provenance' }, h('p', null, provenance), source ? h('a', { href: source.href, target: '_blank', rel: 'noopener noreferrer' }, source.label) : null),
      h('section', { key: activeTab, className: 'tr-panel', role: 'tabpanel', id: `${uid}-panel-${activeTab}`, 'aria-labelledby': `${uid}-tab-${activeTab}` },
        children))), document.body);
}
