import { WebSocket } from "@fastify/websocket";
import { FastifyInstance } from "fastify";

type Conn = WebSocket & { isAlive: boolean };
export const sockets = new Map<string, Conn>();

export function registerWsRoute(fastify: FastifyInstance) {
  fastify.get("/api/ws/:id", { websocket: true }, (socket, req) => {
    fastify.log.info("New connection", req.params);
    const id = (req.params as any).id as string;
    const conn = socket as Conn;
    conn.isAlive = true; // mark as alive on connect
    sockets.set(id, conn);

    socket.on("pong", () => (conn.isAlive = true));
    socket.on("close", () => sockets.delete(id));
  });

  // heartbeat
  setInterval(() => {
    sockets.forEach((c) => {
      if (!c.isAlive) return c.terminate();
      c.isAlive = false;
      c.ping();
    });
  }, 30_000);
}
