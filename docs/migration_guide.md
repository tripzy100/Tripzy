# Tripzy Database Migration & Rollback Strategy

This document outlines the deployment, versioning, and rollback strategies for database changes in development, staging, and production environments.

---

## 🚀 Migration Lifecycle Workflow

Prisma manages database schema adjustments through versioned SQL files saved inside the `prisma/migrations` directory.

### 1. Local Development
When modifying `prisma/schema.prisma` locally:
```bash
# Apply schema changes and generate a new migration SQL file
npx prisma migrate dev --name <migration_name>
```
*Rules*:
- Write descriptive migration names: e.g. `add_kyc_document_type` or `adjust_booking_rates`.
- Check the generated SQL file inside `prisma/migrations/` before pushing to verify formatting.

### 2. CI/CD Pipeline
The GitHub actions pipeline verifies that the schema is not out of sync:
```bash
# Verify schema state without applying changes
npx prisma migrate status
```

### 3. Production Deployments
Do NOT run `migrate dev` in production. Always run:
```bash
# Deploy all pending migrations to target PostgreSQL DB
npx prisma migrate deploy
```
*Note*: Running `migrate deploy` executes only unapplied migration scripts sequentially and does not drop tables or overwrite data.

---

## 📂 Versioning & Schema Alignment

- **Drift Detection**: Database drift happens when manual schema updates are executed directly on the database outside Prisma. If drift is detected, use `npx prisma db pull` to align the schema, or revert the manual DB edits.
- **Incremental Changes**: Never modify an existing, committed migration file. Always create a new incremental migration file to make alterations (like modifying column types or dropping tables).

---

## 🛠️ Rollback & Fail-Safe Strategy

When a migration deployment fails in production, apply one of the following remediation options:

### Reverting Non-Breaking Schema Alterations (Fail-Safe)
If a newly deployed field or index degrades database performance but does not drop existing data:
1. Revert the changes inside `prisma/schema.prisma`.
2. Generate a new roll-forward migration script:
   ```bash
   npx prisma migrate dev --name revert_previous_change
   ```
3. Commit and deploy this migration to push the schema back to its previous state.

### Reverting Breaking Schema Changes (Hard Rollback)
If a migration fails mid-way and leaves the database in an inconsistent state:
1. Revert the code deployment to the previous stable Git commit.
2. Mark the failed migration as resolved manually inside the Prisma metadata registry:
   ```bash
   npx prisma migrate resolve --rolled-back <failed_migration_name>
   ```
3. Restore the database from the last automated snapshot (e.g. AWS RDS point-in-time recovery, or pg_restore dumps).
