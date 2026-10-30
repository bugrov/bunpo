import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';

// Виртуальные файлы не входят в tsconfig, поэтому для проверки синтаксических правил отключаем type-aware часть.
const eslint = new ESLint({
  cwd: process.cwd(),
  overrideConfig: [
    { languageOptions: { parserOptions: { projectService: false } } },
    tseslint.configs.disableTypeChecked,
  ],
});

const lint = async (code: string, filePath: string): Promise<string[]> => {
  const [result] = await eslint.lintText(code, { filePath });

  return (result?.messages ?? []).map((message) => message.ruleId ?? `parse: ${message.message}`);
};

describe('ESLint в файлах типов', () => {
  it('разрешает объявление типов', async () => {
    const rules = await lint('export interface Props { a: string }\n', 'app/components/ui/types.ts');

    expect(rules).not.toContain('no-restricted-syntax');
  });

  it('по-прежнему запрещает as unknown as и sql.raw', async () => {
    const code = 'export const a = 1 as unknown as string;\nsql.raw("x");\n';
    const rules = await lint(code, 'server/types/index.ts');

    expect(rules.filter((rule) => rule === 'no-restricted-syntax')).toHaveLength(2);
  });
});

describe('ESLint запрещает строковые пути в переходах', () => {
  it('navigateTo со строкой', async () => {
    const rules = await lint("navigateTo('/lesson');\n", 'app/composables/useBad.ts');

    expect(rules).toContain('no-restricted-syntax');
  });

  it('navigateTo с именованным роутом разрешён', async () => {
    const rules = await lint("navigateTo({ name: 'home' });\n", 'app/composables/useGood.ts');

    expect(rules).not.toContain('no-restricted-syntax');
  });

  it('NuxtLink со статическим to', async () => {
    const code = '<template>\n  <NuxtLink to="/lesson">x</NuxtLink>\n</template>\n';
    const rules = await lint(code, 'app/components/widgets/Bad.vue');

    expect(rules).toContain('vue/no-restricted-syntax');
  });

  it('navigateTo с объектом и path', async () => {
    const rules = await lint("navigateTo({ path: '/lesson' });\n", 'app/composables/useBad.ts');

    expect(rules).toContain('no-restricted-syntax');
  });

  it('NuxtLink с :to-строкой', async () => {
    const code = '<template>\n  <NuxtLink :to="\'/lesson\'">x</NuxtLink>\n</template>\n';
    const rules = await lint(code, 'app/components/widgets/Bad.vue');

    expect(rules).toContain('vue/no-restricted-syntax');
  });

  it('NuxtLink с :to по имени разрешён', async () => {
    const code = '<template>\n  <NuxtLink :to="{ name: \'home\' }">x</NuxtLink>\n</template>\n';
    const rules = await lint(code, 'app/components/widgets/Good.vue');

    expect(rules).not.toContain('vue/no-restricted-syntax');
  });
});
