<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <Navbar></Navbar>
    <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:px-8">
      <slot></slot>
    </main>
  </div>
</template>
