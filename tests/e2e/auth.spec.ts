import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { deleteUserByEmail, hasDatabase, uniqueEmail } from './helpers/users';

const PASSWORD = 'correct-horse-battery';

const register = async (page: Page, email: string, name = 'Саня'): Promise<void> => {
  await page.goto('/register');
  await page.getByLabel('Имя').fill(name);
  await page.getByLabel('Почта').fill(email);
  await page.getByLabel('Пароль').fill(PASSWORD);
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
};

test.describe('закрытые страницы без базы', () => {
  test('гость на закрытой странице уходит на вход', async ({ page }) => {
    await page.goto('/today');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Вход' })).toBeVisible();
  });

  test('публичные страницы доступны гостю и не уводят на вход', async ({ page }) => {
    const pages: [string, string][] = [
      ['/', 'Bunpo'],
      ['/login', 'Вход'],
      ['/register', 'Регистрация'],
    ];

    for (const [path, heading] of pages) {
      await page.goto(path);

      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
      expect(new URL(page.url()).pathname).toBe(path);
    }
  });

  test('вход и регистрация принимают только JSON (защита от CSRF)', async ({ request }) => {
    const form = { email: 'user@example.test', password: 'correct-horse-battery', displayName: 'Саня' };

    expect((await request.post('/api/auth/login', { form })).status()).toBe(415);
    expect((await request.post('/api/auth/register', { form })).status()).toBe(415);
    expect((await request.post('/api/auth/login', { data: { email: 'bad', password: '' } })).status()).toBe(400);
  });

  test('robots.txt закрывает сайт от индексации', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();

    expect(body).toMatch(/User-agent:\s*\*/);
    expect(body).toMatch(/Disallow:\s*\/\s*$/m);
  });
});

test.describe('авторизация с базой', () => {
  test.skip(!hasDatabase, 'нужна база: задайте NUXT_DATABASE_URL');

  test('регистрация, сессия переживает перезагрузку, выход', async ({ page }) => {
    const email = uniqueEmail();

    try {
      await register(page, email);

      await expect(page).toHaveURL(/\/today$/);
      await expect(page.getByText('Привет, Саня')).toBeVisible();

      await page.reload();
      await expect(page.getByText('Привет, Саня')).toBeVisible();

      await page.getByRole('button', { name: 'Выйти' }).click();
      await expect(page).toHaveURL(/\/login$/);

      await page.goto('/today');
      await expect(page).toHaveURL(/\/login$/);
    } finally {
      await deleteUserByEmail(email);
    }
  });

  test('вход: неверный пароль даёт общую ошибку, верный пускает', async ({ page }) => {
    const email = uniqueEmail();

    try {
      await register(page, email);
      await page.getByRole('button', { name: 'Выйти' }).click();

      await page.getByLabel('Почта').fill(email);
      await page.getByLabel('Пароль').fill('wrong-password');
      await page.getByRole('button', { name: 'Войти' }).click();
      await expect(page.getByRole('alert')).toHaveText('Неверная почта или пароль');

      await page.getByLabel('Пароль').fill(PASSWORD);
      await page.getByRole('button', { name: 'Войти' }).click();
      await expect(page).toHaveURL(/\/today$/);
    } finally {
      await deleteUserByEmail(email);
    }
  });

  test('повторная регистрация той же почты отклоняется', async ({ page }) => {
    const email = uniqueEmail();

    try {
      await register(page, email);
      await page.getByRole('button', { name: 'Выйти' }).click();

      await register(page, email, 'Другой');
      await expect(page.getByRole('alert')).toHaveText('Эта почта уже зарегистрирована');
    } finally {
      await deleteUserByEmail(email);
    }
  });

  test('вошедший пользователь со страницы входа попадает на «Сегодня»', async ({ page }) => {
    const email = uniqueEmail();

    try {
      await register(page, email);
      await expect(page).toHaveURL(/\/today$/);

      await page.goto('/login');

      await expect(page).toHaveURL(/\/today$/);
    } finally {
      await deleteUserByEmail(email);
    }
  });
});
