import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));
const sectionParagraphs = chapter.paragraphs.filter(p => p.section === '2.2.1');
const models = [
  { name: 'Arquitrama', title: 'Design Clássico', order: 67, count: 24, features: ['Causalidade', 'Final fechado', 'Tempo linear', 'Conflito externo', 'Protagonista único', 'Realidade consistente', 'Protagonista ativo'] },
  { name: 'Minitrama', title: 'Minimalismo', order: 68, count: 19, features: ['Final aberto', 'Conflito interno', 'Multi-protagonista', 'Protagonista passivo'] },
  { name: 'Antitrama', title: 'Antiestrutura', order: 69, count: 21, features: ['Coincidência', 'Tempo não linear', 'Realidades inconsistentes'] },
];

test('vertices and every principle work by keyboard, with source definitions and correct contrasts', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/#2.2.1');
  const figure = page.locator('.story-triangle');
  await expect(figure).toHaveCount(1);
  for (const model of models) {
    const vertex = figure.getByRole('button', { name: `${model.title} — ${model.name}`, exact: true });
    await vertex.focus();
    await page.keyboard.press('Space');
    await expect(vertex).toHaveAttribute('aria-pressed', 'true');
    expect(await figure.locator('.story-feature').allTextContents()).toEqual(model.features);
    const sourceExcerpt = await figure.locator('.story-source-excerpt').textContent();
    expect(sectionParagraphs.some(p => p.text.includes(sourceExcerpt))).toBeTruthy();
    for (const label of model.features) {
      const feature = figure.getByRole('button', { name: label, exact: true });
      await feature.focus();
      await page.keyboard.press('Enter');
      await expect(feature).toHaveAttribute('aria-pressed', 'true');
      await expect(figure.locator('.story-axis-comparison > div')).toHaveCount(3);
      const definition = await figure.locator('.story-source-excerpt').textContent();
      expect(chapter.paragraphs.some(p => p.text === definition)).toBeTruthy();
      await figure.getByRole('button', { name: 'Voltar ao vértice', exact: true }).click();
      await expect(feature).toBeFocused();
    }
  }
  await figure.getByRole('button', { name: 'Design Clássico — Arquitrama', exact: true }).click();
  await figure.getByRole('button', { name: 'Causalidade', exact: true }).click();
  expect(await figure.locator('.story-axis-comparison dd').allTextContents()).toEqual(['Causalidade', 'Não indicado neste vértice', 'Coincidência']);
  await figure.getByRole('button', { name: 'Final fechado', exact: true }).click();
  expect(await figure.locator('.story-axis-comparison dd').allTextContents()).toEqual(['Final fechado', 'Final aberto', 'Não indicado neste vértice']);
  await figure.getByRole('button', { name: 'Tempo linear', exact: true }).click();
  await expect(figure.locator('.story-source-excerpt')).toContainText('com ou sem flashbacks');
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(sectionParagraphs.map(p => p.text));
  await expect(figure.locator('.story-source-reference')).toContainText('seção 2.3.5');
  await expect(figure.getByRole('link')).toHaveCount(0);
  await page.goto('/#2.3.5');
  await expect(page).toHaveURL(/#2\.3\.5$/);
  await expect(page.locator('main h1')).toHaveText('Tempo linear contra tempo não linear');
  expect(errors).toEqual([]);
});

test('film catalog filters all 64 source films without changing titles, countries or years', async ({ page }) => {
  await page.goto('/#2.2.1');
  const figure = page.locator('.story-triangle');
  await figure.locator('summary').click();
  let total = 0;
  for (const model of models) {
    await figure.getByRole('button', { name: `${model.title} — ${model.name}`, exact: true }).click();
    await expect(figure.locator('summary')).toHaveText(`Exemplos no cinema — ${model.name} (${model.count})`);
    const films = await figure.locator('.story-film-list li').evaluateAll(items => items.map(item => [item.querySelector('strong').textContent, item.querySelector('span').textContent]));
    expect(films).toHaveLength(model.count);
    const source = chapter.paragraphs.find(p => p.order === model.order).text;
    let previous = -1;
    for (const [title, info] of films) {
      const position = source.indexOf(`${title} (${info})`);
      expect(position).toBeGreaterThan(previous);
      previous = position;
    }
    total += films.length;
  }
  expect(total).toBe(64);
  await expect(figure.locator('.story-film-list')).toContainText('8 ½');
  await expect(figure.locator('.story-film-list')).toContainText('USA/1943');
  await figure.locator('summary').click();
  await expect(figure.locator('.story-film-list')).toBeHidden();
});

test('original figure remains available at its source position and zoom restores focus', async ({ page }) => {
  await page.goto('/#2.2.1');
  const figure = page.locator('.story-triangle');
  expect(await figure.evaluate(el => el.previousElementSibling.dataset.order)).toBe('65');
  await figure.getByRole('button', { name: 'Diagrama original', exact: true }).click();
  await expect(figure.locator('img')).toHaveJSProperty('naturalWidth', 626);
  await figure.getByRole('button', { name: 'Ampliar diagrama original', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Figura 01 ampliada', exact: true })).toBeVisible();
  await expect(page.locator('.lightbox-img')).toHaveAttribute('src', '/images/chapter-02/diagrama-01.jpeg');
  await page.keyboard.press('Escape');
  await expect(figure.getByRole('button', { name: 'Ampliar diagrama original', exact: true })).toBeFocused();
  await figure.getByRole('button', { name: 'Explorar vértices', exact: true }).click();
  await expect(figure.locator('.story-feature')).toHaveCount(7);
  await page.goto('/#2.3');
  await expect(page.locator('.story-triangle')).toHaveCount(0);
  await expect(page.locator('.fig-diagram')).toHaveCount(2);
});

test('diagram follows reader theme and font size without overflow at the largest text setting', async ({ page }, info) => {
  await page.goto('/#2.2.1');
  const figure = page.locator('.story-triangle');
  const background = await figure.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole('button', { name: 'Ativar modo cinema', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await figure.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(background);
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Aumentar tamanho do texto', exact: true }).click();
  expect(await figure.locator('.story-feature').first().evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeCloseTo(24.7, 1);
  for (const model of models) {
    await figure.getByRole('button', { name: `${model.title} — ${model.name}`, exact: true }).click();
    await figure.locator('.story-feature').first().click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    expect(await figure.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
  }
  if (info.project.name === 'desktop') {
    const vertex = figure.getByRole('button', { name: 'Minimalismo — Minitrama', exact: true });
    await vertex.hover();
    await expect(vertex).toHaveAttribute('aria-pressed', 'true');
  }
});
