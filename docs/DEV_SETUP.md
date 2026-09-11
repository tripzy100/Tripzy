# Developer Setup Guide

This guide walks you through setting up a local development environment for Tripzy Tours.

---

## Prerequisites

| Tool      | Version  | Purpose                |
| --------- | -------- | ---------------------- |
| Node.js   | >= 20    | JavaScript runtime     |
| npm       | >= 10    | Package manager        |
| Git       | >= 2.40  | Version control        |
| VS Code   | Latest   | Recommended IDE        |

## Clone the Repository

```bash
git clone https://github.com/tripzy100/Tripzy.git
cd Tripzy
```

## Install Dependencies

```bash
npm install
```

## Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Open .env.local and fill in real credentials
```

### Required Credentials

| Service    | Where to Get It                                     |
| ---------- | --------------------------------------------------- |
| Supabase   | [supabase.com](https://supabase.com) → Project Settings → API |
| Cloudinary | [cloudinary.com](https://cloudinary.com) → Dashboard |
| Cashfree   | [cashfree.com](https://cashfree.com) → API Keys     |
| Google Maps | [console.cloud.google.com](https://console.cloud.google.com) |
| Resend     | [resend.com](https://resend.com) → API Keys         |
| SMS Provider | Optional (defaults to `SMS_PROVIDER="none"`)       |

## Database Setup

```bash
# Apply migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed the database
npx tsx prisma/seeds/seed.ts

# Open Prisma Studio (optional)
npx prisma studio
```

## Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify Setup

```bash
npm run lint      # Should pass
npx tsc --noEmit  # Should pass
npm test          # Should pass
npm run build     # Should pass
```

## VS Code Extensions (Recommended)

- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- GitLens
- GitHub Pull Requests
- Error Lens

## Troubleshooting

See the [Troubleshooting Guide](./TROUBLESHOOTING.md).
