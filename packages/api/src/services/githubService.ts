import { FastifyBaseLogger, FastifyInstance } from "fastify";
import { Webhooks, type EmitterWebhookEvent } from "@octokit/webhooks";
import { attachOwnerToRepos } from "../utils/githubMapper.js";
import { GithubInstallationRepository } from "../repositories/githubInstallationRepository.js";
import { GHRepo } from "../utils/githubMapper.js";
import { GithubRepositoryRepository } from "../repositories/githubRepositoryRepository.js";

export class GithubWebhookService {
  private readonly webhooks: Webhooks;
  private readonly installations: GithubInstallationRepository;
  private readonly repos: GithubRepositoryRepository;
  private readonly log: FastifyBaseLogger;
  
  constructor(app: FastifyInstance) {
    this.installations = new GithubInstallationRepository(app.prisma, app.log);
    this.repos = new GithubRepositoryRepository(app.prisma, app.log, this.installations);
    this.log = app.log;
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error('GITHUB_WEBHOOK_SECRET is not set');
    }
    this.webhooks = new Webhooks({
      secret
    });
    // Register only the actions you care about
    this.webhooks.on('installation.created', this.onInstallationCreated);
    this.webhooks.on('installation.deleted', this.onInstallationDeleted);
    this.webhooks.on('installation.suspend', this.onInstallationSuspended);
    this.webhooks.on('installation.unsuspend', this.onInstallationUnsuspended);

    // Log only events that aren't explicitly handled
    this.webhooks.onAny(({ name, payload }) => {
      // Skip events that we've registered explicit handlers for
      const eventType = 'action' in payload ? `${name}.${payload.action}` : name;
      const handledEvents = [
        'installation.created',
        'installation.deleted',
        'installation.suspend',
        'installation.unsuspend',
        'issues.opened',
        'issues.labeled',
        'issues.unlabeled',
        'push'
      ];
      
      if (!handledEvents.includes(eventType)) {
        const logPayload: { name: string; action?: unknown } = { name };
        if ('action' in payload) {
          logPayload.action = payload.action;
        }
        this.log.info('Unhandled GitHub event', logPayload);
      }
    });
  }

  /**
   * Verify the signature and dispatch the webhook event to the registered
   * handlers.  Exposed so that the HTTP route can delegate incoming requests
   * without leaking the underlying `@octokit/webhooks` instance.
   *
   * @param id        Value of the `X-GitHub-Delivery` header
   * @param name      Value of the `X-GitHub-Event` header
   * @param signature Value of the `X-Hub-Signature-256` header (optional)
   * @param payload   Raw request body received from GitHub (Buffer or string)
   */
  async handleWebhook(
    id: string,
    name: string,
    signature: string | undefined | string[],
    payload: Buffer | string,
  ): Promise<void> {
    this.log.debug('Received webhook', { id, name, signature, payload });
    // The library expects a single signature string (undefined allowed)
    const sig = (Array.isArray(signature) ? signature[0] : signature) ?? '';

    this.log.debug('Verifying and receiving webhook', { id, name, signature, payload });
    // The `@octokit/webhooks` typings require the payload to be a string.
    const body = typeof payload === 'string' ? payload : payload.toString();

    await this.webhooks.verifyAndReceive({
      id,
      name,
      payload: body,
      signature: sig,
    });
  }

  private onInstallationCreated = async (
    { payload }: EmitterWebhookEvent<'installation.created'>
  ): Promise<void> => {
    // 1. Upsert installation record
    const installation = await this.installations.upsert(payload);

    // 2. Upsert repositories that the app was installed on
    if (payload.repositories && payload.repositories.length) {
      // The repository objects included with the `installation.created` event
      // do **not** contain an `owner` field but our `GHRepo` helper type – and
      // downstream persistence logic – expect it to be present.  We can safely
      // derive the missing information from `payload.installation.account`,
      // which is the user or organisation the app was installed on.

      const reposWithOwner: GHRepo[] = attachOwnerToRepos(
        payload.repositories,
        payload.installation.account,
      );

      // Pass the UUID primary key of the GhInstallation record so the foreign
      // key constraint on Repository.installationId is satisfied.
      await this.repos.upsertMany(installation.id, reposWithOwner);
    }
  };

  private onInstallationDeleted = async (
    { payload }: EmitterWebhookEvent<'installation.deleted'>
  ) => this.installations.disable(payload);

  private onInstallationSuspended = async (
    { payload }: EmitterWebhookEvent<'installation.suspend'>
  ) => this.installations.suspend({ installation: { id: payload.installation.id } });

  private onInstallationUnsuspended = async (
    { payload }: EmitterWebhookEvent<'installation.unsuspend'>
  ) =>
    this.installations.unsuspend({ installation: { id: payload.installation.id } });
}