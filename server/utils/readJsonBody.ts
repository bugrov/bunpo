import type { H3Event } from 'h3';
import type { z } from 'zod';

// Тело мутирующих запросов читаем только как JSON. Кросс-сайтовая HTML-форма не может отправить такой content-type
// (а fetch с ним требует CORS preflight, которого у нас нет), поэтому это защита от CSRF, в том числе от CSRF на вход.
export const readValidatedJsonBody = async <T extends z.ZodType>(event: H3Event, schema: T): Promise<z.output<T>> => {
  const contentType = getRequestHeader(event, 'content-type')?.toLowerCase() ?? '';

  if (!contentType.startsWith('application/json')) {
    throw createError({ statusCode: 415, statusMessage: 'Unsupported Media Type', message: 'Ожидается application/json' });
  }

  return readValidatedBody(event, zodValidator(schema));
};
