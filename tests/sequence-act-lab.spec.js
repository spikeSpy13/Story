import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const chapter = JSON.parse(readFileSync(new URL('../src/content/chapter-02.json', import.meta.url), 'utf8'));

test('the new full artifact belongs only to Sequence, following its complete source text', async ({ page }) => {
  const paragraphs = chapter.paragraphs.filter(p => p.section === '2.1.5');
  await page.goto('/#2.1.5');
  const lab = page.getByRole('complementary', { name: 'Valores locais, impacto maior', exact: true });
  await expect(lab).toHaveCount(1);
  expect(await lab.evaluate(el => el.previousElementSibling.dataset.paragraphContainer)).toBe(paragraphs.at(-1).id);
  expect(await lab.evaluate(el => el.closest('[data-section]').dataset.section)).toBe('2.1.5');
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(paragraphs.map(p => p.text));
  await expect(page.locator('.sequence-definition')).toHaveCount(1);
  await expect(lab.locator('.sa-panel')).toHaveCount(3);
  await page.getByRole('button', { name: 'Destacar parágrafo 36', exact: true }).click();
  await page.getByRole('button', { name: 'Mostrar apenas meus destaques', exact: true }).click();
  await expect(lab).toHaveCount(0);
  await expect(page.locator('[data-paragraph]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Mostrar texto completo', exact: true }).click();
  await expect(lab).toBeVisible();
  await lab.getByRole('link', { name: 'Ler o conceito de ato →', exact: true }).click();
  await expect(page.locator('main h1')).toHaveText('Ato');
  await expect(lab).toHaveCount(0);
  expect(await page.locator('[data-paragraph]').allTextContents()).toEqual(chapter.paragraphs.filter(p => p.section === '2.1.6').map(p => p.text));
  await page.goto('/#2.1.4');
  await expect(lab).toHaveCount(0);
  await expect(page.locator('.beat-sequence-lab')).toHaveAttribute('data-mode', 'full');
});

test('four values track the scenes and only the third resolves the new job', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#2.1.5');
  const lab = page.locator('.sequence-act-lab');
  await expect(lab.locator('.sa-values')).toHaveAttribute('data-scene', '3');
  const expected = [
    ['+ Autoconfiança', 'Ainda não está em jogo', 'Ainda não testado'],
    ['+ Autoconfiança → − Derrota', '− Risco de morte → + Vida', 'À beira do desastre social'],
    ['− Derrota → + Triunfo pessoal', '+ Viva após a travessia', '− Desastre → + Triunfo social'],
  ];
  for (let i = 1; i <= 3; i++) {
    const button = lab.locator(`button[data-scene="${i}"]`);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(lab.locator('.sa-value')).toHaveCount(4);
    for (const [index, value] of ['confidence', 'life', 'social'].entries()) {
      await expect(lab.locator(`[data-value="${value}"] .sa-value-state`)).toHaveText(expected[i - 1][index]);
    }
    await expect(lab.locator('.sa-job')).toHaveAttribute('data-climax', String(i === 3));
    await expect(lab.locator('.sa-job .sa-value-state')).toHaveText(i === 3 ? '++ Conquista o trabalho em Nova Iorque' : '− Ainda sem o novo trabalho');
    await expect(lab.locator('.sa-steps li')).toHaveCount(4);
    await expect(lab.locator('.sa-catalyst p')).not.toBeEmpty();
  }
  await expect(lab.locator('.sa-job')).toContainText('duplamente positivo');
  expect(errors).toEqual([]);
});

test('the two park routes explain the dilemma without rewriting the narrated outcome', async ({ page }) => {
  await page.goto('/#2.1.5');
  const lab = page.locator('.sequence-act-lab');
  await lab.locator('button[data-scene="2"]').click();
  const values = await lab.locator('.sa-values').innerText();
  for (const route of ['around', 'across']) {
    const button = lab.locator(`button[data-route="${route}"]`);
    await button.focus();
    await page.keyboard.press('Space');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(lab.locator('.sa-route-result')).toContainText(route === 'around' ? 'não chegaria à festa em tempo' : 'Caminho escolhido na narrativa');
    await expect(lab.locator('.sa-map-active')).toHaveAttribute('d', route === 'around'
      ? 'M 55 130 L 90 130 L 90 217 L 310 217 L 310 130 L 345 130'
      : 'M 55 130 L 345 130');
    await expect(lab.locator('.sa-map-caption')).toContainText('sem escala');
    expect(await lab.locator('.sa-values').innerText()).toBe(values);
  }
  await lab.locator('button[data-route="around"]').click();
  await lab.locator('button[data-scene="3"]').click();
  await expect(lab.locator('.sa-route-box')).toHaveCount(0);
  await lab.locator('button[data-scene="2"]').click();
  await expect(lab.locator('button[data-route="around"]')).toHaveAttribute('aria-pressed', 'true');
});

