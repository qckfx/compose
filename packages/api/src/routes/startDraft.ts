import { FastifyInstance } from "fastify";
import { v4 as uuid } from "uuid";
import { Sandbox } from "e2b";
import { sockets } from "../wsHub.js";

export function startDraftRoute(app: FastifyInstance) {
  app.post("/api/start-draft", async (req, res) => {
    const { repoUrl, prompt } = req.body as { repoUrl: string; prompt: string };
    const sessionId = uuid();

    await app.prisma.doc.create({
      data: { id: sessionId, repoUrl, prompt, content: "", status: "drafting" },
    });

    runAgentJob({ app, repoUrl, prompt, sessionId }).catch((error) => {
      app.log.error(error);
    });

    return {
      sessionId,
    };
  });

  // TODO: move to a separate file that makes more sense
  app.get("/api/doc/:id", async (req, res) => {
    const { id } = req.params as any;
    const doc = await app.prisma.doc.findUnique({ where: { id } });
    if (!doc) return res.status(404).send({ error: "Not found" });
    return doc;
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
  const { stdout } = await sandbox.commands.run(
    `cd repo && qckfx -a ../.qckfx/design-doc.json --quiet "You are to generate a design document for the following prompt and write it to design-doc.md. You MUST write the design doc to disk at repo/design-doc.md. After you're done just give the user a brief summary of the design doc. Here is the user prompt: ${prompt}"`,
    {
      requestTimeoutMs: 1000 * 60 * 20,
      timeoutMs: 1000 * 60 * 20,
    },
  );
  app.log.debug("Agent output:\n" + stdout);

  const designDoc = await sandbox.files.read("repo/design-doc.md");
  await app.prisma.doc.update({
    where: { id: sessionId },
    data: { content: designDoc, status: "completed" },
  });
  app.log.debug("Design Document:\n" + designDoc);

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
