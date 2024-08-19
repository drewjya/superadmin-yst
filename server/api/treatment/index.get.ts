import prisma from "~/lib/prisma";
import { VTreatment } from "~/lib/types";

export default defineEventHandler(async (event) => {
  const {
    query,
    cursor,
    category,
    tag,
  }: { cursor: number; query: string; category: number; tag: number } =
    getQuery(event);
  let items: VTreatment[];
  const limit = 10;
  if (query || category || tag) {
    items = await prisma.treatment.findMany({
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
        nama: query
          ? {
              startsWith: query,
            }
          : undefined,
        tagsId: tag ? +tag : undefined,
        categoryId: category ? +category : undefined,
      },
      select: {
        id: true,
        nama: true,
        category: {
          select: {
            nama: true,
            id: true,
          },
        },
        durasi: true,
        tags: {
          select: {
            name: true,
            id: true,
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
      category: {
        select: {
          nama: true,
          id: true,
        },
      },
      durasi: true,
      tags: {
        select: {
          name: true,
          id: true,
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
