import { z } from 'zod';

/**
 * User schema definition
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  // Accept ISO strings or Date objects, coerce to Date at runtime
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * Response schema for /auth/me endpoint
 */
export const MeResponseSchema = z.object({
  user: UserSchema,
});

/**
 * Request schema for the login endpoint
 */
export const LoginQuerySchema = z.object({
  returnUrl: z.string().optional(),
});

/**
 * Request schema for the callback endpoint
 */
export const CallbackQuerySchema = z.object({
  code: z.string(),
  state: z.string().optional(),
});

/**
 * Authentication error response
 */
export const AuthErrorSchema = z.object({
  error: z.string(),
  code: z.enum([
    'INVALID_PROVIDER',
    'INVALID_CODE',
    'MISSING_EMAIL',
    'AUTHENTICATION_FAILED',
    'USER_NOT_FOUND',
    'UNAUTHORIZED',
    'TOKEN_EXPIRED',
    'INVALID_TOKEN',
    'VALIDATION_ERROR',
  ]),
  message: z.string().optional(),
  details: z.array(z.any()).optional(),
});

/**
 * Generic success response
 */
export const SuccessResponseSchema = z.object({
  success: z.boolean(),
});

// Derive TypeScript types from schemas
export type User = z.infer<typeof UserSchema>;
export type MeResponse = z.infer<typeof MeResponseSchema>;
export type LoginQuery = z.infer<typeof LoginQuerySchema>;
export type CallbackQuery = z.infer<typeof CallbackQuerySchema>;
export type AuthError = z.infer<typeof AuthErrorSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
