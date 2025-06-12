import { createApiRoutes } from "./typedFetch";
import { MeResponseSchema, SuccessResponseSchema } from "@/schemas/auth";
import { z } from "zod";

/**
 * API routes definition with typed schemas
 */
export const apiRoutes = {
  me: {
    url: "/api/auth/me",
    schema: MeResponseSchema,
  },
  logout: {
    url: "/api/auth/logout",
    schema: SuccessResponseSchema,
  },
  docs: {
    url: "/api/docs",
    schema: z.array(
      z.object({
        id: z.string(),
        content: z.string(),
        ghRepoName: z.string(),
        status: z.enum(["drafting", "completed", "error"]),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
      }),
    ),
  },
  repositories: {
    url: "/api/repositories",
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
  },
  startDraft: {
    url: "/api/start-draft",
    // The response shape: { sessionId: string }
    schema: z.object({ sessionId: z.string().uuid() }),
  },
} as const;

// Create a typesafe version of the routes for use in the application
export const routes = createApiRoutes(apiRoutes);

// Export the type for use in other files
export type Routes = typeof routes;
