import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from './core/services/theme.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly theme = inject(ThemeService);

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'My Dreams', path: '/dreams', icon: 'auto_awesome' },
    { label: 'Goals', path: '/goals', icon: 'flag' },
    { label: 'Stocks', path: '/investments/stocks', icon: 'show_chart' },
    { label: 'Transactions', path: '/investments/transactions', icon: 'receipt_long' },
    { label: 'Portfolio', path: '/portfolio', icon: 'pie_chart' },
    { label: 'SIP Planner', path: '/sip-planner', icon: 'savings' },
    { label: 'Forecast', path: '/forecast', icon: 'trending_up' },
    { label: 'Reports', path: '/reports', icon: 'summarize' },
    { label: 'Settings', path: '/settings', icon: 'settings' }
  ];
}
