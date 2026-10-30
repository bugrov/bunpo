import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from '../../shared/schemas/auth';

const valid = { email: 'user@example.com', password: 'correct-horse', displayName: 'Саня' };

describe('registerSchema', () => {
  it('приводит почту к нижнему регистру и обрезает пробелы, имя тоже обрезается', () => {
    const result = registerSchema.parse({ ...valid, email: '  User@Example.COM ', displayName: '  Саня  ' });

    expect(result.email).toBe('user@example.com');
    expect(result.displayName).toBe('Саня');
  });

  it.each([
    ['некорректная почта', { email: 'not-an-email' }],
    ['слишком длинная почта', { email: `${'a'.repeat(250)}@example.com` }],
    ['пароль короче 8 символов', { password: '1234567' }],
    ['пароль длиннее 128 символов', { password: 'a'.repeat(129) }],
    ['пустое имя', { displayName: '   ' }],
    ['имя длиннее 50 символов', { displayName: 'a'.repeat(51) }],
  ])('отклоняет: %s', (_name, patch) => {
    expect(registerSchema.safeParse({ ...valid, ...patch }).success).toBe(false);
  });

  it('принимает пароль ровно из 8 и из 128 символов', () => {
    expect(registerSchema.safeParse({ ...valid, password: 'a'.repeat(8) }).success).toBe(true);
    expect(registerSchema.safeParse({ ...valid, password: 'a'.repeat(128) }).success).toBe(true);
  });
});

describe('loginSchema', () => {
  it('не раскрывает правила пароля: подходит любой непустой пароль до 128 символов', () => {
    expect(loginSchema.safeParse({ email: valid.email, password: 'x' }).success).toBe(true);
    expect(loginSchema.safeParse({ email: valid.email, password: '' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: valid.email, password: 'a'.repeat(129) }).success).toBe(false);
  });

  it('нормализует почту так же, как регистрация', () => {
    expect(loginSchema.parse({ email: ' User@Example.com ', password: 'x' }).email).toBe('user@example.com');
  });
});
