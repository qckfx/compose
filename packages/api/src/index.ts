import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyWebsocket from "@fastify/websocket";
import { registerWsRoute } from "./wsHub.js";
import { startDraftRoute } from "./routes/startDraft.js";
import { commentRoutes } from "./routes/comments.js";
import prismaPlugin from "./plugins/prisma.js";
import dotenv from "dotenv";

dotenv.config();

const app = Fastify({
  logger: {
    level: "debug",
  },
});
await app.register(cors, { origin: true });

// WebSocket support
await app.register(fastifyWebsocket);

await app.register(prismaPlugin);

registerWsRoute(app);
startDraftRoute(app);
commentRoutes(app);

app.get("/api/ping", async () => ({ ok: true, ts: Date.now() }));

app.listen({ port: 4000, host: "0.0.0.0" }).then((addr) => {
  console.log("API running →", addr);
});
