<script setup lang="ts">
import { parseFurigana } from '#shared/utils/furigana';
import type { UiRubyProps } from './types';

const props = defineProps<UiRubyProps>();

const showReading = useFurigana();
const segments = computed(() => parseFurigana(props.text));
</script>

<template>
  <span
    class="ui-ruby"
    lang="ja"
  >
    <template
      v-for="(segment, index) in segments"
      :key="index"
    >
      <ruby v-if="segment.reading && showReading">{{ segment.text }}<rp>(</rp><rt class="ui-ruby__reading">{{ segment.reading }}</rt><rp>)</rp></ruby>
      <template v-else>{{ segment.text }}</template>
    </template>
  </span>
</template>

<style lang="scss" scoped>
.ui-ruby {
  @apply leading-loose;

  &__reading {
    @apply text-[0.55em] font-normal text-muted-foreground;
  }
}
</style>
