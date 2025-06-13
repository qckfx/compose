import { FastifyInstance } from "fastify";

export function templatesRoute(app: FastifyInstance) {
  app.get("/api/templates", async () => {
    // open-to-all; could add auth if needed
    const templates = await app.prisma.template.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isDefault: true,
      },
      orderBy: { name: "asc" },
    });
    return templates;
  });
}
