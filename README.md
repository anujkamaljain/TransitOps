# TransitOps

Smart Transport Operations Platform — a single place to manage vehicles, drivers, trips, maintenance, fuel, and expenses instead of juggling spreadsheets and logbooks.

TransitOps digitizes the full lifecycle of a fleet: register a vehicle, onboard a driver, dispatch a trip, log maintenance and fuel, and watch the operational numbers update on a live dashboard. The business rules that usually live in someone's head (don't dispatch a retired vehicle, don't assign a driver with an expired license, don't overload a van) are enforced by the backend.

Live app: https://transit-ops-psi.vercel.app

---

## What it does

- **Auth + RBAC** — email/password login with JWT stored in httpOnly cookies. Four roles, each sees only what it should.
- **Vehicle registry** — unique registration numbers, load capacity, odometer, acquisition cost, and status (Available / On Trip / In Shop / Retired).
- **Driver management** — license category and expiry, safety score, contact, and status (Available / On Trip / Off Duty / Suspended).
- **Trip dispatch** — pick a source, destination, available vehicle and driver, cargo weight, and distance. Lifecycle: Draft → Dispatched → Completed / Cancelled.
- **Maintenance** — opening a maintenance record flips the vehicle to In Shop and pulls it out of the dispatch pool; closing it restores the vehicle.
- **Fuel & expenses** — record fuel logs and other costs (tolls, permits, fines, etc.) and roll them up per vehicle.
- **Reports & analytics** — fuel efficiency, fleet utilization, operational cost, and vehicle ROI, with CSV export.
- **Realtime dashboard** — KPIs update over Socket.io.
- **Extras** — dark mode, search/filter/sort, and license-expiry reminders.

### Business rules enforced server-side

- Registration numbers are unique.
- Retired / In Shop vehicles never show up in dispatch.
- Drivers who are Suspended or hold an expired license can't be assigned.
- A vehicle or driver already On Trip can't be double-booked.
- Cargo weight can't exceed the vehicle's max load capacity.
- Dispatching sets vehicle + driver to On Trip; completing or cancelling restores them to Available.
- Creating an active maintenance record sets the vehicle to In Shop; closing it restores it (unless retired).

---

## Roles

| Role | Fleet | Drivers | Trips | Fuel & Expenses | Analytics | Settings |
|---|---|---|---|---|---|---|
| Fleet Manager | Manage | Manage | View | View | View | Manage |
| Dispatcher | View | View | Manage | — | — | — |
| Safety Officer | — | Manage | View | — | — | — |
| Financial Analyst | View | — | — | Manage | Manage | — |

### Demo accounts

All demo users share the password `Transit@2026` (seeded by `npm run db:seed`).

| Role | Email |
|---|---|
| Fleet Manager | manager@transitops.in |
| Dispatcher | dispatcher@transitops.in |
| Safety Officer | safety@transitops.in |
| Financial Analyst | analyst@transitops.in |

---

## Tech stack

**Frontend:** React + Vite, TypeScript, Tailwind CSS, shadcn/ui (Radix), React Hook Form + Zod, TanStack Query, React Router, Recharts, Socket.io client.

**Backend:** Node.js, Express, PostgreSQL, Prisma ORM, JWT, bcrypt, Zod, Winston, Socket.io.

**Deployment:** Vercel (frontend), Google Cloud Run (backend), Neon / any managed Postgres for the database.

---

## Project layout

```
TransitOps/
├── backend/
│   ├── prisma/
│   │   ├── schema/           # split schema (identity, fleet, operations, settings, enums)
│   │   ├── seeds/            # seed data (users, fleet, drivers, operations, org settings)
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/           # env parsing, RBAC map
│   │   ├── middleware/        # auth, validation, rate limit, error handling
│   │   ├── modules/          # auth, vehicles, drivers, trips, maintenance, fuel, expenses, analytics, health
│   │   ├── realtime/         # Socket.io server + event bus
│   │   ├── lib/              # prisma client, logger
│   │   └── generated/prisma/ # generated Prisma client (gitignored — created by `prisma generate`)
│   └── package.json
└── frontend/
    └── src/
        ├── components/       # layout + shared UI (shadcn)
        ├── features/         # vehicles, drivers, trips, maintenance, fuel, expenses, reports, auth, dashboard
        ├── hooks/            # auth, permissions
        ├── lib/              # api client, utils
        └── routes/           # route guards
```

