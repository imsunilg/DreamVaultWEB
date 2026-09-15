import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'dreams',
    loadComponent: () => import('./features/dreams/dream-list/dream-list.component').then(m => m.DreamListComponent)
  },
  {
    path: 'dreams/add',
    loadComponent: () => import('./features/dreams/dream-form/dream-form.component').then(m => m.DreamFormComponent)
  },
  {
    path: 'dreams/:id/edit',
    loadComponent: () => import('./features/dreams/dream-form/dream-form.component').then(m => m.DreamFormComponent)
  },
  {
    path: 'dreams/:id',
    loadComponent: () => import('./features/dreams/dream-detail/dream-detail.component').then(m => m.DreamDetailComponent)
  },
  {
    path: 'goals',
    loadComponent: () => import('./features/goals/goals.component').then(m => m.GoalsComponent)
  },
  {
    path: 'investments',
    pathMatch: 'full',
    redirectTo: 'investments/stocks'
  },
  {
    path: 'investments/stocks',
    loadComponent: () => import('./features/investments/stocks/stocks.component').then(m => m.StocksComponent)
  },
  {
    path: 'investments/stocks/:id',
    loadComponent: () => import('./features/investments/stock-detail/stock-detail.component').then(m => m.StockDetailComponent)
  },
  {
    path: 'investments/transactions',
    loadComponent: () => import('./features/investments/transactions/transactions.component').then(m => m.TransactionsComponent)
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./features/portfolio/portfolio.component').then(m => m.PortfolioComponent)
  },
  {
    path: 'sip-planner',
    loadComponent: () => import('./features/sip-planner/sip-planner.component').then(m => m.SipPlannerComponent)
  },
  {
    path: 'forecast',
    loadComponent: () => import('./features/forecast/forecast.component').then(m => m.ForecastComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
