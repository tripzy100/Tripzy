# Release Guide

This document describes the release process for Tripzy Tours.

---

## Versioning

We follow **Semantic Versioning** (`MAJOR.MINOR.PATCH`):

| Increment | When                                   | Example |
| --------- | -------------------------------------- | ------- |
| MAJOR     | Breaking change                        | 1.0.0 → 2.0.0 |
| MINOR     | New feature (backwards compatible)     | 1.0.0 → 1.1.0 |
| PATCH     | Bug fix (backwards compatible)         | 1.0.0 → 1.0.1 |

## Release Process

### 1. Prepare the Release Branch

```bash
git checkout develop
git pull origin develop
```

### 2. Update Version

Update the version in:

- `package.json`
- `VERSION`

### 3. Update Changelog

Add a new entry to `CHANGELOG.md` with the version number, date, and summary of changes.

### 4. Commit the Release Prep

```bash
git add package.json VERSION CHANGELOG.md
git commit -m "chore: bump version to v1.1.0"
```

### 5. Open Release PR

Open a PR from `develop` → `main` with:

- Title: `Release v1.1.0`
- Description listing all changes in this release

### 6. Review

- CI must pass
- At least 1 approval required

### 7. Merge to Main

Use **"Create a merge commit"** to preserve the release marker.

### 8. Tag the Release

```bash
git checkout main
git pull origin main
git tag v1.1.0
git push origin v1.1.0
```

### 9. Create GitHub Release

1. Go to GitHub → Releases → Draft a new release
2. Select the tag `v1.1.0`
3. Title: `v1.1.0`
4. Auto-generate release notes from the changelog
5. Publish

### 10. Deploy

Production deployment happens automatically via CI/CD.

## Hotfix Release

For emergency hotfixes that skip the regular release cycle:

1. Create `hotfix/xxx` from `main`
2. Fix and commit
3. PR into `main` (squash merge)
4. PR into `develop` (merge commit)
5. Tag and release as above