test('narrative scope and qualitative magnitude can be explored independently', async ({ page }) => {
  await page.goto('/#2.1.5');
  const lab = page.locator('.sequence-act-lab');
  await lab.getByRole('button', { name: 'Uma cena de entrevista', exact: true }).click();
  await expect(lab.locator('.sa-design-result')).toHaveAttribute('data-design', 'interview');
  await expect(lab.locator('.sa-design-result')).toContainText('qualificada');
  await expect(lab.locator('.sa-gains')).toHaveCount(0);
  for (const [id, shift] of [['scene', 'Dúvida → Autoconfiança'], ['sequence', 'Sem o novo trabalho → Conquista do trabalho'], ['act', 'Grande reversão de valores']]) {
    const button = lab.locator(`button[data-magnitude="${id}"]`);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(lab.locator('.sa-magnitude-result')).toHaveAttribute('data-magnitude', id);
    await expect(lab.locator('.sa-magnitude-shift')).toHaveText(shift);
    await expect(lab.locator('.sa-design-result')).toHaveAttribute('data-design', 'interview');
    await expect(lab.locator('.sa-job')).toHaveAttribute('data-climax', 'true');
  }
  await expect(lab.locator('.sa-magnitude-result')).toContainText('clímax final da estória');
  await lab.getByRole('button', { name: 'Sequência de três cenas', exact: true }).click();
  expect(await lab.locator('.sa-gains li').allTextContents()).toEqual(['Caráter interno', 'Relação com a mãe', 'Panorama de Nova Iorque', 'Corporação']);
  await expect(lab.locator('.sa-magnitude-result')).toHaveAttribute('data-magnitude', 'act');
});

test('source notes retain their text, focus and position after lazy loading', async ({ page }) => {
  for (const number of ['1', '2']) {
    await page.goto(`/#2.1.5?nota=${number}`);
    await expect(page.locator('.sequence-act-lab')).toBeVisible();
    await expect(page.locator(`#note-${number}`)).toBeFocused();
    await expect(page.locator(`#note-${number}`)).toBeInViewport();
    const note = chapter.notes.find(item => item.number === number);
    await expect(page.locator(`[data-note="${number}"]`)).toHaveText(note.text);
    await page.locator(`#note-${number} .note-back`).click();
    await expect(page.locator(`#call-${number}`)).toBeFocused();
    await page.locator(`#call-${number}`).click();
    const inline = page.getByRole('note', { name: `Nota ${number}`, exact: true });
    await expect(inline.locator('p')).toHaveText(note.text);
    await inline.locator('.inline-note-footer-link').click();
    await expect(page.locator(`#note-${number}`)).toBeFocused();
    await expect(page.locator(`#note-${number}`)).toBeInViewport();
  }
});

test('Sequence panels support theme, enlarged text and narrow screens', async ({ page }, info) => {
  await page.goto('/#2.1.5');
  const lab = page.locator('.sequence-act-lab');
  await expect(lab).toBeVisible();
  const before = await lab.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole('button', { name: 'Ativar modo cinema', exact: true }).click();
  expect(await lab.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(before);
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Aumentar tamanho do texto', exact: true }).click();
  expect(await lab.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(26);
  for (const width of info.project.name === 'mobile' ? [390, 320] : [1440, 1150, 900]) {
    await page.setViewportSize({ width, height: 1000 });
    await lab.locator('button[data-scene="2"]').click();
    for (const panel of await lab.locator('.sa-panel, .sa-route-box, .sa-value').all()) {
      expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
});
