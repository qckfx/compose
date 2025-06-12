import { FastifyInstance } from "fastify";
import { z } from "zod";
import { createJwt } from "../services/jwtService.js";

export function publicAuthRoutes(app: FastifyInstance) {
  app.get('/login', async (req, res) => {
    try {
      let returnUrl = "/";
      try {
        const { returnUrl: queryReturnUrl } = z.object({ returnUrl: z.string() }).parse(req.query);
        returnUrl = queryReturnUrl;
      } catch (error) {
        app.log.warn({ error }, 'No return URL provided, redirecting to /');
      }
      const authUrl = getAuthUrl(app, returnUrl);
      app.log.info({ authUrl }, 'Redirecting to WorkOS for login');
      res.redirect(authUrl);
    } catch (error) {
      app.log.error({ error }, 'Error getting auth URL');
      res.status(500).send({ error: 'Internal server error' });
    }
  });

  app.get('/github/callback', async (req, res) => {
    if (process.env.CLIENT_BASE_URL) {
      res.redirect(`${process.env.CLIENT_BASE_URL}`);
    } else {
      res.redirect('/');
    }
  });

  app.get('/workos/callback', async (req, res) => {
    try {
      const { code, state } = z.object({ code: z.string(), state: z.string() }).parse(req.query);
      const authentication = await app.workos.userManagement.authenticateWithCode({
        code,
        clientId: process.env.WORKOS_CLIENT_ID,
      });
      app.log.info({ user: redactSensitiveInfo(authentication.user as unknown as Record<string, unknown>) }, 'Authenticated with WorkOS');
      const profile = authentication.user;
      const accessToken = authentication.accessToken;

      if (!profile.email) {
        throw new Error('No email found in WorkOS profile');
      }

      const user = await app.prisma.user.upsert({
        where: { email: profile.email },
        update: {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.profilePictureUrl,
        },
        create: {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.profilePictureUrl,
        },
      });

      const jwt = await createJwt({
        sub: user.id,
        email: user.email,
      });
    
      app.log.info('Generated JWT for user', { userId: user.id, jwt: redactToken(jwt), accessToken: redactToken(accessToken) });

      // Retrieve original client return URL (base64-encoded path)
      const { returnUrl } = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
      app.log.info({ returnUrl }, 'Encoded return URL');

      // Decode for successful redirect when installations & repositories exist
      const decodedReturnUrl = Buffer.from(decodeURIComponent(returnUrl), 'base64').toString('utf-8');
      app.log.info({ decodedReturnUrl }, 'Decoded return URL');

      // -------------------------------------------------------------------
      // Determine whether the user already has at least one repository that
      // this GitHub App has access to via an installation. If not, send them
      // to the Install page so they can connect the app to GitHub.
      // -------------------------------------------------------------------
      let hasRepositories = false;
      try {
        const repoCount = await app.prisma.repository.count({
          where: {
            disabled: false,
            installation: {
              userInstallations: {
                some: { userId: user.id },
              },
            },
          },
        });
        hasRepositories = repoCount > 0;
        app.log.info({ userId: user.id, repoCount }, 'Repository count for user');
      } catch (error) {
        // If the query fails, log but fall back to showing install page to be safe
        app.log.error({ error, userId: user.id }, 'Error counting repositories for user');
      }

      // Decide where to send the user
      let targetPath: string;
      if (hasRepositories) {
        targetPath = decodedReturnUrl;
      } else {
        // Keep the original encoded return path so we can send them back after they install
        targetPath = `/install?returnUrl=${encodeURIComponent(returnUrl)}`;
      }

      res.setCookie('token', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600, // 1 hour in seconds
      });

      if (process.env.CLIENT_BASE_URL) {
        res.redirect(`${process.env.CLIENT_BASE_URL}${targetPath}`);
      } else {
        res.redirect(targetPath);
      }
    } catch (error) {
      app.log.error({ error }, 'Error authenticating with WorkOS');
      res.status(500).send({ error: 'Internal server error' });
    }
  });
}

export function privateAuthRoutes(app: FastifyInstance) {
  app.get('/api/auth/logout', async (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
  });

  app.get('/api/auth/me', async (req, res) => {
    try {
      const { userId } = z.object({ userId: z.string() }).parse(req.auth);
      const user = await app.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        app.log.error({ userId }, 'User not found');
        res.status(404).send({ error: 'User not found' });
        return;
      }
      res.send({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      app.log.error({ error }, 'Error getting user');
      res.status(500).send({ error: 'Internal server error' });
    }
  });
}

function getAuthUrl(app: FastifyInstance, returnUrl: string) {
  const state = JSON.stringify({ returnUrl });
  const redirectUri = process.env.WORKOS_REDIRECT_URI;
  app.log.info({ redirectUri }, 'Redirecting to WorkOS for login');
  return app.workos.userManagement.getAuthorizationUrl({
    clientId: process.env.WORKOS_CLIENT_ID,
    provider: 'authkit',
    redirectUri: process.env.WORKOS_REDIRECT_URI,
    state: Buffer.from(state).toString('base64'),
  })
}

function redactSensitiveInfo<T extends Record<string, unknown>>(
  obj: T, 
  sensitiveKeys: string[] = ['token', 'accessToken', 'jwt', 'password', 'secret', 'key', 'code']
): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  // Create a shallow copy of the object
  const result = { ...obj };
  
  // Redact sensitive keys
  for (const key of Object.keys(result) as (keyof T)[]) {
    const value = result[key];
    
    // Check if this key should be redacted
    const shouldRedact = sensitiveKeys.some(sensitiveKey => 
      String(key).toLowerCase().includes(sensitiveKey.toLowerCase())
    );
    
    if (shouldRedact && typeof value === 'string') {
      // Redact the value
      (result[key] as unknown) = redactToken(value);
    } else if (value && typeof value === 'object') {
      // Recursively redact nested objects
       
      (result[key] as unknown) = redactSensitiveInfo(value as Record<string, unknown>, sensitiveKeys);
    }
  }
  
  return result;
}

export function redactToken(
  token: string | undefined, 
  showFirstChars = 4, 
  showLastChars = 4
): string {
  if (!token) {
    return '[undefined]';
  }
  
  if (token.length <= showFirstChars + showLastChars) {
    return '*'.repeat(token.length);
  }
  
  const firstPart = token.substring(0, showFirstChars);
  const lastPart = token.substring(token.length - showLastChars);
  const redactedLength = token.length - (showFirstChars + showLastChars);
  
  return `${firstPart}${'*'.repeat(redactedLength)}${lastPart}`;
}