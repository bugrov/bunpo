import { expect, test } from '@playwright/test';

test('главная страница открывается и использует тёмную тему', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Bunpo' })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/dark/);
});
