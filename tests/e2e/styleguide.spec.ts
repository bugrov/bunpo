import { expect, test } from '@playwright/test';

test('витрина дизайн-системы: клик по label фокусирует поле, ошибка видна', async ({ page }) => {
  await page.goto('/styleguide');

  await page.getByText('Имя', { exact: true }).click();
  await expect(page.getByPlaceholder('Саня')).toBeFocused();
  await expect(page.getByRole('alert')).toHaveText('Некорректный адрес');
  await expect(page.getByRole('button', { name: 'Primary' })).toBeVisible();
});

test('на мобильной ширине нет горизонтальной прокрутки', async ({ page }) => {
  await page.goto('/styleguide');

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth - document.documentElement.clientWidth;
  });

  expect(overflow).toBeLessThanOrEqual(0);
});
