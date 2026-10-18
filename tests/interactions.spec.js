import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const content = JSON.parse(readFileSync(new URL('../src/content/chapter-01.json', import.meta.url)));
const images = JSON.parse(readFileSync(new URL('../src/content/chapter-01-illustrations.json', import.meta.url))).placements;

test('lightbox shows originals, navigates all seven images and restores focus and scroll', async ({ page }) => {
  await page.goto('/#1.1');
  const trigger = page.getByRole('button', { name: /^Ampliar figura 03:/ });
  await trigger.scrollIntoViewIfNeeded();
  const scrollBefore = await page.evaluate(() => scrollY);
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h2')).toHaveText('Figura 03 ampliada');
  await expect(dialog.getByRole('button', { name: 'Fechar imagem' })).toBeFocused();
  const bounds = await dialog.boundingBox();
  expect(bounds.x).toBe(0);
  expect(bounds.y).toBe(0);
  expect(Math.round(bounds.width)).toBe(page.viewportSize().width);
  expect(Math.round(bounds.height)).toBe(page.viewportSize().height);
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('h2')).toHaveText('Figura 04 ampliada');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.getByRole('button', { name: 'Imagem anterior' })).toBeDisabled();
  for (const image of images) {
    await expect(dialog.locator('.lightbox-img')).toHaveAttribute('src', image.src);
    await expect(dialog.locator('.lightbox-caption')).toContainText(image.alt);
    expect(await dialog.locator('.lightbox-img').evaluate(e => getComputedStyle(e).objectFit)).toBe('contain');
    if (image.number !== '07') await page.keyboard.press('ArrowRight');
  }
  await expect(dialog.getByRole('button', { name: 'Próxima imagem' })).toBeDisabled();
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(e => e.contains(document.activeElement))).toBeTruthy();
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(Math.abs(await page.evaluate(() => scrollY) - scrollBefore)).toBeLessThan(4);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Fechar imagem' }).click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.mouse.click(3, 3);
  await expect(dialog).toHaveCount(0);
});

test('paragraph highlights persist, filter by section, and can be removed', async ({ page }) => {
  await page.goto('/#1.1');
  const first = page.locator('[data-paragraph]').first();
  await page.getByRole('button', { name: 'Destacar parágrafo 1', exact: true }).click();
  await expect(first).toHaveClass(/is-highlighted/);
  await expect(first).toHaveText(content.paragraphs[0].text);
  await first.dblclick({ position: { x: 120, y: 40 } });
  await expect(first).not.toHaveClass(/is-highlighted/);
  await first.dblclick({ position: { x: 120, y: 40 } });
  await page.getByRole('button', { name: 'Destacar parágrafo 2', exact: true }).click();
  await expect(page.locator('.highlight-filter')).toHaveText('Destaques (2)');
  await page.reload();
  await expect(page.locator('.is-highlighted')).toHaveCount(2);
  await page.goto('/#1.2');
  await expect(page.locator('.highlight-filter')).toHaveText('Destaques (0)');
  await page.goto('/#1.1');
  await page.getByRole('button', { name: 'Mostrar apenas meus destaques' }).click();
  await expect(page.locator('[data-paragraph]')).toHaveCount(2);
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(content.paragraphs.slice(0, 2).map(p => p.text));
  await expect(page.locator('.reading-canvas [data-illustration]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Remover destaque do parágrafo 1', exact: true }).click();
  await expect(page.locator('[data-paragraph]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Remover destaque do parágrafo 2', exact: true }).click();
  await expect(page.locator('.empty-saved')).toBeVisible();
  await page.getByRole('button', { name: 'Voltar ao texto completo' }).click();
  await expect(page.locator('[data-paragraph]')).toHaveCount(14);
  await page.reload();
  await expect(page.locator('.is-highlighted')).toHaveCount(0);
});

test('theme and font size persist, font limits hold, and reading progress reaches the end', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/#1.1');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Ativar modo papel' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const increase = page.getByRole('button', { name: 'Aumentar tamanho do texto' });
  const decrease = page.getByRole('button', { name: 'Diminuir tamanho do texto' });
  await increase.click();
  await increase.click();
  await decrease.click();
  await expect(page.locator('.reading-canvas')).toHaveCSS('font-size', '20px');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('.reading-canvas')).toHaveCSS('font-size', '20px');
  for (let i = 0; i < 3; i++) await increase.click();
  await expect(increase).toBeDisabled();
  await expect(page.locator('.reading-canvas')).toHaveCSS('font-size', '26px');
  for (let i = 0; i < 5; i++) await decrease.click();
  await expect(decrease).toBeDisabled();
  await expect(page.locator('.reading-canvas')).toHaveCSS('font-size', '16px');
  await page.evaluate(() => scrollTo(0, 0));
  await expect(page.locator('.reading-progress-bar')).toHaveAttribute('data-progress', '0');
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('.reading-progress-bar')).toHaveAttribute('data-progress', '100');
  await page.goto('/#1');
  await expect(page.locator('.reading-progress-bar')).toHaveCount(0);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('study controls remain usable when browser storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Storage unavailable', 'QuotaExceededError'); }; });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/#1.1');
  await expect(page.locator('.reader-status')).toContainText('apenas nesta sessão');
  await page.getByRole('button', { name: 'Destacar parágrafo 1', exact: true }).click();
  await expect(page.locator('.is-highlighted')).toHaveCount(1);
  await page.locator('.theme-toggle').click();
  await expect(page.locator('[data-paragraph]').first()).toHaveText(content.paragraphs[0].text);
  expect(errors).toEqual([]);
});
