import { fileURLToPath } from 'node:url';
import { removeDevOnlyPages } from './config/devPages';
import { tailwindReference } from './config/tailwindReference';

// Прямые слэши нужны Tailwind на Windows тоже.
const cssEntry = fileURLToPath(new URL('./app/assets/css/main.css', import.meta.url)).replaceAll('\\', '/');

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: {
    // Дописывает @reference в стили компонентов до того, как Sass и Tailwind их обработают.
    plugins: [tailwindReference(cssEntry)],
  },
  // Tailwind подключён через PostCSS, а не Vite-плагином: PostCSS в Vite идёт после Sass,
  // поэтому @apply внутри SCSS (с вложенностью &__element) обрабатывается уже раскрытым.
  postcss: {
    plugins: { '@tailwindcss/postcss': {} },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ru', class: 'dark' },
      title: 'Bunpo',
    },
  },
  components: [{ path: '~/components', pathPrefix: false, extensions: ['vue'] }],
  $production: {
    hooks: {
      'pages:extend': removeDevOnlyPages,
    },
  },
  typescript: {
    strict: true,
    // Тесты и конфиги тестов проверяются вместе с остальным кодом (и видны ESLint).
    nodeTsConfig: {
      include: ['../tests/**/*', '../config/**/*', '../vitest.config.ts', '../playwright.config.ts'],
    },
  },
});
