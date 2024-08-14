<script setup lang="ts">
import { type DateValue, CalendarDate } from "@internationalized/date";
import Calendar from "~/components/ui/calendar/Calendar.vue";

const today = () => {
  const today = new Date();
  return new CalendarDate(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
};
const value = ref<DateValue>();
</script>

<template>
  <div
    class="flex flex-1 items-center justify-center rounded-lg border-[0.25px] shadow-sm"
  >
    <div class="flex flex-col items-center gap-1 text-center">
      <p>{{ value }}</p>
      <Calendar
        v-model="value"
        :data="{
          '2024-08-01': '2024-08-01',
          '2024-08-03': '2024-08-03',
          '2024-08-05': '2024-08-05',
        }"
      />
      <!-- <h3 class="text-2xl font-bold tracking-tight">
              You have no products
            </h3>
            <p class="text-sm text-muted-foreground">
              You can start selling as soon as you add a product.
            </p>
            <Button class="mt-4">
              Add Product
            </Button> -->
    </div>
  </div>
</template>
