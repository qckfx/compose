import type { FastifyInstance } from "fastify";
import { getAuth } from "@clerk/fastify";

interface AuthErrorResponse {
  name: string;
  code: string;
  message: string;
}

function unauth(): AuthErrorResponse {
  return {
    name: "Authentication required",
    code: "UNAUTHORIZED",
    message: "No authentication token provided",
  };
}

declare module "fastify" {
  interface FastifyRequest {
    auth: {
      userId: string;
      email: string;
    };
  }
}

export function authMiddleware(app: FastifyInstance) {
  app.addHook("preHandler", async (req, res) => {
    const { userId, sessionClaims } = await getAuth(req);
    if (!userId) {
      return res.status(401).send(unauth());
    }
    req.auth = { userId, email: sessionClaims.email as string };
  });
}
