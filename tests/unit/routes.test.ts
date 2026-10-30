import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROUTE } from '../../shared/routes';

const pagesDir = join(import.meta.dirname, '../../app/pages');

const listPages = (dir: string): string[] => {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    return entry.isDirectory() ? listPages(path) : [path];
  });
};

const pages = listPages(pagesDir).filter((path) => path.endsWith('.vue'));

const routeKeyOf = (source: string): string | undefined => {
  return /definePageMeta\(\{[^}]*name:\s*ROUTE\.(\w+)/.exec(source)?.[1];
};

describe('именованные роуты', () => {
  it('имена роутов уникальны и совпадают с ключами', () => {
    const names = Object.values(ROUTE);

    expect(new Set(names).size).toBe(names.length);
    expect(Object.keys(ROUTE).sort()).toEqual([...names].sort());
  });

  it('в проекте есть страницы', () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  it.each(pages)('страница %s задаёт name из ROUTE через definePageMeta', (page) => {
    const key = routeKeyOf(readFileSync(page, 'utf-8'));

    expect(key, 'definePageMeta({ name: ROUTE.xxx }) не найден').toBeDefined();
    expect(Object.keys(ROUTE)).toContain(key);
  });

  it('каждое имя из ROUTE используется ровно одной страницей', () => {
    const used = pages.flatMap((page) => {
      const key = routeKeyOf(readFileSync(page, 'utf-8'));

      return key ? [key] : [];
    });

    expect(used.sort()).toEqual(Object.keys(ROUTE).sort());
  });

  it.each(pages)('страница %s тонкая: один компонент <XxxPage />', (page) => {
    const source = readFileSync(page, 'utf-8');
    const template = /<template>([\s\S]*)<\/template>/.exec(source)?.[1] ?? '';
    const tags = template.match(/<[A-Z]\w+/g) ?? [];

    expect(tags).toHaveLength(1);
    expect(tags[0]).toMatch(/Page$/);
  });
});
