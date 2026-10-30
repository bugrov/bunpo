import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const apiDir = join(import.meta.dirname, '../../server/api');

const listFiles = (dir: string): string[] => {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    return entry.isDirectory() ? listFiles(path) : [path];
  });
};

const files = listFiles(apiDir).map((path) => relative(apiDir, path).replaceAll('\\', '/'));
const source = (file: string): string => readFileSync(join(apiDir, file), 'utf-8');

// Эндпоинты без требования сессии. Любой новый эндпоинт, которого здесь нет, обязан вызывать requireUserSession.
const PUBLIC_ENDPOINTS = [
  'auth/register.post.ts',
  'auth/login.post.ts',
  'grammar/index.get.ts',
  'grammar/[id].get.ts',
];
// Публичный контент, который кэшируется общим кэшем: такие обработчики не имеют права читать сессию и куки.
const CACHED_ENDPOINTS = ['grammar/index.get.ts', 'grammar/[id].get.ts'];
const SESSION_OR_COOKIE_API = /getUserSession|requireUserSession|setUserSession|getCookie|parseCookies|getHeader\(/;

describe('защита API', () => {
  it('в списке публичных нет несуществующих файлов', () => {
    for (const file of PUBLIC_ENDPOINTS) {
      expect(files, `${file} указан как публичный, но файла нет`).toContain(file);
    }
  });

  it('каждый не публичный эндпоинт вызывает requireUserSession', () => {
    for (const file of files.filter((item) => !PUBLIC_ENDPOINTS.includes(item))) {
      expect(source(file), `${file} должен вызывать requireUserSession(event)`).toContain('requireUserSession(');
    }
  });

  it('кэшируемые обработчики используют defineCachedEventHandler и не читают сессию и куки', () => {
    for (const file of CACHED_ENDPOINTS) {
      expect(source(file), `${file} должен быть defineCachedEventHandler`).toContain('defineCachedEventHandler(');
      expect(source(file), `${file} не должен трогать сессию и куки`).not.toMatch(SESSION_OR_COOKIE_API);
    }
  });

  it('кэшируемые обработчики задают свой getKey, не зависящий от строки запроса', () => {
    for (const file of CACHED_ENDPOINTS) {
      expect(source(file), `${file}: нужен getKey (иначе ключ кэша включает query и растёт от ?x=1, ?x=2)`).toContain('getKey:');
    }
  });

  it('тело мутирующих запросов читается только как JSON через readValidatedJsonBody', () => {
    const mutating = files.filter((file) => /\.(post|put|patch|delete)\.ts$/.test(file));

    for (const file of mutating) {
      expect(source(file), `${file}: нужен readValidatedJsonBody (защита от CSRF через form-запросы)`).not.toMatch(
        /readBody\(|readValidatedBody\(|readFormData\(|readMultipartFormData\(/,
      );
    }
  });

  it('defineCachedEventHandler встречается только в списке кэшируемых', () => {
    for (const file of files.filter((item) => !CACHED_ENDPOINTS.includes(item))) {
      expect(source(file), `${file} не должен кэшироваться общим кэшем`).not.toContain('defineCachedEventHandler(');
    }
  });
});
