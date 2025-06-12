import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import fastifyWebsocket from "@fastify/websocket";
import { registerWsRoute } from "./wsHub.js";
import { privateAuthRoutes, publicAuthRoutes } from "./routes/auth.js";
import { commentRoutes } from "./routes/comments.js";
import { startDraftRoute } from "./routes/startDraft.js";
import prismaPlugin from "./plugins/prisma.js";
import workosPlugin from "./plugins/workos.js";
import dotenv from "dotenv";
import { authMiddleware } from "./middleware/auth.js";
import { githubRoutes } from "./routes/github.js";
import githubWebhookServicePlugin from "./plugins/githubWebhookService.js";

dotenv.config();

const app = Fastify({
  logger: {
    level: "debug",
  },
});
await app.register(cookie);
await app.register(cors, { origin: true });
await app.register(import('fastify-raw-body'), {
  field: 'rawBody', // change the default request.rawBody property name
  global: false, // add the rawBody to every request. **Default true**
  encoding: 'utf8', // set it to false to set rawBody as a Buffer **Default utf8**
  runFirst: true, // get the body before any preParsing hook change/uncompress it. **Default false**
  routes: [], // array of routes, **`global`** will be ignored, wildcard routes not supported
  jsonContentTypes: [], // array of content-types to handle as JSON. **Default ['application/json']**
})

// WebSocket support
await app.register(fastifyWebsocket);

await app.register(prismaPlugin);
await app.register(workosPlugin);
await app.register(githubWebhookServicePlugin);


app.get("/api/ping", async () => ({ ok: true, ts: Date.now() }));
publicAuthRoutes(app);
githubRoutes(app);

// Register private routes within an encapsulated plugin so authMiddleware applies only to them
await app.register(async (secure) => {
  // Attach authentication middleware for everything declared in this scope
  authMiddleware(secure);

  // Private (authenticated) routes
  registerWsRoute(secure);
  startDraftRoute(secure);
  commentRoutes(secure);
  privateAuthRoutes(secure);
});

app.listen({ port: 3000, host: "0.0.0.0" }).then((addr) => {
  console.log("API running →", addr);
});
