import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));
const source = chapter.paragraphs.filter(p => p.section === '2.2');
const models = chapter.paragraphs.filter(p => p.section === '2.2.1');

test('the triangle introduction has its own seven paragraphs and full plot lab, separately from its models', async ({ page }) => {
  await page.goto('/#2.2');
  const lab = page.getByRole('complementary', { name: 'Trama: escolhas no tempo', exact: true });
  await expect(lab).toHaveCount(1);
  expect(await lab.evaluate(el => el.previousElementSibling.dataset.paragraphContainer)).toBe(source.at(-1).id);
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(source.map(p => p.text));
  await expect(page.locator('.reading-block')).toHaveCount(1);
  await expect(page.locator('.tools-badge')).toHaveText('LEITURA · 7 PARÁGRAFOS');
  await expect(page.locator('.plot-definition')).toHaveText(source[1].text);
  await expect(page.locator('.story-triangle, .fig-diagram, .notes, .section-links, .crumbs')).toHaveCount(0);
  await expect(lab.locator('.pd-panel')).toHaveCount(3);
  await expect(page.locator('.pn .nx')).toHaveAttribute('href', '#2.2.1');
  await page.getByRole('button', { name: 'Destacar parágrafo 55', exact: true }).click();
  await page.getByRole('button', { name: 'Mostrar apenas meus destaques', exact: true }).click();
  await expect(lab).toHaveCount(0);
  await expect(page.locator('[data-paragraph]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Mostrar texto completo', exact: true }).click();
  await expect(lab).toBeVisible();
  for (const route of ['2.2.1', '2.1', '2.3', '2']) {
    await page.goto(`/#${route}`);
    await expect(lab).toHaveCount(0);
  }
});

test('all four phases and three writing lenses preserve their independent selection and didactic labels', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#2.2');
  const lab = page.locator('.plot-design-lab');
  await expect(lab.locator('.pd-exercise-label')).toContainText('criadas para este exercício');
  const samples = new Set();
  for (const lens of ['prose', 'exposition', 'cinema']) {
    const option = lab.locator(`button[data-lens="${lens}"]`);
    await option.focus();
    await page.keyboard.press('Enter');
    await expect(option).toHaveAttribute('aria-pressed', 'true');
    for (const phase of ['despair', 'threads', 'trial', 'change']) {
      const button = lab.locator(`button[data-phase="${phase}"]`);
      await button.focus();
      await page.keyboard.press('Space');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(lab.locator('.pd-translation-result')).toHaveAttribute('data-phase', phase);
      await expect(lab.locator('.pd-translation-result')).toHaveAttribute('data-lens', lens);
      await expect(lab.locator('.pd-writing-example')).toContainText('Exemplo didático');
      samples.add(await lab.locator('.pd-writing-example p').textContent());
      if (phase === 'trial') await expect(lab.locator('.pd-inner-state')).toContainText('Hipótese de exercício');
    }
  }
  expect(samples.size).toBe(12);
  await expect(lab.locator('.pd-carpenter')).toContainText('transformar o mental em físico');
  expect(errors).toEqual([]);
});

test('the four composition hypotheses visibly omit, add and reorder events without a numerical score', async ({ page }) => {
  await page.goto('/#2.2');
  const lab = page.locator('.plot-design-lab');
  const reference = ['opening', 'work', 'threads', 'trial', 'ending'];
  for (const [id, order, change] of [
    ['reference', reference, null],
    ['exclude', reference, 'Omissão'],
    ['include', ['opening', 'work', 'threads', 'show', 'trial', 'ending'], 'Inclusão'],
    ['reorder', ['opening', 'trial', 'work', 'threads', 'ending'], 'Antecipação'],
  ]) {
    const button = lab.locator(`button[data-pattern="${id}"]`);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(lab.locator('.pd-pattern-result')).toHaveAttribute('data-pattern', id);
    expect(await lab.locator('.pd-event-list li').evaluateAll(items => items.map(item => item.dataset.event))).toEqual(order);
    await expect(lab.locator('.pd-change-label')).toHaveCount(change ? 1 : 0);
    if (change) {
      await expect(lab.locator('.pd-change-label')).toHaveText(change);
      await expect(lab.locator('.pd-diagnosis')).toContainText('Hipótese de montagem');
    }
    await expect(lab.locator('.pd-diagnosis p')).not.toBeEmpty();
    await expect(lab.locator('.pd-pattern-result')).not.toContainText('%');
  }
  await expect(lab.locator('.pd-pattern-result')).toContainText('anteceder sua construção');
  await lab.locator('button[data-pattern="reference"]').click();
  await expect(lab.locator('.pd-change-label')).toHaveCount(0);
  await expect(lab.locator('.pd-translation-result')).toHaveAttribute('data-phase', 'despair');
});

