import { PrismaClient, Repository, Prisma } from '@prisma/client';
import { GHRepo, mapRepo } from '../utils/githubMapper.js';
import { GithubInstallationRepository } from './githubInstallationRepository.js';
import { FastifyBaseLogger } from 'fastify';

export class GithubRepositoryRepository {
  constructor(
    private prisma: PrismaClient,
    private logger: FastifyBaseLogger,
    private installations: GithubInstallationRepository
  ) {}

  /**
   * Upsert multiple repositories from a webhook event
   */
  public async upsertMany(
    installationId: string,
    repos: GHRepo[],
    tx?: Prisma.TransactionClient
  ): Promise<Repository[]> {
    const client = tx || this.prisma;
    this.logger.info('Upserting GitHub repositories', {
      installationId,
      repoCount: repos.length
    });

    // Limit concurrent DB traffic to avoid hammering Postgres on very large
    // installations (some customers have 10k+ repos).
    const CONCURRENT = 50;
    const out: Repository[] = [];

    for (let i = 0; i < repos.length; i += CONCURRENT) {
      const slice = repos.slice(i, i + CONCURRENT);
      const batch = await Promise.all(
        slice.map(async (repo) => {
          const data = mapRepo(installationId, repo);
          return client.repository.upsert({
            where: {
              ghRepoId: BigInt(repo.id)
            },
            update: {
              fullName: data.fullName,
              private: data.private,
              disabled: false // Re-enable if previously disabled
            },
            create: data
          });
        })
      );
      out.push(...batch);
    }

    return out;
  }

  /**
   * Mark repositories as disabled (soft delete)
   */
  public async markRemoved(
    ghRepoIds: bigint[],
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    this.logger.info('Marking GitHub repositories as removed', {
      repoCount: ghRepoIds.length
    });

    if (tx) {
      // If we're already in a transaction, just execute the updates in parallel
      await Promise.all(
        ghRepoIds.map(id =>
          tx.repository.updateMany({
            where: { ghRepoId: id },
            data: { disabled: true }
          })
        )
      );
    } else {
      // If no transaction was provided, create one
      await this.prisma.$transaction(
        ghRepoIds.map(id =>
          this.prisma.repository.updateMany({
            where: { ghRepoId: id },
            data: { disabled: true }
          })
        )
      );
    }
  }

  /**
   * Upsert a repository from a webhook payload
   */
  public async upsertFromPayload(
    repoPayload: GHRepo,
    ghInstallationId: number,
    tx?: Prisma.TransactionClient
  ): Promise<Repository> {
    const client = tx || this.prisma;

    this.logger.info('Upserting GitHub repository from payload', {
      repo: repoPayload.full_name,
      installationId: String(ghInstallationId)
    });

    // First, ensure the installation exists
    const installation = await this.installations.ensure(
      {
        id: ghInstallationId,
        account: {
          login: repoPayload.owner.login,
          type: repoPayload.owner.type as 'User' | 'Organization'
        }
      },
      tx
    );

    // Then upsert the repository
    const data = mapRepo(installation.id, repoPayload);
    return client.repository.upsert({
      where: {
        ghRepoId: BigInt(repoPayload.id)
      },
      update: {
        fullName: data.fullName,
        private: data.private,
        disabled: false
      },
      create: data
    });
  }
}