<script setup lang="ts">
import type { UiInputProps } from './types';

const model = defineModel<string>({ default: '' });
const { type = 'text' } = defineProps<UiInputProps>();
</script>

<template>
  <input
    v-model="model"
    class="ui-input"
    :class="{ 'ui-input--invalid': invalid }"
    :type="type"
    :aria-invalid="invalid ? 'true' : undefined"
  >
</template>

<style scoped>
@reference "../../assets/css/main.css";

.ui-input {
  @apply h-11 w-full rounded-xl border border-input bg-card px-4 text-base text-foreground
    placeholder:text-muted-foreground
    focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
    disabled:cursor-not-allowed disabled:opacity-50;
}

.ui-input--invalid {
  @apply border-destructive focus-visible:outline-destructive;
}
</style>
