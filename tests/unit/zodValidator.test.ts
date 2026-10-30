import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { zodValidator } from '../../server/utils/zodValidator';

const schema = z.object({ id: z.string().trim().min(1) });

describe('zodValidator', () => {
  it('возвращает разобранные данные для корректного ввода', () => {
    expect(zodValidator(schema)({ id: '  n5-wa-desu  ' })).toEqual({ id: 'n5-wa-desu' });
  });

  it('возвращает false для некорректного ввода, не бросая ошибку', () => {
    const validate = zodValidator(schema);

    expect(validate({ id: '' })).toBe(false);
    expect(validate(null)).toBe(false);
    expect(validate({})).toBe(false);
  });
});
