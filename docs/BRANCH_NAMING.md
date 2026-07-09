# Branch Naming Guide

Consistent branch naming makes it easy to understand the purpose of each branch at a glance.

---

## Format

```
<type>/<short-description>
```

Use lowercase with hyphens as separators.

## Types

| Type      | Purpose                              | Base Branch |
| --------- | ------------------------------------ | ----------- |
| `feature` | New feature or enhancement           | `develop`   |
| `hotfix`  | Emergency production fix             | `main`      |

## Examples

### Feature Branches

| Branch Name                  | Description                         |
| ---------------------------- | ----------------------------------- |
| `feature/homepage`           | Homepage redesign                    |
| `feature/vehicle-search`     | Vehicle search with filters          |
| `feature/booking`            | Booking flow implementation          |
| `feature/payment`            | Cashfree payment integration         |
| `feature/admin`              | Admin dashboard                      |
| `feature/kyc`                | KYC document upload + verification   |
| `feature/auth`               | Authentication (login/register)      |
| `feature/dashboard`          | Customer dashboard                   |
| `feature/notifications`      | Email/SMS notifications              |
| `feature/blog`               | Blog CMS                             |
| `feature/seo`                | SEO optimization                     |
| `feature/maps`               | Google Maps integration              |
| `feature/reports`            | Analytics and reporting              |

### Hotfix Branches

| Branch Name           | Description                |
| --------------------- | -------------------------- |
| `hotfix/payment`      | Payment gateway fix         |
| `hotfix/login`        | Authentication fix          |
| `hotfix/security`     | Security vulnerability fix  |
| `hotfix/database`     | Database migration fix      |

## Rules

1. Always branch from the correct base (see table above)
2. Use kebab-case (hyphens, not underscores)
3. Keep names short but descriptive (2-4 words)
4. Delete the branch after merging
5. Never include ticket numbers in branch names (use PR descriptions instead)
