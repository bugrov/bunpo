import { registerSchema } from '#shared/schemas/auth';
import { users } from '../../db/schema';

export default defineEventHandler(async (event) => {
  const input = await readValidatedJsonBody(event, registerSchema);
  const passwordHash = await hashPassword(input.password);

  const [user] = await useDb()
    .insert(users)
    .values({ email: input.email, passwordHash, displayName: input.displayName })
    .onConflictDoNothing({ target: users.email })
    .returning({ id: users.id, displayName: users.displayName });

  if (!user) {
    throw createError({ statusCode: 409, statusMessage: 'Conflict', message: 'Эта почта уже зарегистрирована' });
  }

  await replaceUserSession(event, { user });

  return user;
});
