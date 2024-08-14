<script setup lang="ts">
import { CircleUser } from "lucide-vue-next";

import { type DateValue, CalendarDate } from "@internationalized/date";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sidebar from "~/components/Sidebar.vue";
import SidebarSheet from "~/components/SidebarSheet.vue";
import TitlePage from "~/components/TitlePage.vue";

const sidebar = useSidebar();

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
    class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
  >
    <Sidebar />
    <div class="flex flex-col">
      <header
        class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6"
      >
        <SidebarSheet />
        <div class="w-full flex-1">
          <TitlePage :title="sidebar.title.value ?? ''" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <CircleUser class="h-5 w-5" />
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
