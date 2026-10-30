import { describe, expect, it } from 'vitest';
import { exerciseSchema, grammarPointSchema } from '../../shared/schemas/grammar';

const example = { jp: 'これは{本|ほん}です。', ru: 'Это книга.' };
const dialogue = {
  lines: [
    { speaker: 'A', jp: 'これは{何|なん}ですか。', ru: 'Что это?' },
    { speaker: 'B', jp: '{本|ほん}です。', ru: 'Книга.' },
  ],
};
const exercises = [
  { type: 'choice', prompt: 'わたし＿学生です。', options: ['は', 'を'], answerIndex: 0 },
  { type: 'cloze', text: 'これは{{ほん|本}}です。', translation: 'Это книга.' },
  { type: 'reorder', words: ['これは', '本', 'です'], translation: 'Это книга.' },
  { type: 'translate', prompt: 'Это книга.', answers: ['これは本です。'] },
];
const validPoint = {
  id: 'n5-test',
  level: 'n5',
  register: 'polite',
  status: 'draft',
  title: 'テスト',
  summary: 'Тест',
  formation: ['A + B'],
  explanation: 'Объяснение',
  examples: [example, example, example, example],
  dialogues: [dialogue],
  exercises,
};

describe('grammarPointSchema', () => {
  it('принимает корректный пункт и подставляет значения по умолчанию', () => {
    const point = grammarPointSchema.parse(validPoint);

    expect(point.tags).toEqual([]);
    expect(point.related).toEqual([]);
    expect(point.prerequisites).toEqual([]);
    expect(point.pitfalls).toEqual([]);
  });

  it.each([
    ['id не начинается с уровня', { id: 'n4-test' }],
    ['id в неверном формате', { id: 'N5_Test' }],
    ['неизвестный уровень', { level: 'n6' }],
    ['неизвестный регистр', { register: 'rude' }],
    ['меньше 4 примеров', { examples: [example] }],
    ['больше 6 примеров', { examples: Array.from({ length: 7 }, () => example) }],
    ['нет диалогов', { dialogues: [] }],
    ['меньше 4 упражнений', { exercises: exercises.slice(0, 3) }],
    ['пустой formation', { formation: [] }],
  ])('отклоняет: %s', (_name, patch) => {
    expect(grammarPointSchema.safeParse({ ...validPoint, ...patch }).success).toBe(false);
  });

  it('отклоняет битую разметку фуригана в примере', () => {
    const broken = { jp: '{本|ほん です。', ru: 'x' };

    expect(grammarPointSchema.safeParse({ ...validPoint, examples: [broken, example, example, example] }).success).toBe(
      false,
    );
  });

  it('отклоняет чтение фуриганы не из каны', () => {
    const broken = { jp: '{本|hon}です。', ru: 'x' };

    expect(grammarPointSchema.safeParse({ ...validPoint, examples: [broken, example, example, example] }).success).toBe(
      false,
    );
  });
});

describe('exerciseSchema', () => {
  it('choice: answerIndex должен указывать на вариант', () => {
    const base = { type: 'choice', prompt: 'x', options: ['а', 'б'] };

    expect(exerciseSchema.safeParse({ ...base, answerIndex: 1 }).success).toBe(true);
    expect(exerciseSchema.safeParse({ ...base, answerIndex: 2 }).success).toBe(false);
  });

  it('choice: варианты уникальны', () => {
    expect(exerciseSchema.safeParse({ type: 'choice', prompt: 'x', options: ['а', 'а'], answerIndex: 0 }).success).toBe(
      false,
    );
  });

  it('cloze: нужен хотя бы один пропуск {{ответ|вариант}}', () => {
    expect(exerciseSchema.safeParse({ type: 'cloze', text: 'これは本です。', translation: 'x' }).success).toBe(false);
    expect(exerciseSchema.safeParse({ type: 'cloze', text: 'これは{{本|ほん}}です。', translation: 'x' }).success).toBe(
      true,
    );
  });

  it('cloze: фуригана и пропуск в одном тексте допустимы', () => {
    const text = '{私|わたし}は{{学生|がくせい}}です。';

    expect(exerciseSchema.safeParse({ type: 'cloze', text, translation: 'x' }).success).toBe(true);
  });

  it('reorder: слова без разметки, минимум два', () => {
    expect(exerciseSchema.safeParse({ type: 'reorder', words: ['а'], translation: 'x' }).success).toBe(false);
    expect(exerciseSchema.safeParse({ type: 'reorder', words: ['а', '{б|б}'], translation: 'x' }).success).toBe(false);
  });

  it('translate: ответы из одних пробелов отклоняются', () => {
    expect(exerciseSchema.safeParse({ type: 'translate', prompt: 'x', answers: ['   '] }).success).toBe(false);
  });

  it('translate: нужен хотя бы один ответ', () => {
    expect(exerciseSchema.safeParse({ type: 'translate', prompt: 'x', answers: [] }).success).toBe(false);
  });

  it('неизвестный тип упражнения отклоняется', () => {
    expect(exerciseSchema.safeParse({ type: 'listen', prompt: 'x' }).success).toBe(false);
  });
});
