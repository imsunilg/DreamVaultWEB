# DreamVaultWEB

Angular frontend for DreamVault — a personal dream/goal planner and offline investment
portfolio tracker. See `DreamVaultDOC/DreamValutDescription.md` for the full product spec.

Generated with Angular CLI 22 (standalone components, SCSS), Angular Material, and
`ng2-charts`/Chart.js. Responsive down to phone widths, with a collapsible/overlay sidenav
on handset/tablet breakpoints (via `@angular/cdk/layout`).

## Project layout

```
src/app/
  core/
    models/        TypeScript interfaces mirroring the API DTOs
    services/       HttpClient services (one per API area) + AuthService + ThemeService
    guards/         authGuard (requires login) / guestGuard (login & register pages only)
    interceptors/   auth (attaches Bearer token, handles 401) + error (snackbar) interceptors
  shared/
    components/     summary-card, progress-bar, dream-card, stock-card,
                     forecast-chart, portfolio-chart, transaction-table
    pipes/          inr (Intl currency), inrCompact (₹1.25 Cr style)
  features/
    auth/ (login, register)
    dashboard/ dreams/ goals/ investments/ portfolio/
    sip-planner/ forecast/ reports/ settings/
```

## Prerequisites

- Node.js 20+ and npm
- `DreamVaultAPI` running locally (defaults to `http://localhost:5895/api`,
  configured in `src/environments/environment.ts`)

## Run

```powershell
npm install
ng serve --port 4895
```

Open http://localhost:4895. Unauthenticated visitors are redirected to `/login`.
See `DreamVaultAPI/README.md` for demo login credentials (Admin + User roles).
The app talks directly to the API's CORS-enabled origin — no dev-server proxy is configured,
since `environment.apiUrl` already points at the API.

## Build

```powershell
ng build
```

## Authentication & roles

- `/login` and `/register` are public; every other route is behind `authGuard`.
- A JWT from `POST /api/auth/login` (or `/register`) is stored in `localStorage` and attached
  to every API call by `authInterceptor`; a `401` response logs the user out and redirects to `/login`.
- The toolbar shows the signed-in user's name and role, with a logout menu.
- **Admin**-only actions (Add Stock, manual price updates, add/delete transactions) are hidden
  in the UI for `User`-role accounts — enforced again server-side, the UI hiding is just a courtesy.

## Not implemented in this pass

- CSV/Excel/PDF export
- Social/OAuth login (email/password only)
- Broad component/e2e test suite (this is a UI on top of a fully unit-tested calculation
  engine in the API; see `DreamVaultAPI/DreamVaultAPI.Tests`)
