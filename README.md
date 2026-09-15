# DreamVaultWEB

Angular frontend for DreamVault — a personal dream/goal planner and offline investment
portfolio tracker, with authentication, roles, and an admin user-management module.
See `DreamVaultDOC/DreamValutDescription.md` for the full product spec.

Generated with Angular CLI 22 (standalone components, SCSS), Angular Material, and
`ng2-charts`/Chart.js. Responsive down to phone widths, with a collapsible/overlay sidenav
on handset/tablet breakpoints (via `@angular/cdk/layout`).

## Project layout

```
src/app/
  core/
    models/         TypeScript interfaces mirroring the API DTOs (incl. admin-user, admin-dashboard, log)
    services/        HttpClient services + AuthService, AdminUserService, AdminDashboardService,
                      LogService, ThemeService
    guards/          authGuard (requires login) / guestGuard (login & register only) /
                      adminGuard (Admin role only, else snackbar + redirect to /dashboard)
    interceptors/    auth (attaches Bearer token, 401 -> logout+redirect, 403 -> snackbar) +
                      error (generic snackbar) interceptors
  shared/
    components/      summary-card, progress-bar, dream-card, stock-card, forecast-chart,
                      portfolio-chart, transaction-table, confirm-dialog
    pipes/           inr (Intl currency), inrCompact (₹1.25 Cr style)
  features/
    auth/ (login, register)
    profile/
    admin/ (admin-dashboard, admin-users, admin-user-form, admin-user-detail,
             admin-login-logs, admin-activity-logs)
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
See `DreamVaultAPI/README.md` for demo login credentials (Admin + User roles) — the login page
also shows them inline (gated by `environment.showDemoCredentials`, `true` in dev, `false` in
`environment.production.ts`; click a demo row to auto-fill the form). The app talks directly to
the API's CORS-enabled origin — no dev-server proxy is configured, since `environment.apiUrl`
already points at the API.

## Build

```powershell
ng build                              # dev config
ng build --configuration production   # applies environment.production.ts via fileReplacements
```

## Authentication & roles

- `/login` and `/register` are public; every other route is behind `authGuard`. `/admin/*` routes
  additionally require `adminGuard`.
- Login is by **username**, with a "Remember me" checkbox: checked stores the session in
  `localStorage` (survives browser restarts), unchecked uses `sessionStorage` (cleared when the
  tab closes). Show/hide password toggle included.
- A JWT from `POST /api/auth/login` is attached to every API call by `authInterceptor`; a `401`
  logs the user out and redirects to `/login`, a `403` shows an "Access denied" snackbar.
- The toolbar shows the signed-in user's name and a role badge, with a menu for My Profile /
  Change Password / Logout. `/profile` lets a user edit their name/email and change their password.
- **Admin**-only actions (Add Stock, manual price updates, add/delete transactions, and the whole
  `/admin/*` section) are hidden in the UI for `User`-role accounts — enforced again server-side,
  the UI hiding is just a courtesy.

## Admin module

Visible in the sidebar under an "Administration" section, only when `auth.isAdmin()`:

- **Admin Dashboard** (`/admin/dashboard`) — summary cards, user-growth and login-activity line
  charts, user-status and role-distribution doughnut charts, recent activity feed, quick actions.
- **Users** (`/admin/users`) — server-paginated table with search + role/status filters; a menu
  per row for View/Edit/Activate/Deactivate/Lock/Unlock/Delete, each destructive action behind a
  confirmation dialog (`shared/components/confirm-dialog`). Add/Edit use one shared form component;
  password reset is a separate dedicated dialog (never a browser `prompt()`).
- **User Detail** (`/admin/users/:id`) — account info, login activity, and an audit-log timeline
  scoped to that user.
- **Login Logs** (`/admin/login-logs`) and **User Activity** (`/admin/user-activity`) — paginated,
  filterable tables backed by the API's login/audit log endpoints.

Role and account-status badges (Admin/User, Active/Inactive/Locked, login Success/Failed) use the
same theme-aware CSS-variable pattern as the Dreams priority badges, so they stay readable in both
Light and Dark mode — see `styles.scss`'s `--role-*`, `--account-*`, `--login-*` variables and the
`.dv-badge*` classes.

## Not implemented in this pass

- CSV/Excel/PDF export
- Social/OAuth login (email/password only)
- Broad component/e2e test suite (this is a UI on top of a fully unit-tested calculation/auth
  engine in the API; see `DreamVaultAPI/DreamVaultAPI.Tests`). Admin and auth flows were verified
  manually via Playwright (login as Admin/User, role-gated nav, CRUD + lock/unlock/delete on a
  test user, dark mode, mobile) rather than an automated Jasmine/Karma suite.
