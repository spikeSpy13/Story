import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const h = React.createElement;

function readPreference(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function storePreference(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}

export function useReaderPreferences(paragraphIds) {
  const [savedParas, setSavedParas] = useState(() => {
    const saved = readPreference('story_highlights', []);
    return new Set(Array.isArray(saved) ? saved.filter(id => paragraphIds.has(id)) : []);
  });
  const [theme, setTheme] = useState(() => {
    const saved = readPreference('story_theme', null);
    return ['light', 'dark'].includes(saved) ? saved : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [fontSize, setFontSize] = useState(() => {
    const saved = readPreference('story_font_size', 18);
    return Number.isInteger(saved) && saved >= 16 && saved <= 26 ? saved : 18;
  });
  const [persistenceAvailable, setPersistenceAvailable] = useState(true);

  useLayoutEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    const results = [storePreference('story_highlights', [...savedParas]),
      storePreference('story_theme', theme), storePreference('story_font_size', fontSize)];
    setPersistenceAvailable(results.every(Boolean));
  }, [savedParas, theme, fontSize]);

  const toggleSave = useCallback(id => {
    if (!paragraphIds.has(id)) return;
    setSavedParas(previous => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, [paragraphIds]);
  const toggleTheme = useCallback(() => setTheme(value => value === 'dark' ? 'light' : 'dark'), []);
  const changeFontSize = useCallback(delta => setFontSize(value => Math.max(16, Math.min(26, value + delta))), []);
  return { savedParas, toggleSave, theme, toggleTheme, fontSize, changeFontSize, persistenceAvailable };
}

export function ReadingProgress({ sectionRef }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame;
    const update = () => {
      const bounds = section.getBoundingClientRect();
      const distance = bounds.height - innerHeight;
      const value = distance > 0 ? Math.max(0, Math.min(100, -bounds.top / distance * 100)) : 100;
      setProgress(Math.round(value * 10) / 10);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [sectionRef]);
  // Portals keep fixed overlays outside the CSS layout containers used by the reader.
  return createPortal(h('div', { className: 'reading-progress-bar', 'aria-hidden': true, 'data-progress': progress },
    h('div', { className: 'reading-progress-fill', style: { width: `${progress}%` } })), document.body);
}

export function Lightbox({ image, index, count, onClose, onPrev, onNext }) {
  const dialogRef = useRef(null), closeRef = useRef(null);
  const isOpen = Boolean(image);
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousScroll = { left: scrollX, top: scrollY };
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    closeRef.current.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      window.scrollTo(previousScroll);
    };
  }, [isOpen]);
  if (!image) return null;
  return createPortal(h('dialog', {
    ref: dialogRef, className: 'lightbox-backdrop', 'aria-labelledby': 'lightbox-title', 'aria-describedby': 'lightbox-caption',
    onCancel: e => { e.preventDefault(); onClose(); },
    onClick: e => { if (e.target === e.currentTarget) onClose(); },
    onKeyDown: e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev?.(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); onNext?.(); }
      if (e.key === 'Tab') {
        const controls = [...dialogRef.current.querySelectorAll('a[href],button:not(:disabled)')];
        const first = controls[0], last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    },
  }, h('div', { className: 'lightbox-content' },
    h('div', { className: 'lightbox-top' },
      h('h2', { id: 'lightbox-title', className: 'lightbox-title mono' }, `Figura ${image.number} ampliada`),
      h('span', { className: 'lightbox-count mono' }, `${index + 1} / ${count}`),
      h('a', { href: image.src, target: '_blank', rel: 'noreferrer', className: 'lightbox-original mono' }, 'Abrir original'),
      h('button', { ref: closeRef, type: 'button', className: 'lightbox-close mono', onClick: onClose, 'aria-label': 'Fechar imagem' }, 'Fechar ×')),
    h('img', { src: image.src, alt: image.alt, className: 'lightbox-img', width: image.width, height: image.height }),
    h('div', { className: 'lightbox-bar' },
      h('button', { type: 'button', className: 'lightbox-nav mono', onClick: onPrev, disabled: !onPrev, 'aria-label': 'Imagem anterior' }, '← Anterior'),
      h('p', { id: 'lightbox-caption', className: 'lightbox-caption', 'aria-live': 'polite' }, h('strong', { className: 'mono' }, `FIG. ${image.number} — `), image.alt),
      h('button', { type: 'button', className: 'lightbox-nav mono', onClick: onNext, disabled: !onNext, 'aria-label': 'Próxima imagem' }, 'Próxima →')))), document.body);
}
