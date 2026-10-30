<template>
  <section class="ui-card">
    <header
      v-if="$slots.header"
      class="ui-card__header"
    >
      <slot name="header" />
    </header>
    <div class="ui-card__body">
      <slot />
    </div>
    <footer
      v-if="$slots.footer"
      class="ui-card__footer"
    >
      <slot name="footer" />
    </footer>
  </section>
</template>

<style lang="scss" scoped>
.ui-card {
  @apply flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground;

  &__header {
    @apply border-b px-5 py-4 font-semibold;
  }

  &__body {
    @apply px-5 py-4;
  }

  &__footer {
    @apply border-t px-5 py-4;
  }
}
</style>
