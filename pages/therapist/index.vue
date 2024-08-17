<script setup lang="ts">
import { DotsHorizontalIcon } from "@radix-icons/vue";
import type { VTableColumn, VTherapist } from "~/lib/types";
type Cur = number | undefined;
const cursors = ref<Cur[]>([undefined]);
const skip = ref("");
const search = ref("");
type TherapistReq = {
  therapist: VTherapist[];
  nextCursor: number | null;
};
const { data, status } = await useLazyFetch<TherapistReq>(
  () => `/api/therapist?query=${search.value}&${skip.value ?? ""}`
);

const columns: VTableColumn<VTherapist>[] = [
  {
    class: "min-w-20",
    display: (data) => data.no ?? "-",
    key: "no",
    label: "No",
  },
  {
    class: "w-32",
    display: (data) => data.nama,
    key: "nama",
    label: "Nama",
  },
  {
    class: "w-32",

    key: "gender",
    label: "Gender",
  },
  {
    class: "w-20",
    display: (data) => data.cabang?.nama ?? "-",
    key: "cabang",
    label: "Cabang",
  },
  // {
  //   class: "w-20",
  //   display: (data) => data.attendance?.checkIn?.toString() ?? "-",
  //   key: "check-in",
  //   label: "Check In",
  // },
  // {
  //   class: "w-20",
  //   display: (data) => data.attendance?.checkOut?.toString() ?? "-",
  //   key: "check-out",
  //   label: "Check Out",
  // },
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

      <Button variant="outline" size="sm">Add New Therapist</Button>
    </div>

    <VTable
      @reset="
        () => {
          search = '';
          skip = '';
          cursors = [undefined];
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
      :data="data?.therapist ?? undefined"
      :get-key="(data) => data.nama"
      v-model:search="search"
    >
      <template #head>
        <TableHead> Check In </TableHead>
        <TableHead> Check Out </TableHead>
        <TableHead> Actions </TableHead>
      </template>

      <template #default="{ data }">
        <TableCell>
          <div class="flex justify-center">
            <Button
              v-if="!data.attendance?.checkIn"
              size="sm"
              variant="outline"
            >
              Check In
            </Button>
            <p v-else>
              {{ data.attendance?.checkIn?.toString() }}
            </p>
          </div>
        </TableCell>
        <TableCell>
          <div class="flex justify-center">
            <div v-if="!data.attendance?.checkIn" size="sm" variant="secondary">
              -
            </div>
            <Button
              v-else-if="!data.attendance?.checkOut"
              size="sm"
              variant="outline"
            >
              Check Out
            </Button>
            <p v-else>
              {{ data.attendance?.checkOut?.toString() }}
            </p>
          </div>
        </TableCell>
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
