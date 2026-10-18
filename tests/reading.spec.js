import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const content = JSON.parse(readFileSync(new URL('../src/content/chapter-01.json', import.meta.url)));
const overview = JSON.parse(readFileSync(new URL('../src/content/chapter-01-overview.json', import.meta.url)));

async function navigateFromIndex(page, id) {
  const menu = page.getByRole('button', { name: '☰ Índice' });
  if (await menu.isVisible()) await menu.click();
  await page.locator(`.lab[href="#${id}"]`).click();
}

test('chapter opening shows the supplied summary instead of the full text', async ({ page }) => {
  await page.goto('/#1');
  await expect(page.locator('main h1')).toHaveText(content.title);
  expect(await page.locator('.overview-opening, .chapter-body p').allTextContents()).toEqual(overview.paragraphs);
  await expect(page.locator('.overview-card em')).toHaveText('Story');
  await expect(page.getByRole('navigation', { name: 'Caminho' })).toHaveCount(0);
  await expect(page.locator('.drop-cap-paragraph')).toHaveText(overview.paragraphs[1]);
  await expect(page.locator('.closing-quote p')).toHaveText(overview.paragraphs[3]);
  const illustration = page.getByRole('img', { name: overview.image.alt });
  await expect(illustration).toBeVisible();
  await expect(illustration).toHaveJSProperty('naturalWidth', 1672);
  await expect(illustration).toHaveJSProperty('naturalHeight', 941);
  const imageBounds = await illustration.boundingBox();
  const titleBounds = await page.locator('main h1').boundingBox();
  const mainBounds = await page.locator('main').boundingBox();
  if (mainBounds.width >= 760) {
    expect(imageBounds.x).toBeGreaterThanOrEqual(titleBounds.x + titleBounds.width);
  } else {
    expect(imageBounds.y).toBeGreaterThan(titleBounds.y + titleBounds.height);
  }
  expect(await illustration.evaluate(img => getComputedStyle(img).objectFit)).toBe('cover');
  await expect(page.locator('[data-paragraph]')).toHaveCount(0);
  await expect(page.locator('[data-note]')).toHaveCount(0);
  await expect(page.locator('.section-links')).toHaveCount(0);
  await expect(page.locator('.pn')).toHaveCount(0);
  await navigateFromIndex(page, '1.1');
  await expect(page.locator('.chapter-overview')).toHaveCount(0);
  await expect(page.locator('[data-paragraph]')).toHaveCount(14);
});

test('section pages preserve all 72 source paragraphs, four quotes and six notes', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const paragraphs = [], notes = [];
  let quotes = 0, calls = 0;
  for (const section of content.sections.filter(s => s.parent === '1')) {
    await page.goto(`/#${section.id}`);
    await expect(page.locator('main h1')).toHaveText(section.title);
    paragraphs.push(...await page.locator('[data-paragraph]').allTextContents());
    notes.push(...await page.locator('[data-note]').allTextContents());
    quotes += await page.locator('blockquote').count();
    calls += await page.locator('.note-call').count();
  }
  expect(paragraphs).toEqual(content.paragraphs.map(p => p.text));
  expect(notes).toEqual(content.notes.map(n => n.text));
  expect(quotes).toBe(4);
  expect(calls).toBe(6);
  const pdf = await page.request.get('/content/chapter-01.pdf');
  expect(pdf.ok()).toBeTruthy();
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
  expect(errors).toEqual([]);
});

