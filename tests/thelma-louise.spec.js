import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));
const triggerName = 'Abrir dossiê de THELMA E LOUISE (EUA/1991)';
const dialogFor = page => page.getByRole('dialog', { name: 'Thelma e Louise', exact: true });
const tabNames = ['1. Estrutura', '2. Arquitrama', '3. Brechas e final', '4. Contexto e legado'];
async function open(page) {
  await page.goto('/#2.2.1');
  await page.locator('.story-film-catalog summary').click();
  const trigger = page.locator('.story-film-list').getByRole('button', { name: triggerName, exact: true });
  await trigger.click();
  await expect(dialogFor(page)).toBeVisible();
  return trigger;
}

test('both film entries open the new dossier while the book and original PDF remain exact', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const trigger = await open(page), dialog = dialogFor(page);
  await expect(dialog.locator('.tr-provenance')).toContainText('19 páginas');
  await expect(dialog.getByRole('link', { name: 'Consultar o PDF original · 19 páginas ↗' })).toHaveAttribute('href', '/content/dossiers/thelma-e-louise.pdf');
  const response = await request.get('/content/dossiers/thelma-e-louise.pdf');
  expect(response.ok()).toBeTruthy();
  expect(createHash('sha256').update(await response.body()).digest('hex')).toBe('03b120aef71cc586d5ba5c2860804fa644f0ef081f358f359d3d565ae4f6bfef');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  const inline = page.locator('[data-paragraph]').getByRole('button', { name: triggerName, exact: true });
  await expect(inline).toHaveText('THELMA E LOUISE (EUA/1991)');
  await inline.focus();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(inline).toBeFocused();
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(chapter.paragraphs.filter(p => p.section === '2.2.1').map(p => p.text));
  expect(errors).toEqual([]);
});

