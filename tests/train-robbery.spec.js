import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));
const source = chapter.paragraphs.filter(p => p.section === '2.2.1');
const triggerName = 'Abrir dossiê de O GRANDE ROUBO DE TREM (EUA/1904)';
const dialogFor = page => page.getByRole('dialog', { name: 'O Grande Roubo de Trem', exact: true });
async function openCatalog(page) {
  await page.goto('/#2.2.1');
  await page.locator('.story-film-catalog summary').click();
  const button = page.locator('.story-film-list').getByRole('button', { name: triggerName, exact: true });
  await button.click();
  await expect(dialogFor(page)).toBeVisible();
  return button;
}

test('the first Archplot film and its exact book citation open the same supplementary dossier', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const catalog = await openCatalog(page);
  const dialog = dialogFor(page);
  await expect(dialog).toHaveCount(1);
  await expect(dialog.locator('.tr-provenance')).toContainText('1903');
  await expect(dialog.locator('.tr-provenance')).toContainText('EUA/1904');
  await dialog.getByRole('button', { name: 'Fechar dossiê do filme', exact: true }).click();
  await expect(catalog).toBeFocused();
  await expect(page.locator('.story-film-list > li').first().locator('strong')).toHaveText('O GRANDE ROUBO DE TREM');
  await expect(page.locator('.story-film-list > li').first().locator('span')).toHaveText('EUA/1904');
  await expect(page.locator('.story-film-list button')).toHaveCount(2);
  const inline = page.locator('[data-paragraph]').getByRole('button', { name: triggerName, exact: true });
  await expect(inline).toHaveText('O GRANDE ROUBO DE TREM (EUA/1904)');
  await inline.focus();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(inline).toBeFocused();
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(source.map(p => p.text));
  for (const name of ['Minimalismo — Minitrama', 'Antiestrutura — Antitrama']) {
    await page.getByRole('button', { name, exact: true }).click();
    await expect(page.locator('.story-film-list button')).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test('all fourteen scenes expose the reserved frame and the three analytical fields', async ({ page }) => {
  await openCatalog(page);
  const dialog = dialogFor(page);
  await expect(dialog.getByRole('tabpanel')).toHaveCount(1);
  await expect(dialog.locator('.tr-scene-strip button')).toHaveCount(14);
  await expect(dialog.getByRole('button', { name: '← Cena anterior', exact: true })).toBeDisabled();
  for (let i = 1; i <= 14; i++) {
    const button = dialog.locator(`button[data-scene="${i}"]`);
    await button.focus();
    await page.keyboard.press('Space');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(dialog.locator('.tr-scene-inspector')).toHaveAttribute('data-scene', String(i));
    await expect(dialog.locator('.tr-image-placeholder')).toContainText(`Cena ${String(i).padStart(2, '0')}`);
    await expect(dialog.locator('.tr-scene-details .tr-card')).toHaveCount(3);
    for (const paragraph of await dialog.locator('.tr-scene-details .tr-card p').all()) await expect(paragraph).not.toBeEmpty();
  }
  await expect(dialog.locator('.tr-scene-details h3')).toHaveText('Cena 14: Realism');
  await expect(dialog.getByRole('button', { name: 'Próxima cena →', exact: true })).toBeDisabled();
  await expect(dialog.locator('img')).toHaveCount(0);
});

test('scene navigation stays inside every selected phase and respects its endpoints', async ({ page }) => {
  await openCatalog(page);
  const dialog = dialogFor(page);
  for (const [filter, start, end] of [['ato1', 1, 4], ['ato2a', 5, 9], ['ato2b', 10, 11], ['ato3', 12, 13], ['epilogo', 14, 14]]) {
    await dialog.locator(`button[data-filter="${filter}"]`).click();
    expect(await dialog.locator('.tr-scene-strip button').evaluateAll(items => items.map(item => Number(item.dataset.scene)))).toEqual(Array.from({length:end-start+1}, (_, i) => start+i));
    await expect(dialog.locator('.tr-scene-inspector')).toHaveAttribute('data-scene', String(start));
    await expect(dialog.getByRole('button', { name: '← Cena anterior', exact: true })).toBeDisabled();
    for (let i = start + 1; i <= end; i++) {
      await dialog.getByRole('button', { name: 'Próxima cena →', exact: true }).click();
      await expect(dialog.locator('.tr-scene-inspector')).toHaveAttribute('data-scene', String(i));
    }
    await expect(dialog.getByRole('button', { name: 'Próxima cena →', exact: true })).toBeDisabled();
    if (end > start) {
      await dialog.getByRole('button', { name: '← Cena anterior', exact: true }).click();
      await expect(dialog.locator('.tr-scene-inspector')).toHaveAttribute('data-scene', String(end-1));
    }
  }
  await dialog.locator('button[data-filter="all"]').click();
  await expect(dialog.locator('.tr-scene-inspector')).toHaveAttribute('data-scene', '1');
  await expect(dialog.locator('.tr-scene-strip button')).toHaveCount(14);
});

test('keyboard tabs expose all four panels and preserve scene and legacy selections', async ({ page }) => {
  await openCatalog(page);
  const dialog = dialogFor(page);
  await dialog.locator('button[data-scene="9"]').click();
  const first = dialog.getByRole('tab', { name: '1. Decupagem', exact: true });
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByRole('tab', { name: '2. Arquitrama', exact: true })).toBeFocused();
  await expect(dialog.locator('[data-pillar]')).toHaveCount(6);
  await expect(dialog.locator('.tr-models .tr-card')).toHaveCount(3);
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('[data-paradox-scene]')).toHaveCount(3);
  await page.keyboard.press('End');
  await expect(dialog.getByRole('tab', { name: '4. Legado', exact: true })).toBeFocused();
  await expect(dialog.locator('.tr-legacy-options button')).toHaveCount(8);
  for (let i=0; i<8; i++) {
    await dialog.locator(`button[data-legacy="${i}"]`).click();
    await expect(dialog.locator('.tr-legacy-result')).toHaveAttribute('data-legacy', String(i));
    await expect(dialog.locator('.tr-legacy-result p')).not.toBeEmpty();
  }
  await first.click();
  await expect(dialog.locator('.tr-scene-inspector')).toHaveAttribute('data-scene', '9');
  await dialog.getByRole('tab', { name: '4. Legado', exact: true }).click();
  await expect(dialog.locator('.tr-legacy-result')).toHaveAttribute('data-legacy', '7');
  await dialog.getByRole('button', { name: 'Rever o disparo da cena 14', exact: true }).click();
  await expect(first).toBeFocused();
  await expect(dialog.locator('.tr-scene-inspector')).toHaveAttribute('data-scene', '14');
  await dialog.getByRole('tab', { name: '3. Atrações e narrativa', exact: true }).click();
  await dialog.getByRole('button', { name: 'Examinar cena 10', exact: true }).click();
  await expect(dialog.locator('.tr-scene-inspector')).toHaveAttribute('data-scene', '10');
  await expect(dialog.getByRole('tabpanel')).toHaveCount(1);
});

