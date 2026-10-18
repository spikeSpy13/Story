import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));

test('the complete original artifact follows Beat, preserving the source and highlight filter', async ({ page }) => {
  const id = '2.1.4';
  const paragraphs = chapter.paragraphs.filter(p => p.section === id);
  await page.goto(`/#${id}`);
  const lab = page.locator('.beat-sequence-lab');
  await expect(lab).toHaveCount(1);
  await expect(lab).toHaveAttribute('data-mode', 'full');
  expect(await lab.evaluate(el => el.previousElementSibling.dataset.paragraphContainer)).toBe(paragraphs.at(-1).id);
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(paragraphs.map(p => p.text));
  await expect(page.locator('.beat-definition')).toHaveCount(1);
  await expect(lab.locator('.bs-panel')).toHaveCount(3);
  await expect(lab.locator('.bs-beat-options')).toHaveCount(1);
  await expect(lab.locator('.bs-scene-options')).toHaveCount(1);
  await expect(lab.locator('.bs-lab-footer')).toHaveCount(0);
  await page.getByRole('button', { name: `Destacar parágrafo ${paragraphs[1].order}`, exact: true }).click();
  await page.getByRole('button', { name: 'Mostrar apenas meus destaques', exact: true }).click();
  await expect(lab).toHaveCount(0);
  await expect(page.locator('[data-paragraph]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Mostrar texto completo', exact: true }).click();
  await expect(lab).toBeVisible();
  await page.goto('/#2.1');
  await expect(page.locator('.beat-sequence-lab')).toHaveCount(0);
  await expect(page.locator('.bs-beat-options')).toHaveCount(0);
  await expect(page.locator('.bs-scene-options')).toHaveCount(0);
  for (const route of ['2.1.5', '2.1.6']) {
    await page.goto(`/#${route}`);
    await expect(page.locator('.beat-sequence-lab')).toHaveCount(0);
  }
});

test('all six beats expose their action and reaction and only the last ends the relationship', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#2.1.4');
  const lab = page.locator('.beat-sequence-lab');
  await expect(lab).toBeVisible();
  const summary = lab.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(lab.locator('.bs-terminology-grid')).toBeVisible();
  await expect(lab.locator('.bs-terminology-grid')).toContainText('pausa curta');
  const behavior = ['Brincadeira', 'Insultos', 'Ameaças e desafios', 'Súplicas e ridicularizações', 'Violência', 'Decisão e choque'];
  for (let i = 1; i <= 6; i++) {
    const button = lab.locator(`[data-beat="${i}"]`);
    await button.focus();
    await page.keyboard.press('Space');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(lab.locator('.bs-exchange-monitor')).toHaveAttribute('data-turned', String(i === 6));
    await expect(lab.locator('.bs-beat-status')).toContainText(behavior[i - 1]);
    await expect(lab.locator('.bs-scene-charge')).toContainText(i === 6 ? '− Separados' : '+ Ainda juntos');
    await expect(lab.locator('.bs-action')).not.toBeEmpty();
    await expect(lab.locator('.bs-reaction')).not.toBeEmpty();
  }
  expect(await lab.locator('.bs-exchange .bs-kicker').allTextContents()).toEqual(['Ação · Andy', 'Reação · Chris']);
  await expect(lab.locator('.bs-action')).toContainText('acabou!');
  await summary.click();
  await expect(lab.locator('.bs-terminology-grid')).toBeHidden();
  await expect(lab.locator('.bs-scene-options')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Barbara has local changes in every scene and gains the New York job only at the climax', async ({ page }) => {
  await page.goto('/#2.1.4');
  const lab = page.locator('.beat-sequence-lab');
  await expect(lab).toBeVisible();
  const expected = [
    ['Dúvida → + Autoconfiança'],
    ['Risco de morte → + Sobrevivência', 'Autoconfiança → − Derrota'],
    ['Desastre social → + Triunfo social', 'Conquista o trabalho'],
  ];
  for (let i = 1; i <= 3; i++) {
    const button = lab.locator(`[data-scene="${i}"]`);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(lab.locator('.bs-macro-banner')).toHaveAttribute('data-climax', String(i === 3));
    await expect(lab.locator('.bs-macro-state')).toHaveText(i === 3 ? '++ Conquista o trabalho em Nova Iorque' : '− Ainda sem o trabalho em Nova Iorque');
    for (const shift of expected[i - 1]) await expect(lab.locator('.bs-local-shifts')).toContainText(shift);
    await expect(lab.locator('.bs-scene-outline li')).toHaveCount(4);
    await expect(lab.locator('.bs-catalyst')).not.toBeEmpty();
  }
  await expect(lab.locator('.bs-sequence-impact')).toContainText('duplamente positivo');
  await lab.locator('[data-scene="1"]').click();
  await expect(lab.locator('.bs-macro-banner')).toHaveAttribute('data-climax', 'false');
  await lab.getByRole('button', { name: 'Uma cena de entrevista', exact: true }).click();
  await expect(lab.locator('.bs-design-result')).toHaveAttribute('data-design', 'interview');
  await expect(lab.locator('.bs-design-gains')).toHaveCount(0);
  await expect(lab.locator('.bs-design-result')).toContainText('qualificada');
  await lab.getByRole('button', { name: 'Sequência de três cenas', exact: true }).click();
  expect(await lab.locator('.bs-design-gains li').allTextContents()).toEqual(['Caráter interno', 'Relação com a mãe', 'Panorama de Nova Iorque', 'Corporação']);
  await expect(lab.locator('[data-scene="1"]')).toHaveAttribute('aria-pressed', 'true');
  await lab.locator('[data-beat="6"]').click();
  await expect(lab.locator('.bs-scene-charge')).toContainText('− Separados');
  await expect(lab.locator('[data-scene="1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('main h1')).toHaveText('Beat');
});

test('the unified Beat artifact follows the reading theme and font in narrow and wide layouts', async ({ page }, info) => {
  await page.goto('/#2.1.4');
  const lab = page.locator('.beat-sequence-lab');
  await expect(lab).toBeVisible();
  const before = await lab.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole('button', { name: 'Ativar modo cinema', exact: true }).click();
  expect(await lab.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(before);
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Aumentar tamanho do texto', exact: true }).click();
  expect(await lab.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(26);
  for (const width of info.project.name === 'mobile' ? [390, 320] : [1440, 1150, 900]) {
    await page.setViewportSize({ width, height: 1000 });
    await lab.locator('[data-beat="6"]').click();
    await lab.locator('[data-scene="3"]').click();
    for (const panel of await lab.locator('.bs-panel').all()) {
      expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
});
