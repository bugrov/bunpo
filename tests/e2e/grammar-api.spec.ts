import { expect, test } from '@playwright/test';

test('GET /api/grammar возвращает краткий список без тяжёлых полей', async ({ request }) => {
  const response = await request.get('/api/grammar');
  const list = (await response.json()) as Record<string, unknown>[];

  expect(response.status()).toBe(200);
  expect(list.length).toBeGreaterThanOrEqual(3);
  expect(list[0]).toEqual(
    expect.objectContaining({ id: expect.any(String), level: expect.any(String), title: expect.any(String) }),
  );
  expect(list[0]).not.toHaveProperty('exercises');
});

test('список отсортирован от простых уровней к сложным, затем по id', async ({ request }) => {
  const list = (await (await request.get('/api/grammar')).json()) as { id: string; level: string }[];
  const levels = list.map((item) => item.level);

  expect(levels).toEqual([...levels].sort((a, b) => b.localeCompare(a)));
  expect(list.map((item) => item.id).slice(0, 2)).toEqual(['n5-te-kudasai', 'n5-wa-desu']);
});

test('GET /api/grammar/:id возвращает полный пункт', async ({ request }) => {
  const response = await request.get('/api/grammar/n5-wa-desu');
  const point = (await response.json()) as Record<string, unknown>;

  expect(response.status()).toBe(200);
  expect(point).toEqual(expect.objectContaining({ id: 'n5-wa-desu', exercises: expect.any(Array) }));
});

test('неизвестный id даёт 404, некорректный формат id даёт 400', async ({ request }) => {
  expect((await request.get('/api/grammar/n5-net-takogo')).status()).toBe(404);
  expect((await request.get('/api/grammar/Bad_Id')).status()).toBe(400);
});
