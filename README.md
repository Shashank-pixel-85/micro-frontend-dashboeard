# Micro-Frontend Dashboard

A React dashboard demonstrating a real **Micro-Frontend architecture with Module Federation**. The project is split into a Host/Shell and five independently developed remote applications.

## Architecture

```text
                         HOST / SHELL :3000
                 routing • auth • navigation
                           │
       ┌───────────────────┼────────────────────┐
       │                   │                    │
       ▼                   ▼                    ▼
   AUTH :3001         DASHBOARD :3002       USERS :3003
                                               │
                                               │ user-updated event
                                               ▼
                                        NOTIFICATIONS :3005

                         ANALYTICS :3004
```

### Applications

| Application | Port | Responsibility |
|---|---:|---|
| Host | 3000 | Shell, routing, navigation, authentication state, remote boundaries |
| Auth | 3001 | Login UI and demo session creation |
| Dashboard | 3002 | Workspace overview and API-backed metrics |
| Users | 3003 | User list, search and PATCH update |
| Analytics | 3004 | API-backed task metrics and charts |
| Notifications | 3005 | Workspace notifications and cross-MFE communication |

The Host lazy-loads the remote applications through Module Federation. Each remote has its own Vite build and `remoteEntry.js`, so the business modules can be developed and deployed independently.

## Requirements covered

- React + Vite
- Module Federation
- Independent Auth, Dashboard, Users, Analytics and Notifications remotes
- Shared authentication/session utility
- Protected application routes
- Shared navigation and reusable UI package
- REST API integration using JSONPlaceholder
- TanStack Query for server state
- Loading, error, empty and retry states
- Lazy loading of remote modules
- Shared React/ReactDOM dependencies
- Remote error boundaries and fallback UI
- Responsive desktop/tablet/mobile layouts
- Cross-MFE communication using browser custom events
- Persisted latest user-update event for late-mounted Notifications
- Environment-based remote URLs for deployment
- Beginner-readable component/service separation

## Prerequisites

- Node.js 18+
- npm 9+

## Install

From the repository root:

```bash
npm install
```

## Run locally

This project uses `@originjs/vite-plugin-federation`. The Vite remotes are served from their built output so that the Host can consume their generated `remoteEntry.js` files.

### One-command local stack

```bash
npm run start:local
```

The script first builds all five remotes, then starts their preview servers and the Host.

Open:

```text
http://localhost:3000
```

Ports:

```text
Host          http://localhost:3000
Auth          http://localhost:3001
Dashboard     http://localhost:3002
Users         http://localhost:3003
Analytics     http://localhost:3004
Notifications http://localhost:3005
```

### Manual startup

Build the remotes first:

```bash
npm run build:remotes
```

Then use separate terminals:

```bash
npm run preview -w auth
npm run preview -w dashboard
npm run preview -w users
npm run preview -w analytics
npm run preview -w notifications
npm run dev -w host
```

## Shashank authentication

The Auth remote accepts any non-empty email and password. It stores a demo session in localStorage so the Host can protect application routes and update the shell immediately after login.

This is intentionally a demonstration authentication flow. A production application should replace it with the organization's real identity provider/API.

## API integration

The business remotes use the public JSONPlaceholder API:

```text
GET /users       → Dashboard + Users
GET /posts       → Dashboard
GET /todos       → Analytics
PATCH /users/:id → Users update demonstration
```

The request logic lives in service files so it can be replaced with a real backend later.

## Module communication

The Users remote demonstrates communication between independently loaded modules.

```text
Users MFE
   │
   │ successful PATCH
   ▼
publishUserUpdated(user)
   │
   ├── saves the latest event
   │
   └── mfe:user-updated browser event
            │
            ▼
   Notifications MFE
```

Notifications listens for the browser event while mounted. It also reads the latest persisted event when it mounts later, which demonstrates communication even when the Notifications route was not open during the update.

## Shared packages

```text
packages/
├── auth/   → session, login, logout
├── ui/     → Button, Card, Badge, StatCard and state components
└── utils/  → API base URL, events and formatting
```

The remotes share infrastructure packages without importing business components from each other.

## Production deployment

Deploy each app as a separate Vite application.

The Host accepts these build-time environment variables:

```text
VITE_AUTH_REMOTE
VITE_DASHBOARD_REMOTE
VITE_USERS_REMOTE
VITE_ANALYTICS_REMOTE
VITE_NOTIFICATIONS_REMOTE
```

Example:

```text
VITE_AUTH_REMOTE=https://your-auth-domain/assets/remoteEntry.js
VITE_DASHBOARD_REMOTE=https://your-dashboard-domain/assets/remoteEntry.js
VITE_USERS_REMOTE=https://your-users-domain/assets/remoteEntry.js
VITE_ANALYTICS_REMOTE=https://your-analytics-domain/assets/remoteEntry.js
VITE_NOTIFICATIONS_REMOTE=https://your-notifications-domain/assets/remoteEntry.js
```

Copy `apps/host/.env.example` to the Host deployment environment and set the real deployed remote entry URLs.

## Verification

Run:

```bash
npm test
```

This performs deterministic architecture and responsive checks.

Build all remotes:

```bash
npm run build:remotes
```

Build the Host:

```bash
npm run build:host
```

Every remote build should generate:

```text
dist/assets/remoteEntry.js
```

## Project structure

```text
micro-frontend-dashboard/
├── apps/
│   ├── host/
│   ├── auth/
│   ├── dashboard/
│   ├── users/
│   ├── analytics/
│   └── notifications/
├── packages/
│   ├── auth/
│   ├── ui/
│   └── utils/
├── scripts/
│   └── verify-architecture.mjs
├── docs/
│   └── superpowers/plans/
├── package.json
└── README.md
```

## Notes for reviewers

This is a real federated application, not one React application merely divided into folders. The Host consumes remote applications through Module Federation, remotes are built independently, shared dependencies are configured explicitly, and reusable infrastructure is kept in shared packages.
