<template>
  <label class="ui-label">
    <slot />
  </label>
</template>

<style lang="scss" scoped>
.ui-label {
  @apply text-sm font-medium text-foreground;
}
</style>
