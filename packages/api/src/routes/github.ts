import { FastifyInstance } from "fastify";

export function githubRoutes(app: FastifyInstance) {
  app.post('/api/github/webhook', {config: { rawBody: true } }, async (req, res) => {
    app.log.debug('Received webhook', { headers: req.headers, body: req.body });
    const id = req.headers['x-github-delivery'] as string | undefined;
    const name = req.headers['x-github-event'] as string | undefined;
    const signature = req.headers['x-hub-signature-256'];

    if (!id || !name) {
      res.status(400).send('Missing GitHub headers');
      return;
    }

    try {
      app.log.debug('Received webhook', { id, name, signature, payload: req.rawBody });
      await app.githubWebhookService.handleWebhook(id, name, signature, req.rawBody as Buffer);
      // A 204 status code is expected by GitHub on success.
      res.status(204).send();
    } catch (err) {
      console.error('GitHub webhook processing failed', err);
      res.status(400).send('Webhook handling failed');
    }
  });
}