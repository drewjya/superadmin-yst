<script setup lang="ts">
import {
  Building2,
  ClipboardPlus,
  Home,
  LineChart,
  Package,
  ShoppingCart,
  Users,
} from "lucide-vue-next";

const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <Home class="h-4 w-4" v-if="title === 'Dashboards'" />
  <ShoppingCart class="h-4 w-4" v-else-if="title === 'Orders'" />
  <Building2 class="h-4 w-4" v-else-if="title === 'Cabangs'" />
  <Package class="h-4 w-4" v-else-if="title === 'Treatments'" />
  <ClipboardPlus class="h-4 w-4" v-else-if="title === 'Therapists'" />
  <Users class="h-4 w-4" v-else-if="title === 'Customers'" />
  <LineChart class="h-4 w-4" v-else-if="title === 'Analytics'" />
</template>

<style scoped></style>
