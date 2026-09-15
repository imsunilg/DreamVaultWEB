import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { forkJoin } from 'rxjs';
import { DreamService } from '../../core/services/dream.service';
import { GoalService } from '../../core/services/goal.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { StockService } from '../../core/services/stock.service';
import { ForecastService } from '../../core/services/forecast.service';
import { Dream } from '../../core/models/dream.model';
import { Goal } from '../../core/models/goal.model';
import { PortfolioSummary } from '../../core/models/portfolio.model';
import { Stock } from '../../core/models/stock.model';
import { ForecastResult } from '../../core/models/forecast.model';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MatCardModule, InrPipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  private dreamService = inject(DreamService);
  private goalService = inject(GoalService);
  private portfolioService = inject(PortfolioService);
  private stockService = inject(StockService);
  private forecastService = inject(ForecastService);

  dreams = signal<Dream[]>([]);
  goals = signal<Goal[]>([]);
  portfolioSummary = signal<PortfolioSummary | null>(null);
  stocks = signal<Stock[]>([]);
  forecast = signal<ForecastResult | null>(null);

  activeGoals = computed(() => this.goals().filter(g => g.status !== 'Achieved'));
  onTrackGoals = computed(() => this.goals().filter(g => g.status === 'OnTrack'));
  atRiskGoals = computed(() => this.goals().filter(g => g.status === 'AtRisk'));
  behindGoals = computed(() => this.goals().filter(g => g.status === 'Behind'));
  achievedGoals = computed(() => this.goals().filter(g => g.status === 'Achieved'));

  bestStock = computed(() => this.topStock((a, b) => b.profitLossPercent - a.profitLossPercent));
  worstStock = computed(() => this.topStock((a, b) => a.profitLossPercent - b.profitLossPercent));

  ngOnInit(): void {
    forkJoin({
      dreams: this.dreamService.getAll(),
      goals: this.goalService.getAll(),
      portfolio: this.portfolioService.getSummary(),
      stocks: this.stockService.getAll()
    }).subscribe(({ dreams, goals, portfolio, stocks }) => {
      this.dreams.set(dreams);
      this.goals.set(goals);
      this.portfolioSummary.set(portfolio);
      this.stocks.set(stocks.filter(s => s.quantity > 0));

      this.forecastService
        .calculateForecast({
          currentInvestment: portfolio.currentValue,
          monthlyInvestment: dreams.reduce((sum, d) => sum + d.monthlyContribution, 0),
          expectedAnnualReturnRate: 12
        })
        .subscribe(result => this.forecast.set(result));
    });
  }

  private topStock(compare: (a: Stock, b: Stock) => number): Stock | null {
    const list = this.stocks();
    if (!list.length) return null;
    return [...list].sort(compare)[0];
  }
}
