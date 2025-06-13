import { FastifyInstance } from "fastify";
import { z } from "zod";

export function docRoutes(app: FastifyInstance) {
  app.get("/api/doc/:id", async (req, res) => {
    const { id } = req.params as { id: string };
    const doc = await app.prisma.doc.findUnique({ where: { id } });
    if (!doc) return res.status(404).send({ error: "Not found" });
    return doc;
  });

  app.get("/api/docs", async (req) => {
    const { userId } = z.object({ userId: z.string() }).parse(req.auth);
    const docs = await app.prisma.doc.findMany({
      where: { clerkUserId: userId },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
    return docs;
  });
}
