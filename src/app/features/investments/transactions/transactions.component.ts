import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';
import { StockService } from '../../../core/services/stock.service';
import { Stock, StockTransaction } from '../../../core/models/stock.model';
import { TransactionTableComponent } from '../../../shared/components/transaction-table/transaction-table.component';

interface EnrichedTransaction extends StockTransaction {
  symbol: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [MatCardModule, TransactionTableComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
  private stockService = inject(StockService);
  protected auth = inject(AuthService);

  stocks = signal<Stock[]>([]);
  allTransactions = signal<EnrichedTransaction[]>([]);

  sortedTransactions = computed(() =>
    [...this.allTransactions()].sort((a, b) => b.transactionDate.localeCompare(a.transactionDate))
  );

  ngOnInit(): void {
    this.stockService.getAll().subscribe(stocks => {
      this.stocks.set(stocks);

      if (!stocks.length) return;

      forkJoin(stocks.map(s => this.stockService.getTransactions(s.stockId))).subscribe(results => {
        const enriched: EnrichedTransaction[] = [];
        results.forEach((transactions, i) => {
          transactions.forEach(t => enriched.push({ ...t, symbol: stocks[i].symbol }));
        });
        this.allTransactions.set(enriched);
      });
    });
  }

  deleteTransaction(transactionId: number): void {
    this.stockService.deleteTransaction(transactionId).subscribe(() => {
      this.allTransactions.set(this.allTransactions().filter(t => t.transactionId !== transactionId));
    });
  }
}
