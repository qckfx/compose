import type { FastifyInstance } from "fastify";
import { verifyJwt } from "../services/jwtService.js";

interface AuthErrorResponse {
  name: string;
  code: string;
  message: string;
}

function unauth(): AuthErrorResponse {
  return {
    name: 'Authentication required',
    code: 'UNAUTHORIZED',
    message: 'No authentication token provided',
  };
}

export function invalid(): AuthErrorResponse {
  return {
    name: 'Invalid token',
    code: 'INVALID_TOKEN',
    message: 'Authentication token is malformed or invalid',
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
  app.addHook('preHandler', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send(unauth());
    }
    try {
      const payload = await verifyJwt(token);
      if (!payload) {
        return res.status(401).send(invalid());
      }
      req.auth = {
        userId: payload.sub as string,
        email: payload.email as string,
      };
    } catch {
      return res.status(401).send(invalid());
    }
  });
}