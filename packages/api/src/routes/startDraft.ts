import { FastifyInstance } from "fastify";
import { v4 as uuid } from "uuid";
import { Sandbox } from "e2b";
import { z } from "zod";
import { sockets } from "../wsHub.js";

export function startDraftRoute(app: FastifyInstance) {
  app.post("/api/start-draft", async (req, res) => {
    try {
      // Validate request body
      const { repositoryId, repositoryName, prompt } = z
        .object({
          repositoryId: z.string(),
          repositoryName: z.string(),
          prompt: z.string().min(1),
        })
        .parse(req.body);

      const { userId } = z.object({ userId: z.string() }).parse(req.auth);

      const repoUrl = `https://github.com/${repositoryName}.git`;
      const sessionId = uuid();

      await app.prisma.doc.create({
        data: {
          id: sessionId,
          ghRepoId: repositoryId,
          ghRepoName: repositoryName,
          prompt,
          content: "",
          status: "drafting",
          clerkUserId: userId,
        },
      });

      runAgentJob({ app, repoUrl, prompt, sessionId }).catch((error) => {
        app.log.error(error);
      });

      return { sessionId };
    } catch (error: unknown) {
      if ((error as Error).name === "ZodError") {
        res.status(400).send({ error: "Invalid request payload" });
      } else {
        app.log.error({ error }, "Error starting draft");
        res.status(500).send({ error: "Internal server error" });
      }
    }
  });
}

async function runAgentJob({
  app,
  repoUrl,
  prompt,
  sessionId,
}: {
  app: FastifyInstance;
  repoUrl: string;
  prompt: string;
  sessionId: string;
}) {
  const sandbox = await Sandbox.create("composer", {
    timeoutMs: 1000 * 60 * 20,
    envs: {
      LLM_API_KEY: process.env.LLM_API_KEY,
    },
  });
  await sandbox.commands.run("git clone " + repoUrl + " repo");
  await sandbox.commands.run(
    `cd repo && qckfx -a ../.qckfx/design-doc.json --quiet "You are to generate a design document for the following prompt and write it to design-doc.md. You MUST write the design doc to disk at repo/design-doc.md. After you're done just return 'ok'. Here is the user prompt: ${prompt}"`,
    {
      requestTimeoutMs: 1000 * 60 * 20,
      timeoutMs: 1000 * 60 * 20,
    },
  );

  let designDoc = null;
  while (!designDoc) {
    try {
      designDoc = await sandbox.files.read("repo/design-doc.md");
    } catch (error) {
      console.error("Error reading design doc", error);
      await sandbox.commands.run(
        'cd repo && qckfx -a ../.qckfx/design-doc.json --quiet "You MUST output the design doc to disk at ./design-doc.md. Do that now."',
      );
    }
  }

  await app.prisma.doc.update({
    where: { id: sessionId },
    data: { content: designDoc, status: "completed" },
  });

  const conns = sockets.get(sessionId);
  if (conns) {
    conns.forEach((conn) =>
      conn.send(
        JSON.stringify({
          type: "draft",
          content: designDoc,
        }),
      ),
    );
  }

  await sandbox.kill();
}
