import type { components } from '@octokit/openapi-webhooks-types';

import { GhAccountType, Prisma } from '@prisma/client';

/* -------------------------------------------------------------------------- */
/* Helper type aliases – narrowed views of the enormous OpenAPI definitions   */
/* -------------------------------------------------------------------------- */

type RepositorySchema = components['schemas']['repository-webhooks'];
type IssueSchema = components['schemas']['issue'];
type SimpleUserSchema = components['schemas']['simple-user'];
type LabelSchema = components['schemas']['label'];

export type GHRepo = Pick<
  RepositorySchema,
  'id' | 'full_name' | 'private' | 'owner'
>;

// The `installation.created` webhook includes repository objects that look like
// `RepositorySchema` but *omit* the `owner` field.  Down-stream code relies on
// the narrower `GHRepo` shape which *requires* `owner`.  The helpers below
// bridge that gap in a type-safe manner.

export type GHRepoNoOwner = Pick<RepositorySchema, 'id' | 'full_name' | 'private'>;

type SimpleUser = components['schemas']['simple-user'];
type Enterprise = components['schemas']['enterprise'];

/**
 * Convert the `installation.account` union (SimpleUser | Enterprise | null)
 * into a valid `SimpleUser` record that satisfies our `GHRepo.owner` type.
 *
 * Enterprise objects don't match `SimpleUser` 1-for-1 so we coerce the subset
 * of fields we actually use and stub the rest with safe defaults.
 */
export const toSimpleUser = (account: SimpleUser | Enterprise | null): SimpleUser => {
  if (!account) {
    throw new Error('GitHub installation account is null – cannot determine repository owner');
  }

  if ('type' in account) {
    // SimpleUser (User / Organization)
    return account;
  }

  // Enterprise – map required fields into SimpleUser shape
  return {
    login: account.slug ?? account.name ?? String(account.id),
    id: account.id,
    node_id: account.node_id,
    avatar_url: account.avatar_url,
    gravatar_id: null,
    url: account.html_url,
    html_url: account.html_url,
    followers_url: '',
    following_url: '',
    gists_url: '',
    starred_url: '',
    subscriptions_url: '',
    organizations_url: '',
    repos_url: '',
    events_url: '',
    received_events_url: '',
    type: 'Organization',
    site_admin: false,
    name: undefined,
    email: undefined,
    user_view_type: undefined,
  };
};

/**
 * Enrich a list of repo objects (missing the `owner` field) with the provided
 * account, returning fully-typed `GHRepo` records.
 */
export const attachOwnerToRepos = (
  repos: readonly GHRepoNoOwner[],
  account: SimpleUser | Enterprise | null,
): GHRepo[] => {
  const owner = toSimpleUser(account);
  return repos.map((r) => ({
    id: r.id,
    full_name: r.full_name,
    private: r.private,
    owner,
  }));
};

export type GHUser = Pick<SimpleUserSchema, 'id' | 'login' | 'avatar_url'>;

export type GHIssue = Pick<IssueSchema, 'id' | 'number' | 'title'>;

export type Label = Pick<LabelSchema, 'name' | 'color'>;

export interface InstallationLite {
  id: number;
  account: {
    login: string;
    type: 'User' | 'Organization' | 'Bot';
  };
}

/* -------------------------------------------------------------------------- */
/* Conversions                                                                 */
/* -------------------------------------------------------------------------- */

export const toAccountType = (t: 'User' | 'Organization' | 'Bot'): GhAccountType => {
  if (t === 'Organization') return 'Organization';
  if (t === 'Bot') return 'Bot';
  return 'User';
};

export const mapInstallation = (
  installation: InstallationLite
): Prisma.GhInstallationCreateInput => ({
  ghInstallationId: BigInt(installation.id),
  accountLogin: installation.account.login,
  accountType: toAccountType(installation.account.type)
});

export const mapRepo = (
  installationId: string,
  repo: GHRepo
): Prisma.RepositoryUncheckedCreateInput => ({
  ghRepoId: BigInt(repo.id),
  fullName: repo.full_name,
  private: repo.private,
  installationId,
  disabled: false
});
