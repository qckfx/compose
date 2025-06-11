import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

export default fp(async (app, _opts) => {
  const prisma = new PrismaClient();
  app.decorate("prisma", prisma);

  app.addHook("onClose", async (instance) => {
    await instance.prisma.$disconnect();
  });
});

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
