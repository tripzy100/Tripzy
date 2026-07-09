# Git Workflow Guide

Tripzy Tours follows **GitHub Flow** with two long-lived branches (`main` and `develop`) plus short-lived feature and hotfix branches.

---

## Branch Overview

```
main
  └── develop
        ├── feature/xxx
        ├── feature/yyy
        └── hotfix/zzz → main + develop
```

### `main`

- **Production.** Always deployable.
- Connected to **Vercel Production**.
- **Protected** — no direct commits, no force pushes.
- Accepts merges only from `develop` (releases) and `hotfix/*` (emergencies).

### `develop`

- **Daily development.** Integration branch for features.
- Connected to **Vercel Preview**.
- Feature branches are merged here.
- When stable, a release PR is opened from `develop` → `main`.

### `feature/*`

- One branch per feature or task.
- Branch off: `develop`
- Merge into: `develop` (via PR)

### `hotfix/*`

- Emergency fix for production.
- Branch off: `main`
- Merge into: `main` AND `develop` (two PRs)

## Daily Workflow

```bash
# 1. Ensure you're on develop and up to date
git checkout develop
git pull origin develop

# 2. Create a feature branch
git checkout -b feature/my-feature

# 3. Work, commit, push
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature

# 4. Open a Pull Request on GitHub
#    Base: develop  ←  Compare: feature/my-feature

# 5. After CI passes and review is approved, merge
#    Use "Squash and merge" for feature branches
```

## Hotfix Workflow

```bash
# 1. Branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# 2. Fix and commit
git commit -m "fix: resolve critical issue"

# 3. PR into main
#    After approval: merge into main

# 4. Also PR hotfix into develop
git checkout develop
git pull origin develop
git merge hotfix/critical-fix
# or open a PR: develop ← hotfix/critical-fix
```

## Protected Branch Rules

Set these in GitHub → Settings → Branches:

### `main`
- Require pull request before merging
- Require 1 approval
- Dismiss stale reviews
- Require status checks (CI pipeline)
- Require branches to be up to date
- No force push
- Restrict deletions

### `develop`
- Require pull request before merging
- Require status checks (CI pipeline)
- No force push
- Restrict deletions
