export type StockTransactionType = 'BUY' | 'SELL' | 'BONUS' | 'SPLIT' | 'DIVIDEND';

export interface Stock {
  stockId: number;
  symbol: string;
  companyName: string;
  sector: string | null;
  currentPrice: number;
  notes: string | null;
  quantity: number;
  investedAmount: number;
  averageBuyPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface StockCreateRequest {
  symbol: string;
  companyName: string;
  sector?: string | null;
  currentPrice: number;
  notes?: string | null;
}

export interface StockUpdatePriceRequest {
  currentPrice: number;
}

export interface StockTransaction {
  transactionId: number;
  stockId: number;
  transactionType: StockTransactionType;
  transactionDate: string;
  quantity: number;
  pricePerShare: number;
  brokerage: number;
  taxes: number;
  notes: string | null;
}

export interface StockTransactionCreateRequest {
  transactionType: StockTransactionType;
  transactionDate: string;
  quantity: number;
  pricePerShare: number;
  brokerage: number;
  taxes: number;
  notes?: string | null;
}
