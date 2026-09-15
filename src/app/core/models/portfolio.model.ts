export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  returnPercent: number;
  numberOfStocks: number;
}

export interface AssetAllocationItem {
  symbol: string;
  companyName: string;
  currentValue: number;
  allocationPercent: number;
}

export interface PortfolioPerformancePoint {
  date: string;
  totalInvested: number;
  portfolioValue: number;
}
