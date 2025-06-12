import fp from "fastify-plugin";
import { WorkOS } from "@workos-inc/node";

export default fp(async (app, _opts) => {
  const workos = new WorkOS(process.env.WORKOS_API_KEY);
  app.decorate("workos", workos);
});

declare module "fastify" {
  interface FastifyInstance {
    workos: WorkOS;
  }
}