test('Declínio illustrations appear at the marked paragraphs, with 04 after anarquia da existência', async ({ page }) => {
  await page.goto('/#1.1');
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('.section-hero [data-illustration="01"]')).toHaveCount(1);
  await expect(page.locator('.reading-canvas [data-illustration="01"]')).toHaveCount(0);
  const expected = [['02', '2'], ['03', '3'], ['04', '6'], ['05', '9'], ['06', '11'], ['07', '13']];
  expect(await page.locator('.reading-canvas [data-illustration]').evaluateAll(figures => figures.map(figure =>
    [figure.dataset.illustration, figure.dataset.illustration === '04'
      ? figure.previousElementSibling?.dataset.order : figure.nextElementSibling?.dataset.order]))).toEqual(expected);
  expect(await page.locator('[data-illustration="04"]').evaluate(figure => figure.previousElementSibling.textContent))
    .toMatch(/é nossa melhor tentativa para descobrir algum sentido na anarquia da existência\.$/);
  const numbers = ['01', '02', '03', '04', '05', '06', '07'];
  expect(await page.locator('.fig-num').allTextContents()).toEqual(numbers.map(number => `FIG. ${number}`));
  const mainBounds = await page.locator('.editorial-section').boundingBox();
  for (const number of numbers) {
    const image = page.locator(`[data-illustration="${number}"] img`);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty('naturalWidth', 1672);
    await expect(image).toHaveJSProperty('naturalHeight', 941);
    const bounds = await page.locator(`[data-illustration="${number}"] .fig-frame`).boundingBox();
    const ratio = number === '01' ? 16 / 10 : ['04', '05', '07'].includes(number) ? 21 / 9
      : mainBounds.width >= 720 ? 4 / 3 : 16 / 9;
    expect(bounds.width / bounds.height).toBeCloseTo(ratio, 2);
  }
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(
    content.paragraphs.filter(p => p.section === '1.1').map(p => p.text));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.locator('#call-1').click();
  await expect(page.getByRole('note', { name: 'Nota 1', exact: true })).toBeVisible();
  await page.locator('.inline-note-footer-link').click();
  await expect(page.locator('#note-1')).toBeFocused();
  await page.locator('#note-1 .note-back').click();
  await expect(page.locator('#call-1')).toBeFocused();
  await page.goto('/#1.2');
  await expect(page.locator('[data-illustration]')).toHaveCount(0);
});

test('section links, subsection hierarchy, reload and browser history', async ({ page }) => {
  await page.goto('/#1');
  await navigateFromIndex(page, '1.3');
  await expect(page).toHaveURL(/#1\.3$/);
  await expect(page.locator('main h1')).toHaveText('O IMPERATIVO DA ESTÓRIA');
  await expect(page.locator('[data-paragraph]')).toHaveCount(20);
  await expect(page.locator('article h3')).toHaveText('Boa estória bem contada');
  await page.locator('.section-links a[href="#1.3.1"]').click();
  await page.reload();
  await expect(page.locator('main h1')).toHaveText('Boa estória bem contada');
  await expect(page.locator('[data-paragraph]')).toHaveCount(6);
  await page.goBack();
  await expect(page.locator('main h1')).toHaveText('O IMPERATIVO DA ESTÓRIA');
  await page.locator('.pn .nx').click();
  await expect(page.locator('main h1')).toHaveText('ESTÓRIA E VIDA');
});

test('all notes open inline without jumping, with footer fallback and return links', async ({ page }) => {
  for (const note of content.notes) {
    const paragraph = content.paragraphs.find(p => p.segments.some(s => s.note === note.number));
    await page.goto(`/#${paragraph.section}`);
    await page.locator(`#call-${note.number}`).evaluate(e => e.scrollIntoView({ block: 'center' }));
    const before = await page.evaluate(() => scrollY);
    const url = page.url();
    await page.locator(`#call-${note.number}`).click();
    const inline = page.getByRole('note', { name: `Nota ${note.number}`, exact: true });
    await expect(inline).toBeVisible();
    await expect(inline.locator('p')).toHaveText(note.text);
    expect(page.url()).toBe(url);
    expect(Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThan(4);
    await inline.getByRole('link', { name: 'Ver nota no fim da seção' }).click();
    await expect(page.locator(`#note-${note.number}`)).toBeFocused();
    await page.locator(`#note-${note.number} .note-back`).click();
    await expect(page.locator(`#call-${note.number}`)).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(inline).toHaveCount(0);
    await expect(page.locator(`#call-${note.number}`)).toHaveAttribute('aria-expanded', 'false');
  }
  await page.goto('/#1.1?nota=1');
  await expect(page.locator('#note-1')).toBeFocused();
});

test('home, pending chapter and no horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.card')).toHaveCount(19);
  await page.locator('.card[href="#2"]').click();
  await expect(page.getByText('Os arquivos deste capítulo ainda não foram enviados.')).toBeVisible();
  await expect(page.locator('[data-paragraph]')).toHaveCount(0);
  await page.goto('/#1.3.1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.goto('/#1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test('mobile drawer closes by keyboard, selection and backdrop', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'Mobile navigation only');
  await page.goto('/');
  const menu = page.getByRole('button', { name: '☰ Índice' });
  await menu.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await menu.click();
  await page.locator('.lab[href="#1"]').click();
  await expect(page.locator('main h1')).toHaveText(content.title);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.locator('.scrim').click({ position: { x: 380, y: 400 } });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});
