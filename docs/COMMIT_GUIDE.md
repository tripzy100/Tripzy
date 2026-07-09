# Commit Guide

Tripzy Tours uses **Conventional Commits** to create a readable commit history and enable automated changelog generation.

---

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

The commit message must start with a **type**, optionally followed by a **scope** in parentheses, then a colon and a **description**.

## Types

| Type       | Usage                                          |
| ---------- | ---------------------------------------------- |
| `feat`     | A new feature                                  |
| `fix`      | A bug fix                                      |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `docs`     | Documentation only                             |
| `style`    | Formatting, missing semicolons, etc. (no code change) |
| `test`     | Adding or updating tests                       |
| `chore`    | Maintenance, dependencies, tooling             |
| `perf`     | Performance improvement                        |
| `ci`       | CI/CD configuration changes                    |
| `build`    | Build system or external dependencies          |

## Scope (Optional)

The scope identifies the area of the codebase affected:

```
feat(booking): add date range picker
fix(payment): correct webhook signature validation
refactor(auth): extract middleware logic
```

Common scopes: `auth`, `booking`, `payment`, `admin`, `cars`, `catalog`, `ui`, `api`, `db`, `ci`

## Description

- Use the imperative mood ("add" not "added" or "adds")
- No period at the end
- Max 72 characters
- Lowercase after the colon

## Body (Optional)

Use the body to explain the **why** behind the change:

```
fix(payment): handle expired token gracefully

When the Cashfree token expires mid-session, the user would see a
generic error. This commit adds token refresh logic and a retry
mechanism so the flow continues uninterrupted.
```

## Footer (Optional)

Reference issues or breaking changes:

```
feat(catalog): add pagination

Closes #42
```

For breaking changes, add `BREAKING CHANGE:` at the start of the footer:

```
refactor(api): restructure payment endpoints

BREAKING CHANGE: Payment webhook URL changed from /api/pay to /api/payment/webhook
```

## Examples

```
feat: add booking calendar
feat(admin): add KYC review panel
fix: resolve login redirect loop
fix(payment): correct webhook signature
refactor: simplify booking service
docs: update setup guide
style: improve navbar spacing
test: add booking validation tests
chore: upgrade next.js to 15.1
ci: optimize workflow caching
```

## Why Conventional Commits?

- **Automatic changelog** generation
- **Semantic versioning** — `fix` → patch, `feat` → minor, `BREAKING CHANGE` → major
- **Readable history** for onboarding and debugging
- **GitHub integration** — commits with `Closes #N` auto-close issues
