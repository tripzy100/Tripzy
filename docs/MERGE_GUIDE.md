# Merge Guide

This document defines how and when to merge branches in the Tripzy Tours repository.

---

## Merge Strategies

### Feature Branches → `develop`

**Strategy: Squash and Merge**

```
feature/xxx ──┬── commits ──┬──> develop
              │   A-B-C     │    (single commit)
              └─────────────┘
```

All commits from the feature branch are squashed into **one commit** on `develop`.

**Why?** Keeps `develop` history clean. Each feature is one logical unit.

```bash
# On GitHub: select "Squash and merge"
# Commit message: feat(scope): description
```

### `develop` → `main` (Release)

**Strategy: Merge Commit (--no-ff)**

```
develop ───────────────┬──> main
                       │   (merge commit)
feature/xxx ── A ── B ┤
feature/yyy ── C ── D ┤
```

Creates an explicit merge commit to mark the release.

**Why?** Preserves the full feature history and provides a clear release marker.

```bash
# On GitHub: select "Create a merge commit"
```

### Hotfix Branches → `main`

**Strategy: Squash and Merge**

Same as feature → develop. Keep hotfix as a single commit on `main`.

### Hotfix Branches → `develop`

**Strategy: Merge Commit**

Use a merge commit to bring the hotfix into `develop` so the commit is preserved and conflicts are resolved explicitly.

## Before Merging

Checklist for the merger:

- [ ] CI pipeline passed (all checks green)
- [ ] At least 1 code review approval
- [ ] No merge conflicts
- [ ] Branch is up to date with target (rebase if needed)
- [ ] Screenshots added (for UI changes)
- [ ] Tests written/updated

## After Merging

- Delete the source branch (GitHub does this automatically when you check the box)
- Close the related issue if the PR says `Closes #N`
- Update any project board statuses

## Handling Merge Conflicts

```bash
# On your feature branch
git checkout feature/my-feature
git pull origin develop

# Resolve conflicts, then
git add .
git commit -m "chore: merge develop into feature/my-feature"
git push origin feature/my-feature
```

Never merge feature branches that have unresolved conflicts or failing CI.
