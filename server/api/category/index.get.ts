import prisma from "~/lib/prisma";
import { VCategory } from "~/lib/types";

export default defineEventHandler(async () => {
  const category:VCategory[] = await prisma.category.findMany({
    select: {
      id: true,
      nama: true,
    },
  });

  return {
    category: category,
  };
});
