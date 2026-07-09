<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tripzy100/Tripzy/main/public/logo-dark.svg">
  <img alt="Tripzy Tours" src="https://raw.githubusercontent.com/tripzy100/Tripzy/main/public/logo.svg">
</picture>

# Tripzy Tours

**Self-Drive Car Rental Platform** — India's trusted marketplace for hourly, daily, and monthly car rentals.

| Aspect           | Stack                                                       |
| ---------------- | ----------------------------------------------------------- |
| **Framework**    | Next.js 15 (App Router)                                     |
| **Language**     | TypeScript (strict)                                         |
| **Database**     | Supabase PostgreSQL + Prisma ORM                            |
| **Auth**         | Supabase Auth (Email + Google OAuth)                        |
| **UI**           | Tailwind CSS + shadcn/ui + Framer Motion                    |
| **Payments**     | Cashfree (sandbox / production)                             |
| **Media**        | Cloudinary (image upload & CDN)                             |
| **Maps**         | Google Maps API                                             |
| **Email/SMS**    | Resend / MSG91                                              |
| **Hosting**      | Vercel (Production + Preview)                               |
| **CDN**          | Cloudflare                                                  |
| **CI/CD**        | GitHub Actions                                              |

---

## Quick Start

```bash
git clone https://github.com/tripzy100/Tripzy.git
cd Tripzy
npm install
cp .env.example .env.local   # Fill in your credentials
npx prisma migrate dev
npx prisma generate
npx tsx prisma/seeds/seed.ts
npm run dev                  # → http://localhost:3000
```

See the [Developer Setup Guide](./docs/DEV_SETUP.md) for detailed instructions.

---

## Branch Strategy

```
main          Production (protected — no direct commits)
  └── develop   Integration branch (Vercel Preview)
        ├── feature/*  New features → PR into develop
        └── hotfix/*   Emergency fixes → PR into main + develop
```

| Branch         | Environment          | CI Required |
| -------------- | -------------------- | ----------- |
| `main`         | Vercel Production    | ✅ Yes       |
| `develop`      | Vercel Preview       | ✅ Yes       |
| `feature/*`    | Auto Preview URL     | ✅ Yes (PR)  |
| `hotfix/*`     | Auto Preview URL     | ✅ Yes (PR)  |

See [Git Workflow Guide](./docs/GIT_WORKFLOW.md) and [Branch Naming Guide](./docs/BRANCH_NAMING.md).

---

## Commit Convention

We follow **Conventional Commits**:

```
feat(scope): description    # New feature
fix(scope): description     # Bug fix
refactor(scope): ...        # Code restructuring
docs: ...                   # Documentation
chore: ...                  # Maintenance
```

See [Commit Guide](./docs/COMMIT_GUIDE.md).

---

## Scripts

| Command              | Description                |
| -------------------- | -------------------------- |
| `npm run dev`        | Start dev server           |
| `npm run build`      | Production build           |
| `npm run lint`       | ESLint check               |
| `npm run format`     | Prettier format            |
| `npm test`           | Run Vitest tests           |
| `npx prisma studio`  | Open DB browser            |
| `npx tsc --noEmit`   | TypeScript type check      |

---

## CI/CD Pipeline

Every Pull Request runs:

1. `npm ci` — clean install
2. `npx tsc --noEmit` — TypeScript compilation check
3. `npm run lint` — ESLint
4. `npx prisma generate` — Prisma client generation
5. `npm test` — Vitest unit tests
6. `npm run build` — Next.js production build

Deployments are automatic via GitHub Actions → Vercel.

See [CI Workflow](./.github/workflows/ci.yml) and [Deploy Workflow](./.github/workflows/deploy.yml).

---

## Documentation

| Guide                       | File                          |
| --------------------------- | ----------------------------- |
| Architecture                | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| Supabase Setup              | [docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) |
| Deployment (Infra)          | [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) |
| Developer Setup             | [docs/DEV_SETUP.md](./docs/DEV_SETUP.md) |
| Git Workflow                | [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md) |
| Branch Naming               | [docs/BRANCH_NAMING.md](./docs/BRANCH_NAMING.md) |
| Commit Guide                | [docs/COMMIT_GUIDE.md](./docs/COMMIT_GUIDE.md) |
| Merge Guide                 | [docs/MERGE_GUIDE.md](./docs/MERGE_GUIDE.md) |
| Deployment Guide            | [docs/DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) |
| Release Guide               | [docs/RELEASE_GUIDE.md](./docs/RELEASE_GUIDE.md) |
| Troubleshooting             | [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for our contribution guidelines.

## Security

Report vulnerabilities to **security@tripzy.com**. See [SECURITY.md](./SECURITY.md).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

## Team

- **Developer 1** — Owner: Payments, Auth, Booking, DB, Security, Admin, CI/CD
- **Developer 2** — Frontend: UI, Components, Landing Page, SEO, Animations

## License

Private — Tripzy Tours
