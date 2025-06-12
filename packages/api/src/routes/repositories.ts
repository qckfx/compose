import { FastifyInstance } from "fastify";
import { Octokit } from "@octokit/rest";
import { z } from "zod";

export function repositoriesRoutes(app: FastifyInstance) {
  // List repositories accessible to the current user
  app.get("/api/repositories", async (req, res) => {
    try {
      // Authentication information is attached by authMiddleware
      const { userId } = z.object({ userId: z.string() }).parse(req.auth);

      const accessToken = await app.clerkClient.users
        .getUserOauthAccessToken(userId, "github")
        .then((r) => r.data[0].token);

      const octokit = new Octokit({
        auth: accessToken,
      });

      const repos = await octokit.request("GET /user/repos");
      app.log.info({ repos }, "Repositories");
      const reposData = repos.data as { id: number; full_name: string }[];

      // Shape response as { id, name }
      res.send(
        reposData.map(({ id, full_name }) => ({
          id: id.toString(),
          name: full_name,
        })),
      );
    } catch (error) {
      // If auth is missing or invalid, send 401; otherwise 500
      app.log.error({ error }, "Error fetching repositories for user");
      res.status(500).send({ error: "Internal server error" });
    }
  });
}
