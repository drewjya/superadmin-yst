<script setup lang="ts">
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListFilter,
  X,
} from "lucide-vue-next";

import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
import type { DateRange } from "radix-vue";

import type { Gender, OrderStatus } from "@prisma/client";
import type { VOrder } from "~/lib/types";
import {
  cn,
  currencyFormat,
  formatDateString,
  genderList,
  numberFormat,
  orderStatusList,
  titleCase,
  todayString,
} from "~/lib/utils";

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});

type Cur = number | undefined;
const cursors = ref<Cur[]>([undefined]);
const skip = ref("");
const therapist = ref("");
const user = ref("");
const email = ref("");
const initDate = new Date();

type OrderReq = {
  order: VOrder[];
  nextCursor: number | null;
};

const date = ref({
  start: new CalendarDate(
    initDate.getFullYear(),
    initDate.getMonth() + 1,
    initDate.getDate()
  ),
  end: new CalendarDate(
    initDate.getFullYear(),
    initDate.getMonth() + 2,
    initDate.getDate()
  ),
}) as Ref<DateRange>;

const orderStatus = ref<OrderStatus | "">("");
const gender = ref<Gender | undefined>();
const listStatus = orderStatusList();
const { status, data } = await useLazyFetch<OrderReq>(
  () =>
    `/api/order?start=${date.value.start ?? ""}&end=${
      date.value.end ?? ""
    }&status=${orderStatus.value}&therapist=${therapist.value}&name=${
      user.value
    }&email=${email.value}&gender=${gender.value ?? ""}&${skip.value}`
);
type Profit = {
  now: number;
  prev: number;
};
const { data: income } = await useLazyFetch<{
  monthly: Profit;
  weekly: Profit;
}>(() => `/api/order/income?date=${todayString()}&status=${orderStatus.value}`);

const percentageVal = (profit: Profit, val: "week" | "month") => {
  if (profit.prev === 0) {
    if (profit.now === 0) {
      return `same from last ${val}`;
    }
    return `+${numberFormat(profit.now / 100)}% from last ${val}`;
  }
  if (profit.now !== profit.prev) {
    const comparator = ((profit.now - profit.prev) / profit.prev) * 100;
    console.log(comparator, val);

    if (comparator === 0) {
      return `same from last ${val}`;
    }
    return `${
      comparator > 0
        ? `+${numberFormat(comparator)}`
        : `${numberFormat(comparator)}`
    }% from last ${val}`;
  }
  return `same from the last ${val}`;
};
</script>

