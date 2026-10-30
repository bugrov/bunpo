<script setup lang="ts">
import type { UiBadgeProps } from './types';

const { variant = 'neutral' } = defineProps<UiBadgeProps>();
</script>

<template>
  <span
    class="ui-badge"
    :class="`ui-badge--${variant}`"
  >
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.ui-badge {
  @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold;

  &--neutral {
    @apply bg-secondary text-secondary-foreground;
  }

  &--accent {
    @apply bg-primary text-primary-foreground;
  }

  &--success {
    @apply bg-success/15 text-success;
  }

  &--danger {
    @apply bg-destructive/15 text-destructive;
  }
}
</style>
