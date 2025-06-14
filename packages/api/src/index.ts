import "dotenv/config";

// IMPORTANT: Make sure to import `instrument.js` at the top of your file.
// If you're using ECMAScript Modules (ESM) syntax, use `import "./instrument.js";`
import "./instrument.js";

import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import fastifyWebsocket from "@fastify/websocket";
import * as Sentry from "@sentry/node";
import { ClerkClient, clerkClient, clerkPlugin } from "@clerk/fastify";
import { registerWsRoute } from "./wsHub.js";
import { authMiddleware } from "./middleware/auth.js";
import { privateAuthRoutes, publicAuthRoutes } from "./routes/auth.js";
import { commentRoutes } from "./routes/comments.js";
import { docRoutes } from "./routes/docs.js";
import { repositoriesRoutes } from "./routes/repositories.js";
import { startDraftRoute } from "./routes/startDraft.js";
import { templatesRoute } from "./routes/templates.js";
import prismaPlugin from "./plugins/prisma.js";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

const app = Fastify({
  logger: {
    level: "debug",
  },
});
Sentry.setupFastifyErrorHandler(app);
await app.register(cookie);
await app.register(cors, { origin: true });
await app.register(fastifyWebsocket);
await app.register(prismaPlugin);

// ESM modules don't have __dirname – recreate it so the existing code works in both CommonJS and ESM.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/api/ping", async () => ({ ok: true, ts: Date.now() }));
publicAuthRoutes(app);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Register private routes within an encapsulated plugin so authMiddleware applies only to them
await app.register(async (secure) => {
  // Attach authentication middleware for everything declared in this scope
  await secure.register(clerkPlugin);
  app.decorate("clerkClient", clerkClient);
  authMiddleware(secure);

  // Private (authenticated) routes
  registerWsRoute(secure);
  startDraftRoute(secure);
  docRoutes(secure);
  commentRoutes(secure);
  privateAuthRoutes(secure);
  repositoriesRoutes(secure);
  templatesRoute(secure);
});

// Serve static client build in production
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "web/dist");
  await app.register(fastifyStatic, {
    root: clientBuildPath,
    prefix: "/", // optional: serve at root
  });

  // Fallback to index.html for all unmatched GET routes (SPA)
  app.setNotFoundHandler((req, reply) => {
    if (req.method === "GET" && !req.url.startsWith("/api")) {
      reply.type("text/html");
      return reply.sendFile("index.html");
    }
    reply.status(404).send({ error: "Not Found" });
  });
}

app.listen({ port: 3000, host: "0.0.0.0" }).then((addr) => {
  console.log("API running →", addr);
});

declare module "fastify" {
  interface FastifyInstance {
    clerkClient: ClerkClient;
  }
}
