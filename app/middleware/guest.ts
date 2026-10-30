import { ROUTE } from '#shared/routes';

// Для страниц входа и регистрации: вошедшего пользователя отправляем на «Сегодня».
export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession();

  if (loggedIn.value) {
    return navigateTo({ name: ROUTE.today });
  }
});
