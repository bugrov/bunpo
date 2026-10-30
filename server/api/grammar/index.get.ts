import { LEVELS } from '#shared/schemas/grammar';

// Публичный контент, меняется только деплоем: кэшируем общим кэшем. Обработчик не читает сессию и куки.
export default defineCachedEventHandler(
  async () => {
    const points = await loadGrammarPoints();

    return points
      .map(({ id, level, register, status, title, summary }) => ({ id, level, register, status, title, summary }))
      .sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) || Number(a.id > b.id) - Number(a.id < b.id));
  },
  { maxAge: 60 * 60, swr: true, shouldBypassCache: () => import.meta.dev },
);
