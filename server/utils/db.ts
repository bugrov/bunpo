import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../db/schema';

let db: ReturnType<typeof createDb> | undefined;

const createDb = () => {
  const { databaseUrl } = useRuntimeConfig();

  if (!databaseUrl) {
    throw new Error('NUXT_DATABASE_URL не задана');
  }

  const pool = new Pool({ connectionString: databaseUrl });

  // Без обработчика обрыв простаивающего соединения станет необработанным исключением и уронит процесс.
  pool.on('error', (error: Error) => {
    console.error('Ошибка соединения с БД:', error.message);
  });

  return drizzle(pool, { schema });
};

// Один экземпляр на процесс. Pool (WebSocket) нужен ради транзакций, HTTP-драйвер Neon их не поддерживает.
export const useDb = () => {
  db ??= createDb();

  return db;
};
