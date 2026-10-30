// Единственный источник имён роутов. Страница задаёт имя через definePageMeta({ name: ROUTE.xxx }),
// переходы выполняются только по имени: navigateTo({ name: ROUTE.xxx }), <NuxtLink :to="{ name: ROUTE.xxx }">.
export const ROUTE = {
  home: 'home',
  styleguide: 'styleguide',
} as const;
