import { WebSocket } from "@fastify/websocket";
import { FastifyInstance } from "fastify";

type Conn = WebSocket & { isAlive: boolean; clientId?: string };
// Store **all** open WebSocket connections per docId so broadcasts reach every client.
export const sockets = new Map<string, Set<Conn>>();

export function registerWsRoute(fastify: FastifyInstance) {
  fastify.get<{
    Params: { id: string };
    Querystring: { clientId?: string };
  }>("/api/ws/:id", { websocket: true }, (socket, req) => {
    fastify.log.info("New connection", req.params);
    const { id } = req.params;
    const { clientId } = req.query;
    const conn = socket as Conn;
    conn.isAlive = true; // mark as alive on connect
    conn.clientId = clientId;

    // Add the connection to the set for this doc id (create set if first)
    const set = sockets.get(id);
    if (set) {
      set.add(conn);
    } else {
      sockets.set(id, new Set([conn]));
    }

    socket.on("pong", () => (conn.isAlive = true));
    socket.on("close", () => {
      const set = sockets.get(id);
      if (set) {
        set.delete(conn);
        if (!set.size) sockets.delete(id);
      }
    });
  });

  // heartbeat
  setInterval(() => {
    sockets.forEach((conns) => {
      conns.forEach((c) => {
        if (!c.isAlive) return c.terminate();
        c.isAlive = false;
        c.ping();
      });
    });
  }, 30_000);
}

export function broadcastToDoc(
  docId: string,
  message: any,
  excludeClientId?: string,
) {
  const connections = sockets.get(docId);
  if (!connections) return;

  const messageStr = JSON.stringify(message);
  connections.forEach((conn) => {
    if (conn.readyState === conn.OPEN && conn.clientId !== excludeClientId) {
      conn.send(messageStr);
    }
  });
}
