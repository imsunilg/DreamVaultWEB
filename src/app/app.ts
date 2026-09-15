import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { map } from 'rxjs';
import { AuthService } from './core/services/auth.service';
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
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly theme = inject(ThemeService);
  protected readonly auth = inject(AuthService);
  private router = inject(Router);

  @ViewChild('sidenav') sidenav!: MatSidenav;

  private breakpointObserver = inject(BreakpointObserver);

  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).pipe(map(result => result.matches)),
    { initialValue: false }
  );

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

  onNavItemClick(): void {
    if (this.isHandset()) {
      this.sidenav.close();
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
