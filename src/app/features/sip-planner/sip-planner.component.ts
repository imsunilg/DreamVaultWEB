import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ForecastService } from '../../core/services/forecast.service';
import { SipResult } from '../../core/models/forecast.model';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-sip-planner',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, InrPipe],
  templateUrl: './sip-planner.component.html',
  styleUrl: './sip-planner.component.scss'
})
export class SipPlannerComponent {
  private fb = inject(FormBuilder);
  private forecastService = inject(ForecastService);

  result = signal<SipResult | null>(null);

  form = this.fb.nonNullable.group({
    initialInvestment: [100000, [Validators.required, Validators.min(0)]],
    monthlyInvestment: [25000, [Validators.required, Validators.min(0)]],
    expectedAnnualReturnRate: [12, [Validators.required, Validators.min(0), Validators.max(100)]],
    durationYears: [10, [Validators.required, Validators.min(1), Validators.max(40)]]
  });

  constructor() {
    this.calculate();
    this.form.valueChanges.subscribe(() => this.calculate());
  }

  calculate(): void {
    if (this.form.invalid) return;
    this.forecastService.calculateSip(this.form.getRawValue()).subscribe(result => this.result.set(result));
  }
}
