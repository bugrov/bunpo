import { LEVELS } from '#shared/schemas/grammar';

export default defineEventHandler(async () => {
  const points = await loadGrammarPoints();

  return points
    .map(({ id, level, register, status, title, summary }) => ({ id, level, register, status, title, summary }))
    .sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) || Number(a.id > b.id) - Number(a.id < b.id));
});
