/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-vue'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    // Директивы Tailwind v4.
    'at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['apply', 'reference', 'theme', 'source', 'utility', 'variant', 'custom-variant', 'plugin', 'config'] },
    ],
    'at-rule-prelude-no-invalid': [true, { ignoreAtRules: ['apply', 'reference', 'source', 'utility', 'variant', 'custom-variant', 'plugin', 'config'] }],
    'import-notation': null,
    // BEM: block, block__element, block--modifier, block__element--modifier.
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      { message: 'Имя класса должно соответствовать BEM: block, block__element, block--modifier.' },
    ],
  },
};
