import prisma from "~/lib/prisma";
import { VOrderDetail } from "~/lib/types";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id") ?? "";
  if (!+id) {
    throw createError({
      statusCode: 404,
      message: "ID must be number",
    });
  }

  // await new Promise((res) => setTimeout(res, 100000));

  const order: VOrderDetail | null = await prisma.order.findFirst({
    where: {
      id: +id,
    },
    select: {
      id: true,
      totalPrice: true,
      orderId: true,
      orderStatus: true,
      guestGender: true,
      confirmationTime: true,
      orderTime: true,
      cabang: {
        select: {
          nama: true,
          id: true,
        },
      },
      picture: {
        select: {
          path: true,
        },
      },
      therapist: {
        select: {
          nama: true,
          no: true,
        },
      },
      orderDetails: {
        select: {
          nama: true,
          duration: true,
          price: true,
          treatment: {
            select: {
              nama: true,
              category: {
                select: {
                  nama: true,
                },
              },
              tags: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },

      therapistGender: true,
      user: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          gender: true,
          id: true,
        },
      },
      createdAt: true,
    },
  });
  return {
    order,
  };
});
