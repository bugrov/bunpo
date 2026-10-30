import type { FuriganaSegment } from '../types';

// Разметка фуриганы: {漢字|かんじ}. Чтение только из хираганы и катаканы. Источник общий для схемы и рендера.
export const FURIGANA_SOURCE = String.raw`\{([^{}|]+)\|([\u3040-\u30ff]+)\}`;

const FURIGANA = new RegExp(FURIGANA_SOURCE, 'g');

export const parseFurigana = (text: string): FuriganaSegment[] => {
  const segments: FuriganaSegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(FURIGANA)) {
    const [whole, base, reading] = match;

    if (match.index > cursor) {
      segments.push({ text: text.slice(cursor, match.index) });
    }

    segments.push({ text: base ?? '', reading });
    cursor = match.index + whole.length;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }

  return segments;
};

export const stripFurigana = (text: string): string => {
  return text.replace(FURIGANA, '$1');
};
