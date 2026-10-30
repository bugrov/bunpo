import { Pool } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { users } from '../../../server/db/schema';

export const hasDatabase = Boolean(process.env.NUXT_DATABASE_URL);

// Тестовые пользователи получают почту вида e2e-<случайное>@example.test, чтобы их было легко отличить и удалить.
export const uniqueEmail = (): string => {
  return `e2e-${crypto.randomUUID()}@example.test`;
};

export const deleteUserByEmail = async (email: string): Promise<void> => {
  const pool = new Pool({ connectionString: process.env.NUXT_DATABASE_URL });

  try {
    await drizzle(pool).delete(users).where(eq(users.email, email));
  } finally {
    await pool.end();
  }
};