test('seven milestones expose values and structural functions, with navigation bounded by each act', async ({ page }) => {
  await open(page);
  const dialog = dialogFor(page);
  await expect(dialog.locator('button[data-milestone]')).toHaveCount(7);
  for (let num = 1; num <= 7; num++) {
    await dialog.locator(`button[data-milestone="${num}"]`).click();
    await expect(dialog.locator('.tl-milestone')).toHaveAttribute('data-milestone', String(num));
    await expect(dialog.locator('.tl-milestone .tr-card')).toHaveCount(3);
    for (const paragraph of await dialog.locator('.tl-milestone .tr-card p').all()) await expect(paragraph).not.toBeEmpty();
    await expect(dialog.locator('.tl-milestone .tl-source')).toHaveAttribute('href', /\.pdf#page=\d+$/);
  }
  await expect(dialog.locator('.tl-milestone')).toContainText('congela a imagem');
  for (const [act, start, end] of [['I', 1, 2], ['II', 3, 5], ['III', 6, 7]]) {
    await dialog.locator(`button[data-act="${act}"]`).click();
    await expect(dialog.locator('button[data-milestone]')).toHaveCount(end - start + 1);
    await expect(dialog.locator('.tl-milestone')).toHaveAttribute('data-milestone', String(start));
    await expect(dialog.getByRole('button', { name: '← Marco anterior', exact: true })).toBeDisabled();
    for (let num = start + 1; num <= end; num++) await dialog.getByRole('button', { name: 'Próximo marco →', exact: true }).click();
    await expect(dialog.locator('.tl-milestone')).toHaveAttribute('data-milestone', String(end));
    await expect(dialog.getByRole('button', { name: 'Próximo marco →', exact: true })).toBeDisabled();
    await dialog.getByRole('button', { name: '← Marco anterior', exact: true }).click();
    await expect(dialog.locator('.tl-milestone')).toHaveAttribute('data-milestone', String(end - 1));
  }
});

test('the pillars and partnership show the reversal of leadership and preserve selection across tabs', async ({ page }) => {
  await open(page);
  const dialog = dialogFor(page);
  await dialog.locator('button[data-milestone="4"]').click();
  const first = dialog.getByRole('tab', { name: tabNames[0], exact: true });
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByRole('tab', { name: tabNames[1], exact: true })).toBeFocused();
  await expect(dialog.locator('[data-pillar]')).toHaveCount(7);
  for (let i = 0; i < 3; i++) {
    await dialog.locator(`button[data-role="${i}"]`).click();
    await expect(dialog.locator('.tl-partnership')).toHaveAttribute('data-role', String(i));
    await expect(dialog.locator('.tl-partnership .tr-card')).toHaveCount(2);
  }
  await dialog.locator('button[data-role="1"]').click();
  await expect(dialog.locator('.tl-partnership')).toContainText('A liderança se inverte');
  await first.click();
  await expect(dialog.locator('.tl-milestone')).toHaveAttribute('data-milestone', '4');
  await dialog.getByRole('tab', { name: tabNames[1], exact: true }).click();
  await expect(dialog.locator('.tl-partnership')).toHaveAttribute('data-role', '1');
  await page.keyboard.press('End');
  await expect(dialog.getByRole('tab', { name: tabNames[3], exact: true })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(first).toBeFocused();
  await expect(dialog.getByRole('tabpanel')).toHaveCount(1);
});

test('four breaches, three final moments and ending variants retain their distinct meanings', async ({ page }) => {
  await open(page);
  const dialog = dialogFor(page);
  await dialog.getByRole('tab', { name: tabNames[2], exact: true }).click();
  for (let i = 0; i < 4; i++) {
    await dialog.locator(`button[data-gap="${i}"]`).click();
    await expect(dialog.locator('.tl-gap')).toHaveAttribute('data-gap', String(i));
    await expect(dialog.locator('.tl-gap h4')).toHaveText(['Expectativa', 'Resultado', 'Novo risco']);
  }
  for (let i = 0; i < 3; i++) {
    await dialog.locator(`button[data-stage="${i}"]`).click();
    await expect(dialog.locator('.tl-final-stage')).toHaveAttribute('data-stage', String(i));
    await expect(dialog.locator('.tl-final-stage p')).not.toBeEmpty();
  }
  await expect(dialog.locator('.tl-ending .tr-kicker')).toHaveText('Versão lançada');
  for (const [i, status] of ['Ideia discutida', 'Versão alternativa filmada', 'Versão lançada'].entries()) {
    await dialog.locator(`button[data-ending="${i}"]`).click();
    await expect(dialog.locator('.tl-ending .tr-kicker')).toHaveText(status);
    await expect(dialog.locator('.tl-ending p')).not.toBeEmpty();
  }
  await expect(dialog.locator('.tl-ending')).toContainText('consequência física fatal');
  await dialog.getByRole('tab', { name: tabNames[0], exact: true }).click();
  await dialog.getByRole('tab', { name: tabNames[2], exact: true }).click();
  await expect(dialog.locator('.tl-gap')).toHaveAttribute('data-gap', '3');
});

test('all legacy comparisons and the original bibliography are accessible', async ({ page }) => {
  await open(page);
  const dialog = dialogFor(page);
  await dialog.getByRole('tab', { name: tabNames[3], exact: true }).click();
  await expect(dialog.locator('.tr-legacy-options button')).toHaveCount(8);
  await dialog.getByRole('button', { name: 'Fechar dossiê do filme', exact: true }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.locator('summary')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Fechar dossiê do filme', exact: true })).toBeFocused();
  for (let i = 0; i < 8; i++) {
    await dialog.locator(`button[data-legacy="${i}"]`).click();
    await expect(dialog.locator('.tr-legacy-result')).toHaveAttribute('data-legacy', String(i));
    await expect(dialog.locator('.tr-legacy-result p')).not.toBeEmpty();
  }
  await dialog.locator('summary').click();
  await expect(dialog.locator('details a')).toHaveAttribute('href', '/content/dossiers/thelma-e-louise.pdf#page=16');
  await dialog.getByRole('tab', { name: tabNames[0], exact: true }).click();
  await dialog.getByRole('tab', { name: tabNames[3], exact: true }).click();
  await expect(dialog.locator('.tr-legacy-result')).toHaveAttribute('data-legacy', '7');
});

test('modal focus, closing and route changes preserve the reading context and isolate films', async ({ page }) => {
  const trigger = await open(page), dialog = dialogFor(page);
  const close = dialog.getByRole('button', { name: 'Fechar dossiê do filme', exact: true });
  await expect(close).toBeFocused();
  const position = await page.evaluate(() => scrollY);
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.locator('.tl-milestone .tl-source')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await dialog.locator('.tr-body').click({ position: { x: 10, y: 10 } });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(position, 0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await trigger.click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(2, 2);
  await expect(dialog).toHaveCount(0);
  await trigger.click();
  await expect(dialog).toBeVisible();
  await page.evaluate(() => { location.hash = '2.2'; });
  await expect(dialog).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await open(page);
  await close.click();
  await page.locator('.story-film-list').getByRole('button', { name: 'Abrir dossiê de O GRANDE ROUBO DE TREM (EUA/1904)', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'O Grande Roubo de Trem', exact: true })).toBeVisible();
  await expect(page.locator('.tr-scene-strip button')).toHaveCount(14);
  await expect(dialog).toHaveCount(0);
});

test('highlighted-only citation remains interactive and preserves the paragraph', async ({ page }) => {
  await page.goto('/#2.2.1');
  await page.getByRole('button', { name: 'Destacar parágrafo 67', exact: true }).click();
  await page.getByRole('button', { name: 'Mostrar apenas meus destaques', exact: true }).click();
  await expect(page.locator('[data-paragraph]')).toHaveCount(1);
  await page.getByRole('button', { name: triggerName, exact: true }).click();
  await expect(dialogFor(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-paragraph]')).toHaveClass(/is-highlighted/);
  await expect(page.locator('[data-paragraph]')).toHaveText(chapter.paragraphs.find(p => p.order === 67).text);
});

test('all panels respect dark theme, enlarged text and narrow viewports', async ({ page }, info) => {
  await page.goto('/#2.2.1');
  await page.getByRole('button', { name: 'Ativar modo cinema', exact: true }).click();
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Aumentar tamanho do texto', exact: true }).click();
  await page.locator('.story-film-catalog summary').click();
  await page.locator('.story-film-list').getByRole('button', { name: triggerName, exact: true }).click();
  const dialog = dialogFor(page);
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(26);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  for (const width of info.project.name === 'mobile' ? [390, 320] : [1440, 900]) {
    await page.setViewportSize({ width, height: 700 });
    for (const label of tabNames) {
      await dialog.getByRole('tab', { name: label, exact: true }).click();
      for (const panel of await dialog.locator('.tr-header, .tr-tabs, .tr-body, .tr-card').all()) expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
      expect(await dialog.locator('.tr-body').evaluate(el => el.clientHeight)).toBeGreaterThan(80);
      await expect(dialog.getByRole('button', { name: 'Fechar dossiê do filme', exact: true })).toBeInViewport();
    }
  }
});
