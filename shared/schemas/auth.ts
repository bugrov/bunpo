import { z } from 'zod';

const emailSchema = z.string().trim().toLowerCase().pipe(z.email().max(254));

// Верхняя граница защищает от слишком дорогого хэширования; нижняя только при регистрации, вход её не раскрывает.
const PASSWORD_MAX = 128;

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(PASSWORD_MAX),
  displayName: z.string().trim().min(1).max(50),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(PASSWORD_MAX),
});
