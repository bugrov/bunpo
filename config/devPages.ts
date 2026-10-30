import { ROUTE } from '../shared/routes';

// Страницы, которые существуют только в dev (витрина дизайн-системы и т.п.).
const DEV_ONLY_ROUTES: readonly string[] = [ROUTE.styleguide];

// Хук `pages:extend`: убирает dev-страницы из production-сборки, меняя массив на месте.
export const removeDevOnlyPages = (pages: { name?: string }[]): void => {
  for (let index = pages.length - 1; index >= 0; index -= 1) {
    const name = pages[index]?.name;

    if (name && DEV_ONLY_ROUTES.includes(name)) {
      pages.splice(index, 1);
    }
  }
};
