<script setup lang="ts">
import { ROUTE } from '#shared/routes';

definePageMeta({ name: ROUTE.login, public: true, middleware: 'guest' });
</script>

<template>
  <LoginPage />
</template>
