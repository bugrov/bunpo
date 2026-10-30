import type { z } from 'zod';
import type { exerciseSchema, grammarPointSchema } from '../schemas/grammar';

export type GrammarPoint = z.infer<typeof grammarPointSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;

export interface FuriganaSegment {
  text: string;
  reading?: string | undefined;
}
