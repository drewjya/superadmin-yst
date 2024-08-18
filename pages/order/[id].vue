<script setup lang="ts">
import type { VOrderDetail } from "~/lib/types";

const { id } = useRoute().params;

type OrderDetailReq = {
  order: VOrderDetail | null;
};

const { status, data } = await useLazyFetch<OrderDetailReq>(`/api/order/${id}`);
</script>

<template>
  <OrderCard
    :state="{
      data: data?.order ?? undefined,
      loading: status === 'pending',
    }"
  />
</template>

<style scoped></style>
