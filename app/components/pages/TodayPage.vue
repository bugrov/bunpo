<script setup lang="ts">
import { ROUTE } from '#shared/routes';

const { user, clear } = useUserSession();

const logout = async () => {
  await clear();
  await navigateTo({ name: ROUTE.login });
};
</script>

<template>
  <main class="today-page">
    <h1 class="today-page__title">
      Сегодня
    </h1>
    <p class="today-page__greeting">
      Привет, {{ user?.displayName }}
    </p>
    <UiButton
      variant="ghost"
      @click="logout"
    >
      Выйти
    </UiButton>
  </main>
</template>

<style lang="scss" scoped>
.today-page {
  @apply mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-4 px-4 md:px-8 lg:max-w-2xl lg:px-12;

  &__title {
    @apply text-4xl font-extrabold tracking-tight;
  }

  &__greeting {
    @apply text-lg text-muted-foreground;
  }
}
</style>
