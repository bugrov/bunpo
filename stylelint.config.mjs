const tailwindAtRules = ['apply', 'reference', 'theme', 'source', 'utility', 'variant', 'custom-variant', 'plugin', 'config'];

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-standard-vue/scss'],
  rules: {
    // Директивы Tailwind v4.
    'at-rule-no-unknown': [true, { ignoreAtRules: tailwindAtRules }],
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: tailwindAtRules }],
    'at-rule-prelude-no-invalid': [true, { ignoreAtRules: tailwindAtRules }],
    'import-notation': null,
    // BEM: block, block__element, block--modifier, block__element--modifier.
    // Корневые классы проверяет selector-class-pattern, вложенные (&__element, &--modifier) проверяет selector-nested-pattern:
    // selector-class-pattern пропускает селекторы вида `&_suffix`, поэтому одного его недостаточно.
    'selector-nested-pattern': [
      '^&(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?(:[a-z-]+)?$',
      { message: 'Вложенный селектор должен быть &__element, &--modifier или псевдокласс (BEM).' },
    ],
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      {
        resolveNestedSelectors: true,
        message: 'Имя класса должно соответствовать BEM: block, block__element, block--modifier.',
      },
    ],
  },
};
