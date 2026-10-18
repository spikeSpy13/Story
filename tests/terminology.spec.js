import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));

test('the sidebar opens every terminology concept separately without duplicating chapter navigation', async ({ page }) => {
  await page.goto('/#2.1');
  const source = chapter.paragraphs.filter(p => p.section === '2.1' || p.section.startsWith('2.1.'));
  const read = await page.locator('[data-paragraph]').allTextContents();
  await expect(page.locator('[data-paragraph]')).toHaveCount(6);
  await expect(page.locator('.reading-block')).toHaveCount(1);
  await expect(page.locator('.tools-badge')).toHaveText('LEITURA · 6 PARÁGRAFOS');
  await expect(page.locator('.life-told-lab')).toBeVisible();
  await expect(page.locator('.notes')).toHaveCount(0);
  for (const section of chapter.sections.filter(s => s.parent === '2.1')) {
    if (page.viewportSize().width < 900) await page.getByRole('button', { name: '☰ Índice', exact: true }).click();
    await page.locator(`.tree a[href="#${section.id}"]`).click();
    await expect(page.locator('main h1')).toHaveText(section.title);
    await expect(page.locator('.life-told-lab')).toHaveCount(0);
    await expect(page.locator('.reading-block')).toHaveCount(1);
    read.push(...await page.locator('[data-paragraph]').allTextContents());
    await expect(page.locator('.section-links, .pn, .crumbs')).toHaveCount(0);
    await expect(page.locator('main a[href^="#"]:not([href*="?nota="]):not([href*="?chamada="])')).toHaveCount(0);
  }
  expect(read).toEqual(source.map(p => p.text));
  // The next concept retains its text, waiting for its own future artifact.
  await expect(page.locator('[data-interactive]')).toHaveCount(0);
  await expect(page.locator('.pdf-link')).toHaveAttribute('href', chapter.source.pdf);
});

test('legacy note URLs from the combined terminology page reach the dedicated Sequence page', async ({ page }) => {
  for (const number of ['1', '2']) {
    for (const [query, target] of [['nota', 'note'], ['chamada', 'call']]) {
      await page.goto(`/#2.1?${query}=${number}`);
      await expect(page.locator('main h1')).toHaveText('Sequência');
      await expect(page.locator('.sequence-act-lab')).toBeVisible();
      await expect(page.locator('.life-told-lab')).toHaveCount(0);
      await expect(page.locator(`#${target}-${number}`)).toBeFocused();
      await expect(page.locator(`#${target}-${number}`)).toBeInViewport();
      await expect(page.locator('.lab[href="#2.1.5"]')).toHaveAttribute('aria-current', 'page');
    }
  }
});
