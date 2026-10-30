<script setup lang="ts">
import { ROUTE } from '#shared/routes';
</script>

<template>
  <main class="register-page">
    <h1 class="register-page__title">
      Регистрация
    </h1>
    <RegisterForm />
    <p class="register-page__alt">
      Уже есть аккаунт?
      <NuxtLink
        class="register-page__link"
        :to="{ name: ROUTE.login }"
      >
        Войти
      </NuxtLink>
    </p>
  </main>
</template>

<style lang="scss" scoped>
.register-page {
  @apply mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4 md:px-0;

  &__title {
    @apply text-3xl font-extrabold tracking-tight;
  }

  &__alt {
    @apply text-sm text-muted-foreground;
  }

  &__link {
    @apply text-primary underline-offset-4 hover:underline;
  }
}
</style>
