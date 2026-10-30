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
  { maxAge: 60 * 60, swr: true, shouldBypassCache: () => import.meta.dev },
);