test('the concept comparison changes only its own panel and keeps the source intact', async ({ page }) => {
  await page.goto('/#2.2');
  const lab = page.locator('.plot-design-lab');
  await lab.locator('button[data-pattern="reorder"]').click();
  await lab.locator('button[data-phase="threads"]').click();
  await lab.locator('button[data-concept="misconception"]').click();
  await expect(lab.locator('.pd-concept-result')).toHaveAttribute('data-concept', 'misconception');
  await expect(lab.locator('.pd-concept-result')).toContainText('filme “sem trama”');
  await expect(lab.locator('.pd-design-principles')).toHaveCount(0);
  await lab.locator('button[data-concept="design"]').click();
  await expect(lab.locator('.pd-design-principles li')).toHaveCount(3);
  await expect(lab.locator('.pd-concept-result')).toContainText('Toda estória tem uma trama');
  await expect(lab.locator('.pd-pattern-result')).toHaveAttribute('data-pattern', 'reorder');
  await expect(lab.locator('.pd-translation-result')).toHaveAttribute('data-phase', 'threads');
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(source.map(p => p.text));
});

test('the footer connects introduction, models and formal differences in both directions', async ({ page }) => {
  await page.goto('/#2.2');
  await page.locator('.pn .nx').click();
  await expect(page.locator('main h1')).toHaveText('Arquitrama, Minitrama, Antitrama');
  await expect(page.locator('.plot-design-lab')).toHaveCount(0);
  await expect(page.locator('.story-triangle')).toHaveCount(1);
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(models.map(p => p.text));
  await expect(page.locator('.pn a').filter({hasText:'Anterior'})).toHaveAttribute('href', '#2.2');
  await page.locator('.pn .nx').click();
  await expect(page).toHaveURL(url => url.hash === '#2.3');
  await expect(page.locator('.lab[aria-current="page"]')).toHaveAttribute('href', '#2.3');
  await page.locator('.pn a').filter({hasText:'Anterior'}).click();
  await expect(page).toHaveURL(url => url.hash === '#2.2.1');
  await expect(page.locator('.lab[aria-current="page"]')).toHaveAttribute('href', '#2.2.1');
  await page.locator('.pn a').filter({hasText:'Anterior'}).click();
  await expect(page.locator('.plot-design-lab')).toBeVisible();
  await page.reload();
  await expect(page.locator('[data-paragraph]')).toHaveCount(7);
  await page.goBack();
  await expect(page.locator('main h1')).toHaveText('Arquitrama, Minitrama, Antitrama');
});

test('the separated pages retain their PDF link and notes stay at their source section', async ({ page }) => {
  for (const route of ['2.2', '2.2.1']) {
    await page.goto(`/#${route}`);
    await expect(page.locator('.notes, .note-call')).toHaveCount(0);
    await expect(page.locator('.pdf-link')).toHaveAttribute('href', chapter.source.pdf);
  }
  await page.goto('/#2.3.5?nota=3');
  await expect(page.locator('main h1')).toHaveText('Tempo linear contra tempo não linear');
  await expect(page.locator('#note-3')).toBeFocused();
  await expect(page.locator('#note-3')).toBeInViewport();
  await expect(page.locator('[data-note="3"]')).toHaveText(chapter.notes.find(n => n.number === '3').text);
});

test('plot panels follow theme, enlarged text and narrow screens', async ({ page }, info) => {
  await page.goto('/#2.2');
  const lab = page.locator('.plot-design-lab');
  await expect(lab).toBeVisible();
  const before = await lab.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole('button', { name: 'Ativar modo cinema', exact: true }).click();
  expect(await lab.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(before);
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Aumentar tamanho do texto', exact: true }).click();
  expect(await lab.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(26);
  for (const width of info.project.name === 'mobile' ? [390, 320] : [1440, 1150, 900]) {
    await page.setViewportSize({ width, height: 1000 });
    await lab.locator('button[data-pattern="include"]').click();
    for (const panel of await lab.locator('.pd-panel, .pd-writing-example, .pd-pattern-result').all()) {
      expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
});
