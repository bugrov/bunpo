import { z } from 'zod';
import { FURIGANA_SOURCE } from '../utils/furigana';

export const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'] as const;
export const REGISTERS = ['neutral', 'polite', 'casual', 'slang', 'written'] as const;
export const STATUSES = ['draft', 'reviewed'] as const;

const FURIGANA = new RegExp(FURIGANA_SOURCE, 'g');
// {{ответ|вариант}}: пропуск в упражнении, после первого значения идут допустимые альтернативы.
const BLANK = /\{\{[^{}|]+(?:\|[^{}|]+)*\}\}/g;

const hasNoStrayBraces = (text: string): boolean => {
  return !/[{}]/.test(text);
};

const hasValidFurigana = (text: string): boolean => {
  return hasNoStrayBraces(text.replace(FURIGANA, ''));
};

const FURIGANA_MESSAGE = 'Некорректная разметка фуриганы, нужно {漢字|かんじ}';

const furiganaText = z.string().min(1).refine(hasValidFurigana, FURIGANA_MESSAGE);
const plainText = z.string().trim().min(1);

export const grammarIdSchema = z.string().regex(/^n[1-5](-[a-z0-9]+)+$/, 'id вида n5-te-kudasai');

export const grammarParamsSchema = z.object({ id: grammarIdSchema });

const choiceSchema = z
  .object({
    type: z.literal('choice'),
    prompt: furiganaText,
    options: z.array(furiganaText).min(2).max(5),
    answerIndex: z.number().int().min(0),
  })
  .refine((exercise) => exercise.answerIndex < exercise.options.length, {
    message: 'answerIndex указывает за пределы options',
    path: ['answerIndex'],
  })
  .refine((exercise) => new Set(exercise.options).size === exercise.options.length, {
    message: 'Варианты ответа должны быть уникальны',
    path: ['options'],
  });

const clozeSchema = z.object({
  type: z.literal('cloze'),
  text: plainText
    .refine((text) => new RegExp(BLANK.source).test(text), 'Нужен хотя бы один пропуск {{ответ|вариант}}')
    .refine((text) => hasValidFurigana(text.replace(BLANK, '')), FURIGANA_MESSAGE),
  translation: plainText,
});

const reorderSchema = z.object({
  type: z.literal('reorder'),
  words: z.array(plainText.refine(hasNoStrayBraces, 'В словах для сборки нет разметки')).min(2),
  translation: plainText,
});

const translateSchema = z.object({
  type: z.literal('translate'),
  prompt: plainText,
  answers: z.array(plainText).min(1),
});

export const exerciseSchema = z.discriminatedUnion('type', [choiceSchema, clozeSchema, reorderSchema, translateSchema]);

const exampleSchema = z.object({
  jp: furiganaText,
  ru: plainText,
  note: plainText.optional(),
});

const dialogueSchema = z.object({
  lines: z
    .array(
      z.object({
        speaker: z.enum(['A', 'B']),
        jp: furiganaText,
        ru: plainText,
      }),
    )
    .min(2)
    .max(8),
});

export const grammarPointSchema = z
  .object({
    id: grammarIdSchema,
    level: z.enum(LEVELS),
    register: z.enum(REGISTERS),
    status: z.enum(STATUSES),
    tags: z.array(plainText).default([]),
    title: furiganaText,
    summary: plainText,
    formation: z.array(furiganaText).min(1),
    explanation: plainText,
    examples: z.array(exampleSchema).min(4).max(6),
    dialogues: z.array(dialogueSchema).min(1),
    pitfalls: z.array(plainText).default([]),
    related: z.array(grammarIdSchema).default([]),
    prerequisites: z.array(grammarIdSchema).default([]),
    exercises: z.array(exerciseSchema).min(4),
  })
  .refine((point) => point.id.startsWith(`${point.level}-`), {
    message: 'id должен начинаться с уровня, например n5-...',
    path: ['id'],
  });
