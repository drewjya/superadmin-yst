<script setup lang="ts">
import BackTitle from "~/components/BackTitle.vue";
</script>

<template>
  <div
    class="flex flex-col gap-2 w-[calc(100svw-2rem)] md:w-[calc(100svw-4rem)]"
  >
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
    <BackTitle label="Tambah Cabang"></BackTitle>
  </div>
</template>

<style scoped></style>
