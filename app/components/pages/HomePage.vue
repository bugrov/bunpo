<template>
  <main class="home-page">
    <h1 class="home-page__title">
      Bunpo
    </h1>
    <p class="home-page__lead">
      Японская грамматика по одному правилу в день.
    </p>
  </main>
</template>

<style lang="scss" scoped>
.home-page {
  @apply mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-3 px-4 md:px-8 lg:max-w-2xl lg:px-12;

  &__title {
    @apply text-5xl font-extrabold tracking-tight text-primary;
  }

  &__lead {
    @apply text-lg text-muted-foreground;
  }
}
</style>
