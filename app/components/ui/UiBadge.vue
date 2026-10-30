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

<style scoped>
@reference "../../assets/css/main.css";

.ui-badge {
  @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold;
}

.ui-badge--neutral {
  @apply bg-secondary text-secondary-foreground;
}

.ui-badge--accent {
  @apply bg-primary text-primary-foreground;
}

.ui-badge--success {
  @apply bg-success/15 text-success;
}

.ui-badge--danger {
  @apply bg-destructive/15 text-destructive;
}
</style>
