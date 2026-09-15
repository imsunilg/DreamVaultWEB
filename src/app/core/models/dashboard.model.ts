import { AssetAllocationItem, PortfolioPerformancePoint } from './portfolio.model';

export interface DashboardSummary {
  totalDreams: number;
  completedDreams: number;
  activeGoals: number;
  totalTargetAmount: number;
  totalSavedAmount: number;
  totalInvestments: number;
  currentPortfolioValue: number;
  portfolioProfitLoss: number;
}

export interface GoalTimelineItem {
  dreamId: number;
  name: string;
  targetYear: number;
}

export interface Dashboard {
  summary: DashboardSummary;
  goalTimeline: GoalTimelineItem[];
  assetAllocation: AssetAllocationItem[];
  portfolioGrowth: PortfolioPerformancePoint[];
}