> Note: the Prisma client is generated into `backend/src/generated/prisma` and is **not** committed. It's created automatically by `prisma generate`, which runs on `postinstall` and as part of the build — so a fresh clone or a fresh deploy always regenerates it.

---

## Getting started

### Prerequisites

- Node.js 22
- A PostgreSQL database (local install, Docker, or a hosted one like Neon)

### 1. Clone

```bash
git clone https://github.com/anujkamaljain/TransitOps.git
cd TransitOps
```

### 2. Backend

```bash
cd backend
npm install            # also runs `prisma generate` via postinstall
cp .env.example .env   # then edit values
```

Fill in `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/transitops?schema=public"
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=use-a-long-random-string
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

`CLIENT_URL` accepts a comma-separated list of allowed origins (used for CORS and Socket.io), e.g. `http://localhost:5173,https://transit-ops-psi.vercel.app`.

Apply the schema and seed demo data:

```bash
npm run prisma:migrate   # for local dev; use `prisma migrate deploy` against a remote DB
npm run db:seed
npm run dev              # API on http://localhost:4000
```

Sanity check:

```bash
curl http://localhost:4000/api/health
```

### 3. Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

`frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

```bash
npm run dev              # app on http://localhost:5173
```

Open http://localhost:5173 and log in with one of the demo accounts above.

---

## Environment variables

### Backend

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `PORT` | no | Defaults to 4000. On Cloud Run, leave it unset — the platform provides it. |
| `NODE_ENV` | no | `development` locally, `production` in the cloud (controls secure cookies) |
| `CLIENT_URL` | yes | Comma-separated allowed frontend origins, no trailing slash |
| `JWT_ACCESS_SECRET` | yes | Min 16 chars; use a strong random value |
| `JWT_ACCESS_EXPIRES_IN` | no | Defaults to `15m` |
| `JWT_REFRESH_EXPIRES_IN` | no | Defaults to `7d` |

### Frontend

| Variable | Notes |
|---|---|
| `VITE_API_URL` | Backend base URL including `/api` |
| `VITE_SOCKET_URL` | Backend origin for Socket.io |

---

## Useful scripts

**Backend** (`cd backend`)

| Script | Does |
|---|---|
| `npm run dev` | Start the API with hot reload |
| `npm run build` | `prisma generate` then `tsc` → `dist/` |
| `npm start` | Run the compiled server |
| `npm run prisma:migrate` | Create/apply a dev migration |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed demo users and data |

**Frontend** (`cd frontend`)

| Script | Does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check and build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with oxlint |

---

## Deployment

### Frontend → Vercel

1. Import the repo, set the root directory to `frontend`.
2. Add env vars `VITE_API_URL` and `VITE_SOCKET_URL` pointing at your deployed backend.
3. Deploy.

### Backend → Google Cloud Run

1. Deploy from source with the root/service directory set to `backend`.
2. Set the runtime environment variables: `DATABASE_URL`, `CLIENT_URL` (your Vercel URL), `JWT_ACCESS_SECRET`, and `NODE_ENV=production`. Don't set `PORT`.
3. The build runs `npm ci` → `postinstall` (`prisma generate`) → `npm run build` (`prisma generate && tsc`), so the Prisma client is always present in the image.
4. Run migrations against your production database once:

```bash
DATABASE_URL="<prod-url>" npx prisma migrate deploy
```

### Database

Any managed PostgreSQL works. For a free tier, [Neon](https://neon.tech) is a good fit — create a project, copy the connection string (keep `sslmode=require`), and use it as `DATABASE_URL`.

---

## API overview

All routes are under `/api`:

| Prefix | Purpose |
|---|---|
| `/api/health` | Liveness + DB check |
| `/api/auth` | Login, logout, refresh, current user |
| `/api/vehicles` | Vehicle CRUD |
| `/api/drivers` | Driver CRUD |
| `/api/trips` | Trip creation and lifecycle transitions |
| `/api/maintenance` | Maintenance records |
| `/api/fuel-logs` | Fuel logs |
| `/api/expenses` | Other expenses |
| `/api/analytics` | Dashboard KPIs and reports |

---

## License

MIT
