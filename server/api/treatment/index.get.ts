import prisma from "~/lib/prisma";
import { VTreatment } from "~/lib/types";

export default defineEventHandler(async (event) => {
  const { query, cursor }: { cursor: number; query: string } = getQuery(event);
  let items: VTreatment[];
  const limit = 10;
  if (query && query.length !== 0) {
    items = await prisma.treatment.findMany({
      take: limit,
      where: {
        nama: {
          startsWith: query,
        },
      },
      select: {
        id: true,
        nama: true,
        category: {
          select: {
            nama: true,
          },
        },
        durasi: true,
        tags: {
          select: {
            name: true,
          },
        },
      },
    });
    return {
      treatment: items,
      nextCursor: null,
    };
  }

  items = await prisma.treatment.findMany({
    take: limit,
    cursor: cursor
      ? {
          id: +cursor,
        }
      : undefined,
    select: {
      id: true,
      nama: true,
      category: {
        select: {
          nama: true,
        },
      },
      durasi: true,
      tags: {
        select: {
          name: true,
        },
      },
    },
  });
  let nextCursor: number | undefined;

  if (items.length < limit) {
    nextCursor = undefined;
  } else {
    nextCursor = items[items.length - 1].id;
  }

  return {
    treatment: items,
    nextCursor: nextCursor ?? null,
  };
});
