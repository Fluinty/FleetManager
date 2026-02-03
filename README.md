# Fleet Manager

A comprehensive fleet management dashboard for monitoring vehicle parts purchases, expense tracking, and budget management.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Documentation

- **[SPECS.md](./SPECS.md)** - Full project specification
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development workflow and procedures
- **[AGENTS.md](./AGENTS.md)** - AI agent development guide

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + Shadcn/ui
- **Language:** TypeScript

## Features

- 📊 Dashboard with fleet statistics
- 🚗 Vehicle management and tracking
- 📦 Order management with pending verification queue
- 💰 Budget monitoring and alerts
- 📈 Spending reports and analytics

## Environment Setup

Copy `.env.staging` to `.env.local` for local development:

```bash
cp .env.staging .env.local
```

## Deployment

Deployed automatically via Vercel:
- **Production:** `main` branch
- **Preview:** feature branches (auto-deploy on PR)

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed deployment procedures.
