import { parseGrammarYaml } from '#shared/utils/grammarYaml';
import type { GrammarPoint } from '#shared/types';

let cache: Promise<GrammarPoint[]> | undefined;

const readGrammarPoints = async (): Promise<GrammarPoint[]> => {
  const storage = useStorage('assets:content');
  const keys = (await storage.getKeys('grammar')).filter((key) => key.endsWith('.yaml'));

  const points = await Promise.all(
    keys.map(async (key) => {
      const source = await storage.getItem<string>(key);

      if (typeof source !== 'string') {
        throw new TypeError(`Файл контента ${key} не прочитан как текст`);
      }

      return parseGrammarYaml(source);
    }),
  );
  const duplicate = points.find((point, index) => points.findIndex((other) => other.id === point.id) !== index);

  if (duplicate) {
    throw new Error(`Дублируется id пункта грамматики: ${duplicate.id}`);
  }

  return points;
};

// Контент публичный и неизменяемый в рантайме, поэтому в production читаем один раз; в dev перечитываем, чтобы видеть правки.
export const loadGrammarPoints = (): Promise<GrammarPoint[]> => {
  if (import.meta.dev) {
    return readGrammarPoints();
  }

  // Отказ не кэшируем: после исправления контента следующий запрос должен пройти.
  cache ??= readGrammarPoints().catch((error: unknown) => {
    cache = undefined;
    throw error;
  });

  return cache;
};
