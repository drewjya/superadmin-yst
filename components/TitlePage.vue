<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="flex items-center">
    <h1 class="text-lg font-semibold md:text-2xl">{{ title }}</h1>
  </div>
</template>

<style scoped></style>
