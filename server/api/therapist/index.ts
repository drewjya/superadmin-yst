import { Gender } from "@prisma/client";
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
  const {
    query,
    cursor,
    gender,
    no,
    cabang,
  }: {
    cursor: number;
    query: string;
    gender: string;
    no: string;
    cabang: number;
  } = getQuery(event);
  let items: VTherapist[];
  const limit = 10;
  const date = getUtcDateToday();
  if (query || gender || no || cabang) {
    const data = await prisma.therapist.findMany({
      take: limit,
      ...(parseInt(`${cursor}`)
        ? {
            skip: 1, // Do not include the cursor itself in the query result.
            cursor: {
              id: +cursor,
            },
          }
        : {}),
      where: {
        no: no
          ? {
              startsWith: no,
              mode: "insensitive",
            }
          : undefined,
        cabang: cabang
          ? {
              id: +cabang,
            }
          : undefined,
        gender: gender ? (gender as Gender) : undefined,
        nama: query
          ? {
              startsWith: query,
              mode: "insensitive",
            }
          : undefined,
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
      nextCursor: nextCursor,
    };
  }

  const data = await prisma.therapist.findMany({
    take: limit,
    ...(parseInt(`${cursor}`)
      ? {
          skip: 1, // Do not include the cursor itself in the query result.
          cursor: {
            id: +cursor,
          },
        }
      : {}),

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
