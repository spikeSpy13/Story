import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));
const paragraphs = chapter.paragraphs.filter(p => p.section === '2.1.1');
const titles = {
  coffee: 'Toma café e lê o jornal em silêncio',
  letter: 'Descobre a carta de traição do sócio',
  toast: 'Faz um brinde elogiando a lealdade do sócio no jantar',
};
const sequenceIds = lab => lab.locator('.structure-sequence > li').evaluateAll(items => items.map(item => item.dataset.event));

test('lab follows the final structure paragraph, preserves the book and respects the highlight filter', async ({ page }) => {
  await page.goto('/#2.1.1');
  const lab = page.getByRole('complementary', { name: 'Laboratório de estrutura', exact: true });
  await expect(lab).toHaveCount(1);
  expect(await lab.evaluate(el => el.previousElementSibling.dataset.paragraphContainer)).toBe(paragraphs.at(-1).id);
  await expect(page.locator('.structure-definition')).toHaveText(paragraphs[1].text);
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(paragraphs.map(p => p.text));
  await expect(lab.locator('.structure-lab-note').first()).toContainText('exemplos didáticos');
  await page.getByRole('button', { name: 'Destacar parágrafo 8', exact: true }).click();
  await page.getByRole('button', { name: 'Mostrar apenas meus destaques', exact: true }).click();
  await expect(lab).toHaveCount(0);
  await expect(page.locator('[data-paragraph]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Mostrar texto completo', exact: true }).click();
  await expect(lab).toBeVisible();
  await page.goto('/#2.1');
  await expect(lab).toHaveCount(1);
  await expect(page.locator('.structure-definition')).toHaveCount(1);
  await page.goto('/#2.1.2');
  await expect(lab).toHaveCount(0);
});

test('selection, exclusion and order change the sequence and its possible reading', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/#2.1.1');
  const lab = page.locator('.structure-lab');
  expect(await sequenceIds(lab)).toEqual(['letter', 'toast']);
  await expect(lab.locator('.structure-composition-result')).toContainText('Suspense e tensão');
  const invert = lab.getByRole('button', { name: '⇄ Inverter ordem dos eventos', exact: true });
  await invert.focus();
  await page.keyboard.press('Enter');
  expect(await sequenceIds(lab)).toEqual(['toast', 'letter']);
  await expect(lab.locator('.structure-composition-result')).toContainText('Surpresa e compaixão');
  await lab.getByRole('button', { name: 'Restaurar sequência', exact: true }).click();
  await lab.getByRole('button', { name: `Incluir: ${titles.coffee}`, exact: true }).click();
  await expect(lab.getByRole('button', { name: `Excluir: ${titles.coffee}`, exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(await sequenceIds(lab)).toEqual(['letter', 'toast', 'coffee']);
  await expect(lab.locator('.structure-selection-feedback')).toContainText('3 de 4 momentos incluídos');
  await expect(lab.locator('.structure-context-note')).toContainText('Em outro contexto');
  const before = lab.getByRole('button', { name: `Mover antes: ${titles.coffee}`, exact: true });
  await before.click();
  expect(await sequenceIds(lab)).toEqual(['letter', 'coffee', 'toast']);
  await before.click();
  expect(await sequenceIds(lab)).toEqual(['coffee', 'letter', 'toast']);
  await expect(before).toBeDisabled();
  await lab.getByRole('button', { name: `Mover depois: ${titles.coffee}`, exact: true }).click();
  expect(await sequenceIds(lab)).toEqual(['letter', 'coffee', 'toast']);
  await invert.click();
  expect(await sequenceIds(lab)).toEqual(['toast', 'coffee', 'letter']);
  await lab.getByRole('button', { name: `Excluir: ${titles.coffee}`, exact: true }).click();
  await expect(lab.locator('.structure-context-note')).toHaveCount(0);
  await lab.getByRole('button', { name: `Excluir: ${titles.letter}`, exact: true }).click();
  await expect(invert).toBeDisabled();
  await expect(lab.locator('.structure-composition-result')).toContainText('A comparação ainda está incompleta');
  await lab.getByRole('button', { name: `Excluir: ${titles.toast}`, exact: true }).click();
  expect(await sequenceIds(lab)).toEqual([]);
  await expect(lab.locator('.structure-composition-result')).toContainText('A sequência está vazia');
  await lab.getByRole('button', { name: 'Restaurar sequência', exact: true }).click();
  expect(await sequenceIds(lab)).toEqual(['letter', 'toast']);
  await expect(invert).toBeEnabled();
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(paragraphs.map(p => p.text));
  expect(errors).toEqual([]);
});

test('tabs support keyboard navigation, preserve composition, and expose all event and strategy states', async ({ page }, info) => {
  await page.goto('/#2.1.1');
  const lab = page.locator('.structure-lab');
  const composition = lab.getByRole('tab', { name: '1. Composição', exact: true });
  const event = lab.getByRole('tab', { name: '2. Evento', exact: true });
  const strategy = lab.getByRole('tab', { name: '3. Estratégia', exact: true });
  await expect(lab.getByRole('tablist')).toHaveAttribute('aria-orientation', info.project.name === 'mobile' ? 'vertical' : 'horizontal');
  await lab.getByRole('button', { name: '⇄ Inverter ordem dos eventos', exact: true }).click();
  await composition.focus();
  await page.keyboard.press('ArrowRight');
  await expect(event).toBeFocused();
  await expect(event).toHaveAttribute('aria-selected', 'true');
  await expect(lab.getByRole('tabpanel')).toHaveCount(1);
  await expect(lab.locator('.structure-atom-detail h5')).toHaveText('Delineia personagens');
  for (const [trigger, result] of [['Está situado em um ambiente', 'Gera imagem, ação e diálogo'], ['Retira sua energia de um conflito', 'Produz emoção'], ['Afeta ou é causado por pessoas', 'Delineia personagens']]) {
    const button = lab.getByRole('button', { name: new RegExp(trigger) });
    await button.focus();
    await page.keyboard.press('Space');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(lab.locator('.structure-atom-detail h5')).toHaveText(result);
  }
  await event.focus();
  await page.keyboard.press('End');
  await expect(strategy).toBeFocused();
  await expect(lab.locator('.structure-strategy-feedback')).toHaveAttribute('data-strategy', 'balanced');
  for (const [label, value, text] of [['Apenas sentimentos', 'feelings', 'autoindulgência'], ['Apenas ideias', 'ideas', 'solipsismo'], ['Estratégia dupla', 'balanced', 'Emoção + ponto de vista']]) {
    const button = lab.getByRole('button', { name: label, exact: true });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(lab.locator('.structure-strategy-feedback')).toHaveAttribute('data-strategy', value);
    await expect(lab.locator('.structure-strategy-feedback')).toContainText(text);
  }
  await strategy.focus();
  await page.keyboard.press('Home');
  await expect(composition).toBeFocused();
  expect(await sequenceIds(lab)).toEqual(['toast', 'letter']);
  await page.keyboard.press('ArrowLeft');
  await expect(strategy).toBeFocused();
});

test('all experiments follow the reading theme and font size without overflow', async ({ page }) => {
  await page.goto('/#2.1.1');
  const lab = page.locator('.structure-lab');
  const initial = await lab.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole('button', { name: 'Ativar modo cinema', exact: true }).click();
  expect(await lab.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(initial);
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Aumentar tamanho do texto', exact: true }).click();
  expect(await lab.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(26);
  for (const label of ['1. Composição', '2. Evento', '3. Estratégia']) {
    await lab.getByRole('tab', { name: label, exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    expect(await lab.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
  }
});
