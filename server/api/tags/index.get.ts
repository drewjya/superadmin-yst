import prisma from "~/lib/prisma";
import { VTags } from "~/lib/types";

export default defineEventHandler(async () => {
  const tags:VTags[] = await prisma.tags.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return {
    tags: tags,
  };
});
