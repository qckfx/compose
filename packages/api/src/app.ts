import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import fastifyWebsocket from "@fastify/websocket";
import { clerkPlugin } from "@clerk/fastify";
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

interface AppOptions {
  logger?: boolean | object;
  testing?: boolean;
}

export async function buildApp(
  options: AppOptions = {},
): Promise<FastifyInstance> {
  const app = Fastify({
    logger: options.testing
      ? false
      : {
          level: "debug",
        },
    ...options,
  });

  // Register plugins
  await app.register(cookie);
  await app.register(cors, { origin: true });
  await app.register(fastifyWebsocket);
  await app.register(prismaPlugin);

  // Public routes
  app.get("/api/ping", async () => ({ ok: true, ts: Date.now() }));
  publicAuthRoutes(app);

  // Debug route (only in non-testing mode)
  if (!options.testing) {
    app.get("/debug-sentry", function mainHandler(_req, _res) {
      throw new Error("My first Sentry error!");
    });
  }

  // Register private routes within an encapsulated plugin
  await app.register(async (secure) => {
    // Attach authentication middleware for everything declared in this scope
    if (!options.testing) {
      await secure.register(clerkPlugin);
    }

    // In testing, we'll mock the auth middleware
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

  // Serve static files only in production
  if (process.env.NODE_ENV === "production" && !options.testing) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const clientBuildPath = path.join(__dirname, "web/dist");

    await app.register(fastifyStatic, {
      root: clientBuildPath,
      prefix: "/",
    });

    // SPA fallback
    app.setNotFoundHandler((req, reply) => {
      if (req.method === "GET" && !req.url.startsWith("/api")) {
        reply.type("text/html");
        return reply.sendFile("index.html");
      }
      reply.status(404).send({ error: "Not Found" });
    });
  }

  return app;
}
