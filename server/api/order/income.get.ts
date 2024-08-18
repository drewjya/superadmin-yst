import { OrderStatus } from "@prisma/client";
import prisma from "~/lib/prisma";
import {
  formatStringDate,
  getWeek,
  getWeekDates,
  stringDateThisAndNExt,
} from "~/lib/utils";

export default defineEventHandler(async (event) => {
  const { date, order }: { date: string; order: OrderStatus } = getQuery(event);

  let currDate: Date;
  if (!date) {
    currDate = new Date();
  } else {
    currDate = new Date(date);
  }

  const val = formatStringDate(date);
  const prev = {
    start: val.start,
    end: val.end,
  };

  prev.start.setMonth(val.start.getMonth() - 1);
  prev.end.setMonth(val.start.getMonth() - 1);

  const cr = stringDateThisAndNExt(date);
  const res = await prisma.$queryRaw<{ month: number; totalPrice: BigInt }[]>`
    select 
      EXTRACT(MONTH from "orderTime") as month,
      sum("totalPrice") as "totalPrice"
    FROM "Order"
    WHERE "orderTime" BETWEEN ${cr.start}::timestamp AND ${cr.end}::timestamp
    GROUP BY month
    ORDER BY month asc;
  `;
  const thisMonth = +cr.end.split("-")[1];
  const prevMonth = +cr.start.split("-")[1];

  const arrayToObject = (array: any[], key: any) => {
    const initVal = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initVal);
  };

  const result = arrayToObject(
    res.map((item) => {
      return {
        ...item,
        totalPrice: +item.totalPrice.toString(),
      };
    }),
    "month"
  );

  const monthly = {
    now: result[thisMonth]?.totalPrice ?? 0,
    prev: result[prevMonth]?.totalPrice ?? 0,
  };

  const startWeek = new Date(currDate);
  startWeek.setDate(currDate.getDate() - currDate.getDay() + 1);

  const endWeek = new Date(currDate);
  endWeek.setDate(currDate.getDate() + 6);

  const weekD = getWeekDates(date);
  console.log(weekD);

  const resultW = await prisma.$queryRaw<
    { week: string; totalPrice: BigInt }[]
  >`
    SELECT 
      TO_CHAR(DATE_TRUNC('week', "orderTime"), 'YYYY-MM-DD') AS week,
      SUM("totalPrice") AS "totalPrice"
    FROM "Order"
    WHERE "orderTime" BETWEEN ${weekD.startPrev}::timestamp AND ${weekD.endWeek}::timestamp
    GROUP BY week
    ORDER BY week ASC;
  `;

  const resultWS = arrayToObject(
    resultW.map((item) => {
      return {
        ...item,
        week: getWeek(item.week),
        totalPrice: +item.totalPrice.toString(),
      };
    }),
    "week"
  );

  const currs = {
    now: getWeek(weekD.endWeek),
    prev: getWeek(weekD.startPrev),
  };

  console.log(resultWS, currs);
  const resultWeek = {
    now: resultWS[currs.now]?.totalPrice ?? 0,
    prev: resultWS[currs.prev]?.totalPrice ?? 0,
  };

  return {
    monthly,
    weekly: resultWeek,
  };
});