test('the modal traps focus, closes by escape and backdrop, and restores reading scroll and focus', async ({ page }) => {
  const trigger = await openCatalog(page);
  const dialog = dialogFor(page);
  const close = dialog.getByRole('button', { name: 'Fechar dossiê do filme', exact: true });
  await expect(close).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  const position = await page.evaluate(() => scrollY);
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Próxima cena →', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.locator('.theme-toggle').evaluate(el => el.focus());
  await expect(close).toBeFocused();
  await dialog.locator('.tr-body').click({position:{x:12,y:12}});
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(position, 0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await trigger.click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(2, 2);
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(dialog).toBeVisible();
  await page.evaluate(() => { location.hash = '2.2'; });
  await expect(page.locator('main h1')).toHaveText('O TRIÂNGULO DA ESTÓRIA');
  await expect(dialog).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('a highlighted-only citation still opens the dossier without changing its saved paragraph', async ({ page }) => {
  await page.goto('/#2.2.1');
  await page.getByRole('button', { name: 'Destacar parágrafo 67', exact: true }).click();
  await page.getByRole('button', { name: 'Mostrar apenas meus destaques', exact: true }).click();
  await expect(page.locator('[data-paragraph]')).toHaveCount(1);
  await expect(page.locator('.story-triangle')).toHaveCount(0);
  const trigger = page.getByRole('button', { name: triggerName, exact: true });
  await trigger.click();
  await expect(dialogFor(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.locator('[data-paragraph]')).toHaveClass(/is-highlighted/);
  await expect(page.locator('[data-paragraph]')).toHaveText(chapter.paragraphs.find(p => p.order===67).text);
});

test('the dossier inherits the reading theme and font and remains usable on narrow screens', async ({ page }, info) => {
  await page.goto('/#2.2.1');
  await page.getByRole('button', { name: 'Ativar modo cinema', exact: true }).click();
  for (let i=0; i<4; i++) await page.getByRole('button', { name: 'Aumentar tamanho do texto', exact: true }).click();
  await page.locator('.story-film-catalog summary').click();
  await page.locator('.story-film-list').getByRole('button', { name: triggerName, exact: true }).click();
  const dialog = dialogFor(page);
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(26);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  for (const width of info.project.name === 'mobile' ? [390, 320] : [1440, 900]) {
    await page.setViewportSize({width, height:700});
    for (const label of ['1. Decupagem', '2. Arquitrama', '3. Atrações e narrativa', '4. Legado']) {
      await dialog.getByRole('tab', {name:label, exact:true}).click();
      for (const panel of await dialog.locator('.tr-header, .tr-tabs, .tr-body, .tr-card').all()) {
        expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
      }
      expect(await dialog.locator('.tr-body').evaluate(el => el.clientHeight)).toBeGreaterThan(80);
      await expect(dialog.getByRole('button', { name:'Fechar dossiê do filme', exact:true })).toBeInViewport();
    }
    const box = await dialog.boundingBox();
    expect(box.width).toBeLessThanOrEqual(width);
    expect(box.height).toBeLessThanOrEqual(700);
  }
});
