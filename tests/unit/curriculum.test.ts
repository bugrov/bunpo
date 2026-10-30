import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { curriculumSchema } from '../../shared/schemas/curriculum';
import { parseGrammarYaml } from '../../shared/utils/grammarYaml';

const contentDir = join(import.meta.dirname, '../../content');

const listFiles = (dir: string): string[] => {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    return entry.isDirectory() ? listFiles(path) : [path];
  });
};

const { entries } = curriculumSchema.parse(parse(readFileSync(join(contentDir, 'curriculum.yaml'), 'utf-8')));
const ids = entries.map((entry) => entry.id);
const position = new Map(ids.map((id, index) => [id, index]));
const written = listFiles(join(contentDir, 'grammar'))
  .filter((path) => path.endsWith('.yaml'))
  .map((path) => parseGrammarYaml(readFileSync(path, 'utf-8')));

describe('перечень тем (curriculum.yaml)', () => {
  it('id уникальны', () => {
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('prerequisites существуют, не ссылаются на себя и стоят в списке раньше зависимого пункта', () => {
    for (const entry of entries) {
      for (const dependency of entry.prerequisites) {
        expect(position.has(dependency), `${entry.id} зависит от несуществующего ${dependency}`).toBe(true);
        expect(position.get(dependency) ?? Infinity, `${dependency} должен идти раньше ${entry.id}`).toBeLessThan(
          position.get(entry.id) ?? -1,
        );
      }
    }
  });

  it('каждый написанный пункт есть в перечне с тем же уровнем, регистром и статусом', () => {
    for (const point of written) {
      const entry = entries.find((item) => item.id === point.id);

      expect(entry, `${point.id} не найден в curriculum.yaml`).toBeDefined();
      expect(entry?.level).toBe(point.level);
      expect(entry?.register).toBe(point.register);
      expect(entry?.status).toBe(point.status);
    }
  });

  it('пункты со статусом draft/reviewed имеют файл, а planned файла не имеют', () => {
    const writtenIds = new Set(written.map((point) => point.id));

    for (const entry of entries) {
      expect(writtenIds.has(entry.id), `${entry.id} (${entry.status})`).toBe(entry.status !== 'planned');
    }
  });

  it('файлы лежат в папке своего уровня', () => {
    const files = listFiles(join(contentDir, 'grammar')).filter((path) => path.endsWith('.yaml'));

    for (const file of files) {
      expect(ids).toContain(basename(file, '.yaml'));
    }
  });
});
