import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { StockService } from '../../../core/services/stock.service';
import { Stock } from '../../../core/models/stock.model';
import { StockCardComponent } from '../../../shared/components/stock-card/stock-card.component';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, StockCardComponent],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss'
})
export class StocksComponent implements OnInit {
  private stockService = inject(StockService);
  private fb = inject(FormBuilder);
  protected auth = inject(AuthService);

  stocks = signal<Stock[]>([]);
  showAddForm = signal(false);

  form = this.fb.nonNullable.group({
    symbol: ['', Validators.required],
    companyName: ['', Validators.required],
    sector: [''],
    currentPrice: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.stockService.getAll().subscribe(stocks => this.stocks.set(stocks));
  }

  submit(): void {
    if (this.form.invalid) return;

    this.stockService.create(this.form.getRawValue()).subscribe(() => {
      this.form.reset({ symbol: '', companyName: '', sector: '', currentPrice: 0 });
      this.showAddForm.set(false);
      this.load();
    });
  }
}
