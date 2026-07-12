# TransitOps — Backend

The REST API and realtime server for TransitOps, the Smart Transport Operations Platform. It handles authentication, role-based access, all fleet data, and the business rules that keep operations consistent (status transitions, dispatch validation, cost roll-ups). It also pushes live dashboard updates over Socket.io.

For the full product overview and demo accounts, see the [root README](../README.md).

---

## Tech stack

- **Node.js 22 + Express** (ESM, TypeScript)
- **PostgreSQL** with **Prisma ORM** (via the `@prisma/adapter-pg` driver adapter)
- **JWT** access/refresh tokens in httpOnly cookies, **bcrypt** for password hashing
- **Zod** for request validation and env parsing
- **Winston** for structured logging
- **Socket.io** for the realtime dashboard
- **helmet** + **express-rate-limit** for baseline hardening

---

## Getting started

### Prerequisites

- Node.js 22
- A PostgreSQL database (local, Docker, or hosted like Neon)

### Setup

```bash
npm install            # runs `prisma generate` via postinstall
cp .env.example .env   # then fill in the values below
```

`.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/transitops?schema=public"
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=use-a-long-random-string
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

Apply the schema and seed demo data, then start the server:

```bash
npm run prisma:migrate   # local dev migration (use `prisma migrate deploy` for remote DBs)
npm run db:seed          # seeds demo users + fleet data
npm run dev              # API on http://localhost:4000
```

Verify it's up (this also checks the DB connection):

```bash
curl http://localhost:4000/api/health
```

---

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `PORT` | no | Defaults to 4000. On Cloud Run, leave unset — the platform injects it. |
| `NODE_ENV` | no | `development` or `production`; controls secure/SameSite cookie flags |
| `CLIENT_URL` | yes | Comma-separated allowed frontend origins (no trailing slash). Drives CORS + Socket.io. |
| `JWT_ACCESS_SECRET` | yes | Minimum 16 characters; use a strong random value |
| `JWT_ACCESS_EXPIRES_IN` | no | Defaults to `15m` |
| `JWT_REFRESH_EXPIRES_IN` | no | Defaults to `7d` |

Env is parsed and validated in `src/config/env.ts`; the process exits with a clear message if anything is missing or malformed.

---

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Start the API with hot reload (`tsx watch`) |
| `npm run build` | `prisma generate` then `tsc` → `dist/` |
| `npm start` | Run the compiled server (`node dist/server.js`) |
| `npm run prisma:generate` | Regenerate the Prisma client |
| `npm run prisma:migrate` | Create/apply a dev migration |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed demo users and data |

---

## Project structure

```
backend/
├── prisma/
│   ├── schema/              # split schema files
│   │   ├── schema.prisma    # generator + datasource
│   │   ├── enums.prisma     # UserRole, VehicleStatus, TripStatus, ...
│   │   ├── identity.prisma  # User, RefreshToken
│   │   ├── fleet.prisma     # Vehicle, Driver, VehicleDocument
│   │   ├── operations.prisma# Trip, MaintenanceLog, FuelLog, Expense
│   │   └── settings.prisma  # OrgSettings, AuditLog
│   ├── seeds/               # modular seed data
│   └── seed.ts
├── src/
│   ├── config/              # env parsing, RBAC permission map
│   ├── middleware/          # authenticate, authorize, validate, rate-limit, error/not-found
│   ├── modules/             # feature modules (see below)
│   ├── realtime/            # Socket.io server, event bus, license reminder job
│   ├── lib/                 # prisma client, logger
│   ├── utils/               # api-response, api-error, async-handler, pagination, duration, password
│   ├── generated/prisma/    # generated Prisma client — gitignored, created by `prisma generate`
│   ├── app.ts               # Express app wiring (helmet, cors, routes)
│   ├── routes.ts            # mounts all module routers under /api
│   └── server.ts            # HTTP + Socket.io bootstrap
├── prisma.config.ts
└── package.json
```

Each module under `src/modules/` follows the same pattern:

- `*.routes.ts` — Express router
- `*.controller.ts` — request/response handling
- `*.service.ts` — business logic + Prisma access
- `*.schema.ts` — Zod validation
- plus helpers like `*.transitions.ts` / `*.validators.ts` for trips

Modules: `auth`, `vehicles`, `drivers`, `trips`, `maintenance`, `fuel`, `expenses`, `analytics`, `health`.

---

## API overview

All routes are mounted under `/api` (see `src/routes.ts`):

| Prefix | Purpose |
|---|---|
| `/api/health` | Liveness + DB check (`SELECT 1`) |
| `/api/auth` | Login, logout, refresh, current user |
| `/api/vehicles` | Vehicle CRUD |
| `/api/drivers` | Driver CRUD |
| `/api/trips` | Trip creation and lifecycle transitions |
| `/api/maintenance` | Maintenance records |
| `/api/fuel-logs` | Fuel logs |
| `/api/expenses` | Other expenses |
| `/api/analytics` | Dashboard KPIs and reports |

### Auth & RBAC

- Login returns short-lived access + longer refresh JWTs, both set as httpOnly cookies (`transitops_access`, `transitops_refresh`).
- In production (`NODE_ENV=production`) cookies use `secure` + `SameSite=None` so they work across the Vercel ↔ Cloud Run origin split.
- Role permissions are defined in `src/config/rbac.ts` and enforced by the `authorize` middleware.

---

## About the generated Prisma client

The Prisma client is generated into `src/generated/prisma/` and is **not** committed to git. That's intentional — it's regenerated from the schema:

- on `postinstall` (after `npm install`), and
- as the first step of `npm run build` (`prisma generate && tsc`).

So a fresh clone or a fresh deploy always produces a matching client. If you ever see `Cannot find module '../generated/prisma/client.js'`, just run `npm run prisma:generate`.

---

## Deployment (Google Cloud Run)

1. Deploy from source with the service/root directory set to `backend`.
2. Set runtime env vars: `DATABASE_URL`, `CLIENT_URL` (your Vercel URL), `JWT_ACCESS_SECRET`, and `NODE_ENV=production`. Do **not** set `PORT`.
3. The buildpack runs `npm ci` → `postinstall` (`prisma generate`) → `npm run build`, so the Prisma client is always present in the image.
4. Run migrations against the production database once:

```bash
DATABASE_URL="<prod-url>" npx prisma migrate deploy
```

Any managed PostgreSQL works for the database. [Neon](https://neon.tech) has a usable free tier — copy its connection string (keep `sslmode=require`) into `DATABASE_URL`.
