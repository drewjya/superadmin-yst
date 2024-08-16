<script setup lang="ts" generic="T">
import { ArrowUpDown } from "lucide-vue-next";
import type { KeyFunction, VTableColumn } from "~/lib/types";

withDefaults(
  defineProps<{
    data?: T[];
    getKey: KeyFunction<T>;
    column: VTableColumn<T>[];
    loading?: boolean;
    placeholder?: string;
  }>(),
  {
    data: () => [],
    loading: false,
    placeholder: "No data available",
  }
);
</script>

<template>
  <div class="flex gap-5">
    <Input placeholder="Search" class="border-[0.5px]" />
  </div>
  <ScrollArea class="w-full whitespace-nowrap rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-for="e in column" :class="e.class">
            <Button
              v-if="e.sorting"
              variant="ghost"
              class="w-full flex gap-2"
              @click="e.sorting()"
            >
              {{ e.label }}
              <ArrowUpDown class="w-4 h-4" />
            </Button>
            <div v-else>
              {{ e.label }}
            </div>
          </TableHead>
          <slot name="head" v-if="!loading && data.length !== 0"></slot>
        </TableRow>
      </TableHeader>
      <TableBody v-if="loading">
        <TableRow class="h-40">
          <td :colspan="column.length" class="text-center m-auto">
            <LoadingSpinner />
          </td>
        </TableRow>
      </TableBody>
      <TableBody v-else-if="data.length === 0">
        <TableRow class="h-40">
          <td :colspan="column.length" class="text-center">
            <p>{{ placeholder }}</p>
          </td>
        </TableRow>
      </TableBody>
      <TableBody v-else>
        <TableRow :key="getKey(curr)" v-for="curr in data">
          <TableCell v-for="e in column" class="font-medium px-4">{{
            e.display(curr)
          }}</TableCell>
          <slot :data="curr"></slot>
        </TableRow>
      </TableBody>
    </Table>

    <ScrollBar orientation="horizontal" />
  </ScrollArea>
  <div class="flex justify-end gap-2">
    <Button
      :disabled="loading"
      size="sm"
      variant="secondary"
      class="hover:bg-primary/80 hover:text-primary-foreground"
    >
      Prev
    </Button>
    <Button
      size="sm"
      :disabled="loading"
      variant="secondary"
      class="hover:bg-primary/80 hover:text-primary-foreground"
    >
      Next
    </Button>
  </div>
</template>
