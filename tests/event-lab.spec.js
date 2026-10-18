import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));
const paragraphs = chapter.paragraphs.filter(p => p.section === '2.1.2');
const diagnostic = page => page.locator('.event-stage-monitor');

test('event lab follows Rainmaker once, preserves all nine paragraphs and stays out of saved-only reading', async ({ page }) => {
  await page.goto('/#2.1.2');
  const lab = page.getByRole('complementary', { name: 'Da mudança física ao evento dramático', exact: true });
  await expect(lab).toHaveCount(1);
  expect(await lab.evaluate(el => el.previousElementSibling.dataset.paragraphContainer)).toBe(paragraphs.at(-1).id);
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(paragraphs.map(p => p.text));
  await expect(page.locator('.event-definition')).toHaveCount(3);
  await page.getByRole('button', { name: 'Destacar parágrafo 18', exact: true }).click();
  await page.getByRole('button', { name: 'Mostrar apenas meus destaques', exact: true }).click();
  await expect(lab).toHaveCount(0);
  await expect(page.locator('[data-paragraph]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Mostrar texto completo', exact: true }).click();
  await expect(lab).toBeVisible();
  await page.goto('/#2.1');
  await expect(lab).toHaveCount(1);
  await expect(page.locator('.structure-lab')).toHaveCount(1);
  await page.goto('/#2.1.3');
  await expect(lab).toHaveCount(0);
});

test('the four rain stages expose a character, value and conflict progressively by keyboard', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/#2.1.2');
  const lab = page.locator('.event-lab');
  const cases = [
    ['street', ['false', 'false', 'false'], 'Mudança física'],
    ['person', ['true', 'false', 'false'], 'faltam valor significativo e conflito'],
    ['monsoon', ['true', 'true', 'false'], 'a coincidência ainda não basta'],
    ['rainmaker', ['true', 'true', 'true'], 'alcançada através do conflito'],
  ];
  for (const [id, checks, verdict] of cases) {
    const button = lab.locator(`.event-stage-options [data-stage="${id}"]`);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(diagnostic(page)).toHaveAttribute('data-stage', id);
    expect(await lab.locator('[data-criterion]').evaluateAll(items => items.map(item => item.dataset.active))).toEqual(checks);
    await expect(lab.locator('.event-criteria [role="meter"]')).toHaveAttribute('aria-valuenow', String(checks.filter(value => value === 'true').length));
    await expect(lab.locator('.event-verdict')).toContainText(verdict);
  }
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(paragraphs.map(p => p.text));
  expect(errors).toEqual([]);
});

test('all twelve source value pairs invert individually and together', async ({ page }) => {
  await page.goto('/#2.1.2');
  const lab = page.locator('.event-lab');
  const cards = lab.locator('.event-value-card');
  await expect(cards).toHaveCount(12);
  const source = paragraphs.find(p => p.order === 15).text.toLocaleLowerCase('pt-BR');
  for (const card of await cards.all()) {
    const words = await card.locator('.event-value-pair > span:not([aria-hidden])').allTextContents();
    expect(source).toContain(words.join('/').toLocaleLowerCase('pt-BR'));
    await expect(card).toHaveAttribute('aria-pressed', 'true');
    await card.focus();
    await page.keyboard.press('Space');
    await expect(card).toHaveAttribute('aria-pressed', 'false');
    await expect(card.locator('.event-value-pair .active')).toHaveText(words[1]);
    await expect(card).toHaveAttribute('aria-label', new RegExp(`Atual: ${words[1]} \\(negativo\\)`));
  }
  await lab.getByRole('button', { name: '⇄ Inverter todas as cargas', exact: true }).click();
  expect(await cards.evaluateAll(items => items.every(item => item.getAttribute('aria-pressed') === 'true'))).toBeTruthy();
  await lab.locator('[data-value="life"]').click();
  await lab.getByRole('button', { name: '⇄ Inverter todas as cargas', exact: true }).click();
  await expect(lab.locator('[data-value="life"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(lab.locator('[data-value="hope"]')).toHaveAttribute('aria-pressed', 'false');
  await lab.locator('.event-stage-options [data-stage="monsoon"]').click();
  await expect(lab.locator('[data-value="hope"]')).toHaveAttribute('aria-pressed', 'false');
});

test('conflict matrix updates stage 4 and its diagnostic for partial and empty selections', async ({ page }) => {
  await page.goto('/#2.1.2');
  const lab = page.locator('.event-lab');
  const meter = lab.locator('.event-conflict-feedback [role="meter"]');
  await expect(meter).toHaveAttribute('aria-valuenow', '4');
  for (const [index, id] of ['internal', 'personal', 'social', 'physical'].entries()) {
    const button = lab.locator(`[data-conflict="${id}"]`);
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await expect(diagnostic(page)).toHaveAttribute('data-stage', 'rainmaker');
    await expect(meter).toHaveAttribute('aria-valuenow', String(3 - index));
    await expect(lab.locator('[data-criterion="conflict"]')).toHaveAttribute('data-active', index < 3 ? 'true' : 'false');
    if (index < 3) await expect(lab.locator('.event-verdict')).toContainText('Evento da Estória');
  }
  await expect(lab.locator('.event-criteria [role="meter"]')).toHaveAttribute('aria-valuenow', '2');
  await expect(lab.locator('.event-verdict')).toContainText('Sem conflito selecionado');
  await lab.locator('[data-conflict="internal"]').click();
  await expect(lab.locator('.event-criteria [role="meter"]')).toHaveAttribute('aria-valuenow', '3');
  await expect(lab.locator('.event-verdict')).toContainText('Evento da Estória');
  await expect(lab.locator('.event-conflict-feedback')).toContainText('1 de 4 camadas ativas');
  await lab.locator('.event-stage-options [data-stage="street"]').click();
  await expect(lab.locator('[data-criterion="conflict"]')).toHaveAttribute('data-active', 'false');
  await lab.locator('.event-stage-options [data-stage="rainmaker"]').click();
  await expect(lab.locator('[data-criterion="conflict"]')).toHaveAttribute('data-active', 'true');
});

test('stage diagnostics, values and conflicts follow theme and font without horizontal overflow', async ({ page }) => {
  await page.goto('/#2.1.2');
  const lab = page.locator('.event-lab');
  const before = await lab.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole('button', { name: 'Ativar modo cinema', exact: true }).click();
  expect(await lab.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(before);
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Aumentar tamanho do texto', exact: true }).click();
  expect(await lab.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(26);
  expect(await lab.locator('.event-value-pair').first().evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(26);
  for (const id of ['street', 'person', 'monsoon', 'rainmaker']) {
    await lab.locator(`.event-stage-options [data-stage="${id}"]`).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    expect(await lab.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
  }
});
