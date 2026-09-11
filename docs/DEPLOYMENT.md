# Deployment Guide

## Infrastructure

- **Frontend**: Vercel (Next.js)
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Images**: Cloudinary
- **Email**: Resend
- **SMS**: Provider-Agnostic (Default: `SMS_PROVIDER="none"`, Optional)
- **Payments**: Cashfree
- **Maps**: Google Maps
- **DNS**: Cloudflare

## Environment Variables

Copy `.env.example` to `.env` and fill in all values. Key variables:

```bash
# Supabase
DATABASE_URL="postgresql://postgres:pass@db.REF.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Cashfree
CASHFREE_APP_ID="..."
CASHFREE_SECRET_KEY="..."
CASHFREE_ENV="sandbox"  # or "production"

# Resend
RESEND_API_KEY="re_..."

# SMS Provider (Optional: "none" | "console")
SMS_PROVIDER="none"
```

## Vercel Deployment

1. Push code to GitHub
2. Connect repo to Vercel
3. Add all environment variables in Vercel dashboard
4. Set Framework Preset to "Next.js"
5. Deploy

## Supabase Migration

```bash
npx prisma migrate deploy
npx prisma generate
```

## Post-Deployment

1. Test auth (login/register)
2. Test payment webhook with Cashfree test mode
3. Verify email delivery via Resend
4. Configure Cloudflare DNS
