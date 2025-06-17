import { FastifyInstance } from "fastify";
import { z } from "zod";
import { broadcastToDoc } from "../wsHub.js";

export function docRoutes(app: FastifyInstance) {
  app.get("/api/doc/:id", async (req, res) => {
    const { id } = req.params as { id: string };
    const doc = await app.prisma.doc.findUnique({ where: { id } });
    if (!doc) return res.status(404).send({ error: "Not found" });
    return doc;
  });

  app.put("/api/doc/:id", async (req, res) => {
    const { id } = req.params as { id: string };
    const { userId } = z.object({ userId: z.string() }).parse(req.auth);
    const { content, updatedAt } = z
      .object({
        content: z.string().max(1024 * 1024), // 1MB limit
        updatedAt: z.string().optional(),
      })
      .parse(req.body);

    // Find the document and verify ownership
    const existingDoc = await app.prisma.doc.findUnique({ where: { id } });
    if (!existingDoc) {
      return res.status(404).send({ error: "Document not found" });
    }
    if (existingDoc.clerkUserId !== userId) {
      return res.status(403).send({ error: "Forbidden" });
    }

    // Simple server-wins conflict resolution
    // If client provides updatedAt and it's older than server, return current server state
    if (updatedAt && new Date(updatedAt) < existingDoc.updatedAt) {
      return res.status(409).send({
        error: "Document was updated by another client",
        content: existingDoc.content,
        updatedAt: existingDoc.updatedAt.toISOString(),
      });
    }

    // Update the document
    const updatedDoc = await app.prisma.doc.update({
      where: { id },
      data: { content },
    });

    // Broadcast the save event to other connected clients
    broadcastToDoc(id, {
      type: "user-save",
      content: updatedDoc.content,
      updatedAt: updatedDoc.updatedAt.toISOString(),
    });

    return {
      updatedAt: updatedDoc.updatedAt.toISOString(),
      content: updatedDoc.content,
    };
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
