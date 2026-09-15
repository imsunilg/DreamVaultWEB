import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PortfolioService } from '../../core/services/portfolio.service';
import { AssetAllocationItem, PortfolioPerformancePoint, PortfolioSummary } from '../../core/models/portfolio.model';
import { SummaryCardComponent } from '../../shared/components/summary-card/summary-card.component';
import { PortfolioChartComponent } from '../../shared/components/portfolio-chart/portfolio-chart.component';
import { ForecastChartComponent, LineSeries } from '../../shared/components/forecast-chart/forecast-chart.component';
import { InrCompactPipe } from '../../shared/pipes/inr-compact.pipe';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [MatCardModule, SummaryCardComponent, PortfolioChartComponent, ForecastChartComponent, InrCompactPipe, InrPipe],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {
  private portfolioService = inject(PortfolioService);

  summary = signal<PortfolioSummary | null>(null);
  allocation = signal<AssetAllocationItem[]>([]);
  performance = signal<PortfolioPerformancePoint[]>([]);

  growthLabels = signal<string[]>([]);
  growthSeries = signal<LineSeries[]>([]);

  ngOnInit(): void {
    this.portfolioService.getSummary().subscribe(s => this.summary.set(s));
    this.portfolioService.getAllocation().subscribe(a => this.allocation.set(a));
    this.portfolioService.getPerformance().subscribe(points => {
      this.performance.set(points);
      this.growthLabels.set(points.map(p => p.date));
      this.growthSeries.set([
        { label: 'Total Invested', data: points.map(p => p.totalInvested), color: '#3f6fdb' },
        { label: 'Portfolio Value', data: points.map(p => p.portfolioValue), color: '#1b8a4c' }
      ]);
    });
  }
}
