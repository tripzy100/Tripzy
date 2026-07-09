# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project (choose a strong database password)
3. Select region closest to your users (e.g., Mumbai for India)

## 2. Configure Authentication

1. Go to **Authentication > Providers**
2. **Email/Password**: Enable (default)
   - Disable "Confirm email" for simpler flow (or enable if desired)
3. **Google**: Enable, get credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Add redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

## 3. Get Connection Strings

### Prisma Database URL (Direct Connection)
From **Project Settings > Database > Connection string**:
```
postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

### Auth Keys
From **Project Settings > API**:
- `NEXT_PUBLIC_SUPABASE_URL` - Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)

## 4. Apply Prisma Migrations

```bash
# Update .env with Supabase DATABASE_URL
# Then run:
npx prisma migrate dev --name init
npx prisma generate
```

## 5. Seed the Database

```bash
npx tsx prisma/seeds/seed.ts
```

## 6. Create Admin User via SQL

Run this in Supabase SQL Editor to create an admin role:
```sql
INSERT INTO "Role" (id, name, code) VALUES (gen_random_uuid(), 'Admin', 'ADMIN');
INSERT INTO "Role" (id, name, code) VALUES (gen_random_uuid(), 'User', 'USER');
```

Then in your app, sign up and manually set `role: "ADMIN"` in the user's `raw_user_meta_data` via the Supabase dashboard: **Authentication > Users > Edit metadata**.
