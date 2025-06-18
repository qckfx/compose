import { FastifyInstance, InjectOptions } from "fastify";
import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { vi } from "vitest";
import { buildApp } from "../app.js";

// Mock the auth middleware module
vi.mock("../middleware/auth.js", () => ({
  authMiddleware: (app: FastifyInstance) => {
    // Mock auth middleware that adds test user to all requests
    app.addHook("preHandler", async (request) => {
      request.auth = {
        userId: "test-user-123",
        email: "test@example.com",
      };
    });
  },
}));

// Create a deep mock of PrismaClient
export const prismaMock = mockDeep<PrismaClient>();

// Build test app (auth is mocked above)
export async function buildTestApp(): Promise<FastifyInstance> {
  const app = await buildApp({ testing: true }); // Still need this to skip Clerk registration

  // Replace Prisma with mock
  app.decorate("prisma", prismaMock);

  return app;
}

// Reset all mocks between tests
export function resetAllMocks() {
  mockReset(prismaMock);
}

// Test data factories
export const createMockDoc = (overrides = {}) => ({
  id: "doc-123",
  clerkUserId: "test-user-123",
  content: "# Test Document\n\nThis is a test document.",
  updatedAt: new Date("2024-01-01T00:00:00Z"),
  createdAt: new Date("2024-01-01T00:00:00Z"),
  status: "completed" as const,
  templateId: "template-123",
  ...overrides,
});

// Simple inject helper - auth is mocked above
export async function injectRequest(
  app: FastifyInstance,
  options: {
    method: InjectOptions["method"];
    url: string;
    payload?: string | object | Buffer | NodeJS.ReadableStream;
    headers?: Record<string, string>;
  },
) {
  return app.inject({
    method: options.method,
    url: options.url,
    payload: options.payload,
    headers: {
      "content-type": "application/json",
      ...options.headers,
    },
  });
}

/*
 * Testing Limitations to Note:
 *
 * 1. Authentication is mocked globally - we can't test auth failures
 * 2. All tests run as authenticated user 'test-user-123'
 * 3. To test auth logic, we'd need separate integration tests with real Clerk
 * 4. Focus these tests on business logic, not auth middleware
 */
