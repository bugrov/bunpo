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

const navigateMessage = 'Переходы только по имени роута: navigateTo({ name: ROUTE.xxx }).';
const typeMessage = 'Типы объявляются только в types.ts или types/index.ts.';

const restrictedSyntax = [
  {
    selector: 'TSAsExpression > TSAsExpression > TSUnknownKeyword',
    message: '`as unknown as` запрещён: исправь типы или обоснуй исключение отдельно.',
  },
  {
    selector: "CallExpression[callee.object.name='sql'][callee.property.name='raw']",
    message: 'sql.raw запрещён: используй параметризованные запросы Drizzle.',
  },
  {
    selector: "CallExpression[callee.name='navigateTo'] > Literal:first-child",
    message: navigateMessage,
  },
  {
    selector: "CallExpression[callee.name='navigateTo'] > TemplateLiteral:first-child",
    message: navigateMessage,
  },
  {
    selector: "CallExpression[callee.name='navigateTo'] > ObjectExpression > Property[key.name='path']",
    message: navigateMessage,
  },
];

// Объявлять типы можно только в types.ts, types/** и *.d.ts: там действует только restrictedSyntax.
const typeDeclarationBans = [
  { selector: 'TSInterfaceDeclaration', message: typeMessage },
  { selector: 'TSTypeAliasDeclaration', message: typeMessage },
];

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
      'no-restricted-syntax': ['error', ...restrictedSyntax, ...typeDeclarationBans],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/no-restricted-syntax': [
        'error',
        {
          selector:
            'VElement[rawName=/^(NuxtLink|nuxt-link|RouterLink|router-link)$/] > VStartTag > VAttribute[directive=false][key.name="to"]',
          message: 'Ссылки только по имени роута: :to="{ name: ROUTE.xxx }".',
        },
        {
          selector:
            'VElement[rawName=/^(NuxtLink|nuxt-link|RouterLink|router-link)$/] > VStartTag > VAttribute[directive=true][key.argument.name="to"] > VExpressionContainer > :matches(Literal, TemplateLiteral)',
          message: 'Ссылки только по имени роута: :to="{ name: ROUTE.xxx }".',
        },
        {
          selector:
            'VElement[rawName=/^(div|span|p|li|ul|ol|section|article|header|footer|main|aside|nav|img|h[1-6])$/] > VStartTag > VAttribute[directive=true][key.argument.name=/^(click|dblclick|mousedown|mouseup|pointerdown|pointerup)$/]',
          message: 'Кликабельный элемент должен быть семантическим: <button> для действий, <a>/<NuxtLink> для переходов.',
        },
      ],
    },
  },
  ...fsdOverrides,
  {
    files: ['**/types.ts', '**/types/**/*.ts', '**/*.d.ts'],
    rules: { 'no-restricted-syntax': ['error', ...restrictedSyntax] },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
);
