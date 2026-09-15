# DreamVaultWEB

Angular frontend for DreamVault — a personal dream/goal planner and offline investment
portfolio tracker. See `DreamVaultDOC/DreamValutDescription.md` for the full product spec.

Generated with Angular CLI 22 (standalone components, SCSS), Angular Material, and
`ng2-charts`/Chart.js.

## Project layout

```
src/app/
  core/
    models/        TypeScript interfaces mirroring the API DTOs
    services/       HttpClient services (one per API area) + ThemeService
    interceptors/    Global HTTP error -> snackbar interceptor
  shared/
    components/     summary-card, progress-bar, dream-card, stock-card,
                     forecast-chart, portfolio-chart, transaction-table
    pipes/          inr (Intl currency), inrCompact (₹1.25 Cr style)
  features/
    dashboard/ dreams/ goals/ investments/ portfolio/
    sip-planner/ forecast/ reports/ settings/
```

## Prerequisites

- Node.js 20+ and npm
- `DreamVaultAPI` running locally (defaults to `http://localhost:5080/api`,
  configured in `src/environments/environment.ts`)

## Run

```powershell
npm install
ng serve
```

Open http://localhost:4200. The app talks directly to the API's CORS-enabled origin —
no dev-server proxy is configured, since `environment.apiUrl` already points at the API.

## Build

```powershell
ng build
```

## Not implemented in this pass

- CSV/Excel/PDF export
- Broad component/e2e test suite (this is a UI on top of a fully unit-tested calculation
  engine in the API; see `DreamVaultAPI/DreamVaultAPI.Tests`)
