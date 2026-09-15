import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../core/services/auth.service';
import { StockService } from '../../../core/services/stock.service';
import { Stock, StockTransaction, StockTransactionType } from '../../../core/models/stock.model';
import { InrPipe } from '../../../shared/pipes/inr.pipe';
import { TransactionTableComponent } from '../../../shared/components/transaction-table/transaction-table.component';
import { ForecastChartComponent, LineSeries } from '../../../shared/components/forecast-chart/forecast-chart.component';

@Component({
  selector: 'app-stock-detail',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    InrPipe,
    DecimalPipe,
    TransactionTableComponent,
    ForecastChartComponent
  ],
  templateUrl: './stock-detail.component.html',
  styleUrl: './stock-detail.component.scss'
})
export class StockDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private stockService = inject(StockService);
  private fb = inject(FormBuilder);
  protected auth = inject(AuthService);

  stock = signal<Stock | null>(null);
  transactions = signal<StockTransaction[]>([]);

  chartLabels = signal<string[]>([]);
  chartSeries = signal<LineSeries[]>([]);

  readonly transactionTypes: StockTransactionType[] = ['BUY', 'SELL'];

  private stockId = 0;

  transactionForm = this.fb.nonNullable.group({
    transactionType: 'BUY' as StockTransactionType,
    transactionDate: [this.today(), Validators.required],
    quantity: [0, [Validators.required, Validators.min(0.0001)]],
    pricePerShare: [0, [Validators.required, Validators.min(0)]],
    brokerage: [0, [Validators.min(0)]],
    taxes: [0, [Validators.min(0)]]
  });

  private today(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  priceForm = this.fb.nonNullable.group({
    currentPrice: [0, [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit(): void {
    this.stockId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  private load(): void {
    this.stockService.getById(this.stockId).subscribe(stock => {
      this.stock.set(stock);
      this.priceForm.patchValue({ currentPrice: stock.currentPrice });
    });

    this.stockService.getTransactions(this.stockId).subscribe(transactions => {
      this.transactions.set(transactions);
      this.buildChart(transactions);
    });
  }

  addTransaction(): void {
    if (this.transactionForm.invalid) return;

    this.stockService.addTransaction(this.stockId, this.transactionForm.getRawValue()).subscribe(() => {
      this.transactionForm.reset({ transactionType: 'BUY', transactionDate: this.today(), quantity: 0, pricePerShare: 0, brokerage: 0, taxes: 0 });
      this.load();
    });
  }

  deleteTransaction(transactionId: number): void {
    this.stockService.deleteTransaction(transactionId).subscribe(() => this.load());
  }

  updatePrice(): void {
    if (this.priceForm.invalid) return;
    this.stockService.updatePrice(this.stockId, this.priceForm.getRawValue()).subscribe(stock => this.stock.set(stock));
  }

  private buildChart(transactions: StockTransaction[]): void {
    const sorted = [...transactions].sort((a, b) => a.transactionDate.localeCompare(b.transactionDate));
    let cumulativeQty = 0;
    let cumulativeInvested = 0;

    const labels: string[] = [];
    const investedSeries: number[] = [];
    const qtySeries: number[] = [];

    for (const t of sorted) {
      if (t.transactionType === 'BUY') {
        cumulativeQty += t.quantity;
        cumulativeInvested += t.quantity * t.pricePerShare;
      } else if (t.transactionType === 'SELL') {
        cumulativeQty -= t.quantity;
        cumulativeInvested -= t.quantity * t.pricePerShare;
      }
      labels.push(t.transactionDate);
      investedSeries.push(Math.round(cumulativeInvested));
      qtySeries.push(cumulativeQty);
    }

    this.chartLabels.set(labels);
    this.chartSeries.set([{ label: 'Cumulative Invested', data: investedSeries, color: '#3f6fdb' }]);
  }
}
