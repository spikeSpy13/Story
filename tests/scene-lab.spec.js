import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));
const paragraphs = chapter.paragraphs.filter(p => p.section === '2.1.3');
const axes = ['action', 'education', 'relationship'];
const poles = ['positive', 'mixed', 'negative'];
const moments = ['bedroom', 'kitchen', 'garage', 'road'];

test('scene lab follows the entire Chris and Andy example and preserves all source paragraphs and the quote', async ({ page }) => {
  await page.goto('/#2.1.3');
  const lab = page.getByRole('complementary', { name: 'O teste da virada e a unidade da cena', exact: true });
  await expect(lab).toHaveCount(1);
  expect(await lab.evaluate(el => el.previousElementSibling.dataset.paragraphContainer)).toBe(paragraphs.at(-1).id);
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(paragraphs.map(p => p.text));
  await expect(page.locator('.scene-definition')).toHaveText(paragraphs.find(p => p.order === 21).text);
  await expect(page.locator('blockquote.book-paragraph')).toHaveText(paragraphs.find(p => p.quote).text);
  await page.getByRole('button', { name: 'Destacar parágrafo 21', exact: true }).click();
  await page.getByRole('button', { name: 'Mostrar apenas meus destaques', exact: true }).click();
  await expect(lab).toHaveCount(0);
  await expect(page.locator('[data-paragraph]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Mostrar texto completo', exact: true }).click();
  await expect(lab).toBeVisible();
  await page.goto('/#2.1');
  await expect(lab).toHaveCount(0);
  await expect(page.locator('.event-lab')).toHaveCount(0);
  await expect(page.locator('.structure-lab')).toHaveCount(0);
  await page.goto('/#2.1.4');
  await expect(lab).toHaveCount(0);
});

test('all annotation combinations work in the three axes, with contextual rather than automatic approval', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#2.1.3');
  const lab = page.locator('.scene-lab');
  const initial = lab.getByRole('group', { name: 'Carga inicial', exact: true });
  const final = lab.getByRole('group', { name: 'Carga final', exact: true });
  for (const axis of axes) {
    const button = lab.locator(`[data-axis="${axis}"]`);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    for (const start of poles) {
      await initial.locator(`[data-pole="${start}"]`).click();
      for (const end of poles) {
        const choice = final.locator(`[data-pole="${end}"]`);
        await choice.focus();
        await page.keyboard.press('Space');
        await expect(choice).toHaveAttribute('aria-pressed', 'true');
        const result = lab.locator('.scene-audit-result');
        await expect(result).toHaveAttribute('data-outcome', start === end ? 'same' : 'changed');
        await expect(result).toContainText(start === end ? 'Anotações iguais' : 'Virada indicada pelas anotações');
        await expect(result).toContainText(start === end ? 'Se a exposição é a única justificativa' : 'alcançada através do conflito');
      }
    }
  }
  await expect(lab.locator('.scene-axis-note')).toContainText('um único Evento da Estória');
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(paragraphs.map(p => p.text));
  expect(errors).toEqual([]);
});

test('four locations form one scene and the hypothetical stage version preserves the same turn', async ({ page }) => {
  await page.goto('/#2.1.3');
  const lab = page.locator('.scene-lab');
  for (const mode of ['cinema', 'theatre']) {
    await lab.getByRole('button', { name: mode === 'cinema' ? 'Roteirista · quatro locações' : 'Teste de palco · um lugar', exact: true }).click();
    for (const [index, id] of moments.entries()) {
      const button = lab.locator(`[data-moment="${id}"]`);
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(lab.locator('.scene-moment-monitor')).toHaveAttribute('data-mode', mode);
      await expect(lab.locator('.scene-moment-monitor')).toHaveAttribute('data-turned', index === 3 ? 'true' : 'false');
      await expect(lab.locator('.scene-value-state strong')).toHaveText(index === 3 ? '− Separados / se odeiam' : '+ Juntos / se amam');
      if (mode === 'theatre') await expect(lab.locator('.scene-moment-activity')).toContainText('quarto');
    }
    await expect(lab.locator('.scene-unity-conclusion')).toContainText(mode === 'cinema' ? 'uma única cena' : 'o mesmo evento');
  }
  await expect(lab.locator('.scene-unity-explanation')).toContainText('hipótese de encenação');
  await lab.getByRole('button', { name: 'Roteirista · quatro locações', exact: true }).click();
  await expect(lab.locator('[data-moment="road"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(lab.locator('.scene-moment-activity')).toContainText('acostamento');
});

test('media counts follow the chapter and all panels respond to theme and large text', async ({ page }, info) => {
  await page.goto('/#2.1.3');
  const lab = page.locator('.scene-lab');
  await expect(lab.locator('[data-medium="theatre"]')).toContainText('Raramente chega a 40');
  await expect(lab.locator('[data-medium="film"]')).toContainText('40–60 em um filme típico');
  await expect(lab.locator('[data-medium="novel"]')).toContainText('Pode ultrapassar 60');
  const before = await lab.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole('button', { name: 'Ativar modo cinema', exact: true }).click();
  expect(await lab.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(before);
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Aumentar tamanho do texto', exact: true }).click();
  expect(await lab.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(26);
  for (const width of info.project.name === 'mobile' ? [390, 320] : [1440, 1150]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const axis of axes) {
      await lab.locator(`[data-axis="${axis}"]`).click();
      for (const panel of await lab.locator('.scene-panel').all()) {
        expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    }
  }
});
