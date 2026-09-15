import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StockTransaction } from '../../../core/models/stock.model';
import { InrPipe } from '../../pipes/inr.pipe';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, DatePipe, InrPipe],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.scss'
})
export class TransactionTableComponent {
  @Input({ required: true }) transactions: StockTransaction[] = [];
  @Input() showStockColumn = false;
  @Output() deleteTransaction = new EventEmitter<number>();

  get columns(): string[] {
    return this.showStockColumn
      ? ['stockId', 'transactionType', 'transactionDate', 'quantity', 'pricePerShare', 'total', 'actions']
      : ['transactionType', 'transactionDate', 'quantity', 'pricePerShare', 'total', 'actions'];
  }

  total(t: StockTransaction): number {
    return t.quantity * t.pricePerShare + t.brokerage + t.taxes;
  }

  stockLabel(t: StockTransaction): string {
    return (t as unknown as { symbol?: string }).symbol ?? String(t.stockId);
  }
}
