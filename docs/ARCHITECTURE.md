# Tripzy Architecture

## Overview

Tripzy is a self-drive car rental platform using a monolithic Next.js architecture optimized for:

- **10,000 visitors/month** (peak)
- **100–200 bookings/month**
- **Single-country deployment** (India)
- **Single admin team**

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | Supabase PostgreSQL via Prisma |
| Auth | Supabase Auth (Email + Google) |
| UI | Tailwind CSS + shadcn/ui |
| Forms | react-hook-form + Zod |
| State | TanStack Query |
| Email | Resend |
| SMS | MSG91 |
| Payments | Cashfree |
| Images | Cloudinary |
| Maps | Google Maps |
| Animations | Framer Motion |

## Architecture Diagram

```
┌─────────────────────────────┐
│   Vercel (Next.js 15)      │
│  ┌───────────────────────┐ │
│  │  App Router           │ │
│  │  - Pages (RSC)        │ │
│  │  - API Routes         │ │
│  │  - Server Actions     │ │
│  │  - Middleware (Auth)   │ │
│  └──────┬────────────────┘ │
└─────────┼──────────────────┘
          │
     ┌────┼────┬────┬────┬────┐
     │    │    │    │    │    │
  ┌──▼──┐┌▼──┐┌▼──┐┌▼──┐┌▼──┐
  │Sup. ││Cl.││Cash││Res││MS │
  │base ││oud││free││end││G91│
  │Post.││inary││   ││   ││  │
  └─────┘└───┘└───┘└───┘└──┘
```

## Directory Structure

- `app/` - Next.js App Router (pages, API, layouts)
- `components/` - Shared UI components
- `features/` - Feature modules (booking, payment, cars, etc.)
- `lib/` - Infrastructure clients (Supabase, Prisma, Resend)
- `config/` - Environment validation
- `providers/` - React context providers
- `prisma/` - Database schema and seeds

## Booking Flow

```
Homepage → Login → Search Vehicles → Vehicle Details →
Select Dates → Upload KYC Docs → Review → Payment →
Booking Confirmed → Email + SMS → Receipt PDF
```

## Admin Features

- Vehicle management (CRUD)
- Booking management
- Customer management
- KYC approval queue
- Payment status tracking
- Dashboard with KPIs
