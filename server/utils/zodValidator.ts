import type { z } from 'zod';

// Адаптер zod-схемы для getValidated*: h3 превращает `false` в ответ 400 без деталей схемы.
export const zodValidator = <T extends z.ZodType>(schema: T) => {
  return (input: unknown): z.output<T> | false => {
    const result = schema.safeParse(input);

    return result.success ? result.data : false;
  };
};
