import { PrismaClient, GhInstallation, Prisma } from '@prisma/client';
import { EmitterWebhookEvent } from '@octokit/webhooks';
import { FastifyBaseLogger } from 'fastify';
import { mapInstallation, InstallationLite } from '../utils/githubMapper.js';


export class GithubInstallationRepository {
  constructor(
    private prisma: PrismaClient,
    private logger: FastifyBaseLogger
  ) {}

  /**
   * Create or update a GitHub installation from webhook event
   */
  public async upsert(
    event: EmitterWebhookEvent<'installation.created'>['payload'],
    tx?: Prisma.TransactionClient
  ): Promise<GhInstallation> {
    const client = tx || this.prisma;
    const installation = event.installation;
    if (!installation.account) {
      // The docs say `account` should always be present but we occasionally see
      // null in the wild (e.g. when the account was deleted).  Log and bail
      // out so we don't violate NOT NULL constraints.
      this.logger.warn('Received installation.created with null account', {
        installationId: installation.id
      });
      return client.ghInstallation.upsert({
        where: { ghInstallationId: BigInt(installation.id) },
        update: { deletedAt: null },
        create: {
          ghInstallationId: BigInt(installation.id),
          // fallback placeholders – cannot be null per Prisma schema
          accountLogin: `unknown-${installation.id}`,
          accountType: 'User'
        }
      });
    }

    // Account can be a User or an Organization object with slightly different
    // field sets. Normalise to { login, type }.
    const account = installation.account as unknown as {
      login?: string;
      slug?: string;
      type: 'User' | 'Organization' | 'Bot';
    };

    const accountLogin = (account.login ?? (account.slug ?? `org-${installation.id}`));

    const data = mapInstallation({
      id: installation.id,
      account: {
        login: accountLogin,
        type: account.type
      }
    });

    this.logger.info('Upserting GitHub installation', {
      accountLogin,
      accountType: account.type,
      installationId: String(installation.id)
    });

    return client.ghInstallation.upsert({
      where: {
        ghInstallationId: BigInt(installation.id)
      },
      update: {
        accountLogin: data.accountLogin,
        accountType: data.accountType,
        suspendedAt: null,
        deletedAt: null
      },
      create: data
    });
  }

  /**
   * Mark a GitHub installation as deleted (soft delete)
   */
  public async disable(
    event: EmitterWebhookEvent<'installation.deleted'>['payload'],
    tx?: Prisma.TransactionClient
  ): Promise<GhInstallation> {
    const client = tx || this.prisma;
    const installationId = BigInt(event.installation.id);

    this.logger.info('Marking GitHub installation as deleted', {
      installationId: String(event.installation.id)
    });

    return client.ghInstallation.update({
      where: { ghInstallationId: installationId },
      data: { deletedAt: new Date() }
    });
  }

  /**
   * Mark a GitHub installation as suspended
   */
  public async suspend(
    event: { installation: { id: number } },
    tx?: Prisma.TransactionClient
  ): Promise<GhInstallation> {
    const client = tx || this.prisma;
    const installationId = BigInt(event.installation.id);

    this.logger.info('Marking GitHub installation as suspended', {
      installationId: String(event.installation.id)
    });

    return client.ghInstallation.update({
      where: { ghInstallationId: installationId },
      data: { suspendedAt: new Date() }
    });
  }

  /**
   * Clear suspension flag when GitHub sends unsuspend event
   */
  public async unsuspend(
    event: { installation: { id: number } },
    tx?: Prisma.TransactionClient
  ): Promise<GhInstallation> {
    const client = tx || this.prisma;
    const installationId = BigInt(event.installation.id);

    this.logger.info('Marking GitHub installation as unsuspended', {
      installationId: String(event.installation.id)
    });

    return client.ghInstallation.update({
      where: { ghInstallationId: installationId },
      data: { suspendedAt: null }
    });
  }

  /**
   * Ensure a GitHub installation exists in the database (idempotent)
   */
  public async ensure(
    installation: InstallationLite,
    tx?: Prisma.TransactionClient
  ): Promise<GhInstallation> {
    const client = tx || this.prisma;
    const installationId = BigInt(installation.id);

    this.logger.info('Ensuring GitHub installation exists', {
      installationId: String(installation.id)
    });

    const existingInstallation = await client.ghInstallation.findUnique({
      where: { ghInstallationId: installationId }
    });

    if (existingInstallation) {
      return existingInstallation;
    }

    // Create minimal installation record if not found
    return client.ghInstallation.create({
      data: {
        ghInstallationId: installationId,
        accountLogin: installation.account.login,
        accountType: installation.account.type as any
      }
    });
  }
}