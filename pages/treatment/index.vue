<script setup lang="ts">
import { DotsHorizontalIcon } from "@radix-icons/vue";
import type { VCategory, VTableColumn, VTags, VTreatment } from "~/lib/types";
type Cur = number | undefined;
const cursors = ref<Cur[]>([undefined]);
const skip = ref("");
const search = ref("");
type TreatmentReq = {
  treatment: VTreatment[];
  nextCursor: number | null;
};
const selectedTags = ref<VTags | undefined>();

const selectedCategory = ref<VCategory | undefined>();
const { data, status } = await useLazyFetch<TreatmentReq>(
  () =>
    `/api/treatment?query=${search.value}&category=${
      selectedCategory.value?.id ?? ""
    }&tag=${selectedTags.value?.id ?? ""}&${skip.value ?? ""}`
);



const { data: category, status: categoryStatus } = await useLazyFetch<{
  category: VCategory[];
}>("/api/category");

const { data: tags, status: tagStatus } = await useLazyFetch<{
  tags: VTags[];
}>("/api/tags");

const columns: VTableColumn<VTreatment>[] = [
  {
    class: "min-w-40",
    display: (data) => data.nama,
    key: "nama",
    label: "Nama",
  },
  {
    class: "w-20",
    display: (data) => data.category.nama,
    key: "category",
    label: "Category",
  },
  {
    class: "w-20",
    display: (data) => data.tags?.name ?? "",
    key: "tags",
    label: "Tags",
  },
];

watch(search, () => {
  if (!skip) {
    return;
  }

  skip.value = "";
  cursors.value = [undefined];
});
</script>

<template>
  <div
    class="flex flex-col gap-2 w-[calc(100svw-2rem)] md:w-[calc(100svw-4rem)]"
  >
    <div class="flex items-center justify-between">
      <AppBreadCrumb />

      <Button variant="outline" size="sm">Add New Treatment</Button>
    </div>
    <div class="flex gap-2">
      <VDropdown
        :items="category?.category"
        :loading="categoryStatus === 'pending'"
        :display="(v) => v.nama"
        label="Category"
        v-model="selectedCategory"
      />
      <VDropdown
        :items="tags?.tags"
        :loading="tagStatus === 'pending'"
        :display="(v) => v.name"
        label="Tags"
        v-model="selectedTags"
      />
    </div>
    <VTable
      @reset="
        () => {
          search = '';
          skip = '';
          cursors = [undefined];
          selectedCategory = undefined;
          selectedTags = undefined;
        }
      "
      @prev="
        () => {
          console.log(cursors);
          let cur = cursors.pop();
          cur = cursors.pop();
          skip = `cursor=${cur ?? ''}`;
          if (cursors.length === 0 && cur === undefined) {
            cursors = [undefined];
          } else {
            cursors = [...cursors, cur];
          }
        }
      "
      :prev="cursors.length !== 1"
      :next="data?.nextCursor !== undefined && data?.nextCursor !== null"
      @next="
        () => {
          const next = `cursor=${data?.nextCursor}`;
          if (cursors.length === 0) {
            cursors = [undefined];
          }

          cursors = [...cursors, data?.nextCursor ?? undefined];
          skip = next;
        }
      "
      :loading="status === 'pending'"
      :column="columns"
      :data="data?.treatment ?? undefined"
      :get-key="(data) => data.nama"
      v-model:search="search"
    >
      <template #head>
        <TableHead> Actions </TableHead>
      </template>

      <template #default="{ data }">
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon class="h-4 w-4" />
                <span class="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-[160px]">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem> Delete </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </template>
    </VTable>
  </div>
</template>
