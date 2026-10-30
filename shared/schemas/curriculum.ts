import { z } from 'zod';
import { grammarIdSchema, LEVELS, REGISTERS } from './grammar';

export const CURRICULUM_STATUSES = ['planned', 'draft', 'reviewed'] as const;

// Одна запланированная тема. Порядок записей в curriculum.yaml и есть рекомендуемый порядок изучения.
export const curriculumEntrySchema = z
  .object({
    id: grammarIdSchema,
    title: z.string().trim().min(1),
    level: z.enum(LEVELS),
    register: z.enum(REGISTERS),
    group: z.string().trim().min(1),
    prerequisites: z.array(grammarIdSchema).default([]),
    status: z.enum(CURRICULUM_STATUSES),
  })
  .refine((entry) => entry.id.startsWith(`${entry.level}-`), {
    message: 'id должен начинаться с уровня, например n5-...',
    path: ['id'],
  });

export const curriculumSchema = z.object({
  entries: z.array(curriculumEntrySchema).min(1),
});
