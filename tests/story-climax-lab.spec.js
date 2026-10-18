import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));
const source = chapter.paragraphs.filter(p => p.section === '2.1.7');

test('the complete Story artifact follows its final paragraph and stays exclusive to its concept page', async ({ page }) => {
  await page.goto('/#2.1.7');
  const lab = page.getByRole('complementary', { name: 'O evento chefe e o clímax da estória', exact: true });
  await expect(lab).toHaveCount(1);
  expect(await lab.evaluate(el => el.previousElementSibling.dataset.paragraphContainer)).toBe(source.at(-1).id);
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(source.map(p => p.text));
  await expect(page.locator('.story-definition')).toHaveText(source.find(p => p.order === 51).text);
  await expect(lab.locator('.sc-panel')).toHaveCount(3);
  await page.getByRole('button', { name: 'Destacar parágrafo 51', exact: true }).click();
  await page.getByRole('button', { name: 'Mostrar apenas meus destaques', exact: true }).click();
  await expect(lab).toHaveCount(0);
  await expect(page.locator('[data-paragraph]')).toHaveCount(1);
  await expect(page.locator('.pn a')).toHaveAttribute('href', '#2.1.6');
  await page.getByRole('button', { name: 'Mostrar texto completo', exact: true }).click();
  await expect(lab).toBeVisible();
  for (const route of ['2.1', '2.1.5', '2.1.6', '2']) {
    await page.goto(`/#${route}`);
    await expect(lab).toHaveCount(0);
  }
});

test('reversal tests change the result only after an attempt and block only the final climax', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#2.1.7');
  const lab = page.locator('.story-climax-lab');
  for (const [id, expected] of [['scene', 'voltam a viver juntos'], ['sequence', 'deseja voltar para Terre Haute'], ['act', 'ressuscita em seguida'], ['story', 'Reversão bloqueada']]) {
    const button = lab.locator(`button[data-reversal="${id}"]`);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(lab.locator('.sc-reversal-result')).toHaveAttribute('data-status', 'untried');
    const original = await lab.locator('.sc-original-turn').innerText();
    await lab.getByRole('button', { name: 'Tentar reverter esta mudança', exact: true }).click();
    await expect(lab.locator('.sc-reversal-result')).toHaveAttribute('data-status', id === 'story' ? 'blocked' : 'reversible');
    await expect(lab.locator('.sc-attempt-result')).toContainText(expected);
    expect(await lab.locator('.sc-original-turn').innerText()).toBe(original);
    await lab.getByRole('button', { name: 'Reiniciar teste', exact: true }).click();
    await expect(lab.locator('.sc-reversal-result')).toHaveAttribute('data-status', 'untried');
  }
  await lab.getByRole('button', { name: 'Tentar reverter esta mudança', exact: true }).click();
  await lab.locator('button[data-reversal="scene"]').click();
  await expect(lab.locator('.sc-reversal-result')).toHaveAttribute('data-status', 'untried');
  await expect(lab.getByRole('button', { name: 'Tentar reverter esta mudança', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('the hypothetical executive arc compares fixed endpoints while inspecting each career stage', async ({ page }) => {
  await page.goto('/#2.1.7');
  const lab = page.locator('.story-climax-lab');
  const endpoints = await lab.locator('.sc-master-event').innerText();
  await expect(lab.locator('.sc-master-event')).toContainText('otimista e honesta');
  await expect(lab.locator('.sc-master-event')).toContainText('Corrupta, cínica e cruel');
  for (const [id, career] of [['opening', 'Contratada em Nova Iorque'], ['act-one', 'Presidente da corporação'], ['act-two', 'Demitida pelo conselho'], ['act-three', 'destruição dos antigos patrões']]) {
    const button = lab.locator(`button[data-arc="${id}"]`);
    await button.focus();
    await page.keyboard.press('Space');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(lab.locator('.sc-arc-result')).toHaveAttribute('data-final', String(id === 'act-three'));
    await expect(lab.locator('.sc-career-state')).toContainText(career);
    await expect(lab.locator('.sc-character-state')).not.toBeEmpty();
    await expect(lab.locator('.sc-arc-summary')).not.toBeEmpty();
    expect(await lab.locator('.sc-master-event').innerText()).toBe(endpoints);
  }
  await expect(lab.locator('.sc-arc-status')).toContainText('absoluta e irreversível');
  await expect(lab.locator('.sc-panel').nth(1)).toContainText('Arco hipotético proposto por McKee');
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(source.map(p => p.text));
});

test('all five chain links expose their function and possible failure without changing other experiments', async ({ page }) => {
  await page.goto('/#2.1.7');
  const lab = page.locator('.story-climax-lab');
  for (const integrity of ['working', 'broken']) {
    await lab.locator(`button[data-integrity="${integrity}"]`).click();
    for (const id of ['line', 'beat', 'scene', 'sequence', 'act']) {
      const button = lab.locator(`button[data-link="${id}"]`);
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(lab.locator('.sc-chain-result')).toHaveAttribute('data-link', id);
      await expect(lab.locator('.sc-chain-result')).toHaveAttribute('data-integrity', integrity);
      await expect(lab.locator('.sc-chain-result h5')).toHaveText(integrity === 'working' ? 'Função na construção' : 'Possível falha');
      await expect(lab.locator('.sc-chain-result p')).not.toBeEmpty();
    }
  }
  await expect(lab.locator('.sc-arc-result')).toHaveAttribute('data-arc', 'act-three');
  await expect(lab.locator('.sc-reversal-result')).toHaveAttribute('data-status', 'untried');
});

test('the Story lab supports reading preferences and narrow screens at maximum font size', async ({ page }, info) => {
  await page.goto('/#2.1.7');
  const lab = page.locator('.story-climax-lab');
  await expect(lab).toBeVisible();
  const before = await lab.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole('button', { name: 'Ativar modo cinema', exact: true }).click();
  expect(await lab.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(before);
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Aumentar tamanho do texto', exact: true }).click();
  expect(await lab.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(26);
  for (const width of info.project.name === 'mobile' ? [390, 320] : [1440, 1150, 900]) {
    await page.setViewportSize({ width, height: 1000 });
    await lab.getByRole('button', { name: 'Tentar reverter esta mudança', exact: true }).click();
    for (const panel of await lab.locator('.sc-panel, .sc-master-event, .sc-reversal-result, .sc-arc-result').all()) {
      expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await lab.getByRole('button', { name: 'Reiniciar teste', exact: true }).click();
  }
});
