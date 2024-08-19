import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const { cursor, limit }: { cursor: number; limit: number } = getQuery(event);

  const cabang = await prisma.cabang.findMany({
    take: limit ? +limit : undefined,
    ...(parseInt(`${cursor}`)
      ? {
          skip: 1, // Do not include the cursor itself in the query result.
          cursor: {
            id: +cursor,
          },
        }
      : {}),

    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      nama: true,
      phoneNumber: true,
      closeHour: true,
      openHour: true,
      picture: {
        select: {
          path: true,
        },
      },
      alamat: true,
    },
  });
  let nextCursor: number | undefined;

  if (cabang.length < limit) {
    nextCursor = undefined;
  } else {
    nextCursor = cabang[cabang.length - 1].id;
  }

  return {
    cabang: cabang,
    nextCursor: nextCursor,
  };
});
