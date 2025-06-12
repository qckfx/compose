import { FastifyInstance } from "fastify";
import { z } from "zod";
import { clerkClient } from "@clerk/fastify";

export function publicAuthRoutes(app: FastifyInstance) {
  app.get("/github/callback", async (req, res) => {
    if (process.env.CLIENT_BASE_URL) {
      res.redirect(`${process.env.CLIENT_BASE_URL}`);
    } else {
      res.redirect("/");
    }
  });
}

export function privateAuthRoutes(app: FastifyInstance) {
  app.get("/api/auth/logout", async (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const { userId } = z.object({ userId: z.string() }).parse(req.auth);
      const user = await clerkClient.users.getUser(userId);
      res.send({
        user: {
          id: user.id,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.imageUrl,
          createdAt: new Date(user.createdAt).toISOString(),
          updatedAt: new Date(user.updatedAt).toISOString(),
        },
      });
    } catch (error) {
      app.log.error({ error }, "Error getting user");
      res.status(500).send({ error: "Internal server error" });
    }
  });
}
