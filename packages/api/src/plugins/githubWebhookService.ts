import fp from "fastify-plugin";
import { GithubWebhookService } from "../services/githubService.js";

export default fp(async (app, _opts) => {
  app.decorate("githubWebhookService", new GithubWebhookService(app));
});

declare module "fastify" {
  interface FastifyInstance {
    githubWebhookService: GithubWebhookService;
  }
}