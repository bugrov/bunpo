import tailwindcss from '@tailwindcss/vite';
import { removeDevOnlyPages } from './config/devPages';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ru', class: 'dark' },
      title: 'Bunpo',
    },
  },
  components: [{ path: '~/components', pathPrefix: false }],
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
