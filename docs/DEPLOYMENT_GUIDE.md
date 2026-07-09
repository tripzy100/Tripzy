# Deployment Guide

Tripzy Tours is deployed on **Vercel** with automatic deployments triggered by GitHub Actions.

---

## Architecture

```
Branch     Environment    URL
─────────────────────────────────────────────
main       Production     https://tripzy.com
develop    Preview        https://tripzy-git-develop.vercel.app
feature/*  Preview (PR)   https://tripzy-git-xxx.vercel.app
```

## Automatic Deployments

Deployments are handled by `.github/workflows/deploy.yml`.

| Event                  | Deploys To     |
| ---------------------- | -------------- |
| Push to `main`         | Production     |
| Push to `develop`      | Preview        |
| PR into `main`         | Preview        |
| PR into `develop`      | Preview        |

## Manual Deployment

For manual deployment via Vercel CLI:

```bash
# Production
vercel --prod

# Preview
vercel
```

## Required GitHub Secrets

| Secret                | Description                     |
| --------------------- | ------------------------------- |
| `VERCEL_TOKEN`        | Vercel personal access token    |
| `VERCEL_ORG_ID`       | Vercel organization ID          |
| `VERCEL_PROJECT_ID`   | Vercel project ID               |
| `PRODUCTION_URL`      | Production domain (health check)|

## Required Vercel Environment Variables

Set the following in Vercel Project Settings → Environment Variables:

### Production

All variables from `.env.production` with real secret values.

### Preview

All variables from `.env.development` with preview-specific values (use sandbox services).

## Health Check

After production deployment, a health check runs against `PRODUCTION_URL`.
If the HTTP status code is not 200, the deployment is considered failed.

## Rollback

If a production deployment fails or introduces a bug:

1. Go to **Vercel Dashboard → Deployments**
2. Find the last working deployment
3. Click the three dots → **Promote to Production**
4. Fix the issue on `develop` and deploy normally

## Monitoring

- **Vercel Analytics** — traffic, performance, errors
- **Vercel Logs** — server-side function logs
- **Sentry** — error tracking (if configured)
