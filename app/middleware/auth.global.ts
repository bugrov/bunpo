import { ROUTE } from '#shared/routes';

// Закрыто по умолчанию: гость попадает только на страницы с definePageMeta({ public: true }).
// Это удобство интерфейса, настоящая защита данных это requireUserSession в API.
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();

  if (to.meta.public || loggedIn.value) {
    return;
  }

  return navigateTo({ name: ROUTE.login });
});
