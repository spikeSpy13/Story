import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));
const source = chapter.paragraphs.filter(p => p.section === '2.1.6');
const domainIds = ['inner', 'personal', 'world'];

test('the full Act artifact follows its definition and stays exclusive to the Act page', async ({ page }) => {
  await page.goto('/#2.1.6');
  const lab = page.getByRole('complementary', { name: 'Sequências rumo à grande reversão', exact: true });
  await expect(lab).toHaveCount(1);
  expect(await lab.evaluate(el => el.previousElementSibling.dataset.paragraphContainer)).toBe(source.at(-1).id);
  expect(await lab.evaluate(el => el.closest('[data-section]').dataset.section)).toBe('2.1.6');
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(source.map(p => p.text));
  await expect(page.locator('.act-definition')).toHaveText(source.at(-1).text);
  await expect(lab.locator('.ar-panel')).toHaveCount(3);
  await expect(lab.getByRole('link')).toHaveCount(0);
  await page.getByRole('button', { name: 'Destacar parágrafo 48', exact: true }).click();
  await page.getByRole('button', { name: 'Mostrar apenas meus destaques', exact: true }).click();
  await expect(lab).toHaveCount(0);
  await expect(page.locator('[data-paragraph]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Mostrar texto completo', exact: true }).click();
  await expect(lab).toBeVisible();
  for (const route of ['2.1', '2.1.5', '2.1.7', '2']) {
    await page.goto(`/#${route}`);
    await expect(lab).toHaveCount(0);
  }
  await page.goto('/#2.1.5');
  await expect(page.locator('.sequence-act-lab .sa-panel')).toHaveCount(3);
});

test('all degrees and both directions expose faithful examples or labeled hypotheses', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#2.1.6');
  const lab = page.locator('.act-reversal-lab');
  const expected = {
    scene: { better: ['Exemplo do capítulo', 'Dúvida → Autoconfiança'], worse: ['Exemplo do capítulo', 'Autoconfiança → Derrota'] },
    sequence: { better: ['Exemplo do capítulo', 'Sem o novo trabalho → Contratada'], worse: ['Hipótese de exercício', 'Oportunidade aberta → Vaga perdida'] },
    act: { better: ['Hipótese de exercício', 'Vulnerabilidade → Posição de poder'], worse: ['Hipótese de exercício', 'Prestígio → Incriminação'] },
  };
  for (const degree of ['scene', 'sequence', 'act']) {
    const button = lab.locator(`button[data-degree="${degree}"]`);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    for (const direction of ['better', 'worse']) {
      const toggle = lab.locator(`button[data-direction="${direction}"]`);
      await toggle.focus();
      await page.keyboard.press('Space');
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      await expect(lab.locator('.ar-degree-result')).toHaveAttribute('data-degree', degree);
      await expect(lab.locator('.ar-degree-result')).toHaveAttribute('data-direction', direction);
      await expect(lab.locator('.ar-example-kind')).toHaveText(expected[degree][direction][0]);
      await expect(lab.locator('.ar-value-shift')).toHaveText(expected[degree][direction][1]);
    }
  }
  await expect(lab.locator('.ar-panel').first()).toContainText('ainda pode ser revertida');
  await expect(lab.locator('.ar-chain-result')).toHaveAttribute('data-sequence', 'c');
  expect(errors).toEqual([]);
});

test('the hypothetical sequence chain culminates in the final scene without presenting invented events as the book', async ({ page }) => {
  await page.goto('/#2.1.6');
  const lab = page.locator('.act-reversal-lab');
  await expect(lab.locator('.ar-hypothesis')).toContainText('continuações inventadas');
  await expect(lab.locator('.ar-hypothesis')).toContainText('não uma quantidade obrigatória');
  expect(await lab.locator('.ar-scene-strip > span').allTextContents()).toEqual(Array.from({length:10}, (_, i) => String(i + 1)));
  await expect(lab.locator('.ar-scene-strip [data-climax="true"]')).toHaveText('10');
  for (const id of ['a', 'b', 'c']) {
    const button = lab.locator(`button[data-sequence="${id}"]`);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(lab.locator('.ar-chain-result')).toHaveAttribute('data-sequence', id);
    await expect(lab.locator('.ar-chain-result')).toHaveAttribute('data-climax', String(id === 'c'));
    await expect(lab.locator('.ar-chain-kind')).toHaveText(id === 'a' ? 'Retoma o exemplo do capítulo' : 'Continuação hipotética');
    await expect(lab.locator('.ar-chain-summary')).not.toBeEmpty();
  }
  await expect(lab.locator('.ar-chain-impact')).toContainText('ao mesmo tempo, clímax desta sequência e clímax do ato');
  await lab.locator('button[data-sequence="a"]').click();
  await expect(lab.locator('.ar-chain-result')).toHaveAttribute('data-climax', 'false');
  await expect(lab.locator('.ar-chain-impact')).toContainText('outras sequências ainda preparam');
});

test('all eight combinations of impact domains work and do not act as a quality score', async ({ page }) => {
  await page.goto('/#2.1.6');
  const lab = page.locator('.act-reversal-lab');
  for (let mask = 0; mask < 8; mask++) {
    for (const [index, id] of domainIds.entries()) {
      const button = lab.locator(`button[data-domain="${id}"]`);
      const wanted = Boolean(mask & (1 << index));
      if (await button.getAttribute('aria-pressed') !== String(wanted)) {
        await button.focus();
        await page.keyboard.press('Space');
      }
      await expect(button).toHaveAttribute('aria-pressed', String(wanted));
    }
    const active = domainIds.filter((_, i) => mask & (1 << i));
    expect(await lab.locator('[data-domain-card]').evaluateAll(items => items.map(item => item.dataset.domainCard))).toEqual(active);
    await expect(lab.locator('.ar-domain-synthesis strong')).toContainText(String(active.length));
    if (active.length) await expect(lab.locator('.ar-domain-synthesis')).toContainText('não determina a qualidade');
    else await expect(lab.locator('.ar-empty-domains')).toBeVisible();
  }
  await lab.getByRole('button', { name: 'Limpar seleção', exact: true }).click();
  await expect(lab.locator('[data-domain-card]')).toHaveCount(0);
  await lab.getByRole('button', { name: 'Combinar as três esferas', exact: true }).click();
  await expect(lab.locator('[data-domain-card]')).toHaveCount(3);
  await expect(lab.locator('.ar-domain-better')).toHaveCount(3);
  await expect(lab.locator('.ar-domain-worse')).toHaveCount(3);
  await expect(lab.locator('.ar-chain-result')).toHaveAttribute('data-sequence', 'c');
  await expect(lab.locator('.ar-degree-result')).toHaveAttribute('data-direction', 'worse');
});

test('Act panels follow reading preferences and fit narrow screens with enlarged text', async ({ page }, info) => {
  await page.goto('/#2.1.6');
  const lab = page.locator('.act-reversal-lab');
  await expect(lab).toBeVisible();
  const before = await lab.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole('button', { name: 'Ativar modo cinema', exact: true }).click();
  expect(await lab.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(before);
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Aumentar tamanho do texto', exact: true }).click();
  expect(await lab.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(26);
  for (const width of info.project.name === 'mobile' ? [390, 320] : [1440, 1150, 900]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const panel of await lab.locator('.ar-panel, .ar-example, .ar-domain-card').all()) {
      expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
});
