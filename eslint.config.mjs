// @ts-check
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import withNuxt from './.nuxt/eslint.config.mjs';

const fsdLayers = ['ui', 'entities', 'features', 'widgets', 'pages'];
// Слой может импортировать только нижележащие: pages → widgets → features → entities → ui.
const forbiddenAbove = (layer) => {
  return fsdLayers.slice(fsdLayers.indexOf(layer) + 1);
};
const fsdOverrides = fsdLayers.map((layer) => {
  return {
    files: [`app/components/${layer}/**/*.{ts,vue}`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: forbiddenAbove(layer).map((upper) => {
            return {
              group: [`**/components/${upper}/**`],
              message: `FSD: слой ${layer} не может импортировать вышележащий слой ${upper}.`,
            };
          }),
        },
      ],
    },
  };
});

// Парсер для .vue задаёт сам Nuxt (vue-eslint-parser + TS), поэтому из конфигов typescript-eslint парсер убираем.
const withoutParser = (configs) => {
  return configs.map((config) => {
    const languageOptions = { ...config.languageOptions };
    delete languageOptions.parser;

    return { ...config, languageOptions };
  });
};

export default withNuxt(
  ...withoutParser(tseslint.configs.strictTypeChecked),
  ...withoutParser(tseslint.configs.stylisticTypeChecked),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      curly: ['error', 'all'],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSAsExpression > TSAsExpression > TSUnknownKeyword',
          message: '`as unknown as` запрещён: исправь типы или обоснуй исключение отдельно.',
        },
        {
          selector: "CallExpression[callee.object.name='sql'][callee.property.name='raw']",
          message: 'sql.raw запрещён: используй параметризованные запросы Drizzle.',
        },
        {
          selector: 'TSInterfaceDeclaration',
          message: 'Типы объявляются только в types.ts или types/index.ts.',
        },
        {
          selector: 'TSTypeAliasDeclaration',
          message: 'Типы объявляются только в types.ts или types/index.ts.',
        },
      ],
    },
  },
  ...fsdOverrides,
  {
    files: ['**/types.ts', '**/types/**/*.ts', '**/*.d.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
);
