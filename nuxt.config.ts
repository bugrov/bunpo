import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', 'shadcn-nuxt'],
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
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
  typescript: {
    strict: true,
    // Тесты и конфиги тестов проверяются вместе с остальным кодом (и видны ESLint).
    nodeTsConfig: {
      include: ['../tests/**/*', '../vitest.config.ts', '../playwright.config.ts'],
    },
  },
});
