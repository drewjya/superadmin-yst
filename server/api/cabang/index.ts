import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const param: { cursor: number } = getQuery(event);
  console.log(parseInt(`${param.cursor} `));

  const cabang = await prisma.cabang.findMany({
    take: 6,
    ...(parseInt(`${param.cursor}`)
      ? {
          skip: 1, // Do not include the cursor itself in the query result.
          cursor: {
            id: +param.cursor,
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
  let hasNextPage: boolean = false;

  if (cabang && cabang.length !== 0) {
    const cursor = cabang[cabang.length - 1].id;

    const nextPage = await prisma.cabang.findMany({
      take: 6,
      skip: 1,
      cursor: {
        id: cursor,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    hasNextPage = nextPage.length > 0;

    return {
      cabang,
      lastCursor: parseInt(`${param.cursor}`) ?? undefined,
      hasNextPage: hasNextPage,
    };
  }
  return {
    cabang: [],
    lastCursor: parseInt(`${param.cursor}`) ?? undefined,
    hasNextPage: hasNextPage,
  };
});
