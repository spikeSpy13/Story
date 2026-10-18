import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const content = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));
const firstChapter = JSON.parse(readFileSync(new URL('../src/content/chapter-01.json', import.meta.url), 'utf8'));
const figures = JSON.parse(readFileSync(new URL('../src/content/chapter-02-illustrations.json', import.meta.url), 'utf8')).placements;
const overview = JSON.parse(readFileSync(new URL('../src/content/chapter-02-overview.json', import.meta.url), 'utf8'));

test('chapter 2 is available from home, with no duplicated text or section links on its opening', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.stats')).toContainText('Capítulos 1 e 2 disponíveis');
  const card = page.locator('.card[href="#2"]');
  await expect(card).toContainText('4 seções');
  await card.click();
  await expect(page.locator('main h1')).toHaveText(content.title);
  await expect(page.locator('[data-paragraph], .section-links, .pn, .crumbs, .slot')).toHaveCount(0);
  await expect(page.locator('.chapter-body')).toContainText('35 páginas no PDF · 4 seções · 19 subseções');
  expect(await page.locator('.chapter-summary > p').allTextContents()).toEqual(overview.paragraphs.map(text => text.replaceAll('*', '')));
  expect(await page.locator('.chapter-summary em').allTextContents()).toEqual(['Story', 'A Força do Carinho', 'beats']);
  await expect(page.getByRole('link', { name: 'Consultar PDF original' })).toHaveAttribute('href', '/content/chapter-02.pdf');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test('all chapter 2 reading sections reproduce the 141 paragraphs and six notes', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const paragraphs = [], notes = [];
  let quotes = 0, calls = 0;
  for (const section of content.sections.filter(s => s.parent === '2')) {
    await page.goto(`/#${section.id}`);
    await expect(page.locator('main h1')).toHaveText(section.title);
    paragraphs.push(...await page.locator('[data-paragraph]').allTextContents());
    notes.push(...await page.locator('[data-note]').allTextContents());
    quotes += await page.locator('blockquote').count();
    calls += await page.locator('.note-call').count();
    await expect(page.locator('.pdf-link')).toHaveAttribute('href', content.source.pdf);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
  expect(paragraphs).toEqual(content.paragraphs.map(p => p.text));
  expect(notes.sort()).toEqual(content.notes.map(n => n.text).sort());
  expect(quotes).toBe(1);
  expect(calls).toBe(5);
  const pdf = await page.request.get(content.source.pdf);
  expect(pdf.ok()).toBeTruthy();
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
  expect(errors).toEqual([]);
});

test('all 19 subsections resolve independently and preserve their source text', async ({ page }) => {
  for (const section of content.sections.filter(s => s.level === 3)) {
    await page.goto(`/#${section.id}`);
    await expect(page.locator('main h1')).toHaveText(section.title);
    expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(content.paragraphs.filter(p => p.section === section.id).map(p => p.text));
    await expect(page.locator(`.lab[href="#${section.id}"]`)).toHaveAttribute('aria-current', 'page');
  }
  await page.goto('/#2.1');
  await page.locator('.section-links a[href="#2.1.5"]').click();
  await expect(page.locator('main h1')).toHaveText('Sequência');
  await page.reload();
  await expect(page.locator('main h1')).toHaveText('Sequência');
  await page.goBack();
  await expect(page.locator('main h1')).toHaveText('A TERMINOLOGIA DO DESIGN DA ESTÓRIA');
  await page.locator('.pn .nx').click();
  await expect(page.locator('main h1')).toHaveText('O TRIÂNGULO DA ESTÓRIA');
});

test('original diagrams remain uncropped at their PDF positions and open in the lightbox', async ({ page }) => {
  for (const sectionId of ['2.2', '2.3']) {
    await page.goto(`/#${sectionId}`);
    const expected = figures.filter(f => content.paragraphs.find(p => p.id === f.afterParagraph).section.startsWith(`${sectionId}.`));
    await expect(page.locator('.fig-diagram')).toHaveCount(expected.length);
    for (const image of expected) {
      const figure = page.locator(`[data-illustration="${image.number}"]`);
      expect(await figure.evaluate(el => el.previousElementSibling.dataset.paragraphContainer)).toBe(image.afterParagraph);
      await figure.scrollIntoViewIfNeeded();
      await expect(figure.locator('img')).toHaveJSProperty('naturalWidth', image.width);
      await expect(figure.locator('img')).toHaveJSProperty('naturalHeight', image.height);
      const bounds = await figure.locator('.fig-frame').boundingBox();
      expect(bounds.width / bounds.height).toBeCloseTo(image.width / image.height, 2);
      expect(await figure.locator('img').evaluate(el => getComputedStyle(el).objectFit)).toBe('contain');
      await figure.getByRole('button').click();
      await expect(page.locator('.lightbox-img')).toHaveAttribute('src', image.src);
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(figure.getByRole('button')).toBeFocused();
    }
  }
  await page.goto('/#2.3');
  const third = page.locator('[data-illustration="03"]');
  expect(await third.evaluate(el => el.closest('.reading-block').nextElementSibling.querySelector('h3').textContent)).toBe('Mudança contra estática');
});

test('chapter 2 notes link to the correct chapter and the asterisk has no invented return link', async ({ page }) => {
  for (const note of content.notes.filter(n => n.paragraphs.length)) {
    const paragraph = content.paragraphs.find(p => p.id === note.paragraphs[0]);
    await page.goto(`/#${paragraph.section}`);
    await page.locator(`#call-${note.number}`).click();
    const inline = page.getByRole('note', { name: `Nota ${note.number}`, exact: true });
    await expect(inline.locator('p')).toHaveText(note.text);
    await inline.locator('.inline-note-footer-link').click();
    await expect(page.locator(`#note-${note.number}`)).toBeFocused();
    await page.locator(`#note-${note.number} .note-back`).click();
    await expect(page.locator(`#call-${note.number}`)).toBeFocused();
    expect(page.url()).toContain(`#${paragraph.section}?chamada=${note.number}`);
    await page.keyboard.press('Escape');
  }
  await page.goto('/#2.4.3');
  const asterisk = page.locator('.unnumbered-note');
  await expect(asterisk.locator('[data-note="*"]')).toHaveText(content.notes.find(n => n.number === '*').text);
  await expect(asterisk.locator('a')).toHaveCount(0);
  await expect(page.locator('.note-call')).toHaveCount(0);
});

test('saved paragraphs from both chapters persist together across navigation and reload', async ({ page }) => {
  const original = firstChapter.paragraphs[0], added = content.paragraphs[0];
  await page.goto('/#1.1');
  await page.locator(`[data-paragraph-container="${original.id}"] .para-bookmark`).click();
  await page.goto('/#2.1');
  await page.locator(`[data-paragraph-container="${added.id}"] .para-bookmark`).click();
  await page.reload();
  await expect(page.locator(`[data-paragraph="${added.id}"]`)).toHaveClass(/is-highlighted/);
  await page.getByRole('button', { name: 'Mostrar apenas meus destaques', exact: true }).click();
  await expect(page.locator('[data-paragraph]')).toHaveCount(1);
  await page.goto('/#1.1');
  await expect(page.locator(`[data-paragraph="${original.id}"]`)).toHaveClass(/is-highlighted/);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('story_highlights')).sort())).toEqual([original.id, added.id].sort());
});
