# TransitOps — Frontend

The web client for TransitOps, the Smart Transport Operations Platform. It's a single-page React app that talks to the [TransitOps backend](../backend) over REST and receives live dashboard updates over Socket.io.

Live app: https://transit-ops-psi.vercel.app

For the full product overview, business rules, and demo accounts, see the [root README](../README.md).

---

## Tech stack

- **React 19 + Vite** with TypeScript
- **Tailwind CSS** + **shadcn/ui** (Radix primitives) for the UI
- **TanStack Query** for server state, caching, and mutations
- **React Hook Form + Zod** for forms and validation
- **React Router** for routing and role-based route guards
- **Recharts** for analytics charts
- **Socket.io client** for the realtime dashboard
- **next-themes** for dark mode, **sonner** for toasts, **axios** for the API client

---

## Getting started

### Prerequisites

- Node.js 22
- A running TransitOps backend (see [`../backend`](../backend))

### Setup

```bash
npm install
cp .env.example .env   # then edit if your backend isn't on localhost:4000
npm run dev            # http://localhost:5173
```

Log in with a seeded demo account (all use the password `Transit@2026`):

- `manager@transitops.in` — Fleet Manager
- `dispatcher@transitops.in` — Dispatcher
- `safety@transitops.in` — Safety Officer
- `analyst@transitops.in` — Financial Analyst

Each role only sees the modules it has access to, so switch accounts to explore different parts of the app.

---

## Environment variables

| Variable | Default | Notes |
|---|---|---|
| `VITE_API_URL` | `http://localhost:4000/api` | Backend base URL, including `/api` |
| `VITE_SOCKET_URL` | `http://localhost:4000` | Backend origin for the Socket.io connection |

Vite only exposes variables prefixed with `VITE_`. After changing `.env`, restart the dev server. Values are read in `src/lib/env.ts`.

---

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with oxlint |

---

## Project structure

```
src/
├── components/       # shared UI
│   ├── ui/          # shadcn/ui primitives (button, dialog, table, ...)
│   ├── layout/      # app shell: sidebar, mobile nav, user menu
│   ├── data/        # search, filters, pagination, row actions
│   ├── form/        # form-field wrapper for RHF
│   └── states/      # loading / empty / error states
├── features/         # one folder per domain area
│   ├── dashboard/   # KPIs, status distribution, recent trips
│   ├── vehicles/    # table, filters, form dialog, hooks, api
│   ├── drivers/     # + license badge
│   ├── trips/       # trip cards, dispatch/complete dialogs, capacity hint
│   ├── maintenance/
│   ├── fuel/  &  expenses/
│   ├── reports/     # Recharts charts + fleet report table
│   ├── settings/    # profile, appearance, RBAC matrix
│   ├── auth/        # login form, demo picker
│   └── shared/      # cross-feature reference data
├── hooks/            # use-auth, use-permission, use-realtime, use-debounce
├── lib/
│   ├── api/         # axios client, socket, error helpers
│   ├── env.ts       # reads VITE_ vars
│   └── utils.ts
├── providers/        # auth provider
├── routes/           # router + route guards (require-module, public-only)
├── config/           # labels
└── types/            # domain + auth types
```

Each feature folder follows the same shape: a `*.api.ts` for requests, a `use-*.ts` TanStack Query hook, a `*-schema.ts` Zod schema, and the components (table, filters, form dialog).

---

## How things connect

- **API client** (`src/lib/api/client.ts`) is an axios instance pointed at `VITE_API_URL` with `withCredentials` enabled, since auth uses httpOnly cookies.
- **Auth** is handled by `providers/auth-provider.tsx` + `hooks/use-auth`; the app calls `/auth/me` on load and refreshes tokens automatically.
- **Permissions** are enforced in the UI via `hooks/use-permission` and `routes/require-module.tsx`, mirroring the backend RBAC so users don't see routes they can't use.
- **Realtime** updates come through `hooks/use-realtime.ts` and `lib/api/socket.ts`, which keep the dashboard KPIs fresh.

---

## Deployment (Vercel)

1. Import the repo and set the project root directory to `frontend`.
2. Add `VITE_API_URL` and `VITE_SOCKET_URL` pointing at your deployed backend (e.g. the Cloud Run URL).
3. Deploy. Vercel auto-detects Vite (`npm run build`, output in `dist/`).

Make sure the backend's `CLIENT_URL` includes your Vercel origin, or API calls will be blocked by CORS.
