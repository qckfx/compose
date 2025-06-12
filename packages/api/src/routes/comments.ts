import { FastifyInstance } from "fastify";
import { sockets } from "../wsHub.js";
import { z } from "zod";

export function commentRoutes(app: FastifyInstance) {
  // fetch all comments for doc
  app.get("/api/doc/:id/comments", async (req) => {
    const { id } = req.params as any;
    return app.prisma.comment.findMany({ where: { docId: id } });
  });

  // create new comment
  app.post("/api/doc/:id/comment", async (req) => {
    const { id } = req.params as any;
    const data = z
      .object({
        body: z.string().min(1),
        start: z.number().int(),
        end: z.number().int(),
      })
      .parse(req.body);

    const comment = await app.prisma.comment.create({
      data: { docId: id, ...data },
    });

    sockets
      .get(id)
      ?.forEach((conn) =>
        conn.send(JSON.stringify({ type: "comment_add", comment })),
      );
    return comment;
  });

  // mark resolved
  app.post("/api/comment/:cid/resolve", async (req, res) => {
    const { cid } = req.params as any;
    const comment = await app.prisma.comment.update({
      where: { id: cid },
      data: { resolved: true },
    });
    sockets
      .get(comment.docId)
      ?.forEach((conn) =>
        conn.send(JSON.stringify({ type: "comment_resolve", id: cid })),
      );
    return { ok: true };
  });

  app.post("/api/doc/:id/apply-comments", async (req, res) => {
    const { id } = req.params as any;
    const unresolved = await app.prisma.comment.findMany({
      where: { docId: id, resolved: false },
    });
    if (!unresolved.length) return { ok: true, msg: "no comments" };

    // enqueue agent job
    // runAgentJob({
    //   type: 'apply',
    //   docId: id,
    //   comments: unresolved
    // });

    return { ok: true };
  });
}
