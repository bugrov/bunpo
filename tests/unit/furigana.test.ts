import { describe, expect, it } from 'vitest';
import { parseFurigana, stripFurigana } from '../../shared/utils/furigana';

describe('parseFurigana', () => {
  it('возвращает один сегмент для текста без разметки', () => {
    expect(parseFurigana('こんにちは')).toEqual([{ text: 'こんにちは' }]);
  });

  it('разбивает текст на сегменты с чтениями', () => {
    expect(parseFurigana('わたしは{学生|がくせい}です。')).toEqual([
      { text: 'わたしは' },
      { text: '学生', reading: 'がくせい' },
      { text: 'です。' },
    ]);
  });

  it('поддерживает несколько слов подряд и катакану в чтении', () => {
    expect(parseFurigana('{田中|たなか}{先生|せんせい}')).toEqual([
      { text: '田中', reading: 'たなか' },
      { text: '先生', reading: 'せんせい' },
    ]);
    expect(parseFurigana('{珈琲|コーヒー}')).toEqual([{ text: '珈琲', reading: 'コーヒー' }]);
  });

  it('пустая строка даёт пустой массив', () => {
    expect(parseFurigana('')).toEqual([]);
  });
});

describe('stripFurigana', () => {
  it('оставляет только основной текст', () => {
    expect(stripFurigana('{田中|たなか}さんは{先生|せんせい}です。')).toBe('田中さんは先生です。');
  });
});
