<script setup lang="ts">
import { ROUTE } from '#shared/routes';

definePageMeta({ name: ROUTE.register, public: true, middleware: 'guest' });
</script>

<template>
  <RegisterPage />
</template>
