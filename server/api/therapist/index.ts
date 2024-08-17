import prisma from "~/lib/prisma";
import { VTherapist } from "~/lib/types";

const getUtcDateToday = () => {
  const localDate = new Date();

  const formattedDate = localDate
    .toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/");

  const jakartaStartDate = new Date(
    `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}`
  );

  const jakartaEndDate = new Date(jakartaStartDate);
  jakartaEndDate.setDate(jakartaEndDate.getDate() + 1);
  jakartaEndDate.setMilliseconds(jakartaEndDate.getMilliseconds() - 1);

  const utcStart = jakartaStartDate.toISOString();
  const utcEnd = jakartaEndDate.toISOString();

  return {
    start: utcStart,
    end: utcEnd,
  };
};
export default defineEventHandler(async (event) => {
  const { query, cursor }: { cursor: number; query: string } = getQuery(event);
  let items: VTherapist[];
  const limit = 10;
  const date = getUtcDateToday();
  if (query && query.length !== 0) {
    const data = await prisma.therapist.findMany({
      take: limit,
      where: {
        no: {
          startsWith: query,
        },
      },
      select: {
        id: true,
        nama: true,
        no: true,
        cabang: {
          select: {
            nama: true,
            id: true,
          },
        },
        gender: true,
        attendance: {
          select: {
            checkIn: true,
            checkOut: true,
            id: true,
          },
          take: 1,
          where: {
            createdAt: {
              gte: date.start,
              lt: date.end,
            },
          },
        },
      },
    });
    items = data.map((e) => {
      return {
        ...e,
        attendance: e.attendance.length > 0 ? e.attendance[0] : undefined,
      };
    });
    return {
      therapist: items,
      nextCursor: null,
    };
  }

  const data = await prisma.therapist.findMany({
    take: limit,
    cursor: cursor
      ? {
          id: +cursor,
        }
      : undefined,

    select: {
      id: true,
      nama: true,
      no: true,
      cabang: {
        select: {
          nama: true,
          id: true,
        },
      },
      gender: true,
      attendance: {
        select: {
          checkIn: true,
          checkOut: true,
          id: true,
        },
        take: 1,
        where: {
          createdAt: {
            gte: date.start,
            lt: date.end,
          },
        },
      },
    },
  });
  let nextCursor: number | undefined;
  items = data.map((e) => {
    return {
      ...e,
      attendance: e.attendance.length > 0 ? e.attendance[0] : undefined,
    };
  });
  if (items.length < limit) {
    nextCursor = undefined;
  } else {
    nextCursor = items[items.length - 1].id;
  }

  return {
    therapist: items,
    nextCursor: nextCursor ?? null,
  };
});
