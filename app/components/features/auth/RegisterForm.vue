<script setup lang="ts">
import { ROUTE } from '#shared/routes';
import { registerSchema } from '#shared/schemas/auth';

const { fetch: fetchSession } = useUserSession();

const displayName = ref('');
const email = ref('');
const password = ref('');
const nameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const formError = ref('');
const pending = ref(false);

const submit = async () => {
  formError.value = '';
  const parsed = registerSchema.safeParse({
    displayName: displayName.value,
    email: email.value,
    password: password.value,
  });
  const failed = (field: string): boolean => !parsed.success && parsed.error.issues.some((issue) => issue.path[0] === field);

  nameError.value = failed('displayName') ? 'Введите имя до 50 символов' : '';
  emailError.value = failed('email') ? 'Введите корректную почту' : '';
  passwordError.value = failed('password') ? 'Пароль от 8 до 128 символов' : '';

  if (!parsed.success) {
    return;
  }

  pending.value = true;

  try {
    await $fetch('/api/auth/register', { method: 'POST', body: parsed.data });
    await fetchSession();
    await navigateTo({ name: ROUTE.today });
  } catch (error) {
    formError.value = fetchErrorMessage(error, 'Не удалось зарегистрироваться, попробуйте ещё раз');
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <form
    class="register-form"
    novalidate
    @submit.prevent="submit"
  >
    <UiField
      label="Имя"
      :error="nameError"
    >
      <template #default="{ id, describedBy, invalid }">
        <UiInput
          :id="id"
          v-model="displayName"
          :aria-describedby="describedBy"
          :invalid="invalid"
          autocomplete="nickname"
        />
      </template>
    </UiField>
    <UiField
      label="Почта"
      :error="emailError"
    >
      <template #default="{ id, describedBy, invalid }">
        <UiInput
          :id="id"
          v-model="email"
          :aria-describedby="describedBy"
          :invalid="invalid"
          autocomplete="email"
          type="email"
        />
      </template>
    </UiField>
    <UiField
      label="Пароль"
      :error="passwordError"
      hint="Не короче 8 символов"
    >
      <template #default="{ id, describedBy, invalid }">
        <UiInput
          :id="id"
          v-model="password"
          :aria-describedby="describedBy"
          :invalid="invalid"
          autocomplete="new-password"
          type="password"
        />
      </template>
    </UiField>
    <p
      v-if="formError"
      class="register-form__error"
      role="alert"
    >
      {{ formError }}
    </p>
    <UiButton
      :disabled="pending"
      type="submit"
    >
      Зарегистрироваться
    </UiButton>
  </form>
</template>

<style lang="scss" scoped>
.register-form {
  @apply flex flex-col gap-4;

  &__error {
    @apply text-sm text-destructive;
  }
}
</style>
