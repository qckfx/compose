import { createApiRoutes } from './typedFetch';
import { MeResponseSchema, SuccessResponseSchema } from '@/schemas/auth';

/**
 * API routes definition with typed schemas
 */
export const apiRoutes = {
  me: {
    url: '/api/auth/me',
    schema: MeResponseSchema,
  },
  logout: {
    url: '/api/auth/logout',
    schema: SuccessResponseSchema,
  },
} as const;

// Create a typesafe version of the routes for use in the application
export const routes = createApiRoutes(apiRoutes);

// Export the type for use in other files
export type Routes = typeof routes;