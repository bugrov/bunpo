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

<style scoped>
@reference "../../assets/css/main.css";

.ui-card {
  @apply flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground;
}

.ui-card__header {
  @apply border-b border-border px-5 py-4 font-semibold;
}

.ui-card__body {
  @apply px-5 py-4;
}

.ui-card__footer {
  @apply border-t border-border px-5 py-4;
}
</style>
