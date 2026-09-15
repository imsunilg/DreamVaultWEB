import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'dreams',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dreams/dream-list/dream-list.component').then(m => m.DreamListComponent)
  },
  {
    path: 'dreams/add',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dreams/dream-form/dream-form.component').then(m => m.DreamFormComponent)
  },
  {
    path: 'dreams/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dreams/dream-form/dream-form.component').then(m => m.DreamFormComponent)
  },
  {
    path: 'dreams/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dreams/dream-detail/dream-detail.component').then(m => m.DreamDetailComponent)
  },
  {
    path: 'goals',
    canActivate: [authGuard],
    loadComponent: () => import('./features/goals/goals.component').then(m => m.GoalsComponent)
  },
  {
    path: 'investments',
    pathMatch: 'full',
    redirectTo: 'investments/stocks'
  },
  {
    path: 'investments/stocks',
    canActivate: [authGuard],
    loadComponent: () => import('./features/investments/stocks/stocks.component').then(m => m.StocksComponent)
  },
  {
    path: 'investments/stocks/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/investments/stock-detail/stock-detail.component').then(m => m.StockDetailComponent)
  },
  {
    path: 'investments/transactions',
    canActivate: [authGuard],
    loadComponent: () => import('./features/investments/transactions/transactions.component').then(m => m.TransactionsComponent)
  },
  {
    path: 'portfolio',
    canActivate: [authGuard],
    loadComponent: () => import('./features/portfolio/portfolio.component').then(m => m.PortfolioComponent)
  },
  {
    path: 'sip-planner',
    canActivate: [authGuard],
    loadComponent: () => import('./features/sip-planner/sip-planner.component').then(m => m.SipPlannerComponent)
  },
  {
    path: 'forecast',
    canActivate: [authGuard],
    loadComponent: () => import('./features/forecast/forecast.component').then(m => m.ForecastComponent)
  },
  {
    path: 'reports',
    canActivate: [authGuard],
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'admin/dashboard',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'admin/users',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent)
  },
  {
    path: 'admin/users/add',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-user-form/admin-user-form.component').then(m => m.AdminUserFormComponent)
  },
  {
    path: 'admin/users/:id/edit',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-user-form/admin-user-form.component').then(m => m.AdminUserFormComponent)
  },
  {
    path: 'admin/users/:id',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-user-detail/admin-user-detail.component').then(m => m.AdminUserDetailComponent)
  },
  {
    path: 'admin/login-logs',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-login-logs/admin-login-logs.component').then(m => m.AdminLoginLogsComponent)
  },
  {
    path: 'admin/user-activity',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-activity-logs/admin-activity-logs.component').then(m => m.AdminActivityLogsComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
