import { FastifyInstance } from "fastify";
import { v4 as uuid } from "uuid";
import { Sandbox } from "e2b";
import { z } from "zod";
import { sockets } from "../wsHub.js";

export function startDraftRoute(app: FastifyInstance) {
  app.post("/api/start-draft", async (req, res) => {
    try {
      // Validate request body
      const { repositoryId, repositoryName, prompt, templateId } = z
        .object({
          repositoryId: z.string(),
          repositoryName: z.string(),
          prompt: z.string().min(1),
          templateId: z.string().uuid(),
        })
        .parse(req.body);

      const { userId } = z.object({ userId: z.string() }).parse(req.auth);

      // Fetch the user's GitHub OAuth access token so we can clone private repositories
      const accessToken = await app.clerkClient.users
        .getUserOauthAccessToken(userId, "github")
        .then((r) => r.data[0]?.token);

      if (!accessToken) {
        throw new Error("Missing GitHub OAuth access token for user");
      }

      const repoUrl = `https://x-access-token:${accessToken}@github.com/${repositoryName}.git`;

      const sessionId = uuid();

      const template = await app.prisma.template.findUniqueOrThrow({
        where: { id: templateId },
      });

      await app.prisma.doc.create({
        data: {
          id: sessionId,
          ghRepoId: repositoryId,
          ghRepoName: repositoryName,
          prompt,
          content: "",
          status: "drafting",
          clerkUserId: userId,
          templateId,
        },
      });

      runAgentJob({
        app,
        repoUrl,
        prompt,
        sessionId,
        templateInstructions: template.instructions,
      }).catch((error) => {
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
  templateInstructions,
}: {
  app: FastifyInstance;
  repoUrl: string;
  prompt: string;
  sessionId: string;
  templateInstructions: string;
}) {
  const sandbox = await Sandbox.create("composer", {
    timeoutMs: 1000 * 60 * 20,
    envs: {
      LLM_API_KEY: process.env.LLM_API_KEY,
      LLM_BASE_URL: process.env.LLM_BASE_URL,
    },
  });
  await sandbox.commands.run("git clone " + repoUrl + " repo");

  const fullPrompt = `Please use the template described below to author a comprehensive design document for the following user request:

USER REQUEST: ${prompt}

TEMPLATE TO FOLLOW:
${templateInstructions}

IMPORTANT INSTRUCTIONS:
- Focus your document specifically on the user's request above
- Follow the template structure and requirements exactly
- Write the complete document to repo/design-doc.md
- After successfully writing the document, output only 'ok'
- Do not deviate from the user's request or add unrelated features
- Ground all of your writing in the context of the user's request and the codebase to which you have access`;
  await sandbox.files.write("prompt.txt", fullPrompt);
  await sandbox.commands.run(
    `cd repo && cat ../prompt.txt | qckfx -a ../.qckfx/design-doc.json --quiet`,
    { requestTimeoutMs: 1000 * 60 * 20, timeoutMs: 1000 * 60 * 20 },
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
