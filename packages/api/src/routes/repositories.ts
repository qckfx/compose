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

      // Fetch repositories that the user owns or has explicit access to
      const userRepos = (await octokit.paginate("GET /user/repos", {
        per_page: 200,
        // Include repos the user owns, is a collaborator on, or accesses through org membership
        affiliation: "owner,collaborator,organization_member",
        // Ensure both public and private repos are returned
        visibility: "all",
      })) as { id: number; full_name: string }[];

      app.log.info(
        { totalRepos: userRepos.length },
        "Fetched repositories including organisations",
      );

      // Shape response as { id, name }
      res.send(
        userRepos.map(({ id, full_name }) => ({
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
