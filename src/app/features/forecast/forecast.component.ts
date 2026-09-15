import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ForecastService } from '../../core/services/forecast.service';
import { CagrResult, ForecastResult } from '../../core/models/forecast.model';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { ForecastChartComponent, LineSeries } from '../../shared/components/forecast-chart/forecast-chart.component';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    InrPipe,
    ForecastChartComponent
  ],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.scss'
})
export class ForecastComponent {
  private fb = inject(FormBuilder);
  private forecastService = inject(ForecastService);

  forecastResult = signal<ForecastResult | null>(null);
  cagrResult = signal<CagrResult | null>(null);

  chartLabels = signal<string[]>([]);
  chartSeries = signal<LineSeries[]>([]);

  readonly periodColumns = ['years', 'invested', 'estimatedValue', 'gain', 'cagrPercent'];

  forecastForm = this.fb.nonNullable.group({
    currentInvestment: [1000000, [Validators.required, Validators.min(0)]],
    monthlyInvestment: [30000, [Validators.required, Validators.min(0)]],
    expectedAnnualReturnRate: [12, [Validators.required, Validators.min(0), Validators.max(100)]],
    targetAmount: [0, [Validators.min(0)]]
  });

  cagrForm = this.fb.nonNullable.group({
    initialInvestment: [500000, [Validators.required, Validators.min(0.01)]],
    finalValue: [900000, [Validators.required, Validators.min(0)]],
    periodYears: [5, [Validators.required, Validators.min(0.1)]]
  });

  constructor() {
    this.calculateForecast();
    this.calculateCagr();
    this.forecastForm.valueChanges.subscribe(() => this.calculateForecast());
    this.cagrForm.valueChanges.subscribe(() => this.calculateCagr());
  }

  calculateForecast(): void {
    if (this.forecastForm.invalid) return;
    const value = this.forecastForm.getRawValue();

    this.forecastService
      .calculateForecast({ ...value, targetAmount: value.targetAmount || null })
      .subscribe(result => {
        this.forecastResult.set(result);
        this.chartLabels.set(result.graphPoints.map(p => `Year ${p.year}`));

        const series: LineSeries[] = [
          { label: 'Total Invested', data: result.graphPoints.map(p => p.totalInvested), color: '#3f6fdb' },
          { label: 'Estimated Value', data: result.graphPoints.map(p => p.estimatedValue), color: '#1b8a4c' }
        ];

        if (value.targetAmount) {
          series.push({
            label: 'Target Amount',
            data: result.graphPoints.map(p => p.targetAmount ?? 0),
            color: '#c0392b',
            dashed: true
          });
        }

        this.chartSeries.set(series);
      });
  }

  calculateCagr(): void {
    if (this.cagrForm.invalid) return;
    this.forecastService.calculateCagr(this.cagrForm.getRawValue()).subscribe(result => this.cagrResult.set(result));
  }
}
