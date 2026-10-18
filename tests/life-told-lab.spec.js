import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));
const section = chapter.paragraphs.filter(p => p.section === '2.1');
const levelIds = ['internal', 'personal', 'social', 'physical'];
const phases = ['farm', 'music', 'fame', 'fall', 'motel', 'future'];

test('the terminology page has its six own paragraphs and artifact, separately from its subsections', async ({ page }) => {
  await page.goto('/#2.1');
  const lab = page.getByRole('complementary', { name: 'Da estória de vida à estória contada', exact: true });
  await expect(lab).toHaveCount(1);
  expect(await lab.evaluate(el => el.previousElementSibling.dataset.paragraphContainer)).toBe(chapter.paragraphs[5].id);
  expect(await lab.evaluate(el => el.closest('.reading-block').dataset.section)).toBe('2.1');
  await expect(page.locator('.reading-block')).toHaveCount(1);
  await expect(page.locator('.section-links, .crumbs')).toHaveCount(0);
  await expect(page.locator('.pn')).toHaveCount(1);
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(section.map(p => p.text));
  await expect(lab.locator('.life-panel')).toHaveCount(3);
  await expect(lab.locator('.life-selection-equation')).toContainText('Centenas de milhares de horas');
  await expect(lab.locator('.life-selection-equation')).toContainText('Cerca de duas horas de filme');
  await page.getByRole('button', { name: 'Destacar parágrafo 6', exact: true }).click();
  await page.getByRole('button', { name: 'Mostrar apenas meus destaques', exact: true }).click();
  await expect(lab).toHaveCount(0);
  await expect(page.locator('[data-paragraph]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Mostrar texto completo', exact: true }).click();
  await expect(lab).toBeVisible();
  await page.goto('/#2.1.1');
  await expect(lab).toHaveCount(0);
  await page.goto('/#2.2');
  await expect(lab).toHaveCount(0);
});

test('conflict levels combine, isolate, clear and respond to keyboard and the diagram', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#2.1');
  const lab = page.locator('.life-told-lab');
  await expect(lab.locator('[data-level-card]')).toHaveCount(4);
  await lab.getByRole('button', { name: 'Isolar Vida interna', exact: true }).click();
  expect(await lab.locator('[data-level-card]').evaluateAll(items => items.map(item => item.dataset.levelCard))).toEqual(['internal']);
  await lab.locator('[data-level="physical"]').click();
  expect(await lab.locator('[data-level-card]').evaluateAll(items => items.map(item => item.dataset.levelCard))).toEqual(['internal', 'physical']);
  const socialRing = lab.getByRole('button', { name: 'Alternar anel 3: Instituições sociais', exact: true });
  await socialRing.focus();
  await page.keyboard.press('Space');
  await expect(socialRing).toHaveAttribute('aria-pressed', 'true');
  await expect(lab.locator('[data-level="social"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(lab.locator('[data-level-card]')).toHaveCount(3);
  await page.keyboard.press('Enter');
  await expect(socialRing).toHaveAttribute('aria-pressed', 'false');
  await lab.getByRole('button', { name: 'Limpar seleção', exact: true }).click();
  await expect(lab.locator('[data-level-card]')).toHaveCount(0);
  await expect(lab.locator('.life-level-cards')).toContainText('Selecione um nível');
  // The center is the innermost ring; it is a real pointer target as well.
  await lab.locator('[data-ring="internal"]').click();
  await expect(lab.locator('[data-level-card="internal"]')).toHaveCount(1);
  for (const id of levelIds) {
    if (await lab.locator(`[data-level="${id}"]`).getAttribute('aria-pressed') === 'false') await lab.locator(`[data-level="${id}"]`).click();
    await expect(lab.locator(`[data-ring="${id}"]`)).toHaveAttribute('aria-pressed', 'true');
  }
  await expect(lab.locator('[data-level-card]')).toHaveCount(4);
  await lab.getByRole('button', { name: 'Limpar seleção', exact: true }).click();
  await lab.getByRole('button', { name: 'Combinar os quatro níveis', exact: true }).click();
  expect(await lab.locator('[data-level-card]').evaluateAll(items => items.map(item => item.dataset.levelCard))).toEqual(levelIds);
  expect(errors).toEqual([]);
});

test('the two lenses preserve the inspected phase and distinguish past, filmed period and future implication', async ({ page }) => {
  await page.goto('/#2.1');
  const lab = page.locator('.life-told-lab');
  await expect(lab.locator('.life-phase-monitor')).toHaveAttribute('data-phase', 'motel');
  for (const lens of ['told', 'life']) {
    await lab.getByRole('button', { name: lens === 'told' ? 'Recorte de Horton Foote' : 'Relato do amigo', exact: true }).click();
    await expect(lab.locator('.life-lens-banner')).toHaveAttribute('data-lens', lens);
    await expect(lab.locator('.life-lens-banner')).toContainText(lens === 'told' ? 'cerca de um ano' : 'infância na fazenda');
    for (const id of phases) {
      const button = lab.locator(`.life-timeline [data-phase="${id}"]`);
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      const kind = id === 'motel' ? 'present' : id === 'future' ? 'future' : 'past';
      await expect(lab.locator('.life-phase-monitor')).toHaveAttribute('data-phase', id);
      await expect(lab.locator('.life-phase-monitor')).toHaveAttribute('data-kind', kind);
      await expect(lab.locator('.life-phase-history')).not.toBeEmpty();
      await expect(lab.locator('.life-phase-told')).not.toBeEmpty();
      await expect(lab.locator('.life-phase-status')).toHaveText(kind === 'present' ? 'Período dramatizado' : kind === 'future' ? 'Sugerido pela imagem final' : 'Passado por implicação');
    }
  }
  await lab.getByRole('button', { name: 'Recorte de Horton Foote', exact: true }).click();
  await expect(lab.locator('.life-phase-monitor')).toHaveAttribute('data-phase', 'future');
  await lab.locator('.life-timeline [data-phase="motel"]').click();
  await expect(lab.locator('.life-phase-told')).toContainText('duas horas cobrem o próximo ano');
});

test('entry alternatives are labeled as hypotheses while the motel matches the chapter opening', async ({ page }) => {
  await page.goto('/#2.1');
  const lab = page.locator('.life-told-lab');
  for (const id of ['birth', 'fame', 'motel']) {
    const button = lab.locator(`.life-entry-options [data-cut="${id}"]`);
    await button.focus();
    await page.keyboard.press('Space');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(lab.locator('.life-entry-result')).toHaveAttribute('data-cut', id);
    await expect(lab.locator('.life-entry-result .life-kicker')).toHaveText(id === 'motel' ? 'Abertura descrita no capítulo' : 'Hipótese de exercício');
  }
  await expect(lab.locator('.life-entry-result')).toContainText('o próximo ano');
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(section.map(p => p.text));
});

test('the isolated terminology artifact supports reading preferences without subsection labs or notes', async ({ page }, info) => {
  await page.goto('/#2.1');
  const lab = page.locator('.life-told-lab');
  await expect(lab).toBeVisible();
  await expect(page.locator('.beat-sequence-lab, .sequence-act-lab, .act-reversal-lab, .notes')).toHaveCount(0);
  const before = await lab.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole('button', { name: 'Ativar modo cinema', exact: true }).click();
  expect(await lab.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(before);
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Aumentar tamanho do texto', exact: true }).click();
  expect(await lab.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(26);
  for (const width of info.project.name === 'mobile' ? [390, 320] : [1440, 1150, 900]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const panel of await lab.locator('.life-panel').all()) {
      expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
});
