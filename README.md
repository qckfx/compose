# Compose

A hosted version is available at [compose.qckfx.com](https://compose.qckfx.com).

## What is Compose?

Compose is an AI-powered platform that generates PRDs, refactoring plans, bug fix plans, and other technical documents grounded in your codebase using [qckfx agents](https://github.com/qckfx/agent-sdk). It analyzes your GitHub repository to create comprehensive, context-aware documentation that AI coding assistants like Claude Code can understand and use to implement features effectively.

The platform includes an in-browser editor with real-time collaboration features and provides easy ways to download or copy the contents of your plans as markdown.

## Prerequisites

- **LiteLLM proxy** - For LLM API access
- **PostgreSQL database** - You can use Supabase or run Postgres locally
- **Clerk account** - For authentication (required)
- **PostHog account** - For analytics
- **E2B account** - For remote container execution

## Getting Started

### Environment Setup

1. Copy the example environment files:

   ```bash
   cp packages/web/.env.example packages/web/.env
   cp packages/api/.env.example packages/api/.env
   ```

2. Configure your environment variables:
   - **Auth**: Requires a Clerk account
   - **Database**: Prisma requires a DB connection string. You can use Supabase/Postgres locally
   - **Remote containers**: Require E2B

### Running Locally

From the top-level directory:

```bash
yarn install && yarn dev
```

This will start both the web frontend and API backend in development mode.

## What's Missing

- Documentation
- Easier deployment process

## Contributing

This project is very early and actively evolving. I've open-sourced it to share how it works and gather feedback — not because it's ready for broad contributions yet.

I may accept small fixes or ideas that align with the current direction, but I'm not aiming to grow this into a community-driven project right now.

If you're curious about the architecture, want to build something similar, or have feedback, I'd love to hear from you!
