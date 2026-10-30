import { eq } from 'drizzle-orm';
import { loginSchema } from '#shared/schemas/auth';
import { users } from '../../db/schema';

// Хэш для случая «пользователя нет»: проверка пароля выполняется всегда, чтобы время ответа не выдавало, есть ли такая почта.
let fallbackHash: Promise<string> | undefined;

export default defineEventHandler(async (event) => {
  const input = await readValidatedJsonBody(event, loginSchema);

  const [found] = await useDb()
    .select({ id: users.id, displayName: users.displayName, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  // Ждём запасной хэш в любом случае, чтобы первый запрос после старта стоил одинаково для известной и неизвестной почты.
  fallbackHash ??= hashPassword(crypto.randomUUID());
  const fallback = await fallbackHash;
  const valid = await verifyPassword(found?.passwordHash ?? fallback, input.password);

  if (!found || !valid) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'Неверная почта или пароль' });
  }

  const user = { id: found.id, displayName: found.displayName };

  await replaceUserSession(event, { user });

  return user;
});
