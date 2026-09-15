import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Stock,
  StockCreateRequest,
  StockTransaction,
  StockTransactionCreateRequest,
  StockUpdatePriceRequest
} from '../models/stock.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/stocks`;

  getAll(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.baseUrl);
  }

  getById(id: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.baseUrl}/${id}`);
  }

  create(stock: StockCreateRequest): Observable<Stock> {
    return this.http.post<Stock>(this.baseUrl, stock);
  }

  updatePrice(id: number, request: StockUpdatePriceRequest): Observable<Stock> {
    return this.http.put<Stock>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getTransactions(stockId: number): Observable<StockTransaction[]> {
    return this.http.get<StockTransaction[]>(`${this.baseUrl}/${stockId}/transactions`);
  }

  addTransaction(stockId: number, transaction: StockTransactionCreateRequest): Observable<StockTransaction> {
    return this.http.post<StockTransaction>(`${this.baseUrl}/${stockId}/transactions`, transaction);
  }

  deleteTransaction(transactionId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/transactions/${transactionId}`);
  }
}
