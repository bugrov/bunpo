<script setup lang="ts">
const name = ref('');
</script>

<template>
  <main class="styleguide-page">
    <h1 class="styleguide-page__title">
      Дизайн-система
    </h1>

    <UiCard>
      <template #header>
        Кнопки
      </template>
      <div class="styleguide-page__row">
        <UiButton>Primary</UiButton>
        <UiButton variant="secondary">
          Secondary
        </UiButton>
        <UiButton variant="ghost">
          Ghost
        </UiButton>
        <UiButton variant="danger">
          Danger
        </UiButton>
        <UiButton disabled>
          Disabled
        </UiButton>
      </div>
      <div class="styleguide-page__row">
        <UiButton size="sm">
          Small
        </UiButton>
        <UiButton size="md">
          Medium
        </UiButton>
        <UiButton size="lg">
          Large
        </UiButton>
      </div>
    </UiCard>

    <UiCard>
      <template #header>
        Поля
      </template>
      <div class="styleguide-page__column">
        <UiField
          label="Имя"
          hint="Как к вам обращаться"
        >
          <template #default="{ id, describedBy, invalid }">
            <UiInput
              :id="id"
              v-model="name"
              :aria-describedby="describedBy"
              :invalid="invalid"
              placeholder="Саня"
            />
          </template>
        </UiField>
        <UiField
          label="Email"
          error="Некорректный адрес"
        >
          <template #default="{ id, describedBy, invalid }">
            <UiInput
              :id="id"
              :aria-describedby="describedBy"
              :invalid="invalid"
              type="email"
              model-value="oops"
            />
          </template>
        </UiField>
      </div>
    </UiCard>

    <UiCard>
      <template #header>
        Бейджи
      </template>
      <div class="styleguide-page__row">
        <UiBadge>N5</UiBadge>
        <UiBadge variant="accent">
          N4
        </UiBadge>
        <UiBadge variant="success">
          Пройдено
        </UiBadge>
        <UiBadge variant="danger">
          Ошибка
        </UiBadge>
      </div>
      <template #footer>
        Футер карточки
      </template>
    </UiCard>
  </main>
</template>

<style lang="scss" scoped>
.styleguide-page {
  @apply mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8;

  &__title {
    @apply text-3xl font-extrabold tracking-tight;
  }

  &__row {
    @apply flex flex-wrap items-center gap-3 py-2;
  }

  &__column {
    @apply flex flex-col gap-4;
  }
}
</style>
