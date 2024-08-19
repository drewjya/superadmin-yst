<script setup lang="ts">
import type { VCabang } from "~/lib/types";

const skip = ref("");
type Cur = number | undefined;
const cursors = ref<Cur[]>([undefined]);
type CabangReq = {
  cabang: VCabang[];
  nextCursor: number | null;
};
const { data, status } = await useLazyFetch<CabangReq>(
  () => `/api/cabang?limit=6&cursor=${skip.value}`
);

const setCursor = (val: "prev" | "next") => {
  if (val === "next") {
    const next = `${data?.value?.nextCursor ?? ""}`;
    if (cursors.value.length === 0) {
      cursors.value = [undefined];
    }
    cursors.value = [...cursors.value, data?.value?.nextCursor ?? undefined];
    skip.value = next;
    return;
  }
  if (val === "prev") {
    let cur = cursors.value.pop();
    cur = cursors.value.pop();
    skip.value = `${cur ?? ""}`;
    if (cursors.value.length === 0 && cur === undefined) {
      cursors.value = [undefined];
    } else {
      cursors.value = [...cursors.value, cur];
    }
  }

  return;
};
</script>

<template>
  <div
    class="flex flex-col gap-2 w-[calc(100svw-2rem)] md:w-[calc(100svw-4rem)]"
  >
    <div class="flex items-center justify-between">
      <AppBreadCrumb />

      <Button variant="outline" size="sm">Add New Cabang</Button>
    </div>
    <div
      class="h-48 bg-stone-200 rounded flex justify-center items-center"
      v-if="status === 'pending'"
    >
      <LoadingSpinner></LoadingSpinner>
    </div>
    <div
      class="h-48 bg-stone-200 rounded flex justify-center items-center flex-col"
      v-else-if="data?.cabang.length === 0"
    >
      <div class="font-medium">No Data</div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3">
      <Card v-for="i in data?.cabang" class="flex flex-col justify-between">
        <CardHeader>
          <div class="flex justify-center bg-slate-100 rounded-t">
            <NuxtImg
              class="w-52"
              :src="'https://api.ystfamily.com/img/' + i.picture?.path"
            >
            </NuxtImg>
          </div>

          <CardTitle>
            {{ i.nama }}
          </CardTitle>
          <CardDescription>
            {{ i.openHour }} - {{ i.closeHour }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {{ i.alamat }}
          </CardDescription>
          <CardDescription class="text-xs">
            {{ i.phoneNumber }}
          </CardDescription>
        </CardContent>
        <CardFooter
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <div class="hidden lg:block"></div>
          <Button
            class="w-full bg-blue-700 hover:bg-blue-500"
            size="sm"
            variant="default"
            >Edit</Button
          >
          <Button class="w-full bg-red-700" size="sm" variant="destructive"
            >Hapus</Button
          >
        </CardFooter>
      </Card>
    </div>
    <div class="flex gap-2 justify-end">
      <Button
        v-if="data"
        size="sm"
        class="px-8"
        @click="() => setCursor('prev')"
        :disabled="cursors.length === 1"
        >Prev</Button
      >
      <Button
        v-if="data"
        size="sm"
        class="px-8"
        @click="() => setCursor('next')"
        :disabled="data?.nextCursor === undefined || data?.nextCursor === null"
        >Next</Button
      >
    </div>
  </div>
</template>
