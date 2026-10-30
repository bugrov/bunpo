<script setup lang="ts">
import type { UiButtonProps } from './types';

const { variant = 'primary', size = 'md', type = 'button' } = defineProps<UiButtonProps>();
</script>

<template>
  <button
    class="ui-button"
    :class="[`ui-button--${variant}`, `ui-button--${size}`]"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.ui-button {
  @apply inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
    disabled:pointer-events-none disabled:opacity-50;

  &--primary {
    @apply bg-primary text-primary-foreground hover:brightness-110;
  }

  &--secondary {
    @apply bg-secondary text-secondary-foreground hover:bg-accent;
  }

  &--ghost {
    @apply bg-transparent text-foreground hover:bg-secondary;
  }

  &--danger {
    @apply bg-destructive text-background hover:brightness-110;
  }

  &--sm {
    @apply h-9 px-3 text-sm pointer-coarse:h-11;
  }

  &--md {
    @apply h-11 px-5 text-base;
  }

  &--lg {
    @apply h-14 px-7 text-lg;
  }
}
</style>
