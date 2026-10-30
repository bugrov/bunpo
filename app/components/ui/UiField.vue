<script setup lang="ts">
import type { UiFieldProps, UiFieldSlots } from './types';

const props = defineProps<UiFieldProps>();

defineSlots<UiFieldSlots>();

const id = useId();
const describedBy = computed(() => {
  if (props.error) {
    return `${id}-error`;
  }

  return props.hint ? `${id}-hint` : undefined;
});
</script>

<template>
  <div class="ui-field">
    <UiLabel
      class="ui-field__label"
      :for="id"
    >
      {{ label }}
    </UiLabel>
    <slot
      :id="id"
      :described-by="describedBy"
      :invalid="Boolean(error)"
    />
    <p
      v-if="error"
      :id="`${id}-error`"
      class="ui-field__error"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      :id="`${id}-hint`"
      class="ui-field__hint"
    >
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.ui-field {
  @apply flex flex-col gap-2;
}

.ui-field__hint {
  @apply text-sm text-muted-foreground;
}

.ui-field__error {
  @apply text-sm text-destructive;
}
</style>
