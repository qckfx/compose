import type { ZodSchema, ZodTypeAny } from 'zod';
import apiClient from './apiClient';

/**
 * Fetches and validates data from an API endpoint using Zod schema
 * @param url The API endpoint URL
 * @param schema The Zod schema to validate the response against
 * @returns The parsed and validated response data
 * @throws Error if validation fails or request fails
 */
export async function getParsed<T>(
  url: string,
  schema: ZodSchema<T>
): Promise<T> {
  const res = await apiClient.get(url);
  const parsed = schema.safeParse(res.data);

  if (!parsed.success) {
    // Log and throw a typed error
    console.error('Response validation failed', parsed.error);
    throw new Error('Invalid server response');
  }

  return parsed.data;
}

/**
 * Posts data to an API endpoint and validates the response using Zod schema
 * @param url The API endpoint URL
 * @param data The data to post
 * @param schema The Zod schema to validate the response against
 * @returns The parsed and validated response data
 * @throws Error if validation fails or request fails
 */
export async function postParsed<T, D = unknown>(
  url: string,
  data: D,
  schema: ZodSchema<T>
): Promise<T> {
  const res = await apiClient.post(url, data);
  const parsed = schema.safeParse(res.data);

  if (!parsed.success) {
    // Log and throw a typed error
    console.error('Response validation failed', parsed.error);
    throw new Error('Invalid server response');
  }

  return parsed.data;
}

/**
 * Interface for route definitions
 */
export interface RouteDefinition {
  url: string;
  schema: ZodTypeAny;
}

/**
 * Defines typed API routes with their URLs and schemas
 */
export function createApiRoutes<T extends Record<string, RouteDefinition>>(
  routes: T
) {
  return {
    ...routes,
     
    fetchRoute: async <K extends keyof T>(
      key: K
    ): Promise<T[K]['schema'] extends ZodSchema<infer U> ? U : never> => {
      const { url, schema } = routes[key];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return getParsed(url, schema as any);
    }
  };
}