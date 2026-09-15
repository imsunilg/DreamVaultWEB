import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';
import { AdminDashboard } from '../../../core/models/admin-dashboard.model';
import { SummaryCardComponent } from '../../../shared/components/summary-card/summary-card.component';
import { PortfolioChartComponent } from '../../../shared/components/portfolio-chart/portfolio-chart.component';
import { ForecastChartComponent, LineSeries } from '../../../shared/components/forecast-chart/forecast-chart.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, MatButtonModule, MatCardModule, MatIconModule, SummaryCardComponent, PortfolioChartComponent, ForecastChartComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private dashboardService = inject(AdminDashboardService);

  dashboard = signal<AdminDashboard | null>(null);

  growthLabels = signal<string[]>([]);
  growthSeries = signal<LineSeries[]>([]);

  loginActivityLabels = signal<string[]>([]);
  loginActivitySeries = signal<LineSeries[]>([]);

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe(data => {
      this.dashboard.set(data);

      this.growthLabels.set(data.userGrowth.map(p => p.month));
      this.growthSeries.set([{ label: 'New Users', data: data.userGrowth.map(p => p.newUsers), color: '#3f6fdb' }]);

      this.loginActivityLabels.set(data.loginActivity.map(p => p.date));
      this.loginActivitySeries.set([
        { label: 'Successful', data: data.loginActivity.map(p => p.successCount), color: '#1b8a4c' },
        { label: 'Failed', data: data.loginActivity.map(p => p.failedCount), color: '#c0392b' }
      ]);
    });
  }
}
