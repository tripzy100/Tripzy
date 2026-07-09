# Troubleshooting Guide

Common issues and their solutions when working on Tripzy Tours.

---

## Installation

### `npm install` fails

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve
```

**Solution:** Clear cache and retry:

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Prisma client not found

```
Error: @prisma/client did not initialize yet
```

**Solution:**

```bash
npx prisma generate
```

## Database

### Migrations fail

```
Error: P1000: Authentication failed
```

**Solution:** Check `DATABASE_URL` in `.env.local`. Ensure Supabase project is active and connection string is correct.

### Seed script fails

```
Error: Timeout
```

**Solution:** The Supabase free tier has connection pool limits. Wait 30 seconds and retry, or use a direct connection string.

## TypeScript

### Type errors after pull

```
Type error: Property 'xxx' does not exist on type 'yyy'
```

**Solution:** Prisma schema may have changed. Regenerate:

```bash
npx prisma generate
```

### `tsc --noEmit` fails

**Solution:** Check for missing types in `@types/` directory. Run `npm install` to ensure all dev dependencies are installed.

## Build

### `npm run build` fails

```
Error: Cannot find module '...'
```

**Solution:** Run `npm install` and `npx prisma generate`, then retry.

### Build succeeds locally but fails in CI

**Solution:** The CI uses mock environment variables. Check if your code references an env var that is not in the mock list in `.github/workflows/ci.yml`. Add it with a mock value.

## Git

### Merge conflict

```bash
git checkout feature/my-feature
git pull origin develop
# Resolve conflicts, then
git add .
git commit -m "chore: resolve merge conflicts"
```

### Accidentally committed to `main`

**Solution:** Reset and move the commits to a feature branch:

```bash
git checkout -b feature/accidental-work
git checkout main
git reset --hard origin/main
git push origin main --force-with-lease  # Only if allowed
```

## Vercel

### Deployment fails

1. Check Vercel deployment logs
2. Ensure all environment variables are set in Vercel dashboard
3. Check that `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` are set as GitHub Secrets
4. Try a manual deploy: `vercel --prod`

### Preview URL not showing on PR

**Solution:** The `VERCEL_TOKEN` GitHub secret must have the necessary permissions. Regenerate the token from Vercel and update the secret.

## Environment Variables

### App crashes on missing env

```
Error: Missing environment variable: DATABASE_URL
```

**Solution:** Ensure all required variables are set. Check `.env.local` exists and is populated. If running tests/CI, ensure mock values are provided.
