<script setup lang="ts">
import Toaster from "./components/ui/toast/Toaster.vue";
</script>

<template>
  <NuxtLayout>
    <NuxtPage> </NuxtPage>
  </NuxtLayout>
  <Toaster :duration="800"></Toaster>
</template>
