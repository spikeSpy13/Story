import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const content = JSON.parse(readFileSync(new URL('../src/content/chapter-01.json', import.meta.url)));

test('complete chapter renders the exact 72 source paragraphs and notes', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/#1');
  await expect(page.locator('[data-paragraph]')).toHaveCount(72);
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(content.paragraphs.map(p => p.text));
  expect(await page.locator('[data-note]').allTextContents()).toEqual(content.notes.map(n => n.text));
  await expect(page.locator('blockquote')).toHaveCount(4);
  await expect(page.locator('.note-call')).toHaveCount(6);
  const pdf = await page.request.get('/content/chapter-01.pdf');
  expect(pdf.ok()).toBeTruthy();
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
  expect(errors).toEqual([]);
});

test('section links, subsection hierarchy, reload and browser history', async ({ page }) => {
  await page.goto('/#1');
  await page.locator('.section-links a[href="#1.3"]').click();
  await expect(page).toHaveURL(/#1\.3$/);
  await expect(page.locator('main h1')).toHaveText('O IMPERATIVO DA ESTÓRIA');
  await expect(page.locator('[data-paragraph]')).toHaveCount(20);
  await expect(page.locator('article h3')).toHaveText('Boa estória bem contada');
  await page.locator('.section-links a[href="#1.3.1"]').click();
  await page.reload();
  await expect(page.locator('main h1')).toHaveText('Boa estória bem contada');
  await expect(page.locator('[data-paragraph]')).toHaveCount(6);
  await page.goBack();
  await expect(page.locator('main h1')).toHaveText('O IMPERATIVO DA ESTÓRIA');
  await page.locator('.pn .nx').click();
  await expect(page.locator('main h1')).toHaveText('ESTÓRIA E VIDA');
});

test('all note links lead to the correct note and back to the call', async ({ page }) => {
  await page.goto('/#1');
  for (const note of content.notes) {
    await page.locator(`#call-${note.number}`).click();
    await expect(page.locator(`#note-${note.number}`)).toBeFocused();
    await page.locator(`#note-${note.number} .note-back`).click();
    await expect(page.locator(`#call-${note.number}`)).toBeFocused();
  }
});

test('home, pending chapter and no horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.card')).toHaveCount(19);
  await page.locator('.card[href="#2"]').click();
  await expect(page.getByText('Os arquivos deste capítulo ainda não foram enviados.')).toBeVisible();
  await expect(page.locator('[data-paragraph]')).toHaveCount(0);
  await page.goto('/#1.3.1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test('mobile drawer closes by keyboard, selection and backdrop', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'Mobile navigation only');
  await page.goto('/');
  const menu = page.getByRole('button', { name: '☰ Índice' });
  await menu.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await menu.click();
  await page.locator('.lab[href="#1"]').click();
  await expect(page.locator('main h1')).toHaveText(content.title);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.locator('.scrim').click({ position: { x: 380, y: 400 } });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});
