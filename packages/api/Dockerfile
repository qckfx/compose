FROM node:22-alpine AS builder

# Sentry auth token will be provided via --secret mount

# Activate Corepack to get Yarn (specified in package.json)
RUN corepack enable

# Create app directory
WORKDIR /app

# Copy the bare minimum first for better layer caching
COPY package.json yarn.lock .yarnrc.yml ./
RUN mkdir -p packages/api packages/web
COPY packages/api/package.json ./packages/api/package.json
COPY packages/web/package.json ./packages/web/package.json

# Install all workspace dependencies (node-modules linker)
RUN yarn install

# Copy the rest of the source
COPY packages ./packages

# Copy production environment file for web build
COPY packages/web/.env.production ./packages/web/.env.production

# Build the web (React) application
# Work in its directory to avoid workspace resolution issues
# WORKDIR /app/packages/web
RUN yarn workspace web build

# Return to root
WORKDIR /app

# Build the API (TypeScript -> JavaScript)
# WORKDIR /app/packages/api
RUN yarn workspace api prisma generate
RUN --mount=type=secret,id=sentry_auth_token \
    SENTRY_AUTH_TOKEN=$(cat /run/secrets/sentry_auth_token) \
    yarn workspace api build
WORKDIR /app

# Move the compiled web bundle where the API expects it
RUN mkdir -p /app/packages/api/dist/web/dist \
    && cp -r /app/packages/web/dist/* /app/packages/api/dist/web/dist/

# ------------------------
# Production image
# ------------------------
FROM node:22-alpine AS prod

RUN corepack enable

WORKDIR /srv/app

# Copy production dependencies & built code from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/api/package.json ./package.json
COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/packages/api/prisma ./prisma

# Expose API port
EXPOSE 3000

USER node

# Run prisma seed before starting the application
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/index.js"]
