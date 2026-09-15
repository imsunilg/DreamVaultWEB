import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DreamService } from '../../../core/services/dream.service';
import { Contribution, Dream } from '../../../core/models/dream.model';
import { InrPipe } from '../../../shared/pipes/inr.pipe';
import { ProgressBarComponent } from '../../../shared/components/progress-bar/progress-bar.component';
import { ForecastChartComponent, LineSeries } from '../../../shared/components/forecast-chart/forecast-chart.component';

interface ChecklistStep {
  label: string;
  done: boolean;
}

@Component({
  selector: 'app-dream-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    InrPipe,
    ProgressBarComponent,
    ForecastChartComponent
  ],
  templateUrl: './dream-detail.component.html',
  styleUrl: './dream-detail.component.scss'
})
export class DreamDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dreamService = inject(DreamService);
  private fb = inject(FormBuilder);

  dream = signal<Dream | null>(null);
  contributions = signal<Contribution[]>([]);

  chartLabels = signal<string[]>([]);
  chartSeries = signal<LineSeries[]>([]);

  contributionForm = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    notes: ['']
  });

  private dreamId = 0;

  ngOnInit(): void {
    this.dreamId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  private load(): void {
    this.dreamService.getById(this.dreamId).subscribe(dream => {
      this.dream.set(dream);
      this.buildChart(dream);
    });
    this.dreamService.getContributions(this.dreamId).subscribe(c => this.contributions.set(c));
  }

  checklist(dream: Dream): ChecklistStep[] {
    const progress = dream.progressPercent;
    return [
      { label: 'Wishlist', done: true },
      { label: 'Planned', done: dream.status !== 'Wishlist' },
      { label: 'Savings Started', done: dream.currentAmount > 0 },
      { label: '25% Completed', done: progress >= 25 },
      { label: '50% Completed', done: progress >= 50 },
      { label: '75% Completed', done: progress >= 75 },
      { label: 'Target Achieved', done: dream.status === 'Completed' || progress >= 100 }
    ];
  }

  addContribution(): void {
    if (this.contributionForm.invalid) return;

    const value = this.contributionForm.getRawValue();
    const today = new Date();
    const contributionDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    this.dreamService.addContribution(this.dreamId, { ...value, contributionDate }).subscribe(() => {
      this.contributionForm.reset({ amount: 0, notes: '' });
      this.load();
    });
  }

  deleteDream(): void {
    this.dreamService.delete(this.dreamId).subscribe(() => this.router.navigate(['/dreams']));
  }

  private buildChart(dream: Dream): void {
    const years = Math.max(1, Math.ceil(dream.remainingMonths / 12));
    const labels: string[] = [];
    const savedSeries: number[] = [];
    const targetSeries: number[] = [];

    for (let y = 0; y <= years; y++) {
      labels.push(`Year ${y}`);
      const months = y * 12;
      const monthlyRate = dream.expectedReturnRate / 100 / 12;
      const projected =
        monthlyRate === 0
          ? dream.currentAmount + dream.monthlyContribution * months
          : dream.currentAmount * Math.pow(1 + monthlyRate, months) +
            dream.monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      savedSeries.push(Math.round(projected));
      targetSeries.push(dream.inflationAdjustedTargetAmount);
    }

    this.chartLabels.set(labels);
    this.chartSeries.set([
      { label: 'Projected Savings', data: savedSeries, color: '#1b8a4c' },
      { label: 'Inflation-Adjusted Target', data: targetSeries, color: '#c0392b', dashed: true }
    ]);
  }
}
