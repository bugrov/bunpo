<template>
  <label class="ui-label">
    <slot />
  </label>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.ui-label {
  @apply text-sm font-medium text-foreground;
}
</style>
