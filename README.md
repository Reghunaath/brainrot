# brainrot 🧠🫠

A social media app for the chronically online generation.

## Tech Stack

- Next.js 14 (App Router)
- SQLite + Drizzle ORM
- Tailwind CSS
- pnpm monorepo

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Install

```bash
pnpm install
```

### Run Dev

```bash
pnpm dev
```

Web app: http://localhost:3000
API: http://localhost:3001

### Run Tests

```bash
pnpm test
```

### Build

```bash
pnpm build
```

## Project Structure

```
brainrot/
├── apps/
│   ├── web/      # Next.js frontend (App Router, Tailwind CSS)
│   └── api/      # Next.js REST API backend (Route Handlers, SQLite)
└── packages/
    └── shared/   # Shared TypeScript types, constants, and utilities
```

### apps/web

Next.js 14 App Router frontend. Includes the feed, post detail, and profile pages. Uses Tailwind CSS with a dark theme. Fake auth via React context (no real sessions).

### apps/api

Next.js Route Handlers serving a REST API backed by SQLite via `better-sqlite3` and Drizzle ORM. Auto-seeds the database on first run.

### packages/shared

Shared TypeScript types (`Post`, `User`, `Comment`) and utility functions (`formatRelativeTime`, `truncateContent`).

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes following Conventional Commits
4. Push and open a PR

## License

MIT
