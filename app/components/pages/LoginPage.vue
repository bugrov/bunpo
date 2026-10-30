<script setup lang="ts">
import { ROUTE } from '#shared/routes';
</script>

<template>
  <main class="login-page">
    <h1 class="login-page__title">
      Вход
    </h1>
    <LoginForm />
    <p class="login-page__alt">
      Нет аккаунта?
      <NuxtLink
        class="login-page__link"
        :to="{ name: ROUTE.register }"
      >
        Зарегистрироваться
      </NuxtLink>
    </p>
  </main>
</template>

<style lang="scss" scoped>
.login-page {
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
