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

<style scoped>
@reference "../../assets/css/main.css";

.home-page {
  @apply mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-3 px-4;
}

.home-page__title {
  @apply text-5xl font-extrabold tracking-tight text-primary;
}

.home-page__lead {
  @apply text-lg text-muted-foreground;
}
</style>
