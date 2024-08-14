<script setup lang="ts">
import { Bell, Package2 } from "lucide-vue-next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GenerateIcon from "./GenerateIcon.vue";
const sidebar = useSidebar();
</script>

<template>
  <div class="hidden border-r bg-muted/40 md:block">
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <a href="/" class="flex items-center gap-2 font-semibold">
          <Package2 class="h-6 w-6" />
          <span class="">Acme Inc</span>
        </a>
        <Button variant="outline" size="icon" class="ml-auto h-8 w-8">
          <Bell class="h-4 w-4" />
          <span class="sr-only">Toggle notifications</span>
        </Button>
      </div>
      <div class="flex-1">
        <nav class="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
          <a
            v-for="i in sidebar.pages.value"
            :href="i.link"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-white hover:bg-primary/70"
            :class="
              sidebar.current.value === i.link ? 'bg-primary text-white ' : ''
            "
          >
            <GenerateIcon :title="i.title" />
            {{ i.title }}
            <Badge
              v-if="i.notif"
              class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
            >
              {{ i.notif }}
            </Badge>
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
