<script setup lang="ts">
import { ROUTE } from '#shared/routes';
import { loginSchema } from '#shared/schemas/auth';

const { fetch: fetchSession } = useUserSession();

const email = ref('');
const password = ref('');
const emailError = ref('');
const passwordError = ref('');
const formError = ref('');
const pending = ref(false);

const submit = async () => {
  formError.value = '';
  const parsed = loginSchema.safeParse({ email: email.value, password: password.value });

  const failed = (field: string): boolean => !parsed.success && parsed.error.issues.some((issue) => issue.path[0] === field);

  emailError.value = failed('email') ? 'Введите корректную почту' : '';
  passwordError.value = failed('password') ? 'Введите пароль' : '';

  if (!parsed.success) {
    return;
  }

  pending.value = true;

  try {
    await $fetch('/api/auth/login', { method: 'POST', body: parsed.data });
    await fetchSession();
    await navigateTo({ name: ROUTE.today });
  } catch (error) {
    formError.value = fetchErrorMessage(error, 'Не удалось войти, попробуйте ещё раз');
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <form
    class="login-form"
    novalidate
    @submit.prevent="submit"
  >
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
    >
      <template #default="{ id, describedBy, invalid }">
        <UiInput
          :id="id"
          v-model="password"
          :aria-describedby="describedBy"
          :invalid="invalid"
          autocomplete="current-password"
          type="password"
        />
      </template>
    </UiField>
    <p
      v-if="formError"
      class="login-form__error"
      role="alert"
    >
      {{ formError }}
    </p>
    <UiButton
      :disabled="pending"
      type="submit"
    >
      Войти
    </UiButton>
  </form>
</template>

<style lang="scss" scoped>
.login-form {
  @apply flex flex-col gap-4;

  &__error {
    @apply text-sm text-destructive;
  }
}
</style>
