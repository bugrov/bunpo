import { defineConfig } from 'drizzle-kit';

// drizzle-kit запускается вне Nuxt, поэтому читает .env сам. Миграциям нужно прямое соединение (без pooler).
try {
  process.loadEnvFile('.env');
} catch {
  // .env может отсутствовать (например, в CI переменные задаются окружением)
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/db/schema.ts',
  out: './drizzle',
  // Пустой URL допустим для `generate` (к базе не подключается); `migrate` без него сообщит об ошибке сам.
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED ?? '' },
});
