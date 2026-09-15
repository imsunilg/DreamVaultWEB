import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from '../../core/services/dashboard.service';
import { Dashboard } from '../../core/models/dashboard.model';
import { SummaryCardComponent } from '../../shared/components/summary-card/summary-card.component';
import { PortfolioChartComponent } from '../../shared/components/portfolio-chart/portfolio-chart.component';
import { ForecastChartComponent, LineSeries } from '../../shared/components/forecast-chart/forecast-chart.component';
import { InrCompactPipe } from '../../shared/pipes/inr-compact.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, SummaryCardComponent, PortfolioChartComponent, ForecastChartComponent, InrCompactPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  dashboard = signal<Dashboard | null>(null);
  loading = signal(true);

  dreamProgressLabels = ['Saved', 'Remaining'];
  dreamProgressData = signal<number[]>([0, 0]);

  allocationLabels = signal<string[]>([]);
  allocationData = signal<number[]>([]);

  portfolioGrowthLabels = signal<string[]>([]);
  portfolioGrowthSeries = signal<LineSeries[]>([]);

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe(data => {
      this.dashboard.set(data);
      this.loading.set(false);

      const saved = data.summary.totalSavedAmount;
      const remaining = Math.max(0, data.summary.totalTargetAmount - saved);
      this.dreamProgressData.set([saved, remaining]);

      this.allocationLabels.set(data.assetAllocation.map(a => a.symbol));
      this.allocationData.set(data.assetAllocation.map(a => a.currentValue));

      this.portfolioGrowthLabels.set(data.portfolioGrowth.map(p => p.date));
      this.portfolioGrowthSeries.set([
        { label: 'Total Invested', data: data.portfolioGrowth.map(p => p.totalInvested), color: '#3f6fdb' },
        { label: 'Portfolio Value', data: data.portfolioGrowth.map(p => p.portfolioValue), color: '#1b8a4c' }
      ]);
    });
  }
}