<template>
  <div
    class="flex flex-col gap-4 w-[calc(100svw-2rem)] md:w-[calc(100svw-4rem)]"
  >
    <div class="flex items-center justify-between">
      <AppBreadCrumb />
    </div>
    <main
      class="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"
    >
      <div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
        <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-2">
          <Card>
            <CardHeader class="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle class="text-4xl" v-if="income">
                {{ currencyFormat(income.weekly.now) }}
              </CardTitle>
            </CardHeader>
            <CardContent v-if="income">
              <div class="text-xs text-muted-foreground">
                {{ percentageVal(income.weekly, "week") }}
              </div>
            </CardContent>
            <!-- <CardFooter>
              <Progress :model-value="25" aria-label="25% increase" />
            </CardFooter> -->
          </Card>

          <Card>
            <CardHeader class="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle class="text-4xl" v-if="income">
                {{ currencyFormat(income.monthly.now) }}
              </CardTitle>
            </CardHeader>
            <CardContent v-if="income">
              <div class="text-xs text-muted-foreground">
                {{ percentageVal(income.monthly, "month") }}
              </div>
            </CardContent>
          </Card>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex items-end">
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="
                    cn(
                      'w-[280px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )
                  "
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  <template v-if="date.start">
                    <template v-if="date.end">
                      {{ df.format(date.start.toDate(getLocalTimeZone())) }} -
                      {{ df.format(date.end.toDate(getLocalTimeZone())) }}
                    </template>

                    <template v-else>
                      {{ df.format(date.start.toDate(getLocalTimeZone())) }}
                    </template>
                  </template>
                  <template v-else> Pick a date </template>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <RangeCalendar
                  v-model="date"
                  initial-focus
                  :number-of-months="2"
                  @update:start-value="(startDate:any) => date.start = startDate"
                />
              </PopoverContent>
            </Popover>
            <div class="ml-auto flex items-end gap-2">
              <VDropdown
                :show-label="false"
                :items="genderList()"
                v-model="gender"
                label="Gender"
                :display="(v) => titleCase(v)"
              ></VDropdown>

              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button
                    variant="outline"
                    size="sm"
                    class="h-7 gap-1 rounded-md px-3"
                  >
                    <ListFilter class="h-3.5 w-3.5" />
                    <span class="sr-only sm:not-sr-only">{{
                      orderStatus === "" ? "All" : titleCase(orderStatus)
                    }}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    v-for="i in listStatus"
                    class="border mb-1"
                    @click="orderStatus = i"
                    :class="orderStatus === i ? 'bg-primary text-white' : ''"
                  >
                    <label
                      for="terms2"
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >{{ titleCase(i) }}</label
                    >
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    @click="orderStatus = ''"
                    class="border mb-1"
                    :class="orderStatus === '' ? 'bg-primary text-white' : ''"
                  >
                    <label
                      for="terms2"
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      All
                    </label>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                @click="
                  () => {
                    orderStatus = '';
                    date = {
                      start: new CalendarDate(
                        initDate.getFullYear(),
                        initDate.getMonth(),
                        initDate.getDate()
                      ),
                      end: new CalendarDate(
                        initDate.getFullYear(),
                        initDate.getMonth() + 1,
                        initDate.getDate()
                      ),
                    };
                    gender = undefined;
                    therapist = '';
                  }
                "
                size="sm"
                class="h-7 gap-1 rounded-md px-3"
              >
                <X class="h-3.5 w-3.5" />
                <span class="sr-only sm:not-sr-only">Reset</span>
              </Button>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <Input v-model="therapist" placeholder="Search Nama Therapist" />
            <Input v-model="user" placeholder="Search Nama User" />
            <Input v-model="email" placeholder="Search Email User" />
          </div>

          <Card>
            <CardHeader class="px-7">
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead> Tanggal Treatment </TableHead>
                    <TableHead>Therapist</TableHead>
                    <TableHead class="hidden sm:table-cell"> Cabang </TableHead>
                    <TableHead class="hidden sm:table-cell"> Status </TableHead>
                    <TableHead> Bukti Bayar </TableHead>
                    <TableHead class="text-right"> Amount </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody v-if="status === 'pending'" class="h-40">
                  <td colspan="6" class="text-center m-auto">
                    <LoadingSpinner />
                  </td>
                </TableBody>
                <TableBody
                  v-else-if="(data?.order ?? []).length === 0"
                  class="h-40"
                >
                  <td colspan="6" class="text-center m-auto">
                    <p class="font-medium">Tidak Ada Order</p>
                  </td>
                </TableBody>
                <TableBody v-else>
                  <TableRow
                    v-for="i in data?.order ?? []"
                    @click="
                      () => {
                        $router.push(`/order/${i.id}`);
                      }
                    "
                  >
                    <TableCell class="text-center">
                      {{
                        formatDateString(
                          "DD MMM YYYY, HH:mm",
                          new Date(i.orderTime!).toString()
                        )
                      }}
                    </TableCell>
                    <TableCell class="text-sm">
                      <div class="font-medium">
                        {{
                          i.therapist
                            ? `(${i.therapist?.no}) ${i.therapist.nama}`
                            : "Random"
                        }}
                      </div>
                    </TableCell>
                    <TableCell class="hidden sm:table-cell">
                      {{ i.cabang.nama }}
                    </TableCell>
                    <TableCell class="hidden sm:table-cell">
                      <VBadgeStatus class="text-xs" :status="i.orderStatus" />
                    </TableCell>
                    <TableCell>
                      <div class="flex justify-center">
                        <Badge
                          class="text-xs"
                          :class="i.picture ? 'bg-green-500' : 'bg-red-400'"
                          variant="secondary"
                        >
                          {{ i.picture ? "Sudah" : "Belum" }}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell class="text-right">
                      {{ currencyFormat(i.totalPrice) }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div class="flex justify-end gap-2">
                <Button
                  size="xs"
                  :disabled="status === 'pending' || cursors.length === 1"
                  @click="
                    () => {
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
                  variant="secondary"
                  class="hover:bg-primary/80 hover:text-primary-foreground"
                >
                  <ChevronLeftIcon class="w-4 h-4" />
                </Button>
                <Button
                  size="xs"
                  @click="
                    () => {
                      const next = `cursor=${data?.nextCursor}`;
                      if (cursors.length === 0) {
                        cursors = [undefined];
                      }

                      cursors = [...cursors, data?.nextCursor ?? undefined];
                      skip = next;
                    }
                  "
                  :disabled="data?.nextCursor === null || status === 'pending'"
                  variant="secondary"
                  class="hover:bg-primary/80 hover:text-primary-foreground"
                >
                  <ChevronRightIcon class="w-4 h-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>
