import { grammarParamsSchema } from '#shared/schemas/grammar';

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, zodValidator(grammarParamsSchema));
  const point = (await loadGrammarPoints()).find((item) => item.id === id);

  if (!point) {
    throw createError({ statusCode: 404, statusMessage: 'Пункт грамматики не найден' });
  }

  return point;
});
