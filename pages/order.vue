<script setup lang="ts">
import type { VTableColumn } from "~/lib/types";

type Invoice = {
  invoice: string;
  paymentStatus: string;
  totalAmount: string;
  paymentMethod: string;
};

const columns: VTableColumn<Invoice>[] = [
  {
    class: "min-w-40",
    sorting: () => "desc",
    display: (data) => data.invoice,
    key: "invoice",
    label: "Invoice",
  },
  {
    class: "w-20",
    display: (data) => data.paymentStatus,
    key: "paymentStatus",
    label: "Payment Status",
  },
  {
    class: "w-20",
    display: (data) => data.paymentStatus,
    key: "paymentStatus",
    label: "Payment Status",
  },
  {
    class: "w-20",
    display: (data) => data.paymentStatus,
    key: "paymentStatus",

    label: "Payment Status",
  },
  {
    class: "w-20",
    display: (data) => data.paymentStatus,
    key: "paymentStatus",
    label: "Payment Status",
  },
  {
    class: "w-20",
    display: (data) => data.paymentStatus,
    key: "paymentStatus",
    label: "Payment Status",
  },
  {
    class: "w-20",
    display: (data) => data.paymentStatus,
    key: "paymentStatus",
    label: "Payment Status",
  },
  {
    class: "",
    display: (data) => data.paymentMethod,
    key: "paymentMethod",
    label: "Payment Method",
  },
];

const invoices = <Invoice[]>[
  {
    invoice: "12",
    paymentMethod: "dd",
    paymentStatus: "dds",
    totalAmount: "a",
  },
];
</script>

<template>
  <div
    class="flex flex-col gap-2 w-[calc(100svw-2rem)] md:w-[calc(100svw-4rem)]"
  >
    <h1 class="text-2xl font-bold">Orders</h1>
    <VTable
      :column="columns"
      :get-key="(data) => data.invoice"
      :data="invoices"
    >
      <template #head>
        <TableHead> Actions </TableHead>
      </template>
      <template #default="{ data }">
        <TableCell>
          <Button variant="default" @click="() => console.log('hdhd')"
            >More</Button
          >
        </TableCell>
      </template>
    </VTable>

    <!-- :data="invoices" -->
  </div>
</template>
