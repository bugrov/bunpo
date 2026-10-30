import { describe, expect, it } from 'vitest';
import { cn } from '../../app/lib/utils';

describe('cn', () => {
  it('объединяет классы и убирает ложные значения', () => {
    expect(cn('a', false, 'b')).toBe('a b');
  });

  it('разрешает конфликты Tailwind в пользу последнего класса', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
