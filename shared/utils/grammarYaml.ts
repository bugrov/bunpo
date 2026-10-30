import { parse } from 'yaml';
import { grammarPointSchema } from '../schemas/grammar';
import type { GrammarPoint } from '../types';

// Разбирает и валидирует YAML-файл пункта грамматики. При ошибке бросает ZodError.
export const parseGrammarYaml = (source: string): GrammarPoint => {
  return grammarPointSchema.parse(parse(source));
};
