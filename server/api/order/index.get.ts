import { OrderStatus } from "@prisma/client";
import prisma from "~/lib/prisma";
import { VOrder } from "~/lib/types";

export default defineEventHandler(async (event) => {
  const {
    therapist,
    name,
    email,
    cursor,
    start,
    end,
    status,
  }: {
    cursor: number;
    therapist: string;
    name: string;
    email: string;
    start: string;
    end: string;
    status: string;
  } = getQuery(event);
  let items: VOrder[];
  const limit = 10;

  if (therapist || name || email) {
    items = await prisma.order.findMany({
      take: limit,
      where: {
        orderTime: {
          gte: new Date(start),
          lte: new Date(end),
        },
        therapist: therapist
          ? {
              nama: {
                startsWith: therapist,
                mode: "insensitive",
              },
            }
          : undefined,
        orderStatus: status.length === 0 ? undefined : (status as OrderStatus),
        user:
          name || email
            ? {
                name: name
                  ? {
                      startsWith: name,
                      mode: "insensitive",
                    }
                  : undefined,
                email: email
                  ? {
                      startsWith: email,
                      mode: "insensitive",
                    }
                  : undefined,
              }
            : undefined,
      },
      select: {
        id: true,
        orderId: true,
        orderStatus: true,
        cabang: {
          select: {
            nama: true,
            id: true,
          },
        },
        therapist: {
          select: {
            nama: true,
            no: true,
          },
        },
        guestGender: true,

        totalPrice: true,
        confirmationTime: true,
        orderTime: true,
        picture: {
          select: {
            path: true,
          },
        },
      },
      orderBy: {
        orderTime: "desc",
      },
    });

    return {
      order: items,
      nextCursor: null,
    };
  }

  if (!start || !end) {
    return {
      order: [],
      nextCursor: null,
    };
  }
  items = await prisma.order.findMany({
    take: limit,
    cursor: cursor
      ? {
          id: +cursor,
        }
      : undefined,
    where: {
      orderTime: {
        gte: new Date(start),
        lte: new Date(end),
      },
      orderStatus: status.length === 0 ? undefined : (status as OrderStatus),
    },
    select: {
      id: true,
      orderTime: true,
      orderId: true,
      orderStatus: true,
      cabang: {
        select: {
          nama: true,
          id: true,
        },
      },
      therapist: {
        select: {
          nama: true,
          no: true,
        },
      },
      guestGender: true,

      totalPrice: true,
      confirmationTime: true,
      picture: {
        select: {
          path: true,
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
    order: items,
    nextCursor: nextCursor ?? null,
  };
});
