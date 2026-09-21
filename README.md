# GoodKeys

GoodKeys is a trusted Nigerian property rental marketplace focused on verified listings, trusted agents, transparent move-in costs, and simple inspection booking.

## MVP

- Tenant and agent onboarding
- Verified property discovery
- Search and filters
- Transparent rental cost breakdown
- Saved properties
- Inspection booking
- Agent dashboard
- Messaging
- Admin verification and moderation

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Supabase-hosted PostgreSQL
- Lucide icons

## Database layout

GoodKeys uses a dedicated PostgreSQL schema named `gk`.

Examples:

```text
gk.users
gk.agent_profiles
gk.properties
gk.property_images
gk.favorites
gk.inspection_bookings
gk.conversations
gk.messages
gk.notifications
gk.reports
gk.admin_actions
```

The initial schema is defined in:

```text
db/migrations/001_init_goodkeys.sql
```

## Run locally against Supabase

### 1. Clone the repo

```bash
git clone https://github.com/007femijethro/goodkeys.git
cd goodkeys
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your local environment file

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
DATABASE_SSL=true
```

Never commit `.env.local`.

### 4. Test the PostgreSQL connection

```bash
npm run db:test
```

### 5. Create the GoodKeys schema and tables

```bash
npm run db:migrate
```

The migration is idempotent, so it is safe to run again while developing.

### 6. Start GoodKeys locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 7. Test DB connectivity from the running app

Open:

```text
http://localhost:3000/api/health/db
```

A successful response looks similar to:

```json
{
  "ok": true,
  "service": "GoodKeys",
  "database": {
    "database": "postgres",
    "db_user": "postgres",
    "goodkeys_table_count": 14
  },
  "schema": "gk"
}
```

## Optional: local PostgreSQL with Docker

If you want to develop without connecting to Supabase:

```bash
docker compose up -d
```

Then use:

```env
DATABASE_URL="postgresql://goodkeys:goodkeys@localhost:5433/goodkeys"
DATABASE_SSL=false
```

and run:

```bash
npm run db:migrate
npm run db:test
npm run dev
```

## Useful commands

```bash
npm run dev
npm run build
npm run db:test
npm run db:migrate
```

## Product direction

GoodKeys is designed around one core promise: **find a home you can trust**.
