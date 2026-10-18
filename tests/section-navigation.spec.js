import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));

test('reading footers link to adjacent siblings while opening pages keep their summary layout', async ({ page }) => {
  for (const [route, previous, next] of [
    ['1.1', null, '1.2'], ['1.2', '1.1', '1.3'], ['1.6', '1.5', null],
    ['2.1', null, '2.2'], ['2.1.1', null, '2.1.2'], ['2.1.6', '2.1.5', '2.1.7'], ['2.1.7', '2.1.6', null],
  ]) {
    await page.goto(`/#${route}`);
    const footer = page.getByRole('navigation', { name: 'Entre seções', exact: true });
    await expect(footer).toHaveCount(1);
    expect(await footer.evaluate(el => el === el.parentElement.lastElementChild)).toBeTruthy();
    await expect(page.locator('.section-links, .crumbs')).toHaveCount(0);
    await expect(footer.locator('a')).toHaveCount(Number(Boolean(previous)) + Number(Boolean(next)));
    if (previous) await expect(footer.locator('a').filter({hasText:'Anterior'})).toHaveAttribute('href', `#${previous}`);
    if (next) await expect(footer.locator('a').filter({hasText:'Próximo'})).toHaveAttribute('href', `#${next}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
  for (const route of ['1', '2', '1.3.1']) {
    await page.goto(`/#${route}`);
    await expect(page.locator('.pn')).toHaveCount(0);
  }
});

test('the footer moves between Beat, Sequence, Act and Story and supports browser history', async ({ page }) => {
  await page.goto('/#2.1.4');
  for (const section of ['2.1.5', '2.1.6', '2.1.7']) {
    const next = page.locator('.pn .nx');
    await next.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(url => url.hash === `#${section}`);
    expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(chapter.paragraphs.filter(p => p.section === section).map(p => p.text));
    await expect(page.locator('.lab[aria-current="page"]')).toHaveAttribute('href', `#${section}`);
  }
  await expect(page.locator('.story-climax-lab')).toBeVisible();
  await expect(page.locator('.pn .nx')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.story-climax-lab')).toBeVisible();
  await page.locator('.pn a').click();
  await expect(page.locator('main h1')).toHaveText('Ato');
  await expect(page.locator('.act-reversal-lab')).toBeVisible();
  await page.goBack();
  await expect(page.locator('main h1')).toHaveText('Estória');
  await expect(page.locator('.story-climax-lab')).toBeVisible();
});
