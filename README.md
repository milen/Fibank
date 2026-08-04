# Fibank — Responsive Login & Dashboard

A React + TypeScript front-end assignment: login with DummyJSON auth, then a paginated Star Wars characters table with caching, offline handling, and responsive UI.

## Tech Stack

### Core
- **React 19** — UI
- **TypeScript** — static typing
- **Vite 8** — tooling and bundling
- **React Router DOM 7** — client-side routing

### Styling
- **Sass / SCSS** — variables, mixins, responsive tokens
- **CSS Modules** — scoped component styles

### APIs & browser APIs
- **DummyJSON Auth** — login (`/auth/login`)
- **SWAPI (py4e)** — people data (`/api/people`)
- **Fetch API** — network requests
- **localStorage** — auth session + people page cache

### UI
- **Lucide React** — icons

### Quality
- **Vitest** + **Testing Library** — unit / component tests
- **ESLint** — linting (React Hooks + Refresh rules)
- **GitHub Actions** — CI (lint, test, build)

## Getting Started

```bash
npm install
npm run dev
```

App URL: `http://localhost:5173`
GitHub deploys to: `https://fibank-test.vercel.app/`

### Useful scripts

```bash
npm run lint
npm test
npm run build
```

### Test login credentials

From DummyJSON: `emilys` / `emilyspass`

## Major Technical Decisions

1. **localStorage for auth session** — DummyJSON returns tokens in the response body; third-party cookies are unreliable cross-origin, so user + tokens are stored locally.
2. **Feature folders over a flat `api/` / `contexts/` dump** — domain code lives in `features/auth` and `features/people`; app-wide providers live in `providers/`.
3. **Providers split from hooks** — e.g. `AuthProvider` / `useAuth`, `OfflineProvider` / `useOffline`, so Fast Refresh and lint rules stay happy.
4. **SWAPI server pagination** — pages are fetched with `?page=`; no client-side “load all then paginate”.
5. **Per-page localStorage cache with TTL** — each people page is cached under `swapi_people_page_N` for 5 minutes, with invalidation on expiry / bad data.
6. **Offline UX tied to failed fetches** — a modal is shown when a request fails due to a down connection (testable via DevTools → Network → Offline). Offline images are inlined so they still render offline.
7. **Shared UI primitives** — `Button`, `Card`, `Input`, `Modal` share semantic types (`default | success | disabled | danger | warning`) and global responsive tokens.
8. **Mobile-first responsive design** — breakpoints at `768px` and `1280px`; root font size and paddings scale up. Small screens show a compact table (Name + Details) with a details modal.
9. **Blur-time field validation** — login field errors appear after leaving an input, not while typing; submit stays gated on valid length.
10. **Component folders as `index.tsx` + `styles.module.scss`** — avoids redundant `Component.tsx` + `index.ts` barrels.

## Patterns Used

| Pattern | Where / why |
|---|---|
| **Feature modules** | `src/features/*` owns API, types, and domain state |
| **App providers composition** | `AppProviders` mounts auth + offline + global offline modal |
| **Route guards** | `GuestRoute` / `ProtectedRoute` for login vs dashboard access |
| **Context + custom hooks** | `useAuth`, `useOffline` for shared UI state |
| **Presentational components** | `Button`, `Card`, `Input`, `Header`, `User`, `Modal` |
| **SCSS Modules** | Scoped styles per component; shared tokens in `src/styles/` |
| **Semantic design tokens** | Shared color types and responsive font/padding mixins |
| **Discriminated unions** | Button requires at least icon or text; icon-only needs `aria-label` |
| **Controlled forms** | Login inputs owned by page state |
| **Cache-aside** | Check localStorage → fetch → write cache |
| **Error taxonomy** | `ApiError` for HTTP failures; `isNetworkError` for offline |
| **Reusable Modal** | Offline + person details share one backdrop/Card modal |
| **Responsive column hiding** | Desktop columns vs mobile Details CTA |
| **Unit tests next to code** | `*.test.ts(x)` for API helpers, Input, Login |

## Project Structure (high level)

```text
src/
├── components/     # shared UI (Button, Card, Input, Modal, …)
├── features/       # auth, people
├── pages/          # Login, Dashboard
├── providers/      # AppProviders, OfflineProvider
├── styles/         # globals, variables, mixins
└── utils/          # errors, helpers
```
