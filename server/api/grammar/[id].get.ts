import { grammarParamsSchema } from '#shared/schemas/grammar';

// Публичный контент, меняется только деплоем: кэшируем общим кэшем. Обработчик не читает сессию и куки.
export default defineCachedEventHandler(
  async (event) => {
    const { id } = await getValidatedRouterParams(event, zodValidator(grammarParamsSchema));
    const point = (await loadGrammarPoints()).find((item) => item.id === id);

    if (!point) {
      throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Пункт грамматики не найден' });
    }

    return point;
  },
  {
    maxAge: 60 * 60,
    swr: true,
    // Ключ только из id, без строки запроса. Nitro вырезает из ключа всё кроме букв, цифр и _, поэтому дефис
    // заменяем на _: иначе n5-ab-c и n5-a-bc дали бы один ключ. Неизвестный id кидает 404, ошибки в кэш не попадают.
    getKey: (event) => `grammar_${(getRouterParam(event, 'id') ?? '').replaceAll('-', '_')}`,
    shouldBypassCache: () => import.meta.dev,
  },
);
