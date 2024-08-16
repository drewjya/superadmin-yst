<script setup lang="ts">
import VTable from "~/components/VTable.vue";
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
const invoices: Invoice[] = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];
</script>

<template>
  <div
    class="flex flex-col gap-2 w-[calc(100svw-2rem)] md:w-[calc(100svw-4rem)]"
  >
    <h1 class="text-2xl font-bold">Therapist</h1>
    <VTable
      :column="columns"
      :data="invoices"
      :get-key="(data) => data.invoice"
    />
  </div>
</template>
