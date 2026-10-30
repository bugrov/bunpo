import { readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseGrammarYaml } from '../../shared/utils/grammarYaml';
import type { GrammarPoint } from '../../shared/types';

const contentDir = join(import.meta.dirname, '../../content/grammar');

const listFiles = (dir: string): string[] => {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    return entry.isDirectory() ? listFiles(path) : [path];
  });
};

const files = listFiles(contentDir).filter((path) => path.endsWith('.yaml'));
const loaded = files.map((file) => {
  return { file, point: parseGrammarYaml(readFileSync(file, 'utf-8')) };
});
const points: GrammarPoint[] = loaded.map((item) => item.point);
const ids = new Set(points.map((point) => point.id));

const hasCycle = (): boolean => {
  const state = new Map<string, 'visiting' | 'done'>();
  const byId = new Map(points.map((point) => [point.id, point]));

  const visit = (id: string): boolean => {
    if (state.get(id) === 'done') {
      return false;
    }

    if (state.get(id) === 'visiting') {
      return true;
    }

    state.set(id, 'visiting');
    const cyclic = (byId.get(id)?.prerequisites ?? []).some(visit);

    state.set(id, 'done');

    return cyclic;
  };

  return points.some((point) => visit(point.id));
};

describe('контент грамматики', () => {
  it('есть хотя бы 3 пункта', () => {
    expect(files.length).toBeGreaterThanOrEqual(3);
  });

  it('id уникальны', () => {
    expect(ids.size).toBe(points.length);
  });

  it.each(loaded.map((item) => [basename(item.file), item] as const))('%s: имя файла и папка соответствуют id и уровню', (_name, item) => {
    expect(basename(item.file)).toBe(`${item.point.id}.yaml`);
    expect(basename(dirname(item.file))).toBe(item.point.level);
  });

  it.each(loaded.map((item) => [item.point.id, item.point] as const))('%s: related и prerequisites ссылаются на существующие пункты', (_id, point) => {
    for (const ref of [...point.related, ...point.prerequisites]) {
      expect(ids.has(ref), `${point.id} ссылается на несуществующий ${ref}`).toBe(true);
      expect(ref).not.toBe(point.id);
    }
  });

  it('prerequisites не образуют циклов', () => {
    expect(hasCycle()).toBe(false);
  });
});
